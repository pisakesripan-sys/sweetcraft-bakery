import React, { useState } from "react";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  RotateCcw, 
  Timer, 
  Scale, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  Award,
  BookOpen
} from "lucide-react";
import { useRecipes } from "../context/RecipeContext";

export const KitchenMode: React.FC = () => {
  const { 
    selectedRecipe, 
    recipes,
    setActiveRecipeId,
    setViewMode, 
    multiplier, 
    setMultiplier,
    kitchenChecklist, 
    toggleKitchenCheck, 
    clearKitchenChecklist 
  } = useRecipes();

  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);

  if (!selectedRecipe) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white rounded-3xl mt-12 border border-stone-200">
        <p className="text-stone-600 mb-4">กรุณาเลือกสูตรที่ต้องการทำ</p>
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
  const allIngredients = recipe.sections.flatMap(s => s.ingredients);
  const totalCount = allIngredients.length;
  const checkedCount = allIngredients.filter(ing => kitchenChecklist[ing.id]).length;
  const isAllChecked = totalCount > 0 && checkedCount === totalCount;
  const progressPercent = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={() => setViewMode("detail")}
          className="flex items-center gap-2 px-3.5 py-2 text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-2xl transition-colors text-sm font-medium shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ออกจากโหมดทำขนม</span>
        </button>

        {/* Recipe Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 font-medium hidden sm:inline">สลับสูตร:</span>
          <select
            value={recipe.id}
            onChange={(e) => setActiveRecipeId(e.target.value)}
            className="px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {recipes.map(r => (
              <option key={r.id} value={r.id}>
                {r.emoji} {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Baking Title Card */}
      <div className={`bg-gradient-to-r ${recipe.themeColor} rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-6 relative overflow-hidden`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              {recipe.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-black/30 rounded-full border border-white/20">
                  โหมดตวง & ปรุงในครัว
                </span>
                <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full font-bold">
                  {multiplier}x เท่า
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {recipe.name}
              </h1>
              <p className="text-xs sm:text-sm text-white/90 mt-1">
                ปริมาณที่จะได้: <strong>{Math.round(recipe.yieldCount * multiplier * 10) / 10} {recipe.yieldUnit}</strong>
              </p>
            </div>
          </div>

          {/* Quick Multiplier Switcher in Kitchen */}
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shrink-0">
            <span className="text-xs text-white/80 px-2 font-medium">สัดส่วน:</span>
            {[0.5, 1, 2, 3].map(p => (
              <button
                key={p}
                onClick={() => setMultiplier(p)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  multiplier === p ? "bg-white text-stone-900 shadow-sm" : "text-white/80 hover:text-white"
                }`}
              >
                {p}x
              </button>
            ))}
          </div>
        </div>

        {/* Kitchen Checklist Progress Bar */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>ความคืบหน้าการตวงวัตถุดิบ</span>
            </span>
            <span>
              {checkedCount} / {totalCount} รายการ ({Math.round(progressPercent)}%)
            </span>
          </div>

          <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* All Prepared Celebration Banner */}
      {isAllChecked && (
        <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-3xl flex items-center justify-between gap-4 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-md">
              🎉
            </div>
            <div>
              <h4 className="font-bold text-emerald-950 text-sm">ตวงวัตถุดิบครบทุกอย่างแล้ว!</h4>
              <p className="text-xs text-emerald-700">พร้อมลงมือผสมและอบตามขั้นตอนด้านล่างได้เลยครับ</p>
            </div>
          </div>
          <button
            onClick={clearKitchenChecklist}
            className="flex items-center gap-1 text-xs text-emerald-800 hover:text-emerald-950 font-semibold px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> ล้างติ๊กถูก
          </button>
        </div>
      )}

      {/* Step Sections Accordion */}
      <div className="space-y-6">
        {recipe.sections.map((section, sIndex) => {
          const sectionIngredients = section.ingredients;
          const sectionChecked = sectionIngredients.filter(i => kitchenChecklist[i.id]).length;
          const sectionDone = sectionIngredients.length > 0 && sectionChecked === sectionIngredients.length;

          return (
            <div
              key={section.id}
              className={`bg-white rounded-3xl border transition-all duration-300 shadow-sm overflow-hidden ${
                sectionDone ? "border-emerald-300 ring-2 ring-emerald-500/10" : "border-stone-200"
              }`}
            >
              {/* Section Header */}
              <div 
                className={`px-6 py-4 flex items-center justify-between gap-4 border-b cursor-pointer transition-colors ${
                  sectionDone ? "bg-emerald-50/50 border-emerald-100" : "bg-stone-50/80 border-stone-100"
                }`}
                onClick={() => setActiveSectionIndex(activeSectionIndex === sIndex ? -1 : sIndex)}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-2xl text-xs font-bold flex items-center justify-center shadow-sm ${
                    sectionDone ? "bg-emerald-600 text-white" : "bg-amber-700 text-white"
                  }`}>
                    {sectionDone ? <CheckCircle2 className="w-4 h-4" /> : sIndex + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-stone-900 text-base sm:text-lg">
                      {section.title}
                    </h3>
                    <div className="text-xs text-stone-500">
                      ตวงแล้ว {sectionChecked} / {sectionIngredients.length} รายการ
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-stone-100 text-stone-600 rounded-xl">
                    ขั้นตอนที่ {sIndex + 1}
                  </span>
                </div>
              </div>

              {/* Step Instruction */}
              {section.instruction && (
                <div className="px-6 py-4 bg-amber-50/40 border-b border-stone-100">
                  <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    วิธีทำขั้นตอนนี้:
                  </div>
                  <p className="text-sm sm:text-base font-medium text-stone-800 leading-relaxed">
                    {section.instruction}
                  </p>
                </div>
              )}

              {/* Ingredients Checklist */}
              <div className="p-4 sm:p-6 divide-y divide-stone-100">
                {sectionIngredients.map((ing) => {
                  const isChecked = !!kitchenChecklist[ing.id];
                  const scaledAmount = Math.round((ing.amount * multiplier) * 100) / 100;

                  return (
                    <div
                      key={ing.id}
                      onClick={() => toggleKitchenCheck(ing.id)}
                      className={`py-4 px-3 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 select-none ${
                        isChecked
                          ? "bg-emerald-50/60 opacity-60 line-through text-stone-400"
                          : "hover:bg-amber-50/50 text-stone-800"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <button
                          type="button"
                          className={`w-6 h-6 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                            isChecked ? "bg-emerald-600 text-white" : "border-2 border-stone-300 text-transparent hover:border-amber-500"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4 fill-current" />
                        </button>
                        
                        <div>
                          <div className="font-bold text-base sm:text-lg flex items-center gap-2">
                            <span>{ing.name}</span>
                            {ing.brand && (
                              <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-lg no-underline inline-block border border-amber-200">
                                {ing.brand}
                              </span>
                            )}
                          </div>
                          {ing.note && (
                            <div className="text-xs text-stone-500 mt-0.5 font-normal">
                              {ing.note}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Giant Scaled Weight for Easy Reading */}
                      <div className="text-right shrink-0">
                        <div className="font-mono text-xl sm:text-2xl font-black text-amber-900">
                          {scaledAmount.toLocaleString()}
                        </div>
                        <div className="text-xs font-semibold text-stone-500 uppercase">
                          {ing.unit}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pro Tips Footer */}
      {recipe.tips && recipe.tips.length > 0 && (
        <div className="mt-8 p-6 bg-stone-900 text-white rounded-3xl shadow-xl">
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            ข้อควรระวัง & เคล็ดลับความอร่อย
          </h4>
          <ul className="space-y-2">
            {recipe.tips.map((tip, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-stone-200 flex items-start gap-2 leading-relaxed">
                <span className="text-amber-400 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
