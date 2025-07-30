// import React from "react";

// export default function Result({ resultCount = 0, searchQuery = "" }) {
//   return (
//     <div className="flex items-center justify-center p-2">
//       <span className="text-sm font-medium text-gray-700">{resultCount}</span>
//     </div>
//   );
// }

import React from "react";
import { Search, Utensils, Filter, TrendingUp } from "lucide-react";

export default function Result({
  resultCount = 0,
  searchQuery = "",
  isLoading = false,
}) {
  // Don't show anything if no search query and no results
  if (!searchQuery && resultCount === 0 && !isLoading) {
    return null;
  }

  // Format the result count with nice formatting
  const formatCount = (count) => {
    if (count === 0) return "0";
    if (count === 1) return "1";
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}k`;
    return `${(count / 1000000).toFixed(1)}M`;
  };

  // Get appropriate color scheme based on result count
  const getColorScheme = () => {
    if (isLoading) return "text-blue-300 bg-blue-500/20 border-blue-400/30";
    if (resultCount === 0)
      return "text-red-300 bg-red-500/20 border-red-400/30";
    if (resultCount < 10)
      return "text-yellow-300 bg-yellow-500/20 border-yellow-400/30";
    return "text-green-300 bg-green-500/20 border-green-400/30";
  };

  // Get appropriate icon
  const getIcon = () => {
    if (isLoading) return <Search className="w-4 h-4 animate-pulse" />;
    if (resultCount === 0) return <Filter className="w-4 h-4" />;
    return <Utensils className="w-4 h-4" />;
  };

  // Get status text
  const getStatusText = () => {
    if (isLoading) return "Searching...";
    if (resultCount === 0 && searchQuery) return "No matches";
    if (resultCount === 0) return "No recipes";
    if (resultCount === 1) return "recipe found";
    return "recipes found";
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
        backdrop-blur-sm rounded-xl px-4 py-2 border transition-all duration-300 
        transform hover:scale-105 shadow-lg
        ${getColorScheme()}
      `}
      >
        <div className="flex items-center space-x-2">
          {getIcon()}

          <div className="flex items-baseline space-x-1">
            <span className="text-lg font-bold tabular-nums">
              {isLoading ? "..." : formatCount(resultCount)}
            </span>
            <span className="text-sm opacity-90">{getStatusText()}</span>
          </div>

          {/* Search query indicator */}
          {searchQuery && !isLoading && (
            <div className="flex items-center space-x-1 ml-2 pl-2 border-l border-current/30">
              <span className="text-xs opacity-75">for</span>
              <span
                className="text-xs font-medium max-w-20 truncate"
                title={searchQuery}
              >
                "{searchQuery}"
              </span>
            </div>
          )}

          {/* Trending indicator for good results */}
          {resultCount > 20 && !isLoading && (
            <TrendingUp className="w-3 h-3 ml-1 opacity-60" />
          )}

          {/* Loading dots animation */}
          {isLoading && (
            <div className="flex space-x-1 ml-2">
              <div
                className="w-1 h-1 bg-current rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-1 h-1 bg-current rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-1 h-1 bg-current rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          )}
        </div>

        {/* Subtle pulse effect for active search */}
        {isLoading && (
          <div className="absolute inset-0 rounded-xl bg-current opacity-10 animate-pulse"></div>
        )}
      </div>
    </div>
  );
}
