import React from "react";
import { 
  ChefHat, 
  Calculator, 
  Layers, 
  Scale, 
  Heart, 
  Plus, 
  Check, 
  ArrowRight,
  Package
} from "lucide-react";
import { Recipe } from "../types/recipe";
import { useRecipes } from "../context/RecipeContext";

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  const { 
    favorites, 
    toggleFavorite, 
    shoppingSelection, 
    setShoppingItemMultiplier, 
    setViewMode,
    setActiveRecipeId,
    calculateRecipeCost
  } = useRecipes();

  const isFavorite = favorites.includes(recipe.id);
  const isSelectedForShopping = shoppingSelection[recipe.id]?.selected;

  // Calculate quick stats
  const totalIngredientsCount = recipe.sections.reduce((acc, s) => acc + s.ingredients.length, 0);
  const costSummary = calculateRecipeCost(recipe, 1);

  const handleStartKitchen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveRecipeId(recipe.id);
    setViewMode("kitchen");
  };

  const handleStartCost = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveRecipeId(recipe.id);
    setViewMode("cost");
  };

  const handleToggleShopping = (e: React.MouseEvent) => {
    e.stopPropagation();
    const current = shoppingSelection[recipe.id]?.selected;
    setShoppingItemMultiplier(recipe.id, 1, !current);
  };

  return (
    <div 
      onClick={() => onSelect(recipe)}
      className="group relative bg-white rounded-3xl border border-stone-200/80 hover:border-amber-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Top Card Header with Theme */}
      <div className={`h-28 bg-gradient-to-r ${recipe.themeColor} p-5 relative flex items-start justify-between text-white`}>
        <div className="flex items-center gap-3">
          <div className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform">
            {recipe.emoji}
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-black/20 backdrop-blur-md rounded-full border border-white/20">
              {recipe.categoryLabel}
            </span>
            <h3 className="text-xl font-bold mt-1 text-white tracking-tight drop-shadow-sm group-hover:text-amber-200 transition-colors">
              {recipe.name}
            </h3>
          </div>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe.id);
          }}
          className="p-2 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white transition-all hover:scale-110"
          title={isFavorite ? "ลบจากรายการโปรด" : "เพิ่มในรายการโปรด"}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-400 text-red-400" : "text-white"}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-stone-500 line-clamp-2 mb-4 leading-relaxed">
            {recipe.description}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-stone-50 rounded-2xl p-2.5 border border-stone-100 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <div className="text-[10px] text-stone-400">ปริมาณที่ได้</div>
                <div className="text-xs font-bold text-stone-700 truncate">
                  {recipe.yieldCount} {recipe.yieldUnit}
                </div>
              </div>
            </div>

            <div className="bg-stone-50 rounded-2xl p-2.5 border border-stone-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <div className="text-[10px] text-stone-400">โครงสร้างสูตร</div>
                <div className="text-xs font-bold text-stone-700 truncate">
                  {recipe.sections.length} ส่วน ({totalIngredientsCount} อย่าง)
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients Preview */}
          <div className="space-y-1.5 mb-4">
            <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1">
              <span>วัตถุดิบหลัก:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recipe.sections.flatMap(s => s.ingredients).slice(0, 4).map((ing, idx) => (
                <span 
                  key={idx}
                  className="text-xs px-2 py-0.5 bg-amber-50/80 text-amber-900 border border-amber-200/60 rounded-lg"
                >
                  {ing.name} {ing.brand ? `(${ing.brand})` : ""}
                </span>
              ))}
              {totalIngredientsCount > 4 && (
                <span className="text-xs px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded-lg">
                  +{totalIngredientsCount - 4} อย่าง
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer & Actions */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={handleStartKitchen}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-xl transition-colors border border-amber-200"
              title="เข้าสู่โหมดทำขนม"
            >
              <ChefHat className="w-3.5 h-3.5 text-amber-600" /> เข้าครัว
            </button>

            <button
              onClick={handleStartCost}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-xl transition-colors border border-emerald-200"
              title="ดูต้นทุนสูตรนี้"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-600" /> ~฿{costSummary.totalCost.toFixed(0)}
            </button>
          </div>

          <button
            onClick={handleToggleShopping}
            className={`p-1.5 rounded-xl border transition-all ${
              isSelectedForShopping
                ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                : "bg-stone-50 hover:bg-purple-50 text-stone-400 hover:text-purple-600 border-stone-200"
            }`}
            title={isSelectedForShopping ? "อยู่ในรายการจ่ายตลาดแล้ว" : "เพิ่มลงรายการจ่ายตลาด"}
          >
            {isSelectedForShopping ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
