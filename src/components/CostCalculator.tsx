import React, { useState } from "react";
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Clock, 
  Layers, 
  AlertCircle, 
  Plus, 
  Edit3, 
  Tag, 
  Check, 
  HelpCircle,
  Printer,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useRecipes } from "../context/RecipeContext";
import { Recipe, Ingredient } from "../types/recipe";

export const CostCalculator: React.FC = () => {
  const { 
    selectedRecipe, 
    recipes, 
    setActiveRecipeId, 
    prices, 
    costSettings, 
    updateCostSettings,
    multiplier,
    setMultiplier,
    calculateRecipeCost,
    updateIngredientBrand,
    setViewMode
  } = useRecipes();

  const [editingBrandFor, setEditingBrandFor] = useState<{ sectionId: string; ingredientId: string } | null>(null);
  const [brandInput, setBrandInput] = useState("");

  if (!selectedRecipe) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white rounded-3xl mt-12 border border-stone-200">
        <p className="text-stone-600 mb-4">กรุณาเลือกสูตรขนม</p>
        <button
          onClick={() => setViewMode("recipes")}
          className="px-5 py-2.5 bg-amber-600 text-white rounded-2xl text-sm font-semibold"
        >
          เลือกสูตรขนม
        </button>
      </div>
    );
  }

  const recipe = selectedRecipe;
  const cost = calculateRecipeCost(recipe, multiplier);
  const scaledYield = Math.max(1, Math.round(recipe.yieldCount * multiplier * 10) / 10);

  // Missing prices detection
  const missingPrices = cost.breakdown.filter(item => item.unitPrice === 0);

  const handleSaveBrand = (secId: string, ingId: string) => {
    updateIngredientBrand(recipe.id, secId, ingId, brandInput.trim());
    setEditingBrandFor(null);
    setBrandInput("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Top Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 no-print">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4 text-emerald-600" />
            ระบบคิดต้นทุนวัตถุดิบ & วิเคราะห์ราคาขาย
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-3">
            <span>{recipe.emoji}</span>
            <span>{recipe.name}</span>
          </h1>
        </div>

        {/* Recipe Switcher */}
        <div className="flex items-center gap-2">
          <select
            value={recipe.id}
            onChange={(e) => setActiveRecipeId(e.target.value)}
            className="px-3.5 py-2 bg-white border border-stone-300 rounded-2xl text-sm font-semibold text-stone-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {recipes.map(r => (
              <option key={r.id} value={r.id}>
                {r.emoji} {r.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="p-2.5 text-stone-600 bg-white hover:bg-stone-50 border border-stone-300 rounded-2xl transition-colors shadow-sm"
            title="พิมพ์ตารางต้นทุน"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Missing Price Warning Alert */}
      {missingPrices.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-3xl flex items-start justify-between gap-3 no-print">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-950 text-sm">
                พบวัตถุดิบ {missingPrices.length} รายการที่ยังไม่มีราคาต่อหน่วย
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                รายการ: {missingPrices.map(m => `${m.name} ${m.brand ? `(${m.brand})` : ""}`).join(", ")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setViewMode("prices")}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
          >
            ไปตั้งราคาวัตถุดิบ
          </button>
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Total Batch Cost */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm relative overflow-hidden">
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">
            ต้นทุนรวมทั้งสูตร ({Math.round(multiplier * 100) / 100}x)
          </div>
          <div className="font-mono text-3xl font-black text-stone-900">
            ฿{cost.totalCost.toFixed(2)}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            วัตถุดิบ ฿{cost.totalIngredientCost.toFixed(1)} + ค่าอื่นๆ ฿{(cost.packagingCost + cost.laborCost + cost.overheadCost).toFixed(1)}
          </div>
        </div>

        {/* Card 2: Cost Per Portion / Piece */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-5 border border-emerald-200 shadow-sm">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
            ต้นทุนต่อชิ้น / {recipe.yieldUnit}
          </div>
          <div className="font-mono text-3xl font-black text-emerald-950">
            ฿{cost.costPerPortion.toFixed(2)}
          </div>
          <div className="text-xs text-emerald-700 mt-1">
            ผลิตได้ {scaledYield} {recipe.yieldUnit}
          </div>
        </div>

        {/* Card 3: Suggested Price (Food Cost 30-40%) */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-5 border border-amber-200 shadow-sm">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
            ราคาขายแนะนำ (Food Cost 35%)
          </div>
          <div className="font-mono text-3xl font-black text-amber-950">
            ฿{(cost.costPerPortion / 0.35).toFixed(0)} - ฿{(cost.costPerPortion / 0.30).toFixed(0)}
          </div>
          <div className="text-xs text-amber-700 mt-1">
            กำไรขั้นต้น ~65% - 70%
          </div>
        </div>

        {/* Card 4: Custom Margin Selling Price */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-5 border border-purple-200 shadow-sm">
          <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider mb-1">
            ราคาขายเป้าหมาย (กำไร {costSettings.targetMargin}%)
          </div>
          <div className="font-mono text-3xl font-black text-purple-950">
            ฿{cost.customMarginPrice.toFixed(0)}
          </div>
          <div className="text-xs text-purple-700 mt-1">
            กำไรสุทธิ ฿{(cost.customMarginPrice - cost.costPerPortion).toFixed(2)} / {recipe.yieldUnit}
          </div>
        </div>
      </div>

      {/* Main Breakdown Layout: Left Table, Right Cost Adjusters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left 2 Cols: Ingredient Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
          <div className="p-5 bg-stone-50/80 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-bold text-stone-800 text-base flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              <span>รายละเอียดต้นทุนวัตถุดิบ (Ingredient Breakdown)</span>
            </h3>
            <span className="text-xs font-semibold text-stone-500">
              รวม ฿{cost.totalIngredientCost.toFixed(2)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider bg-stone-50/40">
                  <th className="py-3 px-5">วัตถุดิบ</th>
                  <th className="py-3 px-3">ยี่ห้อ (คลิกแก้)</th>
                  <th className="py-3 px-3 text-right">ปริมาณ</th>
                  <th className="py-3 px-3 text-right">ราคา/หน่วย</th>
                  <th className="py-3 px-5 text-right">รวมเงิน (บาท)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {recipe.sections.map((section) => (
                  <React.Fragment key={section.id}>
                    {/* Section Header Row */}
                    <tr className="bg-amber-50/40">
                      <td colSpan={5} className="py-2 px-5 text-xs font-bold text-amber-900">
                        {section.title}
                      </td>
                    </tr>

                    {section.ingredients.map((ing) => {
                      const scaledAmount = ing.amount * multiplier;
                      const unitPrice = cost.breakdown.find(b => b.ingredientId === ing.id)?.unitPrice || 0;
                      const subtotal = scaledAmount * unitPrice;
                      const isEditing = editingBrandFor?.sectionId === section.id && editingBrandFor?.ingredientId === ing.id;

                      return (
                        <tr key={ing.id} className="hover:bg-stone-50 transition-colors group">
                          {/* Name */}
                          <td className="py-3 px-5 text-stone-800">
                            {ing.name}
                          </td>

                          {/* Brand */}
                          <td className="py-3 px-3">
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  value={brandInput}
                                  onChange={(e) => setBrandInput(e.target.value)}
                                  placeholder="ยี่ห้อ"
                                  autoFocus
                                  className="w-24 px-2 py-0.5 text-xs border border-amber-500 rounded"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSaveBrand(section.id, ing.id);
                                    if (e.key === "Escape") setEditingBrandFor(null);
                                  }}
                                />
                                <button
                                  onClick={() => handleSaveBrand(section.id, ing.id)}
                                  className="px-1.5 py-0.5 bg-amber-600 text-white text-[10px] rounded"
                                >
                                  OK
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingBrandFor({ sectionId: section.id, ingredientId: ing.id });
                                  setBrandInput(ing.brand || "");
                                }}
                                className="text-xs text-left"
                                title="คลิกเพื่อเปลี่ยนยี่ห้อ"
                              >
                                {ing.brand ? (
                                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-semibold rounded-md border border-amber-200">
                                    {ing.brand}
                                  </span>
                                ) : (
                                  <span className="text-stone-300 hover:text-stone-500 italic">
                                    + ยี่ห้อ
                                  </span>
                                )}
                              </button>
                            )}
                          </td>

                          {/* Amount */}
                          <td className="py-3 px-3 text-right font-mono text-stone-700">
                            {scaledAmount.toLocaleString()} {ing.unit}
                          </td>

                          {/* Unit Price */}
                          <td className="py-3 px-3 text-right font-mono text-xs text-stone-500">
                            {unitPrice > 0 ? (
                              `฿${unitPrice.toFixed(3)}/${ing.unit}`
                            ) : (
                              <span className="text-amber-600 font-bold">฿0.00</span>
                            )}
                          </td>

                          {/* Subtotal */}
                          <td className="py-3 px-5 text-right font-mono font-bold text-stone-900">
                            ฿{subtotal.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Cost Parameters & Simulator */}
        <div className="space-y-6 no-print">
          {/* Cost Settings Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm">
            <h3 className="font-bold text-stone-800 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>ปรับต้นทุนแฝง & ค่าแรง</span>
            </h3>

            <div className="space-y-4">
              {/* Packaging Cost */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  ค่าบรรจุภัณฑ์/กระปุก/กล่อง (บาท/หน่วย)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    value={costSettings.packagingCostPerUnit}
                    onChange={(e) => updateCostSettings({ packagingCostPerUnit: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-stone-500">บาท</span>
                </div>
              </div>

              {/* Labor Cost */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  ค่าแรงต่อชั่วโมง (บาท/ชม.)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={costSettings.laborRatePerHour}
                    onChange={(e) => updateCostSettings({ laborRatePerHour: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-stone-500">บาท</span>
                </div>
              </div>

              {/* Prep Time */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  เวลาทำโดยประมาณ (ชั่วโมง/สูตร)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.25"
                    value={costSettings.prepTimeHours}
                    onChange={(e) => updateCostSettings({ prepTimeHours: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-stone-500">ชม.</span>
                </div>
              </div>

              {/* Overhead Percent */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  ค่าดำเนินการ/ค่าน้ำค่าไฟ/แก๊ส (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={costSettings.overheadPercent}
                    onChange={(e) => updateCostSettings({ overheadPercent: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-stone-500">%</span>
                </div>
              </div>

              {/* Target Margin Slider */}
              <div className="pt-3 border-t border-stone-100">
                <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                  <span>เป้าหมายกำไรขั้นต้น:</span>
                  <span className="text-purple-700 font-bold">{costSettings.targetMargin}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="5"
                  value={costSettings.targetMargin}
                  onChange={(e) => updateCostSettings({ targetMargin: parseInt(e.target.value) })}
                  className="w-full accent-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Quick Price Master Shortcut */}
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-3xl">
            <h4 className="font-bold text-blue-950 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-blue-600" />
              จัดการราคาวัตถุดิบส่วนกลาง
            </h4>
            <p className="text-xs text-blue-800 mb-3 leading-relaxed">
              ต้องการแก้ไขราคาต่อแพ็ค หรือเพิ่มยี่ห้อใหม่ของวัตถุดิบทั้งหมด?
            </p>
            <button
              onClick={() => setViewMode("prices")}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              เปิดหน้าจัดการราคาวัตถุดิบ Master
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
