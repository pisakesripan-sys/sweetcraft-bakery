import React, { useState } from "react";
import { 
  ChefHat, 
  BookOpen, 
  Calculator, 
  Tag, 
  ShoppingCart, 
  Search, 
  Plus, 
  ExternalLink,
  RotateCcw,
  Sparkles,
  Heart
} from "lucide-react";
import { useRecipes } from "../context/RecipeContext";
import { RecipeCategory } from "../types/recipe";

interface HeaderProps {
  onOpenNewRecipe: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewRecipe }) => {
  const { 
    viewMode, 
    setViewMode, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    recipes,
    favorites,
    resetRecipes
  } = useRecipes();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const categories: { key: RecipeCategory; label: string; icon: string }[] = [
    { key: "all", label: "ทั้งหมด", icon: "🍰" },
    { key: "cake", label: "เค้ก & เบเกอรี่", icon: "🧀" },
    { key: "cream", label: "ครีม & ไส้", icon: "🍦" },
    { key: "sauce", label: "ซอส & ท็อปปิ้ง", icon: "🍓" },
    { key: "chocolate", label: "ช็อคโกแลต", icon: "🍫" },
    { key: "pie", label: "พาย & ทาร์ต", icon: "🥧" },
    { key: "base", label: "ฐาน & ครัสต์", icon: "🍪" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm no-print">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand & Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setViewMode("recipes")}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-stone-900 text-white flex flex-col items-center justify-center shadow-md shadow-amber-600/25 group-hover:scale-105 transition-transform border border-amber-400/30 overflow-hidden relative shrink-0">
              <span className="font-black text-sm sm:text-base tracking-wider text-amber-100 font-mono leading-none">AT</span>
              <span className="text-[7px] sm:text-[8px] font-bold tracking-widest text-amber-200/90 uppercase leading-none mt-0.5">BAKERY</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl sm:text-2xl text-stone-800 tracking-tight">AT</span>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                  Bakery Master
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">ระบบจัดการสูตรขนม คำนวณวัตถุดิบ & คิดต้นทุนขาย</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1.5 rounded-2xl border border-stone-200/80">
            <button
              onClick={() => setViewMode("recipes")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                viewMode === "recipes" || viewMode === "detail"
                  ? "bg-white text-amber-900 shadow-sm font-semibold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              สูตรขนม ({recipes.length})
            </button>

            <button
              onClick={() => setViewMode("kitchen")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                viewMode === "kitchen"
                  ? "bg-amber-600 text-white shadow-sm font-semibold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
            >
              <ChefHat className="w-4 h-4 text-amber-500" />
              โหมดเข้าครัว
            </button>

            <button
              onClick={() => setViewMode("cost")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                viewMode === "cost"
                  ? "bg-white text-emerald-900 shadow-sm font-semibold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
            >
              <Calculator className="w-4 h-4 text-emerald-600" />
              คำนวณต้นทุน
            </button>

            <button
              onClick={() => setViewMode("prices")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                viewMode === "prices"
                  ? "bg-white text-blue-900 shadow-sm font-semibold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
            >
              <Tag className="w-4 h-4 text-blue-600" />
              ราคา & ยี่ห้อวัตถุดิบ
            </button>

            <button
              onClick={() => setViewMode("shopping")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                viewMode === "shopping"
                  ? "bg-white text-purple-900 shadow-sm font-semibold"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-purple-600" />
              จ่ายตลาด
            </button>
          </nav>

          {/* Quick Actions & Links */}
          <div className="flex items-center gap-2">
            <a
              href="https://docs.google.com/spreadsheets/d/1-XEWSnPdsUsVGVpT4H9aNOp0WitUraI0ob4dWO7sukw/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
              title="เปิดดู Google Sheets ต้นฉบับ"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              Google Sheet
            </a>

            <button
              onClick={onOpenNewRecipe}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">เพิ่มสูตรใหม่</span>
              <span className="sm:hidden">สูตร</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowResetConfirm(!showResetConfirm)}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
                title="รีเซ็ตสูตรเริ่มต้นจาก Google Sheet"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {showResetConfirm && (
                <div className="absolute right-0 mt-2 w-64 p-3 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 animate-in fade-in zoom-in-95">
                  <p className="text-xs text-stone-600 mb-3 font-normal">
                    ต้องการรีเซ็ตสูตรขนมทั้งหมดกลับเป็นค่าเริ่มต้นตาม Google Sheet หรือไม่?
                  </p>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-2.5 py-1 text-xs text-stone-500 hover:bg-stone-100 rounded-lg"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={() => {
                        resetRecipes();
                        setShowResetConfirm(false);
                      }}
                      className="px-2.5 py-1 text-xs bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
                    >
                      ยืนยันรีเซ็ต
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-stone-100 overflow-x-auto gap-1">
          <button
            onClick={() => setViewMode("recipes")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
              viewMode === "recipes" || viewMode === "detail" ? "bg-amber-100 text-amber-900 font-semibold" : "text-stone-600"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> สูตรขนม
          </button>
          <button
            onClick={() => setViewMode("kitchen")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
              viewMode === "kitchen" ? "bg-amber-600 text-white font-semibold" : "text-stone-600"
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" /> เข้าครัว
          </button>
          <button
            onClick={() => setViewMode("cost")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
              viewMode === "cost" ? "bg-emerald-100 text-emerald-900 font-semibold" : "text-stone-600"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" /> คิดต้นทุน
          </button>
          <button
            onClick={() => setViewMode("prices")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
              viewMode === "prices" ? "bg-blue-100 text-blue-900 font-semibold" : "text-stone-600"
            }`}
          >
            <Tag className="w-3.5 h-3.5" /> ราคาวัตถุดิบ
          </button>
          <button
            onClick={() => setViewMode("shopping")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${
              viewMode === "shopping" ? "bg-purple-100 text-purple-900 font-semibold" : "text-stone-600"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" /> จ่ายตลาด
          </button>
        </div>

        {/* Search & Category Filter (Visible in recipes view) */}
        {(viewMode === "recipes" || viewMode === "cost") && (
          <div className="py-3 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อสูตร หรือวัตถุดิบ (เช่น ครีมชีส, สตรอว์เบอร์รี่)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 hover:bg-stone-100/80 focus:bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 bg-stone-200 px-1.5 py-0.5 rounded-full"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.key
                      ? "bg-amber-800 text-white shadow-sm"
                      : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}

              {favorites.length > 0 && (
                <button
                  onClick={() => setSelectedCategory(selectedCategory === ("fav" as any) ? "all" : ("fav" as any))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    (selectedCategory as any) === "fav"
                      ? "bg-rose-600 text-white shadow-sm"
                      : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>รายการโปรด ({favorites.length})</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
