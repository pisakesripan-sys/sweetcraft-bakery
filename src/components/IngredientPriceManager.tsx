import React, { useState } from "react";
import { 
  Tag, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  DollarSign, 
  Sparkles, 
  Check, 
  X,
  Layers
} from "lucide-react";
import { useRecipes } from "../context/RecipeContext";
import { IngredientMasterPrice } from "../types/recipe";

export const IngredientPriceManager: React.FC = () => {
  const { 
    prices, 
    updatePrice, 
    addPrice, 
    deletePrice, 
    resetPrices,
    recipes
  } = useRecipes();

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<IngredientMasterPrice | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPriceForm, setNewPriceForm] = useState({
    name: "",
    brand: "",
    packPrice: 0,
    packSize: 1000,
    packUnit: "กรัม",
    notes: ""
  });

  const filteredPrices = prices.filter(p => {
    const q = search.trim().toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || (p.notes && p.notes.toLowerCase().includes(q));
  });

  const handleStartEdit = (p: IngredientMasterPrice) => {
    setEditingId(p.id);
    setEditForm({ ...p });
  };

  const handleSaveEdit = () => {
    if (editForm) {
      updatePrice(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleCreateNewPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPriceForm.name.trim() || newPriceForm.packPrice <= 0 || newPriceForm.packSize <= 0) return;

    addPrice({
      name: newPriceForm.name.trim(),
      brand: newPriceForm.brand.trim(),
      packPrice: Number(newPriceForm.packPrice),
      packSize: Number(newPriceForm.packSize),
      packUnit: newPriceForm.packUnit.trim() || "กรัม",
      notes: newPriceForm.notes.trim()
    });

    setNewPriceForm({
      name: "",
      brand: "",
      packPrice: 0,
      packSize: 1000,
      packUnit: "กรัม",
      notes: ""
    });
    setShowAddForm(false);
  };

  // Find which recipes use this ingredient
  const getUsedInRecipes = (ingName: string, ingBrand: string) => {
    const matched: string[] = [];
    recipes.forEach(rec => {
      const uses = rec.sections.some(s => 
        s.ingredients.some(i => 
          i.name.trim().toLowerCase() === ingName.trim().toLowerCase() &&
          (!ingBrand || i.brand.trim().toLowerCase() === ingBrand.trim().toLowerCase())
        )
      );
      if (uses) matched.push(rec.name);
    });
    return matched;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-blue-50/70 p-6 rounded-3xl border border-blue-200">
        <div>
          <div className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase tracking-wider mb-1">
            <Tag className="w-4 h-4 text-blue-600" />
            ระบบจัดการราคากลางวัตถุดิบ & สเปคยี่ห้อ (Master Price List)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            ราคาวัตถุดิบ & ยี่ห้อ
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            กำหนดราคาต่อแพ็ค/ขนาดบรรจุ ระบบจะคำนวณต้นทุนต่อกรัมให้อัตโนมัติ และอัปเดตไปทุกสูตรที่ใช้วัตถุดิบนี้
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-2xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            เพิ่มวัตถุดิบใหม่
          </button>

          <button
            onClick={() => {
              if (confirm("ต้องการรีเซ็ตราคาวัตถุดิบทั้งหมดกลับเป็นค่ามาตรฐานหรือไม่?")) {
                resetPrices();
              }
            }}
            className="p-2.5 text-stone-500 hover:text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-2xl transition-colors shadow-sm"
            title="รีเซ็ตราคามาตรฐาน"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add New Price Modal / Inline Form */}
      {showAddForm && (
        <form onSubmit={handleCreateNewPrice} className="mb-8 p-6 bg-white rounded-3xl border-2 border-blue-400 shadow-xl animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              <span>เพิ่มราคาวัตถุดิบ / ยี่ห้อใหม่</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                ชื่อวัตถุดิบ *
              </label>
              <input
                type="text"
                required
                placeholder="เช่น ครีมชีส, วิปครีม"
                value={newPriceForm.name}
                onChange={(e) => setNewPriceForm({ ...newPriceForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                ยี่ห้อ / สเปค (เว้นว่างได้)
              </label>
              <input
                type="text"
                placeholder="เช่น เอเคอร์, Millac, สีม่วง"
                value={newPriceForm.brand}
                onChange={(e) => setNewPriceForm({ ...newPriceForm, brand: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                ราคาต่อแพ็ค/ถุง (บาท) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                min="0"
                placeholder="195"
                value={newPriceForm.packPrice || ""}
                onChange={(e) => setNewPriceForm({ ...newPriceForm, packPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                ปริมาณบรรจุต่อแพ็ค & หน่วย *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  required
                  min="0.01"
                  placeholder="1000"
                  value={newPriceForm.packSize || ""}
                  onChange={(e) => setNewPriceForm({ ...newPriceForm, packSize: parseFloat(e.target.value) || 1 })}
                  className="w-2/3 px-3 py-2 border border-stone-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="กรัม/ฟอง/ห่อ"
                  value={newPriceForm.packUnit}
                  onChange={(e) => setNewPriceForm({ ...newPriceForm, packUnit: e.target.value })}
                  className="w-1/3 px-2 py-2 border border-stone-300 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-stone-500">
              {newPriceForm.packPrice > 0 && newPriceForm.packSize > 0 && (
                <span>
                  ต้นทุนคำนวณได้: <strong className="text-blue-900 font-mono">฿{(newPriceForm.packPrice / newPriceForm.packSize).toFixed(4)} / {newPriceForm.packUnit}</strong>
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                บันทึกวัตถุดิบ
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Search Filter Bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อวัตถุดิบ หรือยี่ห้อ (เช่น เอเคอร์, วิปครีม)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
          />
        </div>

        <span className="text-xs font-semibold text-stone-500">
          แสดง {filteredPrices.length} จาก {prices.length} รายการ
        </span>
      </div>

      {/* Master Price Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider bg-stone-50/70">
                <th className="py-3.5 px-6">วัตถุดิบ</th>
                <th className="py-3.5 px-4">ยี่ห้อ / แบรนด์</th>
                <th className="py-3.5 px-4 text-right">ราคาแพ็ค (บาท)</th>
                <th className="py-3.5 px-4 text-right">ขนาดบรรจุ</th>
                <th className="py-3.5 px-4 text-right">ต้นทุน/หน่วย (คำนวณ)</th>
                <th className="py-3.5 px-4 hidden md:table-cell">สูตรที่ใช้งาน</th>
                <th className="py-3.5 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredPrices.map((p) => {
                const isEditing = editingId === p.id && editForm !== null;
                const usedRecipes = getUsedInRecipes(p.name, p.brand);

                if (isEditing && editForm) {
                  return (
                    <tr key={p.id} className="bg-blue-50/50">
                      <td className="py-3 px-6">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-2 py-1 bg-white border border-blue-400 rounded-lg text-xs font-bold"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editForm.brand}
                          onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                          className="w-full px-2 py-1 bg-white border border-blue-400 rounded-lg text-xs"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <input
                          type="number"
                          step="0.1"
                          value={editForm.packPrice}
                          onChange={(e) => setEditForm({ ...editForm, packPrice: parseFloat(e.target.value) || 0 })}
                          className="w-20 px-2 py-1 bg-white border border-blue-400 rounded-lg text-xs text-right font-mono"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <input
                            type="number"
                            step="0.1"
                            value={editForm.packSize}
                            onChange={(e) => setEditForm({ ...editForm, packSize: parseFloat(e.target.value) || 1 })}
                            className="w-16 px-2 py-1 bg-white border border-blue-400 rounded-lg text-xs text-right font-mono"
                          />
                          <input
                            type="text"
                            value={editForm.packUnit}
                            onChange={(e) => setEditForm({ ...editForm, packUnit: e.target.value })}
                            className="w-12 px-1 py-1 bg-white border border-blue-400 rounded-lg text-xs text-center"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs font-bold text-blue-900">
                        ฿{(editForm.packSize > 0 ? editForm.packPrice / editForm.packSize : 0).toFixed(4)}
                      </td>
                      <td className="py-3 px-4 text-xs text-stone-400">
                        -
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={handleSaveEdit}
                            className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm"
                            title="บันทึก"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditForm(null);
                            }}
                            className="p-1.5 bg-stone-200 text-stone-600 rounded-lg hover:bg-stone-300"
                            title="ยกเลิก"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-6 font-bold text-stone-900">
                      {p.name}
                    </td>

                    {/* Brand */}
                    <td className="py-3.5 px-4">
                      {p.brand ? (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold">
                          {p.brand}
                        </span>
                      ) : (
                        <span className="text-xs text-stone-400 italic">
                          ทั่วไป / ไม่ระบุ
                        </span>
                      )}
                    </td>

                    {/* Pack Price */}
                    <td className="py-3.5 px-4 text-right font-mono text-stone-800">
                      ฿{p.packPrice.toLocaleString()}
                    </td>

                    {/* Pack Size */}
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-stone-600">
                      {p.packSize.toLocaleString()} {p.packUnit}
                    </td>

                    {/* Cost Per Unit */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-blue-900">
                      ฿{p.costPerUnit.toFixed(3)} <span className="text-[10px] text-stone-400 font-normal">/{p.packUnit}</span>
                    </td>

                    {/* Recipes Used In */}
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {usedRecipes.length > 0 ? (
                          usedRecipes.map((rName, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded-md">
                              {rName}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-stone-300">-</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="แก้ไขราคา"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`ต้องการลบรายการราคา ${p.name} ${p.brand ? `(${p.brand})` : ""} หรือไม่?`)) {
                              deletePrice(p.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="ลบ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
