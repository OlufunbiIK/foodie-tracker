import { Heart, Minus, Plus, X, Settings } from "lucide-react";
import React, { useState, useEffect } from "react";

export function Foods({ onDisplay, searchQuery = "" }) {
  const [isLeftCardOpen, setIsLeftCardOpen] = useState(true);
  const [isRightCardOpen, setIsRightCardOpen] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // API Configuration
  const [apiConfig, setApiConfig] = useState({
    provider: "mealdb", // default to free option
    spoonacularKey: "",
    edamamAppId: "",
    edamamAppKey: "",
    resultsLimit: 50,
  });

  // Enhanced API fetching functions
  const fetchRecipesFromMealDB = async (searchQuery = "", limit = 50) => {
    try {
      let recipes = [];

      if (searchQuery) {
        // Search by name
        const nameResponse = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
            searchQuery
          )}`
        );
        const nameData = await nameResponse.json();
        if (nameData.meals) recipes.push(...nameData.meals);

        // Search by ingredient
        const ingredientResponse = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
            searchQuery
          )}`
        );
        const ingredientData = await ingredientResponse.json();
        if (ingredientData.meals) recipes.push(...ingredientData.meals);

        // Remove duplicates
        recipes = recipes.filter(
          (recipe, index, self) =>
            index === self.findIndex((r) => r.idMeal === recipe.idMeal)
        );
      } else {
        // Get random recipes
        const batchSize = Math.min(limit, 50);
        const promises = Array.from({ length: batchSize }, () =>
          fetch("https://www.themealdb.com/api/json/v1/1/random.php").then(
            (res) => res.json()
          )
        );
        const results = await Promise.all(promises);
        recipes = results.map((result) => result.meals[0]).filter(Boolean);
      }

      return recipes.map((meal) => ({
        id: parseInt(meal.idMeal),
        title: meal.strMeal,
        image: meal.strMealThumb,
        readyInMinutes: Math.floor(Math.random() * 60 + 15), // 15-75 minutes
        servings: Math.floor(Math.random() * 6 + 2), // 2-8 servings
        rating: (Math.random() * 2 + 3).toFixed(1),
        isFavorite: false,
        difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
        ingredients: Array.from(
          { length: 20 },
          (_, i) => meal[`strIngredient${i + 1}`]
        )
          .filter((ingredient) => ingredient && ingredient.trim())
          .map((ingredient, index) => {
            const measure = meal[`strMeasure${index + 1}`] || "";
            return measure ? `${measure} ${ingredient}` : ingredient;
          }),
        instructions: meal.strInstructions
          ? meal.strInstructions.split(/\r\n|\n/).filter((step) => step.trim())
          : ["Instructions not available"],
        calories: Math.floor(Math.random() * 400 + 200),
        cuisine: meal.strArea || "International",
        tags: [meal.strCategory, meal.strArea].filter(Boolean),
        video: meal.strYoutube,
        source: meal.strSource,
      }));
    } catch (error) {
      console.error("Error fetching from MealDB:", error);
      throw error;
    }
  };

  const fetchRecipesFromSpoonacular = async (
    searchQuery = "",
    limit = 50,
    apiKey
  ) => {
    try {
      const baseUrl = "https://api.spoonacular.com/recipes";
      let url;

      if (searchQuery) {
        url = `${baseUrl}/complexSearch?query=${encodeURIComponent(
          searchQuery
        )}&number=${limit}&addRecipeInformation=true&fillIngredients=true&apiKey=${apiKey}`;
      } else {
        url = `${baseUrl}/random?number=${limit}&apiKey=${apiKey}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 402) {
          throw new Error(
            "Spoonacular API quota exceeded. Please check your plan."
          );
        }
        throw new Error(`Spoonacular API error: ${response.status}`);
      }

      const data = await response.json();
      const recipeList = searchQuery ? data.results : data.recipes;

      if (!recipeList || recipeList.length === 0) {
        throw new Error("No recipes found");
      }

      return recipeList.map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes || 30,
        servings: recipe.servings || 4,
        rating: recipe.spoonacularScore
          ? (recipe.spoonacularScore / 20).toFixed(1)
          : "4.0",
        isFavorite: false,
        difficulty:
          recipe.readyInMinutes <= 30
            ? "Easy"
            : recipe.readyInMinutes <= 60
            ? "Medium"
            : "Hard",
        ingredients:
          recipe.extendedIngredients?.map((ing) => ing.original) || [],
        instructions:
          recipe.analyzedInstructions?.[0]?.steps?.map((step) => step.step) ||
          (recipe.instructions
            ? recipe.instructions.split(".").filter(Boolean)
            : ["Check source for instructions"]),
        calories:
          recipe.nutrition?.nutrients?.find((n) => n.name === "Calories")
            ?.amount || Math.floor(Math.random() * 400 + 200),
        cuisine: recipe.cuisines?.[0] || "International",
        tags: [
          ...(recipe.cuisines || []),
          ...(recipe.dishTypes || []),
          ...(recipe.diets || []),
        ],
        vegetarian: recipe.vegetarian,
        vegan: recipe.vegan,
        glutenFree: recipe.glutenFree,
        dairyFree: recipe.dairyFree,
        sourceUrl: recipe.sourceUrl,
      }));
    } catch (error) {
      console.error("Error fetching from Spoonacular:", error);
      throw error;
    }
  };

  const fetchRecipesEnhanced = async (searchQuery = "", limit = 50) => {
    const { provider, spoonacularKey } = apiConfig;

    try {
      switch (provider) {
        case "spoonacular":
          if (!spoonacularKey) throw new Error("Spoonacular API key required");
          return await fetchRecipesFromSpoonacular(
            searchQuery,
            limit,
            spoonacularKey
          );

        case "mealdb":
        default:
          return await fetchRecipesFromMealDB(searchQuery, limit);
      }
    } catch (error) {
      console.error(`Error fetching recipes from ${provider}:`, error);
      // Fallback to MealDB if other APIs fail
      if (provider !== "mealdb") {
        console.log("Falling back to MealDB...");
        return await fetchRecipesFromMealDB(searchQuery, limit);
      }
      throw error;
    }
  };

  // Fetch recipes from enhanced API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const transformedRecipes = await fetchRecipesEnhanced(
          searchQuery,
          apiConfig.resultsLimit
        );
        setRecipes(transformedRecipes);
        setFilteredRecipes(transformedRecipes);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchRecipes();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    searchQuery,
    apiConfig.provider,
    apiConfig.spoonacularKey,
    apiConfig.resultsLimit,
  ]);

  // Rest of your existing functions remain the same
  function handleRecipeDisplay(recipe) {
    setSelectedRecipe(recipe);
    if (onDisplay) {
      onDisplay(recipe);
    }
  }

  function handleCloseRecipe() {
    setSelectedRecipe(null);
  }

  function handleShowFavorites() {
    setShowFavorites(!showFavorites);
    setSelectedRecipe(null);
  }

  const favoriteRecipes = recipes.filter((recipe) => recipe.isFavorite);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.cuisine?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          recipe.ingredients?.some((ingredient) =>
            ingredient.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredRecipes(filtered);
    }
  }, [searchQuery, recipes]);

  function handleIsLeftCardOpen() {
    setIsLeftCardOpen(!isLeftCardOpen);
  }

  function handleIsRightCardOpen() {
    setIsRightCardOpen(!isRightCardOpen);
  }

  function handleFavorite(recipeId) {
    const updateFavorites = (recipeList) =>
      recipeList.map((recipe) =>
        recipe.id === recipeId
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      );

    setRecipes(updateFavorites);
    setFilteredRecipes(updateFavorites);
  }

  const refreshRecipes = async () => {
    try {
      setLoading(true);
      const transformedRecipes = await fetchRecipesEnhanced(
        "",
        apiConfig.resultsLimit
      );
      setRecipes(transformedRecipes);
      setFilteredRecipes(transformedRecipes);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Settings Modal Component
  const SettingsModal = () =>
    showSettings && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">API Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Recipe Provider
              </label>
              <select
                value={apiConfig.provider}
                onChange={(e) =>
                  setApiConfig((prev) => ({
                    ...prev,
                    provider: e.target.value,
                  }))
                }
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
              >
                <option value="mealdb">TheMealDB (Free)</option>
                <option value="spoonacular">Spoonacular (Premium)</option>
              </select>
            </div>

            {apiConfig.provider === "spoonacular" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Spoonacular API Key
                </label>
                <input
                  type="password"
                  value={apiConfig.spoonacularKey}
                  onChange={(e) =>
                    setApiConfig((prev) => ({
                      ...prev,
                      spoonacularKey: e.target.value,
                    }))
                  }
                  placeholder="Enter your Spoonacular API key"
                  className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Get your free API key at spoonacular.com
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Results Limit
              </label>
              <select
                value={apiConfig.resultsLimit}
                onChange={(e) =>
                  setApiConfig((prev) => ({
                    ...prev,
                    resultsLimit: parseInt(e.target.value),
                  }))
                }
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
              >
                <option value={25}>25 recipes</option>
                <option value={50}>50 recipes</option>
                <option value={100}>100 recipes</option>
                {apiConfig.provider === "spoonacular" && (
                  <option value={200}>200 recipes</option>
                )}
              </select>
            </div>

            <div className="pt-4 border-t border-gray-600">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Provider Info:
              </h4>
              <div className="text-xs text-gray-400 space-y-1">
                {apiConfig.provider === "mealdb" ? (
                  <>
                    <p>• Free to use, no API key required</p>
                    <p>• ~300 recipes from around the world</p>
                    <p>• Includes video links and detailed instructions</p>
                  </>
                ) : (
                  <>
                    <p>• 360,000+ recipes with nutrition data</p>
                    <p>• Advanced search and filtering</p>
                    <p>• Free tier: 150 requests/day</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 md:px-8 py-10">
      <div className="flex flex-col md:flex-row w-full max-w-7xl gap-6">
        {/* Left Panel - Recipe List */}
        <div className="w-full md:w-1/2 bg-gray-800 rounded-lg shadow-lg overflow-y-auto max-h-[800px]">
          <div className="flex justify-between items-center p-4">
            <div className="flex gap-2">
              <button
                onClick={refreshRecipes}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors flex items-center gap-1"
              >
                <Settings className="w-4 h-4" />
                API
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {apiConfig.provider === "mealdb" ? "MealDB" : "Spoonacular"}
              </span>
              <div onClick={handleIsLeftCardOpen} className="cursor-pointer">
                {isLeftCardOpen ? (
                  <Minus className="w-5 h-5" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 text-red-400 text-center">
              <p>Error: {error}</p>
              {error.includes("API key") && (
                <button
                  onClick={() => setShowSettings(true)}
                  className="mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                >
                  Configure API
                </button>
              )}
            </div>
          )}

          {loading && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="mt-2">
                {searchQuery
                  ? `Searching for "${searchQuery}"...`
                  : `Loading recipes from ${apiConfig.provider}...`}
              </p>
            </div>
          )}

          {/* Rest of your existing JSX remains the same */}
          {isLeftCardOpen && !loading && (
            <div className="p-4">
              {filteredRecipes.length === 0 && searchQuery ? (
                <div className="text-center text-gray-400 py-8">
                  <p>No recipes found for "{searchQuery}"</p>
                  <p className="text-sm mt-2">
                    Try searching for different ingredients or cuisines
                  </p>
                </div>
              ) : (
                filteredRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex items-center p-3 mb-3 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors duration-200"
                    onClick={() => handleRecipeDisplay(recipe)}
                  >
                    <img
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                      src={recipe.image || "https://via.placeholder.com/60"}
                      alt={recipe.title || "Recipe"}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/60";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {recipe.title || "Recipe Title"}
                      </h3>
                      <div className="flex flex-wrap items-center text-gray-400 text-sm gap-2">
                        <span>⭐ {recipe.rating || "4.0"}</span>
                        <span>{recipe.readyInMinutes} min</span>
                        <span>{recipe.servings} servings</span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            recipe.difficulty === "Easy"
                              ? "bg-green-600"
                              : recipe.difficulty === "Medium"
                              ? "bg-yellow-600"
                              : "bg-red-600"
                          }`}
                        >
                          {recipe.difficulty}
                        </span>
                        {recipe.cuisine && (
                          <span className="px-2 py-1 bg-purple-600 rounded text-xs">
                            {recipe.cuisine}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className="text-red-500 hover:text-red-400 transition-colors p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavorite(recipe.id);
                      }}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          recipe.isFavorite ? "fill-current" : ""
                        }`}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Details/Info */}
        <div className="w-full md:w-1/2 bg-gray-800 rounded-lg shadow-lg overflow-y-auto max-h-[800px]">
          <div className="flex justify-between items-center p-4">
            <div className="flex gap-2">
              <button
                onClick={() => setShowFavorites(false)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  !showFavorites
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Summary
              </button>
              <button
                onClick={handleShowFavorites}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  showFavorites
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Favorites ({favoriteRecipes.length})
              </button>
            </div>
            <div onClick={handleIsRightCardOpen} className="cursor-pointer">
              {isRightCardOpen ? (
                <Minus className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </div>
          </div>
          {isRightCardOpen && (
            <div className="p-6">
              {!showFavorites ? (
                // Summary View
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-4 text-gray-300">
                    {searchQuery ? `SEARCH RESULTS` : "RECIPES YOU'VE EXPLORED"}
                  </h2>
                  {searchQuery && (
                    <p className="text-sm text-gray-400 mb-4">
                      Showing results for "{searchQuery}"
                    </p>
                  )}
                  <div className="grid grid-cols-3 gap-4 text-gray-400">
                    <div className="text-center">
                      <span className="text-2xl font-bold block">
                        {filteredRecipes.length}
                      </span>
                      <span className="text-sm">
                        {searchQuery ? "found" : "recipes"}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold block">
                        ⭐
                        {filteredRecipes.length > 0
                          ? (
                              filteredRecipes.reduce(
                                (sum, recipe) => sum + (recipe.rating || 0),
                                0
                              ) / filteredRecipes.length
                            ).toFixed(1)
                          : "0.0"}
                      </span>
                      <span className="text-sm">avg rating</span>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold block">
                        {
                          filteredRecipes.filter((recipe) => recipe.isFavorite)
                            .length
                        }
                      </span>
                      <span className="text-sm">favorites</span>
                    </div>
                  </div>

                  {/* Enhanced stats from API data */}
                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <span className="text-lg font-bold block">
                        {filteredRecipes.length > 0
                          ? Math.round(
                              filteredRecipes.reduce(
                                (sum, recipe) =>
                                  sum + (recipe.readyInMinutes || 0),
                                0
                              ) / filteredRecipes.length
                            )
                          : 0}
                      </span>
                      <span className="text-gray-400">avg cook time</span>
                    </div>
                    <div className="text-center">
                      <span className="text-lg font-bold block">
                        {filteredRecipes.length > 0
                          ? Math.round(
                              filteredRecipes.reduce(
                                (sum, recipe) => sum + (recipe.calories || 0),
                                0
                              ) / filteredRecipes.length
                            )
                          : 0}
                      </span>
                      <span className="text-gray-400">avg calories</span>
                    </div>
                  </div>

                  {/* Provider-specific stats */}
                  <div className="mt-6 pt-6 border-t border-gray-600">
                    <div className="text-xs text-gray-400 space-y-2">
                      <p>
                        Data provided by:{" "}
                        <span className="text-white font-medium">
                          {apiConfig.provider === "mealdb"
                            ? "TheMealDB"
                            : "Spoonacular"}
                        </span>
                      </p>
                      <p>
                        Total recipes loaded:{" "}
                        <span className="text-white">{recipes.length}</span>
                      </p>
                      {apiConfig.provider === "spoonacular" && (
                        <p>Premium features: Nutrition data, dietary filters</p>
                      )}
                      {apiConfig.provider === "mealdb" && (
                        <p>Features: Video tutorials, worldwide cuisines</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Favorites View
                <div>
                  <h2 className="text-xl font-bold mb-4 text-gray-300 text-center">
                    YOUR FAVORITE RECIPES
                  </h2>
                  {favoriteRecipes.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <Heart className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                      <p>No favorite recipes yet</p>
                      <p className="text-sm mt-2">
                        Click the heart icon on recipes to add them to favorites
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {favoriteRecipes.map((recipe) => (
                        <div
                          key={recipe.id}
                          className="flex items-center p-3 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors duration-200"
                          onClick={() => handleRecipeDisplay(recipe)}
                        >
                          <img
                            className="w-12 h-12 object-cover rounded-lg mr-3"
                            src={
                              recipe.image || "https://via.placeholder.com/60"
                            }
                            alt={recipe.title || "Recipe"}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/60";
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-white mb-1">
                              {recipe.title || "Recipe Title"}
                            </h3>
                            <div className="flex items-center text-gray-400 text-xs gap-2">
                              <span>⭐ {recipe.rating || "4.0"}</span>
                              <span>{recipe.readyInMinutes} min</span>
                              <span
                                className={`px-1 py-0.5 rounded text-xs ${
                                  recipe.difficulty === "Easy"
                                    ? "bg-green-600"
                                    : recipe.difficulty === "Medium"
                                    ? "bg-yellow-600"
                                    : "bg-red-600"
                                }`}
                              >
                                {recipe.difficulty}
                              </span>
                            </div>
                          </div>
                          <div
                            className="text-red-500 hover:text-red-400 transition-colors p-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavorite(recipe.id);
                            }}
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Recipe Details Section */}
              {selectedRecipe && (
                <div className="mt-8 border-t border-gray-600 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">
                      Recipe Details
                    </h2>
                    <button
                      onClick={handleCloseRecipe}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <img
                      src={
                        selectedRecipe.image ||
                        "https://via.placeholder.com/400"
                      }
                      alt={selectedRecipe.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />

                    <h3 className="text-2xl font-bold text-white">
                      {selectedRecipe.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center bg-gray-700 rounded-lg p-3">
                        <div className="text-lg font-bold text-white">
                          ⭐ {selectedRecipe.rating}
                        </div>
                        <div className="text-gray-400 text-sm">Rating</div>
                      </div>
                      <div className="text-center bg-gray-700 rounded-lg p-3">
                        <div className="text-lg font-bold text-white">
                          {selectedRecipe.readyInMinutes}
                        </div>
                        <div className="text-gray-400 text-sm">Minutes</div>
                      </div>
                      <div className="text-center bg-gray-700 rounded-lg p-3">
                        <div className="text-lg font-bold text-white">
                          {selectedRecipe.servings}
                        </div>
                        <div className="text-gray-400 text-sm">Servings</div>
                      </div>
                      <div className="text-center bg-gray-700 rounded-lg p-3">
                        <div className="text-lg font-bold text-white">
                          {selectedRecipe.calories}
                        </div>
                        <div className="text-gray-400 text-sm">Calories</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-white mb-3">
                        Ingredients
                      </h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        {selectedRecipe.ingredients?.map(
                          (ingredient, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-400 mr-2">•</span>
                              {ingredient}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-white mb-3">
                        Instructions
                      </h4>
                      <ol className="text-gray-300 space-y-2 text-sm">
                        {selectedRecipe.instructions?.map(
                          (instruction, index) => (
                            <li key={index} className="flex items-start">
                              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">
                                {index + 1}
                              </span>
                              {instruction}
                            </li>
                          )
                        )}
                      </ol>
                    </div>

                    {selectedRecipe.tags && selectedRecipe.tags.length > 0 && (
                      <div>
                        <h4 className="text-lg font-bold text-white mb-3">
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRecipe.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-600 text-white rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Enhanced features for premium APIs */}
                    {selectedRecipe.video && (
                      <div>
                        <h4 className="text-lg font-bold text-white mb-3">
                          Video Tutorial
                        </h4>
                        <a
                          href={selectedRecipe.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Watch on YouTube
                        </a>
                      </div>
                    )}

                    {selectedRecipe.sourceUrl && (
                      <div>
                        <h4 className="text-lg font-bold text-white mb-3">
                          Original Recipe
                        </h4>
                        <a
                          href={selectedRecipe.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Visit Source
                        </a>
                      </div>
                    )}

                    {/* Dietary information for Spoonacular */}
                    {apiConfig.provider === "spoonacular" && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {selectedRecipe.vegetarian && (
                          <span className="bg-green-600 text-white px-2 py-1 rounded">
                            Vegetarian
                          </span>
                        )}
                        {selectedRecipe.vegan && (
                          <span className="bg-green-700 text-white px-2 py-1 rounded">
                            Vegan
                          </span>
                        )}
                        {selectedRecipe.glutenFree && (
                          <span className="bg-orange-600 text-white px-2 py-1 rounded">
                            Gluten Free
                          </span>
                        )}
                        {selectedRecipe.dairyFree && (
                          <span className="bg-blue-600 text-white px-2 py-1 rounded">
                            Dairy Free
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal />
    </div>
  );
}
