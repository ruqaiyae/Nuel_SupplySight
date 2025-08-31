import { query } from "./db";

export const resolvers = {
  Query: {
    products: async (
      _: any,
      {
        search,
        status,
        warehouse,
      }: { search?: string; status?: string; warehouse?: string }
    ) => {
      try {
        let sql = "SELECT * FROM products WHERE 1=1";
        const params: any[] = [];
        let paramIndex = 1;

        if (search) {
          sql += ` AND (name ILIKE $${paramIndex} OR sku ILIKE $${paramIndex})`;
          params.push(`%${search}%`);
          paramIndex++;
        }

        // Only apply warehouse filter if it's not empty
        if (warehouse && warehouse.trim() !== "") {
          sql += ` AND warehouse = $${paramIndex}`;
          params.push(warehouse);
          paramIndex++;
        }

        // Only apply status filter if it's not empty
        if (status && status.trim() !== "") {
          if (status === "Critical") {
            sql += ` AND stock < demand`;
          } else if (status === "Low") {
            sql += ` AND stock = demand`;
          } else if (status === "Healthy") {
            sql += ` AND stock > demand`;
          }
        }

        sql += " ORDER BY name";
        const result = await query(sql, params);
        return result.rows;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
      }
    },

    warehouses: async () => {
      try {
        const result = await query("SELECT * FROM warehouses ORDER BY name");
        return result.rows;
      } catch (error) {
        console.error("Error fetching warehouses:", error);
        throw new Error("Failed to fetch warehouses");
      }
    },

    kpis: async (_: any, { range }: { range: string }) => {
      try {
        let sql = "SELECT * FROM kpis";
        let limit = 30; // Default to 30 days

        // Handle frontend date range format
        if (range === "7d") {
          limit = 7;
        } else if (range === "14d") {
          limit = 14;
        } else if (range === "30d") {
          limit = 30;
        }

        sql += ` ORDER BY date DESC LIMIT $1`;
        const result = await query(sql, [limit]);
        return result.rows.reverse(); // Return in chronological order
      } catch (error) {
        console.error("Error fetching KPIs:", error);
        throw new Error("Failed to fetch KPIs");
      }
    },
  },

  Mutation: {
    updateDemand: async (
      _: any,
      { id, demand }: { id: string; demand: number }
    ) => {
      try {
        const result = await query(
          "UPDATE products SET demand = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
          [demand, id]
        );

        if (result.rows.length === 0) {
          throw new Error(`Product with id ${id} not found`);
        }

        return result.rows[0];
      } catch (error) {
        console.error("Error updating demand:", error);
        throw new Error("Failed to update demand");
      }
    },

    transferStock: async (
      _: any,
      {
        id,
        from,
        to,
        qty,
      }: { id: string; from: string; to: string; qty: number }
    ) => {
      try {
        // Start a transaction
        const client = await query("BEGIN");

        try {
          // Check if product exists and is in the source warehouse
          const productCheck = await query(
            "SELECT * FROM products WHERE id = $1 AND warehouse = $2",
            [id, from]
          );

          if (productCheck.rows.length === 0) {
            throw new Error(`Product is not in warehouse ${from}`);
          }

          const product = productCheck.rows[0];

          if (product.stock < qty) {
            throw new Error(
              `Insufficient stock. Available: ${product.stock}, Requested: ${qty}`
            );
          }

          // Update the product's warehouse and reduce stock
          const result = await query(
            "UPDATE products SET warehouse = $1, stock = stock - $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
            [to, qty, id]
          );

          // Commit the transaction
          await query("COMMIT");

          return result.rows[0];
        } catch (error) {
          // Rollback on error
          await query("ROLLBACK");
          throw error;
        }
      } catch (error) {
        console.error("Error transferring stock:", error);
        throw new Error("Failed to transfer stock");
      }
    },
  },
};
