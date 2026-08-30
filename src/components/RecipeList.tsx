import React from "react";
import { Plus, BookOpen, Search, Sparkles } from "lucide-react";
import { useRecipes } from "../context/RecipeContext";
import { RecipeCard } from "./RecipeCard";
import { Recipe } from "../types/recipe";

interface RecipeListProps {
  onOpenNewRecipe: () => void;
}

export const RecipeList: React.FC<RecipeListProps> = ({ onOpenNewRecipe }) => {
  const { 
    recipes, 
    searchQuery, 
    selectedCategory, 
    favorites,
    setActiveRecipeId, 
    setViewMode 
  } = useRecipes();

  const filteredRecipes = recipes.filter(recipe => {
    // Search match (name, description, ingredients, brands)
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || 
      recipe.name.toLowerCase().includes(q) ||
      recipe.description.toLowerCase().includes(q) ||
      recipe.sections.some(s => 
        s.ingredients.some(ing => 
          ing.name.toLowerCase().includes(q) || 
          ing.brand.toLowerCase().includes(q)
        )
      );

    // Category match
    let matchesCategory = true;
    if (selectedCategory === ("fav" as any)) {
      matchesCategory = favorites.includes(recipe.id);
    } else if (selectedCategory !== "all") {
      matchesCategory = recipe.category === selectedCategory;
    }

    return matchesSearch && matchesCategory;
  });

  const handleSelectRecipe = (recipe: Recipe) => {
    setActiveRecipeId(recipe.id);
    setViewMode("detail");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-amber-500/10 via-amber-100/40 to-orange-500/10 p-6 rounded-3xl border border-amber-200/60">
        <div>
          <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm mb-1">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>สูตรมาตรฐานจาก Google Sheets ทั้งหมด ({recipes.length} สูตร)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-800 tracking-tight">
            คลังสูตรขนม & เบเกอรี่โฮมเมด
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            คลิกเลือกสูตรเพื่อดูรายละเอียด ปรับสูตรตามจำนวนที่ต้องการ หรือเข้าสู่โหมดทำขนมทีละขั้นตอน
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewRecipe}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            เพิ่มสูตรใหม่
          </button>
        </div>
      </div>

      {/* Recipes Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={handleSelectRecipe}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300 p-8">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-800 mb-1">ไม่พบสูตรที่ค้นหา</h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto mb-6">
            ลองเปลี่ยนคำค้นหา หรือกดล้างการค้นหาเพื่อดูสูตรทั้งหมด
          </p>
          <button
            onClick={onOpenNewRecipe}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-xl hover:bg-amber-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> สร้างสูตรนี้เลย
          </button>
        </div>
      )}
    </div>
  );
};
