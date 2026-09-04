import React, { useState, useEffect } from "react";
import { RecipeProvider, useRecipes } from "./context/RecipeContext";
import { Header } from "./components/Header";
import { RecipeList } from "./components/RecipeList";
import { RecipeDetail } from "./components/RecipeDetail";
import { KitchenMode } from "./components/KitchenMode";
import { CostCalculator } from "./components/CostCalculator";
import { IngredientPriceManager } from "./components/IngredientPriceManager";
import { ShoppingListModal } from "./components/ShoppingListModal";
import { RecipeFormModal } from "./components/RecipeFormModal";
import { TimerWidget } from "./components/TimerWidget";
import { PinLock } from "./components/PinLock";
import { Recipe } from "./types/recipe";

const MainContent: React.FC = () => {
  const { viewMode } = useRecipes();
  const [recipeFormOpen, setRecipeFormOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    // Check if unlocked in this session
    return sessionStorage.getItem("sweetcraft_unlocked") !== "true";
  });

  const handleOpenNewRecipe = () => {
    setRecipeToEdit(null);
    setRecipeFormOpen(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setRecipeToEdit(recipe);
    setRecipeFormOpen(true);
  };

  if (isLocked) {
    return (
      <PinLock
        onUnlock={() => {
          sessionStorage.setItem("sweetcraft_unlocked", "true");
          setIsLocked(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f0] text-stone-800 flex flex-col font-sans">
      <Header onOpenNewRecipe={handleOpenNewRecipe} />

      <main className="flex-1 pb-24">
        {viewMode === "recipes" && (
          <RecipeList onOpenNewRecipe={handleOpenNewRecipe} />
        )}

        {viewMode === "detail" && (
          <RecipeDetail onEditRecipe={handleEditRecipe} />
        )}

        {viewMode === "kitchen" && (
          <KitchenMode />
        )}

        {viewMode === "cost" && (
          <CostCalculator />
        )}

        {viewMode === "prices" && (
          <IngredientPriceManager />
        )}

        {viewMode === "shopping" && (
          <ShoppingListModal />
        )}
      </main>

      {/* Floating Kitchen Timer - only shown in Kitchen Mode */}
      {viewMode === "kitchen" && <TimerWidget />}

      {/* Recipe Form Modal */}
      <RecipeFormModal
        isOpen={recipeFormOpen}
        recipeToEdit={recipeToEdit}
        onClose={() => {
          setRecipeFormOpen(false);
          setRecipeToEdit(null);
        }}
      />
    </div>
  );
};

export function App() {
  return (
    <RecipeProvider>
      <MainContent />
    </RecipeProvider>
  );
}

export default App;
