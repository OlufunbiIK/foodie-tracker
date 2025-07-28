import { useState, useEffect } from "react";
import {
  Search,
  Heart,
  Star,
  Clock,
  Users,
  ChefHat,
  Calendar,
  Plus,
  MapPin,
  Utensils,
} from "lucide-react";

// Custom Hooks (we'll implement these)
const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRecipes = async (query) => {
    setLoading(true);
    setError(null);
    try {
      // Mock data for now - replace with actual API call
      const mockRecipes = [
        {
          id: 1,
          title: "Spaghetti Carbonara",
          image:
            "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop",
          readyInMinutes: 20,
          servings: 4,
          rating: 4.5,
          isFavorite: false,
          difficulty: "Medium",
        },
        {
          id: 2,
          title: "Chicken Tikka Masala",
          image:
            "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop",
          readyInMinutes: 45,
          servings: 6,
          rating: 4.8,
          isFavorite: true,
          difficulty: "Hard",
        },
        {
          id: 3,
          title: "Caesar Salad",
          image:
            "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=300&h=200&fit=crop",
          readyInMinutes: 15,
          servings: 2,
          rating: 4.2,
          isFavorite: false,
          difficulty: "Easy",
        },
      ];

      setTimeout(() => {
        setRecipes(
          mockRecipes.filter((recipe) =>
            recipe.title.toLowerCase().includes(query.toLowerCase())
          )
        );
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return { recipes, loading, error, searchRecipes, setRecipes };
};

const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (recipe) => {
    setFavorites((prev) => {
      const exists = prev.find((fav) => fav.id === recipe.id);
      if (exists) {
        return prev.filter((fav) => fav.id !== recipe.id);
      } else {
        return [...prev, { ...recipe, isFavorite: true }];
      }
    });
  };

  return { favorites, toggleFavorite };
};

// Components
const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && query.trim()) {
      onSearch(query);
    }
  };

  const handleSearchClick = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto mb-8">
      <div className="relative flex">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for recipes, ingredients, or cuisine..."
          className="w-full pl-12 pr-24 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg bg-white shadow-sm"
          disabled={isLoading}
        />
        <button
          onClick={handleSearchClick}
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-xl font-medium transition-colors duration-200"
        >
          Search
        </button>
      </div>
    </div>
  );
};

const RecipeCard = ({ recipe, onToggleFavorite, favorites }) => {
  const isFavorite = favorites.some((fav) => fav.id === recipe.id);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => onToggleFavorite(recipe)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isFavorite
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-xl mb-3 text-gray-800 line-clamp-2">
          {recipe.title}
        </h3>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.readyInMinutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} servings</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{recipe.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
              recipe.difficulty
            )}`}
          >
            {recipe.difficulty}
          </span>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
            <ChefHat className="w-4 h-4" />
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ icon: Icon, title, value, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div
      className={`bg-gradient-to-r ${colorClasses[color]} p-6 rounded-2xl text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <Icon className="w-10 h-10 text-white/80" />
      </div>
    </div>
  );
};

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "search", label: "Search", icon: Search },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "meal-plan", label: "Meal Plan", icon: Calendar },
    { id: "restaurants", label: "Restaurants", icon: MapPin },
  ];

  return (
    <nav className="bg-white shadow-lg rounded-2xl p-2 mb-8">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-orange-500 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default function FoodieTracker() {
  const [activeTab, setActiveTab] = useState("search");
  const { recipes, loading, error, searchRecipes } = useRecipes();
  const { favorites, toggleFavorite } = useFavorites();

  const renderContent = () => {
    switch (activeTab) {
      case "search":
        return (
          <div>
            <SearchBar onSearch={searchRecipes} isLoading={loading} />

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">
                  Searching for delicious recipes...
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600">Error: {error}</p>
              </div>
            )}

            {!loading && !error && recipes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onToggleFavorite={toggleFavorite}
                    favorites={favorites}
                  />
                ))}
              </div>
            )}

            {!loading && !error && recipes.length === 0 && (
              <div className="text-center py-12">
                <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  Search for recipes to get started!
                </p>
              </div>
            )}
          </div>
        );

      case "favorites":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Your Favorite Recipes
            </h2>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onToggleFavorite={toggleFavorite}
                    favorites={favorites}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  No favorite recipes yet!
                </p>
                <p className="text-gray-500">
                  Heart some recipes to see them here.
                </p>
              </div>
            )}
          </div>
        );

      case "meal-plan":
        return (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Meal Planning
            </h2>
            <p className="text-gray-600">Plan your weekly meals here!</p>
            <p className="text-gray-500 text-sm mt-2">(Coming soon...)</p>
          </div>
        );

      case "restaurants":
        return (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Nearby Restaurants
            </h2>
            <p className="text-gray-600">Discover restaurants near you!</p>
            <p className="text-gray-500 text-sm mt-2">(Coming soon...)</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl">
              <Utensils className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              FoodieTracker
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Discover, save, and plan your culinary adventures
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Search}
            title="Recipes Found"
            value={recipes.length}
            color="blue"
          />
          <StatsCard
            icon={Heart}
            title="Favorites"
            value={favorites.length}
            color="orange"
          />
          <StatsCard
            icon={Calendar}
            title="Planned Meals"
            value="7"
            color="green"
          />
          <StatsCard icon={ChefHat} title="Cooked" value="23" color="purple" />
        </div>

        {/* Navigation */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content */}
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
