import React, { useState } from "react";
import { X, Plus, Trash2, Sparkles } from "lucide-react";
import { Recipe, RecipeSection, Ingredient } from "../types/recipe";
import { useRecipes } from "../context/RecipeContext";

interface RecipeFormModalProps {
  isOpen: boolean;
  recipeToEdit?: Recipe | null;
  onClose: () => void;
}

export const RecipeFormModal: React.FC<RecipeFormModalProps> = ({ isOpen, recipeToEdit, onClose }) => {
  const { addRecipe, updateRecipe } = useRecipes();

  const [name, setName] = useState(recipeToEdit?.name || "");
  const [category, setCategory] = useState<Recipe["category"]>(recipeToEdit?.category || "cake");
  const [categoryLabel, setCategoryLabel] = useState(recipeToEdit?.categoryLabel || "เค้ก & เบเกอรี่");
  const [yieldCount, setYieldCount] = useState<number>(recipeToEdit?.yieldCount || 1);
  const [yieldUnit, setYieldUnit] = useState(recipeToEdit?.yieldUnit || "ชิ้น / กระปุก");
  const [emoji, setEmoji] = useState(recipeToEdit?.emoji || "🧁");
  const [themeColor, setThemeColor] = useState(recipeToEdit?.themeColor || "from-amber-500 to-amber-700");
  const [description, setDescription] = useState(recipeToEdit?.description || "");
  const [sections, setSections] = useState<RecipeSection[]>(recipeToEdit?.sections || [
    {
      id: "sec-1",
      title: "ส่วนที่ 1 : ส่วนผสมหลัก",
      instruction: "",
      ingredients: [
        { id: "ing-1", name: "", brand: "", amount: 0, unit: "กรัม" }
      ]
    }
  ]);
  const [tips, setTips] = useState<string>(recipeToEdit?.tips?.join("\n") || "");

  if (!isOpen) return null;

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        id: "sec-" + Date.now(),
        title: `ส่วนที่ ${sections.length + 1}`,
        instruction: "",
        ingredients: [
          { id: "ing-" + Date.now(), name: "", brand: "", amount: 0, unit: "กรัม" }
        ]
      }
    ]);
  };

  const handleRemoveSection = (index: number) => {
    if (sections.length > 1) {
      setSections(sections.filter((_, i) => i !== index));
    }
  };

  const handleAddIngredient = (secIndex: number) => {
    const updated = [...sections];
    updated[secIndex].ingredients.push({
      id: "ing-" + Date.now() + "-" + Math.random(),
      name: "",
      brand: "",
      amount: 0,
      unit: "กรัม"
    });
    setSections(updated);
  };

  const handleRemoveIngredient = (secIndex: number, ingIndex: number) => {
    const updated = [...sections];
    if (updated[secIndex].ingredients.length > 1) {
      updated[secIndex].ingredients = updated[secIndex].ingredients.filter((_, i) => i !== ingIndex);
      setSections(updated);
    }
  };

  const handleUpdateIngredient = (secIndex: number, ingIndex: number, field: keyof Ingredient, value: any) => {
    const updated = [...sections];
    updated[secIndex].ingredients[ingIndex] = {
      ...updated[secIndex].ingredients[ingIndex],
      [field]: value
    };
    setSections(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tipList = tips.split("\n").map(t => t.trim()).filter(t => t.length > 0);

    const recipeData: Recipe = {
      id: recipeToEdit ? recipeToEdit.id : "rec-" + Date.now(),
      name: name.trim(),
      category,
      categoryLabel: category === "cake" ? "เค้ก & เบเกอรี่" : category === "cream" ? "ครีม & ไส้" : category === "sauce" ? "ซอส & ท็อปปิ้ง" : category === "chocolate" ? "ช็อคโกแลต" : category === "pie" ? "พาย & ทาร์ต" : "ฐาน & ครัสต์",
      yieldCount: Number(yieldCount) || 1,
      yieldUnit: yieldUnit.trim() || "ชิ้น",
      emoji: emoji.trim() || "🧁",
      themeColor,
      description: description.trim(),
      sheetGid: recipeToEdit?.sheetGid || "",
      sections,
      tips: tipList,
      createdAt: recipeToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (recipeToEdit) {
      updateRecipe(recipeData);
    } else {
      addRecipe(recipeData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {recipeToEdit ? "แก้ไขสูตรขนม" : "เพิ่มสูตรขนมใหม่"}
            </h2>
            <p className="text-xs text-amber-100 mt-0.5">
              กรอกส่วนผสมและแบ่งตามขั้นตอนให้ชัดเจน
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* General Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                ชื่อสูตรขนม *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น ครีมช็อคโกแลต, ชีสเค้กหน้าไหม้"
                className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                อิโมจิ & หมวดหมู่
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  className="w-14 px-2 py-2 border border-stone-300 rounded-xl text-center text-lg"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="cake">เค้ก & เบเกอรี่</option>
                  <option value="cream">ครีม & ไส้</option>
                  <option value="sauce">ซอส & ท็อปปิ้ง</option>
                  <option value="chocolate">ช็อคโกแลต</option>
                  <option value="pie">พาย & ทาร์ต</option>
                  <option value="base">ฐาน & ครัสต์</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                จำนวนที่ได้จากสูตรนี้ *
              </label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                required
                value={yieldCount}
                onChange={(e) => setYieldCount(parseFloat(e.target.value) || 1)}
                className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                หน่วยนับ *
              </label>
              <input
                type="text"
                required
                placeholder="เช่น ถ้วย, กระปุก, ชิ้น, สูตร"
                value={yieldUnit}
                onChange={(e) => setYieldUnit(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                โทนสี
              </label>
              <select
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs"
              >
                <option value="from-amber-600 to-amber-800">โทนสีทอง / เนย</option>
                <option value="from-amber-800 to-stone-900">โทนช็อคโกแลต</option>
                <option value="from-rose-500 to-red-700">โทนสตรอว์เบอร์รี่</option>
                <option value="from-purple-600 to-indigo-800">โทนบลูเบอร์รี่</option>
                <option value="from-emerald-600 to-lime-800">โทนมัทฉะ</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                คำอธิบายสูตร
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="อธิบายรสชาติหรือจุดเด่นของขนม..."
                className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Sections & Ingredients */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider">
                ส่วนผสมตามขั้นตอน (Sections & Ingredients)
              </h3>
              <button
                type="button"
                onClick={handleAddSection}
                className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200"
              >
                <Plus className="w-3.5 h-3.5" /> เพิ่มส่วน/ขั้นตอน
              </button>
            </div>

            {sections.map((section, sIndex) => (
              <div key={section.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    required
                    value={section.title}
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[sIndex].title = e.target.value;
                      setSections(updated);
                    }}
                    placeholder="เช่น ส่วนที่ 1 : เบสครีมชีส"
                    className="font-bold text-sm bg-white px-3 py-1.5 border border-stone-300 rounded-xl flex-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(sIndex)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg"
                      title="ลบส่วนนี้"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={section.instruction || ""}
                  onChange={(e) => {
                    const updated = [...sections];
                    updated[sIndex].instruction = e.target.value;
                    setSections(updated);
                  }}
                  placeholder="วิธีทำในขั้นตอนนี้ (ถ้ามี)..."
                  className="w-full text-xs px-3 py-1.5 bg-white border border-stone-200 rounded-xl focus:outline-none"
                />

                {/* Ingredients List */}
                <div className="space-y-2 pt-2">
                  {section.ingredients.map((ing, iIndex) => (
                    <div key={ing.id} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                      <input
                        type="text"
                        required
                        placeholder="ชื่อวัตถุดิบ *"
                        value={ing.name}
                        onChange={(e) => handleUpdateIngredient(sIndex, iIndex, "name", e.target.value)}
                        className="flex-1 min-w-[140px] px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="ยี่ห้อ (เว้นได้)"
                        value={ing.brand}
                        onChange={(e) => handleUpdateIngredient(sIndex, iIndex, "brand", e.target.value)}
                        className="w-28 px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl text-xs"
                      />
                      <input
                        type="number"
                        step="0.1"
                        required
                        min="0"
                        placeholder="ปริมาณ"
                        value={ing.amount || ""}
                        onChange={(e) => handleUpdateIngredient(sIndex, iIndex, "amount", parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1.5 bg-white border border-stone-300 rounded-xl text-xs text-right font-mono"
                      />
                      <input
                        type="text"
                        required
                        placeholder="หน่วย"
                        value={ing.unit}
                        onChange={(e) => handleUpdateIngredient(sIndex, iIndex, "unit", e.target.value)}
                        className="w-16 px-2 py-1.5 bg-white border border-stone-300 rounded-xl text-xs text-center"
                      />
                      {section.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(sIndex, iIndex)}
                          className="p-1 text-stone-300 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleAddIngredient(sIndex)}
                    className="text-xs text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1 pt-1"
                  >
                    <Plus className="w-3 h-3" /> เพิ่มวัตถุดิบในส่วนนี้
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="pt-4 border-t border-stone-100">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              เคล็ดลับ / ข้อควรระวัง (พิมพ์บรรทัดละ 1 ข้อ)
            </label>
            <textarea
              rows={3}
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="เช่น อบแบบรองน้ำที่ 160C\nชุบเลดี้ฟิ้งเกอร์เร็วๆ อย่าแช่นาน"
              className="w-full px-3.5 py-2 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors"
            >
              {recipeToEdit ? "บันทึกการแก้ไข" : "บันทึกสูตรใหม่"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
