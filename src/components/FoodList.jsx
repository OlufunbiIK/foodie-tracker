import React from "react";
import Foods from "./Foods";

// This approach would only make sense if you want multiple Foods components
// But typically you'd want just one Foods component that handles all recipes
export default function FoodList({ onDisplay, searchQuery }) {
  return (
    <div>
      {/* This would create multiple Foods components, which is probably not what you want */}
      <Foods onDisplay={onDisplay} searchQuery={searchQuery} />
    </div>
  );
}
