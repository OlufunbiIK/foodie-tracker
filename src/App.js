import { useEffect, useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { Foods } from "./components/Foods";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [resultCount, setResultCount] = useState(0);
  const [liveSearchEnabled, setLiveSearchEnabled] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  function handleSearch(query) {
    setSearchQuery(query);

    // If live search is enabled, implement debounced search
    if (liveSearchEnabled) {
      // Clear existing timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      // Set new timeout for debounced search
      const newTimeout = setTimeout(() => {
        // This would trigger immediate search in Foods component
        console.log("Live searching for:", query);
        // The Foods component will automatically react to searchQuery changes
      }, 300); // 300ms debounce

      setSearchTimeout(newTimeout);
    }
  }

  function handleLiveSearchToggle(isActive) {
    setLiveSearchEnabled(isActive);

    if (isActive) {
      console.log("Live search activated - searches will happen as you type");
      // If there's already a query when live search is enabled, trigger search
      if (searchQuery) {
        console.log("Performing live search for existing query:", searchQuery);
      }
    } else {
      console.log("Live search deactivated - manual search mode");
      // Clear any pending search timeouts
      if (searchTimeout) {
        clearTimeout(searchTimeout);
        setSearchTimeout(null);
      }
    }
  }

  function handleRecipeDisplay(recipe) {
    setSelectedRecipe(recipe);
  }

  function handleCloseRecipe() {
    setSelectedRecipe(null);
  }

  // Update result count when search results change
  // This would ideally be passed back from the Foods component
  useEffect(() => {
    // Simulate result count update - in a real app, this would come from Foods component
    if (searchQuery) {
      setResultCount(Math.floor(Math.random() * 50) + 1);
    } else {
      setResultCount(0);
    }
  }, [searchQuery]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header
        onSearch={handleSearch}
        searchQuery={searchQuery}
        resultCount={resultCount}
        onLiveSearchToggle={handleLiveSearchToggle}
      />
      <Foods
        onDisplay={handleRecipeDisplay}
        searchQuery={searchQuery}
        liveSearchEnabled={liveSearchEnabled}
      />

      {/* Debug info - remove in production */}
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-sm max-w-xs">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <p>
          <strong>Query:</strong> {searchQuery || "None"}
        </p>
        <p>
          <strong>Live Search:</strong> {liveSearchEnabled ? "ON" : "OFF"}
        </p>
        <p>
          <strong>Results:</strong> {resultCount}
        </p>
        <p className="text-xs text-gray-300 mt-2">
          {liveSearchEnabled
            ? "Search happens as you type (300ms delay)"
            : "Search happens when Foods component fetches data"}
        </p>
      </div>
    </div>
  );
}
