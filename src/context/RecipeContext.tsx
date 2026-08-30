import React, { createContext, useContext, useState, useEffect } from "react";
import { Recipe, RecipeCategory, IngredientMasterPrice, CostCalculationResult, ShoppingListItem } from "../types/recipe";
import { DEFAULT_RECIPES } from "../data/defaultRecipes";
import { DEFAULT_INGREDIENT_PRICES } from "../data/defaultPrices";

interface CostSettings {
  laborRatePerHour: number;
  prepTimeHours: number;
  packagingCostPerUnit: number;
  overheadPercent: number;
  targetMargin: number;
}

interface RecipeContextType {
  recipes: Recipe[];
  prices: IngredientMasterPrice[];
  activeRecipeId: string | null;
  selectedRecipe: Recipe | null;
  searchQuery: string;
  selectedCategory: RecipeCategory;
  multiplier: number;
  customYield: number | null;
  costSettings: CostSettings;
  kitchenChecklist: Record<string, boolean>;
  favorites: string[];
  shoppingSelection: Record<string, { selected: boolean; multiplier: number }>;
  viewMode: "recipes" | "detail" | "kitchen" | "cost" | "prices" | "shopping";
  
  // Actions
  setActiveRecipeId: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (cat: RecipeCategory) => void;
  setMultiplier: (m: number) => void;
  setCustomYield: (y: number | null) => void;
  setViewMode: (mode: "recipes" | "detail" | "kitchen" | "cost" | "prices" | "shopping") => void;
  updateCostSettings: (settings: Partial<CostSettings>) => void;
  
  // Recipe CRUD
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  resetRecipes: () => void;
  updateIngredientBrand: (recipeId: string, sectionId: string, ingredientId: string, newBrand: string) => void;

  // Prices CRUD
  updatePrice: (price: IngredientMasterPrice) => void;
  addPrice: (price: Omit<IngredientMasterPrice, "id" | "updatedAt" | "costPerUnit">) => void;
  deletePrice: (id: string) => void;
  resetPrices: () => void;
  getPriceForIngredient: (name: string, brand?: string) => number;

  // Helpers
  calculateRecipeCost: (recipe: Recipe, customMult?: number) => CostCalculationResult;
  getConsolidatedShoppingList: () => ShoppingListItem[];
  toggleKitchenCheck: (ingredientId: string) => void;
  clearKitchenChecklist: () => void;
  toggleFavorite: (recipeId: string) => void;
  setShoppingItemMultiplier: (recipeId: string, multiplier: number, selected?: boolean) => void;
  toggleShoppingItemSelected: (recipeId: string) => void;
  selectAllForShopping: () => void;
  clearShoppingList: () => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

const RECIPES_STORAGE_KEY = "sweetcraft_recipes_v2";
const PRICES_STORAGE_KEY = "sweetcraft_prices_v2";
const SETTINGS_STORAGE_KEY = "sweetcraft_cost_settings_v2";
const FAVORITES_STORAGE_KEY = "sweetcraft_favorites_v2";

const DEFAULT_COST_SETTINGS: CostSettings = {
  laborRatePerHour: 60,
  prepTimeHours: 0.5,
  packagingCostPerUnit: 4,
  overheadPercent: 10,
  targetMargin: 50,
};

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem(RECIPES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_RECIPES;
    } catch {
      return DEFAULT_RECIPES;
    }
  });

  const [prices, setPrices] = useState<IngredientMasterPrice[]>(() => {
    try {
      const saved = localStorage.getItem(PRICES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_INGREDIENT_PRICES;
    } catch {
      return DEFAULT_INGREDIENT_PRICES;
    }
  });

  const [costSettings, setCostSettings] = useState<CostSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_COST_SETTINGS;
    } catch {
      return DEFAULT_COST_SETTINGS;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeRecipeId, setActiveRecipeId] = useState<string | null>("rec-choc-cream");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory>("all");
  const [multiplier, setMultiplier] = useState(1);
  const [customYield, setCustomYield] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"recipes" | "detail" | "kitchen" | "cost" | "prices" | "shopping">("recipes");
  const [kitchenChecklist, setKitchenChecklist] = useState<Record<string, boolean>>({});
  const [shoppingSelection, setShoppingSelection] = useState<Record<string, { selected: boolean; multiplier: number }>>({});

  useEffect(() => {
    localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem(PRICES_STORAGE_KEY, JSON.stringify(prices));
  }, [prices]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(costSettings));
  }, [costSettings]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const selectedRecipe = recipes.find(r => r.id === activeRecipeId) || recipes[0] || null;

  const updateCostSettings = (newSettings: Partial<CostSettings>) => {
    setCostSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addRecipe = (newRecipe: Recipe) => {
    setRecipes(prev => [newRecipe, ...prev]);
    setActiveRecipeId(newRecipe.id);
  };

  const updateRecipe = (updated: Recipe) => {
    setRecipes(prev => prev.map(r => r.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : r));
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
    if (activeRecipeId === id) {
      const remaining = recipes.filter(r => r.id !== id);
      setActiveRecipeId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const resetRecipes = () => {
    setRecipes(DEFAULT_RECIPES);
  };

  const updateIngredientBrand = (recipeId: string, sectionId: string, ingredientId: string, newBrand: string) => {
    setRecipes(prev => prev.map(rec => {
      if (rec.id !== recipeId) return rec;
      return {
        ...rec,
        sections: rec.sections.map(sec => {
          if (sec.id !== sectionId) return sec;
          return {
            ...sec,
            ingredients: sec.ingredients.map(ing => ing.id === ingredientId ? { ...ing, brand: newBrand } : ing)
          };
        }),
        updatedAt: new Date().toISOString()
      };
    }));
  };

  const updatePrice = (price: IngredientMasterPrice) => {
    const costPerUnit = price.packSize > 0 ? price.packPrice / price.packSize : 0;
    setPrices(prev => prev.map(p => p.id === price.id ? { ...price, costPerUnit, updatedAt: new Date().toISOString() } : p));
  };

  const addPrice = (newPrice: Omit<IngredientMasterPrice, "id" | "updatedAt" | "costPerUnit">) => {
    const costPerUnit = newPrice.packSize > 0 ? newPrice.packPrice / newPrice.packSize : 0;
    const item: IngredientMasterPrice = {
      ...newPrice,
      id: "price-" + Date.now(),
      costPerUnit,
      updatedAt: new Date().toISOString()
    };
    setPrices(prev => [...prev, item]);
  };

  const deletePrice = (id: string) => {
    setPrices(prev => prev.filter(p => p.id !== id));
  };

  const resetPrices = () => {
    setPrices(DEFAULT_INGREDIENT_PRICES);
  };

  const getPriceForIngredient = (name: string, brand?: string): number => {
    const cleanName = name.trim().toLowerCase();
    const cleanBrand = (brand || "").trim().toLowerCase();

    // 1. Exact match for name + brand
    if (cleanBrand) {
      const match = prices.find(p => p.name.trim().toLowerCase() === cleanName && p.brand.trim().toLowerCase() === cleanBrand);
      if (match) return match.costPerUnit;
    }

    // 2. Exact match for name with generic/empty brand
    const genericMatch = prices.find(p => p.name.trim().toLowerCase() === cleanName && (!p.brand || p.brand.trim() === ""));
    if (genericMatch) return genericMatch.costPerUnit;

    // 3. Partial name match
    const partialMatch = prices.find(p => cleanName.includes(p.name.trim().toLowerCase()) || p.name.trim().toLowerCase().includes(cleanName));
    if (partialMatch) return partialMatch.costPerUnit;

    return 0;
  };

  const calculateRecipeCost = (recipe: Recipe, customMult: number = 1): CostCalculationResult => {
    let totalIngredientCost = 0;
    const breakdown: CostCalculationResult["breakdown"] = [];

    recipe.sections.forEach(section => {
      section.ingredients.forEach(ing => {
        const scaledAmount = ing.amount * customMult;
        const unitPrice = getPriceForIngredient(ing.name, ing.brand);
        const total = scaledAmount * unitPrice;
        totalIngredientCost += total;
        breakdown.push({
          ingredientId: ing.id,
          name: ing.name,
          brand: ing.brand,
          amount: scaledAmount,
          unit: ing.unit,
          unitPrice,
          totalCost: total
        });
      });
    });

    const scaledYield = Math.max(1, (recipe.yieldCount || 1) * customMult);
    const packagingCost = recipe.yieldUnit.includes("กระปุก") || recipe.yieldUnit.includes("ถ้วย") || recipe.yieldUnit.includes("ชิ้น")
      ? scaledYield * costSettings.packagingCostPerUnit
      : costSettings.packagingCostPerUnit * customMult;

    const laborCost = (costSettings.laborRatePerHour * costSettings.prepTimeHours) * customMult;
    const overheadCost = (totalIngredientCost + packagingCost + laborCost) * (costSettings.overheadPercent / 100);
    const totalCost = totalIngredientCost + packagingCost + laborCost + overheadCost;
    const costPerPortion = totalCost / scaledYield;

    // Pricing formulas
    const suggestedPrice30 = costPerPortion / 0.3; // 30% food cost
    const suggestedPrice40 = costPerPortion / 0.4; // 40% food cost
    const suggestedPrice50 = costPerPortion / 0.5; // 50% food cost
    const customMarginPrice = costPerPortion / (1 - (costSettings.targetMargin / 100));

    return {
      recipeId: recipe.id,
      recipeName: recipe.name,
      totalIngredientCost,
      packagingCost,
      laborCost,
      overheadCost,
      totalCost,
      costPerPortion,
      suggestedPrice30,
      suggestedPrice40,
      suggestedPrice50,
      customMarginPrice,
      breakdown
    };
  };

  const getConsolidatedShoppingList = (): ShoppingListItem[] => {
    const itemMap: Record<string, ShoppingListItem> = {};

    Object.entries(shoppingSelection).forEach(([recipeId, config]) => {
      if (!config.selected || config.multiplier <= 0) return;
      const rec = recipes.find(r => r.id === recipeId);
      if (!rec) return;

      rec.sections.forEach(sec => {
        sec.ingredients.forEach(ing => {
          const key = (ing.name.trim() + "_" + (ing.brand || "").trim() + "_" + ing.unit.trim()).toLowerCase();
          const amount = ing.amount * config.multiplier;
          const unitPrice = getPriceForIngredient(ing.name, ing.brand);

          if (!itemMap[key]) {
            itemMap[key] = {
              key,
              name: ing.name,
              brand: ing.brand,
              totalAmount: 0,
              unit: ing.unit,
              estimatedCost: 0,
              checked: false,
              recipes: []
            };
          }

          itemMap[key].totalAmount += amount;
          itemMap[key].estimatedCost += amount * unitPrice;
          itemMap[key].recipes.push({
            recipeName: rec.name,
            amount,
            unit: ing.unit
          });
        });
      });
    });

    return Object.values(itemMap);
  };

  const toggleKitchenCheck = (ingredientId: string) => {
    setKitchenChecklist(prev => ({
      ...prev,
      [ingredientId]: !prev[ingredientId]
    }));
  };

  const clearKitchenChecklist = () => {
    setKitchenChecklist({});
  };

  const toggleFavorite = (recipeId: string) => {
    setFavorites(prev => prev.includes(recipeId) ? prev.filter(id => id !== recipeId) : [...prev, recipeId]);
  };

  const setShoppingItemMultiplier = (recipeId: string, mult: number, selected: boolean = true) => {
    setShoppingSelection(prev => ({
      ...prev,
      [recipeId]: {
        selected,
        multiplier: Math.max(0, mult)
      }
    }));
  };

  const toggleShoppingItemSelected = (recipeId: string) => {
    setShoppingSelection(prev => {
      const current = prev[recipeId] || { selected: false, multiplier: 1 };
      return {
        ...prev,
        [recipeId]: {
          ...current,
          selected: !current.selected
        }
      };
    });
  };

  const selectAllForShopping = () => {
    const updated: Record<string, { selected: boolean; multiplier: number }> = {};
    recipes.forEach(r => {
      updated[r.id] = { selected: true, multiplier: 1 };
    });
    setShoppingSelection(updated);
  };

  const clearShoppingList = () => {
    setShoppingSelection({});
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        prices,
        activeRecipeId,
        selectedRecipe,
        searchQuery,
        selectedCategory,
        multiplier,
        customYield,
        costSettings,
        kitchenChecklist,
        favorites,
        shoppingSelection,
        viewMode,
        setActiveRecipeId,
        setSearchQuery,
        setSelectedCategory,
        setMultiplier,
        setCustomYield,
        setViewMode,
        updateCostSettings,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        resetRecipes,
        updateIngredientBrand,
        updatePrice,
        addPrice,
        deletePrice,
        resetPrices,
        getPriceForIngredient,
        calculateRecipeCost,
        getConsolidatedShoppingList,
        toggleKitchenCheck,
        clearKitchenChecklist,
        toggleFavorite,
        setShoppingItemMultiplier,
        toggleShoppingItemSelected,
        selectAllForShopping,
        clearShoppingList,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipes must be used within a RecipeProvider");
  }
  return context;
};
