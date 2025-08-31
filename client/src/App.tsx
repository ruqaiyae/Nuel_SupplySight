import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_KPIS,
  GET_PRODUCTS,
  GET_WAREHOUSES,
  UPDATE_DEMAND,
  TRANSFER_STOCK,
} from "./lib/graphql";
import TopBar from "./components/TopBar";
import KPICards from "./components/KPICards";
import StockDemandChart from "./components/StockDemandChart";
import Filters from "./components/Filter";
import ProductTable from "./components/ProductTable";

function App() {
  const [selectedDateRange, setSelectedDateRange] = useState("7d");
  const [filters, setFilters] = useState({
    search: "",
    warehouse: "",
    status: "",
  });

  // Load KPI data using GraphQL query
  const { loading, error, data } = useQuery(GET_KPIS, {
    variables: { range: selectedDateRange },
    fetchPolicy: "cache-and-network",
  });

  // Extract KPI data from the query result
  const kpiData = data?.kpis || [];

  // Load products data with filters
  const { data: productsData } = useQuery(GET_PRODUCTS, {
    variables: {
      search: filters.search || undefined,
      warehouse: filters.warehouse || undefined,
      status: filters.status || undefined,
    },
    fetchPolicy: "cache-and-network",
  });

  // Load warehouses data
  const { data: warehousesData } = useQuery(GET_WAREHOUSES);

  // GraphQL mutations
  const [updateDemand] = useMutation(UPDATE_DEMAND);
  const [transferStock] = useMutation(TRANSFER_STOCK);

  // Handle date range change
  const handleDateRangeChange = useCallback((range: string) => {
    setSelectedDateRange(range);
  }, []);

  // Handle filters change
  const handleFiltersChange = useCallback(
    (newFilters: { search: string; warehouse: string; status: string }) => {
      setFilters(newFilters);
    },
    []
  );

  // Update the product demand using GraphQL mutation
  const handleUpdateDemand = useCallback(
    async (productId: string, newDemand: number) => {
      try {
        const { data } = await updateDemand({
          variables: { id: productId, demand: newDemand },
          refetchQueries: [
            {
              query: GET_PRODUCTS,
              variables: {
                search: filters.search || undefined,
                warehouse: filters.warehouse || undefined,
                status: filters.status || undefined,
              },
            },
          ],
          update: (cache, { data: mutationData }) => {
            if (mutationData?.updateDemand) {
              cache.modify({
                fields: {
                  products(existingProducts = []) {
                    return existingProducts.map(
                      (product: { id: string; [key: string]: unknown }) => {
                        if (product.id === productId) {
                          return { ...product, demand: newDemand };
                        }
                        return product;
                      }
                    );
                  },
                },
              });
            }
          },
        });
        return data.updateDemand;
      } catch (error) {
        console.error("Failed to update demand:", error);
        throw error;
      }
    },
    [updateDemand, filters.search, filters.warehouse, filters.status]
  );

  // Transfer stock using GraphQL mutation
  const handleTransferStock = useCallback(
    async (
      productId: string,
      fromWarehouse: string,
      toWarehouse: string,
      quantity: number
    ) => {
      try {
        const { data } = await transferStock({
          variables: {
            id: productId,
            from: fromWarehouse,
            to: toWarehouse,
            qty: quantity,
          },
          refetchQueries: [
            {
              query: GET_PRODUCTS,
              variables: {
                search: filters.search || undefined,
                warehouse: filters.warehouse || undefined,
                status: filters.status || undefined,
              },
            },
          ],
          update: (cache, { data: mutationData }) => {
            if (mutationData?.transferStock) {
              cache.modify({
                fields: {
                  products(existingProducts = []) {
                    return existingProducts.map(
                      (product: { id: string; [key: string]: unknown }) => {
                        if (product.id === productId) {
                          return { ...product };
                        }
                        return product;
                      }
                    );
                  },
                },
              });
            }
          },
        });
        return data.transferStock;
      } catch (error) {
        console.error("Failed to transfer stock:", error);
        throw error;
      }
    },
    [transferStock, filters]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100">
      <TopBar
        onDateRangeChange={handleDateRangeChange}
        selectedDateRange={selectedDateRange}
        isLoading={loading}
      />
      <div className="px-8 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-6 drop-shadow-sm">
              Overview Dashboard
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Monitor your supply chain performance and key metrics
            </p>
          </div>

          {/* Loading and Error States */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">
                Error loading KPI data: {error.message}
              </p>
            </div>
          )}

          {/* KPI Cards */}
          <KPICards
            kpiData={kpiData}
            dateRange={selectedDateRange}
            isLoading={loading}
          />

          {/* Stock vs Demand Trend Chart */}
          <div className="mb-8">
            <StockDemandChart
              kpiData={kpiData}
              dateRange={selectedDateRange}
              isLoading={loading}
            />
          </div>

          {/* Filters Row */}
          <Filters onFiltersChange={handleFiltersChange} />

          {/* Product Table */}
          <div className="mb-8">
            <ProductTable
              products={productsData?.products || []}
              warehouses={warehousesData?.warehouses || []}
              onUpdateDemand={handleUpdateDemand}
              onTransferStock={handleTransferStock}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
