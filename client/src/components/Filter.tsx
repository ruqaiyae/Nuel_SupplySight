import { useState, useEffect } from "react";
import { GET_WAREHOUSES } from "../lib/graphql";
import { useQuery } from "@apollo/client";
import { Search } from "lucide-react";

interface FiltersProps {
  onFiltersChange: (filters: {
    search: string;
    warehouse: string;
    status: string;
  }) => void;
}

export default function Filters({ onFiltersChange }: FiltersProps) {
  const [search, setSearch] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [status, setStatus] = useState("");

  const { data } = useQuery(GET_WAREHOUSES, {
    fetchPolicy: "cache-and-network",
  });
  const warehouses = data?.warehouses || [];

  useEffect(() => {
    onFiltersChange({ search, warehouse, status });
  }, [search, warehouse, status, onFiltersChange]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search Box */}
        <div className="flex-1 min-w-0">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Search Products
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              placeholder="Search by name, SKU, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Warehouse Dropdown */}
        <div className="w-full lg:w-48">
          <label
            htmlFor="warehouse"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Warehouse
          </label>
          <select
            id="warehouse"
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Warehouses</option>
            {warehouses.map((wh: { code: string; name: string }) => (
              <option key={wh.code} value={wh.code}>
                {wh.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="w-full lg:w-48">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            <option value="Healthy">🟢 Healthy</option>
            <option value="Low">🟡 Low</option>
            <option value="Critical">🔴 Critical</option>
          </select>
        </div>
      </div>

      {/* Status Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-green-600">🟢</span>
            <span>Healthy: stock &gt; demand</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">🟡</span>
            <span>Low: stock = demand</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-600">🔴</span>
            <span>Critical: stock &lt; demand</span>
          </div>
        </div>
      </div>
    </div>
  );
}
