import { Package, TrendingUp, CheckCircle } from "lucide-react";
import { useMemo } from "react";

interface KPI {
  id?: number;
  date: string;
  stock: number;
  demand: number;
  created_at?: string;
}

interface KPICardsProps {
  kpiData: KPI[];
  dateRange: string;
  isLoading?: boolean;
}

export default function KPICards({
  kpiData,
  dateRange,
  isLoading = false,
}: KPICardsProps) {
  // Calculate KPIs based on the selected date range - memoized to prevent recalculation on every render
  const { totalStock, totalDemand, fillRate } = useMemo(() => {
    const totalStock = kpiData.reduce((sum, kpi) => sum + kpi.stock, 0);
    const totalDemand = kpiData.reduce((sum, kpi) => sum + kpi.demand, 0);

    // Calculate Fill Rate: (sum(min(stock, demand)) / sum(demand)) * 100%
    const fillRate =
      totalDemand > 0
        ? (kpiData.reduce(
            (sum, kpi) => sum + Math.min(kpi.stock, kpi.demand),
            0
          ) /
            totalDemand) *
          100
        : 0;

    return { totalStock, totalDemand, fillRate };
  }, [kpiData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Stock Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-gray-500">
              Total Stock
            </span>
          </div>
        </div>
        <div className="mb-2">
          <span className="text-3xl font-bold text-gray-900">
            {isLoading ? (
              <span className="inline-block w-20 h-8 bg-gray-200 animate-pulse rounded"></span>
            ) : (
              totalStock.toLocaleString()
            )}
          </span>
          <span className="text-lg text-gray-500 ml-2">units</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="text-green-600 font-medium">
            Available inventory
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {dateRange === "7d"
            ? "Last 7 days"
            : dateRange === "14d"
            ? "Last 14 days"
            : "Last 30 days"}
        </div>
      </div>

      {/* Total Demand Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-gray-500">
              Total Demand
            </span>
          </div>
        </div>
        <div className="mb-2">
          <span className="text-3xl font-bold text-gray-900">
            {isLoading ? (
              <span className="inline-block w-20 h-8 bg-gray-200 animate-pulse rounded"></span>
            ) : (
              totalDemand.toLocaleString()
            )}
          </span>
          <span className="text-lg text-gray-500 ml-2">units</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="text-orange-600 font-medium">
            Customer requirements
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {dateRange === "7d"
            ? "Last 7 days"
            : dateRange === "14d"
            ? "Last 14 days"
            : "Last 30 days"}
        </div>
      </div>

      {/* Fill Rate Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-gray-500">Fill Rate</span>
          </div>
        </div>
        <div className="mb-2">
          <span className="text-3xl font-bold text-gray-900">
            {isLoading ? (
              <span className="inline-block w-16 h-8 bg-gray-200 animate-pulse rounded"></span>
            ) : (
              `${fillRate.toFixed(1)}%`
            )}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span
            className={`font-medium ${
              fillRate >= 80
                ? "text-green-600"
                : fillRate >= 60
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {fillRate >= 80
              ? "Excellent"
              : fillRate >= 60
              ? "Good"
              : "Needs attention"}
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {dateRange === "7d"
            ? "Last 7 days"
            : dateRange === "14d"
            ? "Last 14 days"
            : "Last 30 days"}
        </div>
      </div>
    </div>
  );
}
