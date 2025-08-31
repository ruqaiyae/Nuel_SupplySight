import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
  created_at?: string;
  updated_at?: string;
}

interface Warehouse {
  code: string;
  name: string;
  city: string;
  country: string;
}

interface ProductTableProps {
  products: Product[];
  warehouses: Warehouse[];
  onUpdateDemand?: (productId: string, newDemand: number) => void;
  onTransferStock?: (
    productId: string,
    from: string,
    to: string,
    qty: number
  ) => Promise<void>;
}

export default function ProductTable({
  products,
  warehouses,
  onUpdateDemand,
  onTransferStock,
}: ProductTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUpdatingDemand, setIsUpdatingDemand] = useState(false);
  const [newDemand, setNewDemand] = useState<string>("");
  const [demandError, setDemandError] = useState<string>("");
  const [demandSuccess, setDemandSuccess] = useState<string>("");
  const [transferQuantity, setTransferQuantity] = useState<string>("");
  const [destinationWarehouse, setDestinationWarehouse] = useState<string>("");
  const [transferQuantityError, setTransferQuantityError] =
    useState<string>("");
  const [transferSuccess, setTransferSuccess] = useState<string>("");
  const [isTransferring, setIsTransferring] = useState(false);

  const rowsPerPage = 10;

  const getStatusInfo = (product: Product) => {
    if (product.stock > product.demand) {
      return {
        status: "Healthy",
        emoji: "🟢",
        color: "text-green-600",
        bgColor: "bg-green-50",
      };
    } else if (product.stock === product.demand) {
      return {
        status: "Low",
        emoji: "🟡",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
      };
    } else {
      return {
        status: "Critical",
        emoji: "🔴",
        color: "text-red-600",
        bgColor: "bg-red-50",
      };
    }
  };

  const getRowStyling = (product: Product) => {
    if (product.stock < product.demand) {
      return "bg-red-50/50 hover:bg-red-100/60";
    }
    return "";
  };

  const handleRowClick = (product: Product) => {
    setSelectedProduct(product);
    setNewDemand(product.demand.toString());
    setDemandError("");
    setDemandSuccess("");
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
    setNewDemand("");
    setDemandError("");
    setDemandSuccess("");
    setIsUpdatingDemand(false);

    // Reset transfer form state
    setTransferQuantity("");
    setDestinationWarehouse("");
    setTransferQuantityError("");
    setTransferSuccess("");
    setIsTransferring(false);
  };

  const validateDemand = (value: string): boolean => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) {
      setDemandError("Demand must be a positive number");
      return false;
    }
    if (numValue > 999999) {
      setDemandError("Demand cannot exceed 999,999");
      return false;
    }
    setDemandError("");
    return true;
  };

  const handleDemandChange = (value: string) => {
    setNewDemand(value);
    setDemandSuccess(""); // Clear success message when user types
    if (value) {
      validateDemand(value);
    } else {
      setDemandError("");
    }
  };

  const handleUpdateDemand = async () => {
    if (!selectedProduct || !newDemand.trim()) return;

    if (!validateDemand(newDemand)) return;

    const newDemandValue = parseInt(newDemand);
    if (newDemandValue === selectedProduct.demand) {
      setDemandError("New demand value is the same as current demand");
      return;
    }

    setIsUpdatingDemand(true);

    try {
      if (onUpdateDemand) {
        await onUpdateDemand(selectedProduct.id, newDemandValue);

        // Update the local product data
        const updatedProduct = { ...selectedProduct, demand: newDemandValue };
        setSelectedProduct(updatedProduct);

        // Update the product in the products array to reflect changes in the table
        const productIndex = products.findIndex(
          (p) => p.id === selectedProduct.id
        );
        if (productIndex !== -1) {
          products[productIndex].demand = newDemandValue;
        }

        setDemandError("");
        setDemandSuccess("Demand updated successfully!");

        // Clear success message after 3 seconds
        setTimeout(() => {
          setDemandSuccess("");
        }, 3000);
      }
    } catch (error) {
      setDemandError(`Failed to update demand. Please try again. ${error}`);
    } finally {
      setIsUpdatingDemand(false);
    }
  };

  // Transfer stock handlers
  const validateTransferQuantity = (value: string): boolean => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue <= 0) {
      setTransferQuantityError("Transfer quantity must be a positive number");
      return false;
    }
    if (numValue > selectedProduct!.stock) {
      setTransferQuantityError(
        "Transfer quantity cannot exceed available stock"
      );
      return false;
    }
    setTransferQuantityError("");
    return true;
  };

  const handleTransferQuantityChange = (value: string) => {
    setTransferQuantity(value);
    setTransferSuccess(""); // Clear success message when user types
    if (value) {
      validateTransferQuantity(value);
    } else {
      setTransferQuantityError("");
    }
  };

  const handleTransferStock = async () => {
    if (!selectedProduct || !transferQuantity.trim() || !destinationWarehouse)
      return;

    if (!validateTransferQuantity(transferQuantity)) return;

    const transferQty = parseInt(transferQuantity);
    setIsTransferring(true);

    try {
      // Call the transfer function (this will be implemented in the parent component)
      if (onTransferStock) {
        await onTransferStock(
          selectedProduct.id,
          selectedProduct.warehouse,
          destinationWarehouse,
          transferQty
        );

        // Update the local product data
        const updatedProduct = {
          ...selectedProduct,
          stock: selectedProduct.stock - transferQty,
        };
        setSelectedProduct(updatedProduct);

        // Update the product in the products array
        const productIndex = products.findIndex(
          (p) => p.id === selectedProduct.id
        );
        if (productIndex !== -1) {
          products[productIndex].stock = selectedProduct.stock - transferQty;
        }

        setTransferQuantityError("");
        setTransferSuccess("Stock transferred successfully!");

        // Clear success message after 3 seconds
        setTimeout(() => {
          setTransferSuccess("");
        }, 3000);

        // Reset form
        setTransferQuantity("");
        setDestinationWarehouse("");
      }
    } catch (error) {
      setTransferQuantityError(
        `Failed to transfer stock. Please try again. ${error}`
      );
    } finally {
      setIsTransferring(false);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(products.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  // Reset to first page when products change
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-500 text-lg">
          No products found matching the current filters
        </div>
        <div className="text-gray-400 text-sm mt-2">
          Try adjusting your search criteria or filters
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Product Inventory
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of{" "}
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse
                </th>
                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demand
                </th>
                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.map((product) => {
                const statusInfo = getStatusInfo(product);
                const rowStyling = getRowStyling(product);

                return (
                  <tr
                    key={product.id}
                    onClick={() => handleRowClick(product)}
                    className={`transition-colors cursor-pointer ${rowStyling} ${
                      product.stock >= product.demand ? "hover:bg-gray-100" : ""
                    }`}
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {product.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                      {product.sku}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                      {product.warehouse}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {product.stock.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {product.demand.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                      >
                        {statusInfo.emoji} {statusInfo.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-2 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    console.log("Previous clicked, currentPage:", currentPage);
                    setCurrentPage(Math.max(1, currentPage - 1));
                  }}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    console.log(
                      "Next clicked, currentPage:",
                      currentPage,
                      "totalPages:",
                      totalPages
                    );
                    const newPage = Math.min(totalPages, currentPage + 1);
                    console.log("Setting new page to:", newPage);
                    setCurrentPage(newPage);
                  }}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right-side Drawer */}
      {isDrawerOpen && selectedProduct && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-50/60 z-40"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Product Details
                </h2>
                <button
                  onClick={closeDrawer}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {/* Product Name */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Product ID: {selectedProduct.id}
                  </p>
                </div>

                {/* SKU */}
                <div className="flex gap-2 items-center">
                  <label className="text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {selectedProduct.sku}
                  </p>
                </div>

                {/* Warehouse */}
                <div className="flex gap-2 items-center">
                  <label className="text-sm font-medium text-gray-70">
                    Warehouse
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {selectedProduct.warehouse}
                  </p>
                </div>

                {/* Stock & Demand */}
                <div className="grid grid-cols-2 gap-4 my-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Stock
                    </label>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedProduct.stock.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Demand
                    </label>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedProduct.demand.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex gap-2 items-center mb-6">
                  <label className="text-sm font-medium text-gray-700">
                    Inventory Status
                  </label>
                  {(() => {
                    const statusInfo = getStatusInfo(selectedProduct);
                    return (
                      <div
                        className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                      >
                        <span className="text-lg mr-2">{statusInfo.emoji}</span>
                        {statusInfo.status}
                      </div>
                    );
                  })()}
                </div>

                {/* Stock Analysis */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Analysis
                  </label>
                  <div className="space-y-2">
                    {selectedProduct.stock > selectedProduct.demand ? (
                      <div className="flex items-center text-sm text-green-600">
                        <span className="mr-2">✓</span>
                        Stock exceeds demand by{" "}
                        {(
                          selectedProduct.stock - selectedProduct.demand
                        ).toLocaleString()}{" "}
                        units
                      </div>
                    ) : selectedProduct.stock === selectedProduct.demand ? (
                      <div className="flex items-center text-sm text-yellow-600">
                        <span className="mr-2">⚠</span>
                        Stock equals demand - consider restocking
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-red-600">
                        <span className="mr-2">✗</span>
                        Stock deficit of{" "}
                        {(
                          selectedProduct.demand - selectedProduct.stock
                        ).toLocaleString()}{" "}
                        units
                      </div>
                    )}
                  </div>
                </div>

                {/* Update Demand Form */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Update Demand
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center ">
                      <label
                        htmlFor="newDemand"
                        className="text-sm font-medium text-gray-700 w-[50%]"
                      >
                        New Demand Value
                      </label>
                      <input
                        id="newDemand"
                        type="number"
                        min="0"
                        max="999999"
                        value={newDemand}
                        onChange={(e) => handleDemandChange(e.target.value)}
                        className={`w-[50%] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          demandError ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="Enter new demand value"
                      />
                      {demandError && (
                        <p className="text-sm text-red-600 mt-1">
                          {demandError}
                        </p>
                      )}
                      {demandSuccess && (
                        <p className="text-sm text-green-600 mt-1">
                          {demandSuccess}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleUpdateDemand}
                      disabled={
                        isUpdatingDemand || !newDemand.trim() || !!demandError
                      }
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isUpdatingDemand ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                          Updating...
                        </>
                      ) : (
                        "Update Demand"
                      )}
                    </button>
                  </div>
                </div>

                {/* Transfer Stock Form */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Transfer Stock
                  </h4>
                  <div className="space-y-4">
                    <div className="mb-6">
                      <div className="flex items-center">
                        <label
                          htmlFor="transferStock"
                          className=" text-sm font-medium text-gray-700 w-[50%]"
                        >
                          Transfer Quantity
                        </label>
                        <input
                          id="transferStock"
                          type="number"
                          min="1"
                          max={selectedProduct.stock}
                          value={transferQuantity}
                          onChange={(e) =>
                            handleTransferQuantityChange(e.target.value)
                          }
                          className={`w-[50%] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            transferQuantityError
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter quantity"
                        />
                        {transferQuantityError && (
                          <p className="text-sm text-red-600 mt-1">
                            {transferQuantityError}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Available stock:{" "}
                        {selectedProduct.stock.toLocaleString()} units
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Destination Warehouse
                      </label>
                      <select
                        value={destinationWarehouse}
                        onChange={(e) =>
                          setDestinationWarehouse(e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select destination warehouse</option>
                        {warehouses
                          .filter((w) => w.code !== selectedProduct.warehouse)
                          .map((warehouse) => (
                            <option key={warehouse.code} value={warehouse.code}>
                              {warehouse.name} ({warehouse.code})
                            </option>
                          ))}
                      </select>
                    </div>

                    {transferSuccess && (
                      <p className="text-sm text-green-600 mt-1">
                        {transferSuccess}
                      </p>
                    )}

                    <button
                      onClick={handleTransferStock}
                      disabled={
                        isTransferring ||
                        !transferQuantity.trim() ||
                        !destinationWarehouse ||
                        !!transferQuantityError
                      }
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isTransferring ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                          Transferring...
                        </>
                      ) : (
                        "Transfer Stock"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={closeDrawer}
                  className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
