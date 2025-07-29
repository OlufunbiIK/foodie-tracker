import { useState } from "react";
import {
  Menu,
  X,
  Search,
  TrendingUp,
  Play,
  Pause,
  User,
  LogOut,
  Settings,
} from "lucide-react";

// Header Component
export function Header({
  onSearch,
  searchQuery = "",
  resultCount = 0,
  onLiveSearchToggle,
  user,
  onLogout,
}) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [liveSearchActive, setLiveSearchActive] = useState(false);

  function toggleMenu() {
    setMenuIsOpen((prev) => !prev);
  }

  function toggleUserMenu() {
    setUserMenuOpen((prev) => !prev);
  }

  function handleSearch(e) {
    const query = e.target.value;
    onSearch && onSearch(query);
  }

  function toggleLiveSearch() {
    const newState = !liveSearchActive;
    setLiveSearchActive(newState);

    // Call parent callback if provided
    onLiveSearchToggle && onLiveSearchToggle(newState);

    // If live search is being activated and there's a current query, trigger search
    if (newState && searchQuery) {
      onSearch && onSearch(searchQuery);
    }
  }

  function handleLogout() {
    setUserMenuOpen(false);
    onLogout && onLogout();
  }

  return (
    <header className="w-full relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400"></div>

      {/* Glass morphism overlay */}
      <div className="relative backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl m-2 shadow-2xl">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-lg transform hover:rotate-12 transition-all duration-300">
                <span className="text-xl">🍛</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-yellow-100 to-orange-200 bg-clip-text text-transparent drop-shadow-lg">
                Foodie
                <span className="italic font-light text-yellow-200 ml-1">
                  Tracker
                </span>
              </h1>
            </div>

            {/* Desktop search */}
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-center max-w-2xl mx-8">
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 rounded-xl blur opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                <div className="relative flex items-center">
                  <Search className="absolute left-4 text-gray-600 w-5 h-5" />
                  <input
                    type="text"
                    className="w-full bg-white/95 backdrop-blur-sm rounded-xl px-12 py-3 text-lg text-gray-800 placeholder-gray-500 border border-white/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white transition-all duration-500"
                    placeholder="Search by recipe, ingredient, or cuisine..."
                    onChange={handleSearch}
                    value={searchQuery}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => onSearch && onSearch("")}
                      className="absolute right-4 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Live Search Toggle Button */}
              <button
                onClick={toggleLiveSearch}
                className={`flex items-center space-x-2 backdrop-blur-sm rounded-lg px-4 py-2 border transition-all duration-300 transform hover:scale-105 ${
                  liveSearchActive
                    ? "bg-green-400/20 border-green-300/40 shadow-lg shadow-green-400/20"
                    : "bg-white/15 border-white/30 hover:bg-white/20"
                }`}
              >
                {liveSearchActive ? (
                  <Pause className="text-green-300 w-5 h-5" />
                ) : (
                  <Play className="text-white w-5 h-5" />
                )}
                <span
                  className={`font-medium transition-colors ${
                    liveSearchActive ? "text-green-200" : "text-white"
                  }`}
                >
                  {liveSearchActive
                    ? searchQuery
                      ? `${resultCount} Live Results`
                      : "Live Search ON"
                    : "Live Search"}
                </span>
                {liveSearchActive && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </button>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user && (
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 backdrop-blur-sm bg-white/15 border border-white/30 rounded-lg px-4 py-2 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium">{user.name}</span>
                  </button>

                  {/* User dropdown menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 backdrop-blur-sm bg-white/95 border border-white/30 rounded-xl shadow-lg overflow-hidden z-50">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={toggleMenu}
              className="md:hidden relative group p-2 rounded-lg transition-all duration-300 hover:bg-white/15 cursor-pointer z-10"
              type="button"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {menuIsOpen ? (
                  <X className="text-white w-6 h-6" />
                ) : (
                  <Menu className="text-white w-6 h-6" />
                )}
              </div>
            </button>
          </div>

          {/* Mobile menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
              menuIsOpen
                ? "max-h-96 opacity-100 mt-6"
                : "max-h-0 opacity-0 mt-0"
            }`}
            style={{
              transform: menuIsOpen ? "translateY(0)" : "translateY(-20px)",
            }}
          >
            <div className="space-y-4 pb-2">
              {/* Mobile user info */}
              {user && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {user.name}
                        </p>
                        <p className="text-white/70 text-xs">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-red-300 hover:text-red-200 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Mobile search */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 rounded-xl blur opacity-20"></div>
                <div className="relative flex items-center">
                  <Search className="absolute left-4 text-gray-600 w-5 h-5" />
                  <input
                    type="search"
                    className="w-full bg-white/95 backdrop-blur-sm rounded-xl px-12 py-3 text-lg text-gray-800 placeholder-gray-500 border border-white/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-500"
                    placeholder="Search by recipe, ingredient, or cuisine..."
                    onChange={handleSearch}
                    value={searchQuery}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => onSearch && onSearch("")}
                      className="absolute right-4 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Live Search Toggle */}
              <button
                onClick={toggleLiveSearch}
                className={`w-full flex items-center justify-center space-x-2 backdrop-blur-sm rounded-lg py-3 border transition-all duration-300 ${
                  liveSearchActive
                    ? "bg-green-400/20 border-green-300/40"
                    : "bg-white/15 border-white/30 hover:bg-white/20"
                }`}
              >
                {liveSearchActive ? (
                  <Pause className="text-green-300 w-5 h-5" />
                ) : (
                  <Play className="text-white w-5 h-5" />
                )}
                <span
                  className={`font-medium ${
                    liveSearchActive ? "text-green-200" : "text-white"
                  }`}
                >
                  {liveSearchActive
                    ? searchQuery
                      ? `${resultCount} Live Results`
                      : "Live Search Active"
                    : "Activate Live Search"}
                </span>
                {liveSearchActive && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </button>

              {/* Search suggestions for mobile */}
              {!searchQuery && !liveSearchActive && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <p className="text-white text-sm font-medium mb-2">
                    Try searching for:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Pizza",
                      "Pasta",
                      "Chicken",
                      "Dessert",
                      "Vegetarian",
                      "Quick",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => onSearch && onSearch(suggestion)}
                        className="px-3 py-1 bg-white/15 hover:bg-white/25 rounded-full text-white text-xs transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-yellow-300/15 to-pink-300/15 rounded-full blur-xl"></div>
        <div className="absolute bottom-2 left-2 w-16 h-16 bg-gradient-to-br from-blue-300/15 to-purple-300/15 rounded-full blur-xl"></div>

        {/* Click outside handler for user menu */}
        {userMenuOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setUserMenuOpen(false)}
          ></div>
        )}
      </div>
    </header>
  );
}
