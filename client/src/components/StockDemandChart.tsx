import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

interface KPI {
  id?: number;
  date: string;
  stock: number;
  demand: number;
  created_at?: string;
}

interface StockDemandChartProps {
  kpiData: KPI[];
  dateRange: string;
  isLoading?: boolean;
}

export default function StockDemandChart({
  kpiData,
  dateRange,
  isLoading = false,
}: StockDemandChartProps) {
  // Prepare data for the chart - memoized to prevent recalculation on every render
  const chartData = useMemo(
    () =>
      kpiData.map((kpi, index) => ({
        day: index + 1,
        stock: kpi.stock,
        demand: kpi.demand,
        date: kpi.date,
      })),
    [kpiData]
  );

  // Calculate summary stats - memoized to prevent recalculation on every render
  const { avgStock, avgDemand, stockDemandRatio } = useMemo(() => {
    if (chartData.length === 0) {
      return { avgStock: 0, avgDemand: 0, stockDemandRatio: 0 };
    }

    const totalStock = chartData.reduce((sum, point) => sum + point.stock, 0);
    const totalDemand = chartData.reduce((sum, point) => sum + point.demand, 0);

    const avgStock = Math.round(totalStock / chartData.length);
    const avgDemand = Math.round(totalDemand / chartData.length);
    const stockDemandRatio =
      totalDemand > 0 ? Math.round((totalStock / totalDemand) * 100) : 0;

    return { avgStock, avgDemand, stockDemandRatio };
  }, [chartData]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Stock vs Demand Trend
        </h3>
        <p className="text-sm text-gray-600">
          {dateRange === "7d"
            ? "Last 7 days"
            : dateRange === "14d"
            ? "Last 14 days"
            : "Last 30 days"}{" "}
          performance comparison
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Data points:{" "}
          {isLoading ? (
            <span className="inline-block w-8 h-3 bg-gray-200 animate-pulse rounded"></span>
          ) : (
            kpiData.length
          )}{" "}
          | Range: {dateRange}
        </p>
      </div>

      <div className="h-96 w-full relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-sm text-gray-600">Updating chart...</p>
            </div>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="day"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{ color: "#374151", fontWeight: "600" }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
              }}
            />
            <Line
              type="monotone"
              dataKey="stock"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
              name="Stock"
            />
            <Line
              type="monotone"
              dataKey="demand"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#f97316", strokeWidth: 2 }}
              name="Demand"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {isLoading ? (
              <span className="inline-block w-16 h-8 bg-gray-200 animate-pulse rounded"></span>
            ) : (
              avgStock.toLocaleString()
            )}
          </div>
          <div className="text-sm text-gray-600">Avg Stock</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {isLoading ? (
              <span className="inline-block w-16 h-8 bg-gray-200 animate-pulse rounded"></span>
            ) : (
              avgDemand.toLocaleString()
            )}
          </div>
          <div className="text-sm text-gray-600">Avg Demand</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {isLoading ? (
              <span className="inline-block w-16 h-8 bg-gray-200 animate-pulse rounded"></span>
            ) : (
              `${stockDemandRatio}%`
            )}
          </div>
          <div className="text-sm text-gray-600">Stock/Demand Ratio</div>
        </div>
      </div>
    </div>
  );
}
