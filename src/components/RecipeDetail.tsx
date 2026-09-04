import React, { useState } from "react";
import { 
  ArrowLeft, 
  ChefHat, 
  Calculator, 
  ShoppingCart, 
  Printer, 
  Edit3, 
  Plus, 
  Check, 
  Scale, 
  Layers, 
  Package, 
  Sparkles, 
  Tag, 
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Info
} from "lucide-react";
import { useRecipes } from "../context/RecipeContext";
import { Recipe, Ingredient } from "../types/recipe";

interface RecipeDetailProps {
  onEditRecipe: (recipe: Recipe) => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ onEditRecipe }) => {
  const { 
    selectedRecipe, 
    setViewMode, 
    multiplier, 
    setMultiplier, 
    shoppingSelection, 
    setShoppingItemMultiplier,
    updateIngredientBrand,
    prices,
    calculateRecipeCost
  } = useRecipes();

  const [editingBrandFor, setEditingBrandFor] = useState<{ sectionId: string; ingredientId: string } | null>(null);
  const [brandInput, setBrandInput] = useState("");
  const [targetYieldInput, setTargetYieldInput] = useState("");
  const [ingredientScaleSelected, setIngredientScaleSelected] = useState<string>("");
  const [ingredientScaleAmount, setIngredientScaleAmount] = useState<string>("");
  const [showScaleModal, setShowScaleModal] = useState(false);

  if (!selectedRecipe) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-stone-500">ไม่พบสูตรที่เลือก</p>
        <button
          onClick={() => setViewMode("recipes")}
          className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-xl text-sm"
        >
          กลับหน้ารวมสูตร
        </button>
      </div>
    );
  }

  const recipe = selectedRecipe;
  const isSelectedForShopping = shoppingSelection[recipe.id]?.selected;
  const costSummary = calculateRecipeCost(recipe, multiplier);

  // Multiplier presets
  const multiplierPresets = [0.5, 1, 1.5, 2, 3, 5];

  const handleStartBrandEdit = (secId: string, ing: Ingredient) => {
    setEditingBrandFor({ sectionId: secId, ingredientId: ing.id });
    setBrandInput(ing.brand || "");
  };

  const handleSaveBrand = (secId: string, ingId: string) => {
    updateIngredientBrand(recipe.id, secId, ingId, brandInput.trim());
    setEditingBrandFor(null);
    setBrandInput("");
  };

  const handleScaleByYield = () => {
    const desired = parseFloat(targetYieldInput);
    if (!isNaN(desired) && desired > 0 && recipe.yieldCount > 0) {
      const calculatedMult = desired / recipe.yieldCount;
      setMultiplier(calculatedMult);
      setShowScaleModal(false);
      setTargetYieldInput("");
    }
  };

  const handleScaleByIngredient = () => {
    const desiredAmount = parseFloat(ingredientScaleAmount);
    if (!isNaN(desiredAmount) && desiredAmount > 0 && ingredientScaleSelected) {
      // Find the base ingredient
      let baseAmount = 0;
      recipe.sections.forEach(s => {
        const found = s.ingredients.find(i => i.id === ingredientScaleSelected);
        if (found) baseAmount = found.amount;
      });

      if (baseAmount > 0) {
        // Calculate exact multiplier without premature rounding to avoid 550g -> 552g issue
        const calculatedMult = desiredAmount / baseAmount;
        setMultiplier(calculatedMult);
        setShowScaleModal(false);
      }
    }
  };

  // Get all unique brands in system for quick suggestions
  const brandSuggestions = Array.from(new Set(prices.map(p => p.brand).filter(b => b.length > 0)));

  // Calculate scaled yield
  const scaledYield = Math.round((recipe.yieldCount * multiplier) * 10) / 10;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 no-print">
        <button
          onClick={() => setViewMode("recipes")}
          className="flex items-center gap-2 px-3 py-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้ารวมสูตร</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-colors shadow-sm"
            title="พิมพ์การ์ดสูตร"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">พิมพ์สูตร</span>
          </button>

          <button
            onClick={() => onEditRecipe(recipe)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>แก้ไขสูตร</span>
          </button>

          <button
            onClick={() => {
              setShoppingItemMultiplier(recipe.id, multiplier, !isSelectedForShopping);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all shadow-sm ${
              isSelectedForShopping
                ? "bg-purple-600 text-white"
                : "bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200"
            }`}
          >
            {isSelectedForShopping ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            <span>{isSelectedForShopping ? "อยู่ในรายการจ่ายตลาดแล้ว" : "เพิ่มในรายการจ่ายตลาด"}</span>
          </button>
        </div>
      </div>

      {/* Main Recipe Header Banner */}
      <div className={`bg-gradient-to-r ${recipe.themeColor} rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="text-5xl sm:text-6xl p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
              {recipe.emoji}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 bg-black/30 backdrop-blur-md rounded-full border border-white/20">
                  {recipe.categoryLabel}
                </span>
                {recipe.sheetGid && (
                  <span className="text-xs px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-amber-100">
                    Google Sheets GID: {recipe.sheetGid}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                {recipe.name}
              </h1>
              <p className="text-sm sm:text-base text-white/90 mt-2 max-w-2xl leading-relaxed">
                {recipe.description}
              </p>
            </div>
          </div>

          {/* Quick Start Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 no-print">
            <button
              onClick={() => setViewMode("kitchen")}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-amber-50 text-amber-950 font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <ChefHat className="w-5 h-5 text-amber-600" />
              <span>เข้าสู่โหมดทำขนม</span>
            </button>

            <button
              onClick={() => setViewMode("cost")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black/30 hover:bg-black/40 backdrop-blur-md text-white font-medium text-xs rounded-2xl border border-white/20 transition-colors"
            >
              <Calculator className="w-4 h-4 text-emerald-300" />
              <span>คำนวณต้นทุน (฿{costSummary.totalCost.toFixed(1)})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Scaling Multiplier Control Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-md mb-8 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left: Current Scale Info */}
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-stone-800 text-base">ปรับสัดส่วนสูตร (Scale Multiplier)</h3>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg font-mono">
                {Math.round(multiplier * 100) / 100}x เท่า
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              ผลิตได้: <strong className="text-amber-900 font-semibold">{scaledYield} {recipe.yieldUnit}</strong>
              {multiplier !== 1 && <span className="text-stone-400"> (จากสูตรตั้งต้น {recipe.yieldCount} {recipe.yieldUnit})</span>}
            </p>
          </div>

          {/* Right: Multiplier Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Multiplier Buttons */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200">
              {multiplierPresets.map((p) => (
                <button
                  key={p}
                  onClick={() => setMultiplier(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    Math.abs(multiplier - p) < 0.001
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                  }`}
                >
                  {p}x
                </button>
              ))}
            </div>

            {/* Custom Multiplier Input */}
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="0.05"
                min="0.05"
                max="50"
                value={Math.round(multiplier * 100) / 100}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val > 0) setMultiplier(val);
                }}
                className="w-16 px-2.5 py-1.5 border border-stone-300 rounded-xl text-sm font-mono text-center font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-xs text-stone-500 font-medium">เท่า</span>
            </div>

            {/* Smart Scaling Trigger */}
            <button
              onClick={() => {
                const nextShow = !showScaleModal;
                setShowScaleModal(nextShow);
                if (nextShow && !ingredientScaleSelected && recipe.sections[0]?.ingredients[0]) {
                  const firstIng = recipe.sections[0].ingredients[0];
                  setIngredientScaleSelected(firstIng.id);
                  setIngredientScaleAmount(String(Math.round(firstIng.amount * multiplier * 100) / 100));
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 text-stone-700 hover:text-amber-900 rounded-xl text-xs font-semibold transition-colors"
              title="คำนวณจากจำนวนกระปุก หรือวัตถุดิบที่มี"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>คำนวณขั้นสูง</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>
          </div>
        </div>

        {/* Smart Scaling Drawer Modal */}
        {showScaleModal && (
          <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* 1. Scale by Target Yield */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-amber-600" />
                คำนวณตามจำนวนกระปุก/ชิ้นที่ต้องการ
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder={`เช่น ${recipe.yieldCount * 2}`}
                  value={targetYieldInput}
                  onChange={(e) => setTargetYieldInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-xs text-stone-600">{recipe.yieldUnit}</span>
                <button
                  onClick={handleScaleByYield}
                  className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs rounded-xl transition-colors"
                >
                  ปรับสูตร
                </button>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                ระบบจะคำนวณตัวคูณเพื่อผลิตให้ได้จำนวนที่กำหนดพอดี
              </p>
            </div>

            {/* 2. Scale by Available Ingredient */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-stone-600" />
                คำนวณตามวัตถุดิบที่มีอยู่
              </h4>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <select
                  value={ingredientScaleSelected}
                  onChange={(e) => {
                    const selId = e.target.value;
                    setIngredientScaleSelected(selId);
                    if (selId) {
                      let foundAmt = 0;
                      recipe.sections.forEach(s => {
                        const found = s.ingredients.find(i => i.id === selId);
                        if (found) foundAmt = found.amount;
                      });
                      if (foundAmt > 0) {
                        setIngredientScaleAmount(String(Math.round(foundAmt * multiplier * 100) / 100));
                      }
                    } else {
                      setIngredientScaleAmount("");
                    }
                  }}
                  className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">-- เลือกวัตถุดิบ --</option>
                  {recipe.sections.flatMap(s => s.ingredients).map(ing => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name} {ing.brand ? `(${ing.brand})` : ""} (สูตรเดิม {ing.amount} {ing.unit})
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    placeholder="เช่น 550"
                    value={ingredientScaleAmount}
                    onChange={(e) => setIngredientScaleAmount(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleScaleByIngredient();
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  <button
                    onClick={handleScaleByIngredient}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-xs rounded-xl transition-colors shrink-0 shadow-sm"
                  >
                    ปรับ
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-stone-500">
                ใส่น้ำหนักวัตถุดิบที่มี (เช่น วิปครีม 550 กรัม) ระบบจะเริ่มคำนวณและปรับวัตถุดิบอื่นตามสัดส่วนพอดีเป๊ะ
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Brand Customization Note Alert */}
      <div className="mb-6 p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 flex items-start gap-3 no-print">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 leading-relaxed">
          <strong className="font-semibold text-amber-900">💡 การระบุยี่ห้อวัตถุดิบ: </strong>
          คุณสามารถคลิกที่แท็ก <strong>[ยี่ห้อ]</strong> ในตารางด้านล่าง เพื่อพิมพ์หรือเปลี่ยนยี่ห้อ (เช่น เอเคอร์, Millac, ทิวลิป) ได้ตลอดเวลา ซึ่งระบบจะนำชื่อยี่ห้อไปคำนวณราคาและต้นทุนในหน้าราคาวัตถุดิบอัตโนมัติ
        </div>
      </div>

      {/* Recipe Sections & Ingredients */}
      <div className="space-y-6">
        {recipe.sections.map((section, sIndex) => (
          <div 
            key={section.id}
            className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden"
          >
            {/* Section Header */}
            <div className="bg-stone-50/80 px-6 py-4 border-b border-stone-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-amber-700 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                  {sIndex + 1}
                </span>
                <h2 className="font-bold text-stone-800 text-base sm:text-lg">
                  {section.title}
                </h2>
              </div>

              <span className="text-xs text-stone-500 font-medium">
                {section.ingredients.length} รายการวัตถุดิบ
              </span>
            </div>

            {/* Section Instruction */}
            {section.instruction && (
              <div className="px-6 py-3 bg-amber-50/30 border-b border-stone-100 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <span className="font-semibold text-amber-900">วิธีทำ: </span>
                {section.instruction}
              </div>
            )}

            {/* Ingredients Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider bg-stone-50/30">
                    <th className="py-3 px-6">วัตถุดิบ</th>
                    <th className="py-3 px-4">ยี่ห้อ / สเปค (คลิกเพื่อแก้ไข)</th>
                    <th className="py-3 px-6 text-right">ปริมาณตามสัดส่วน ({Math.round(multiplier * 100) / 100}x)</th>
                    <th className="py-3 px-4 text-right hidden sm:table-cell text-stone-400">สูตรตั้งต้น (1x)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {section.ingredients.map((ing) => {
                    const scaledAmount = Math.round((ing.amount * multiplier) * 100) / 100;
                    const isEditing = editingBrandFor?.sectionId === section.id && editingBrandFor?.ingredientId === ing.id;

                    return (
                      <tr 
                        key={ing.id} 
                        className="hover:bg-amber-50/30 transition-colors group"
                      >
                        {/* Ingredient Name */}
                        <td className="py-3.5 px-6 font-semibold text-stone-800">
                          <div className="flex items-center gap-2">
                            <span>{ing.name}</span>
                            {ing.note && (
                              <span className="text-xs font-normal text-stone-400">
                                {ing.note}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Brand / Note with Inline Editor */}
                        <td className="py-3.5 px-4">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={brandInput}
                                onChange={(e) => setBrandInput(e.target.value)}
                                placeholder="ระบุยี่ห้อ (เว้นว่างได้)"
                                autoFocus
                                className="px-2.5 py-1 text-xs bg-white border-2 border-amber-500 rounded-lg focus:outline-none shadow-sm"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveBrand(section.id, ing.id);
                                  if (e.key === "Escape") setEditingBrandFor(null);
                                }}
                              />
                              <button
                                onClick={() => handleSaveBrand(section.id, ing.id)}
                                className="px-2 py-1 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700"
                              >
                                บันทึก
                              </button>
                              <button
                                onClick={() => setEditingBrandFor(null)}
                                className="px-1.5 py-1 text-stone-400 hover:text-stone-600 text-xs"
                              >
                                ยกเลิก
                              </button>
                            </div>
                          ) : (
                            <div 
                              onClick={() => handleStartBrandEdit(section.id, ing)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs cursor-pointer border transition-all group-hover:border-amber-300"
                            >
                              {ing.brand ? (
                                <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                                  {ing.brand}
                                </span>
                              ) : (
                                <span className="text-stone-400 italic bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded-lg">
                                  + ระบุยี่ห้อ
                                </span>
                              )}
                              <Edit3 className="w-3 h-3 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          )}
                        </td>

                        {/* Scaled Quantity */}
                        <td className="py-3.5 px-6 text-right">
                          <span className="font-mono text-base font-extrabold text-amber-950">
                            {scaledAmount.toLocaleString()}
                          </span>{" "}
                          <span className="font-medium text-stone-600 text-xs">
                            {ing.unit}
                          </span>
                        </td>

                        {/* Base Quantity */}
                        <td className="py-3.5 px-4 text-right hidden sm:table-cell font-mono text-xs text-stone-400">
                          {ing.amount} {ing.unit}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Pro Tips & Notes */}
      {recipe.tips && recipe.tips.length > 0 && (
        <div className="mt-8 bg-amber-50/50 rounded-3xl p-6 border border-amber-200/70">
          <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            เคล็ดลับการทำให้อร่อย (Chef Tips & Tricks)
          </h3>
          <ul className="space-y-2">
            {recipe.tips.map((tip, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-amber-950 flex items-start gap-2 leading-relaxed">
                <span className="text-amber-500 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-6 mt-8 z-30 flex items-center justify-between gap-4 p-4 bg-stone-900/90 backdrop-blur-md text-white rounded-3xl shadow-2xl border border-stone-700 no-print">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{recipe.emoji}</div>
          <div>
            <div className="text-xs text-stone-400">กำลังดูสูตร</div>
            <div className="font-bold text-sm text-stone-100">{recipe.name} ({Math.round(multiplier * 100) / 100}x)</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("cost")}
            className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-emerald-300 text-xs font-semibold rounded-2xl border border-stone-600 transition-colors flex items-center gap-1.5"
          >
            <Calculator className="w-4 h-4" />
            <span>ต้นทุน ~฿{costSummary.totalCost.toFixed(0)}</span>
          </button>

          <button
            onClick={() => setViewMode("kitchen")}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2"
          >
            <ChefHat className="w-4 h-4" />
            <span>เริ่มทำในครัว</span>
          </button>
        </div>
      </div>
    </div>
  );
};
