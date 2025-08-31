interface TopBarProps {
  onDateRangeChange?: (range: string) => void;
  selectedDateRange: string;
  isLoading?: boolean;
}

export default function TopBar({
  onDateRangeChange,
  selectedDateRange,
  isLoading = false,
}: TopBarProps) {
  const handleRangeClick = (range: string) => {
    onDateRangeChange?.(range);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-3 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 border-b-2 border-blue-200 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(30,58,138,0.1)]">
          SupplySight
        </h1>
      </div>

      <div className="flex items-center">
        <div className="relative flex gap-2 bg-white p-2 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-blue-200 transition-all duration-300 ease-in-out">
          {isLoading && (
            <div className="absolute -top-1 -right-1">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          )}
          <button
            className={`px-4 py-2 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 ease-in-out min-w-12 text-center focus:outline-none focus:ring-4 focus:ring-blue-300/30 ${
              selectedDateRange === "7d"
                ? "bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-[0_2px_8px_rgba(30,58,138,0.3)] transform -translate-y-0.5"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-600 hover:-translate-y-0.5 active:bg-slate-200"
            }`}
            onClick={() => handleRangeClick("7d")}
          >
            7d
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 ease-in-out min-w-12 text-center focus:outline-none focus:ring-4 focus:ring-blue-300/30 ${
              selectedDateRange === "14d"
                ? "bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-[0_2px_8px_rgba(30,58,138,0.3)] transform -translate-y-0.5"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-600 hover:-translate-y-0.5 active:bg-slate-200"
            }`}
            onClick={() => handleRangeClick("14d")}
          >
            14d
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 ease-in-out min-w-12 text-center focus:outline-none focus:ring-4 focus:ring-blue-300/30 ${
              selectedDateRange === "30d"
                ? "bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-[0_2px_8px_rgba(30,58,138,0.3)] transform -translate-y-0.5"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-600 hover:-translate-y-0.5 active:bg-slate-200"
            }`}
            onClick={() => handleRangeClick("30d")}
          >
            30d
          </button>
        </div>
      </div>
    </div>
  );
}
