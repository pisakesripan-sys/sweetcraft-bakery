import React, { useState } from "react";
import { 
  ShoppingCart, 
  Check, 
  Copy, 
  Printer, 
  Trash2, 
  Plus, 
  Layers, 
  CheckCircle2, 
  Sparkles 
} from "lucide-react";
import { useRecipes } from "../context/RecipeContext";

export const ShoppingListModal: React.FC = () => {
  const { 
    recipes, 
    shoppingSelection, 
    setShoppingItemMultiplier, 
    toggleShoppingItemSelected, 
    selectAllForShopping, 
    clearShoppingList,
    getConsolidatedShoppingList
  } = useRecipes();

  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const shoppingItems = getConsolidatedShoppingList();
  const selectedRecipesCount = Object.values(shoppingSelection).filter(s => s.selected).length;
  const totalEstimatedCost = shoppingItems.reduce((acc, item) => acc + item.estimatedCost, 0);

  const toggleCheck = (key: string) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = () => {
    const lines: string[] = [];
    lines.push("🛒 รายการจ่ายตลาดซื้อวัตถุดิบทำขนม (AT)");
    lines.push("================================");
    
    // Included recipes
    lines.push("📋 สูตรที่วางแผนผลิต:");
    Object.entries(shoppingSelection).forEach(([rId, cfg]) => {
      if (cfg.selected && cfg.multiplier > 0) {
        const r = recipes.find(rec => rec.id === rId);
        if (r) lines.push(`- ${r.name} (${cfg.multiplier}x สูตร)`);
      }
    });
    lines.push("");
    lines.push("🧺 วัตถุดิบที่ต้องซื้อ:");
    shoppingItems.forEach((item, idx) => {
      const brandStr = item.brand ? ` [${item.brand}]` : "";
      lines.push(`${idx + 1}. ${item.name}${brandStr}: ${Math.round(item.totalAmount * 100) / 100} ${item.unit} (~฿${item.estimatedCost.toFixed(0)})`);
    });
    lines.push("");
    lines.push(`💰 ประมาณการยอดซื้อรวม: ฿${totalEstimatedCost.toFixed(0)}`);

    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-purple-50/70 p-6 rounded-3xl border border-purple-200">
        <div>
          <div className="flex items-center gap-2 text-purple-800 font-bold text-xs uppercase tracking-wider mb-1">
            <ShoppingCart className="w-4 h-4 text-purple-600" />
            ระบบวางแผนผลิต & สรุปรายการจ่ายตลาด (Batch Production Planner)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            รายการซื้อวัตถุดิบรวม
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            ติ๊กเลือกสูตรและระบุจำนวนสูตรที่ต้องการทำ ระบบจะคำนวณและรวบรวมวัตถุดิบที่ซ้ำกันออกมาเป็นยอดซื้อเดียวให้ทันที
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm rounded-2xl shadow-sm transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "คัดลอกลงคลิปบอร์ดแล้ว!" : "คัดลอกข้อความ (LINE)"}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-2.5 text-stone-600 bg-white hover:bg-stone-50 border border-stone-300 rounded-2xl transition-colors shadow-sm"
            title="พิมพ์รายการจ่ายตลาด"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={clearShoppingList}
            className="p-2.5 text-stone-400 hover:text-red-600 bg-white hover:bg-red-50 border border-stone-300 rounded-2xl transition-colors shadow-sm"
            title="ล้างรายการทั้งหมด"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Select Recipes to Produce */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm h-fit no-print">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
            <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>เลือกสูตรที่จะทำ ({selectedRecipesCount})</span>
            </h3>
            <button
              onClick={selectAllForShopping}
              className="text-xs text-purple-700 hover:text-purple-900 font-semibold"
            >
              เลือกทั้งหมด
            </button>
          </div>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            {recipes.map(recipe => {
              const itemConfig = shoppingSelection[recipe.id] || { selected: false, multiplier: 1 };

              return (
                <div
                  key={recipe.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    itemConfig.selected
                      ? "bg-purple-50/60 border-purple-300 shadow-sm"
                      : "bg-stone-50/50 hover:bg-stone-100/50 border-stone-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-3 cursor-pointer flex-1 select-none">
                      <input
                        type="checkbox"
                        checked={itemConfig.selected}
                        onChange={() => toggleShoppingItemSelected(recipe.id)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-stone-300"
                      />
                      <div>
                        <div className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                          <span>{recipe.emoji}</span>
                          <span>{recipe.name}</span>
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {recipe.yieldCount} {recipe.yieldUnit}
                        </div>
                      </div>
                    </label>

                    {itemConfig.selected && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setShoppingItemMultiplier(recipe.id, Math.max(0.5, itemConfig.multiplier - 0.5))}
                          className="w-6 h-6 rounded-lg bg-white border border-purple-200 text-purple-800 font-bold text-xs flex items-center justify-center hover:bg-purple-100"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          value={itemConfig.multiplier}
                          onChange={(e) => setShoppingItemMultiplier(recipe.id, parseFloat(e.target.value) || 1)}
                          className="w-12 px-1 py-0.5 text-center font-mono font-bold text-xs bg-white border border-purple-300 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setShoppingItemMultiplier(recipe.id, itemConfig.multiplier + 0.5)}
                          className="w-6 h-6 rounded-lg bg-white border border-purple-200 text-purple-800 font-bold text-xs flex items-center justify-center hover:bg-purple-100"
                        >
                          +
                        </button>
                        <span className="text-[11px] text-stone-500 font-medium">สูตร</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Consolidated Shopping Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Box */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1">
                ยอดรวมวัตถุดิบทั้งหมด
              </div>
              <div className="text-3xl font-black font-mono">
                {shoppingItems.length} รายการ
              </div>
              <div className="text-xs text-purple-200 mt-1">
                จากทั้งหมด {selectedRecipesCount} สูตรที่เลือกผลิต
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1">
                ประมาณการงบประมาณที่ต้องเตรียม
              </div>
              <div className="text-3xl font-black font-mono text-emerald-300">
                ~฿{totalEstimatedCost.toFixed(0)}
              </div>
              <div className="text-xs text-purple-200 mt-1">
                คำนวณตามราคาวัตถุดิบ Master Price
              </div>
            </div>
          </div>

          {/* Consolidated Items Checklist */}
          {shoppingItems.length > 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
              <div className="p-5 bg-stone-50/80 border-b border-stone-100 flex items-center justify-between">
                <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider">
                  เช็คลิสต์ซื้อของ (Shopping Checklist)
                </h3>
                <span className="text-xs text-stone-500 font-medium">
                  ติ๊กถูกเมื่อหยิบของลงตะกร้าแล้ว
                </span>
              </div>

              <div className="divide-y divide-stone-100">
                {shoppingItems.map((item) => {
                  const isChecked = !!checkedItems[item.key];

                  return (
                    <div
                      key={item.key}
                      onClick={() => toggleCheck(item.key)}
                      className={`p-4 sm:px-6 flex items-center justify-between gap-4 cursor-pointer transition-colors select-none ${
                        isChecked ? "bg-emerald-50/60 opacity-60 line-through text-stone-400" : "hover:bg-purple-50/40"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <button
                          type="button"
                          className={`w-6 h-6 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                            isChecked ? "bg-emerald-600 text-white" : "border-2 border-stone-300 text-transparent hover:border-purple-500"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4 fill-current" />
                        </button>

                        <div>
                          <div className="font-bold text-base text-stone-900 flex items-center gap-2">
                            <span>{item.name}</span>
                            {item.brand && (
                              <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-lg no-underline inline-block border border-amber-200">
                                {item.brand}
                              </span>
                            )}
                          </div>
                          
                          {/* Recipe Breakdown source */}
                          <div className="text-[11px] text-stone-400 mt-0.5 no-underline flex flex-wrap gap-1">
                            <span>ใช้ใน: </span>
                            {item.recipes.map((r, i) => (
                              <span key={i} className="text-stone-500 font-medium">
                                {r.recipeName} ({Math.round(r.amount * 10) / 10} {r.unit}){i < item.recipes.length - 1 ? "," : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono text-xl font-black text-purple-950">
                          {Math.round(item.totalAmount * 100) / 100} {item.unit}
                        </div>
                        <div className="text-xs font-semibold text-emerald-700">
                          ~฿{item.estimatedCost.toFixed(0)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300 p-8">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-stone-800 mb-1">ยังไม่ได้เลือกสูตรที่จะทำ</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                กรุณาทำเครื่องหมายถูกที่สูตรขนมทางด้านซ้าย เพื่อคำนวณรายการวัตถุดิบรวม
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
