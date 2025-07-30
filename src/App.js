import { useEffect, useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { Foods } from "./components/Foods";
import AuthPage from "./components/Auth";

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Existing recipe app state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [resultCount, setResultCount] = useState(0);
  const [liveSearchEnabled, setLiveSearchEnabled] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      // In a real app, you'd check for stored auth tokens, session storage, etc.
      const storedUser = localStorage.getItem("user");
      const authToken = localStorage.getItem("authToken");

      if (storedUser && authToken) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    };

    // Simulate checking auth status
    setTimeout(checkAuthStatus, 1000);
  }, []);

  // Handle successful authentication
  function handleAuthSuccess(userData) {
    setUser(userData);
    setIsAuthenticated(true);

    // In a real app, you'd store the auth token and user data
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("authToken", "your-auth-token"); // This would come from your API

    console.log("User authenticated:", userData);
  }

  // Handle logout
  function handleLogout() {
    setUser(null);
    setIsAuthenticated(false);

    // Clear stored auth data
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");

    // Reset recipe app state
    setSearchQuery("");
    setSelectedRecipe(null);
    setResultCount(0);
    setLiveSearchEnabled(false);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
      setSearchTimeout(null);
    }

    console.log("User logged out");
  }

  // Existing recipe app functions
  function handleSearch(query) {
    setSearchQuery(query);

    if (liveSearchEnabled) {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const newTimeout = setTimeout(() => {
        console.log("Live searching for:", query);
      }, 300);

      setSearchTimeout(newTimeout);
    }
  }

  function handleLiveSearchToggle(isActive) {
    setLiveSearchEnabled(isActive);

    if (isActive) {
      console.log("Live search activated - searches will happen as you type");
      if (searchQuery) {
        console.log("Performing live search for existing query:", searchQuery);
      }
    } else {
      console.log("Live search deactivated - manual search mode");
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

  useEffect(() => {
    if (searchQuery && isAuthenticated) {
      setResultCount(Math.floor(Math.random() * 50) + 1);
    } else {
      setResultCount(0);
    }
  }, [searchQuery, isAuthenticated]);

  function handleResultCountChange(count) {
    setResultCount(count);
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-xl mb-4 mx-auto animate-spin">
            <span className="text-2xl">🍛</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Foodie Tracker</h2>
          <p className="text-white/80">Loading your culinary experience...</p>
        </div>
      </div>
    );
  }

  // Show authentication page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // Show main recipe app if authenticated
  return (
    <div className="min-h-screen bg-gray-900">
      <Header
        onSearch={handleSearch}
        searchQuery={searchQuery}
        resultCount={resultCount}
        onLiveSearchToggle={handleLiveSearchToggle}
        user={user}
        onLogout={handleLogout}
      />

      <Foods
        onDisplay={handleRecipeDisplay}
        searchQuery={searchQuery}
        liveSearchEnabled={liveSearchEnabled}
        onResultCountChange={handleResultCountChange} // Add this prop
      />

      {/* Debug info - remove in production */}
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-sm max-w-xs">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <p>
          <strong>User:</strong> {user?.name || user?.email || "Guest"}
        </p>
        <p>
          <strong>Query:</strong> {searchQuery || "None"}
        </p>
        <p>
          <strong>Live Search:</strong> {liveSearchEnabled ? "ON" : "OFF"}
        </p>
        <p>
          <strong>Results:</strong> {resultCount}
        </p>
        <button
          onClick={handleLogout}
          className="mt-2 px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition-colors"
        >
          Logout
        </button>
        <p className="text-xs text-gray-300 mt-2">
          {liveSearchEnabled
            ? "Search happens as you type (300ms delay)"
            : "Search happens when Foods component fetches data"}
        </p>
      </div>
    </div>
  );
}
