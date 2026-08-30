export type RecipeCategory = "cake" | "cream" | "sauce" | "chocolate" | "pie" | "base" | "all";

export interface Ingredient {
  id: string;
  name: string;
  brand: string; // editable by user
  amount: number;
  unit: string;
  note?: string;
  checked?: boolean;
}

export interface RecipeSection {
  id: string;
  title: string;
  ingredients: Ingredient[];
  instruction?: string;
  prepTimeMinutes?: number;
}

export interface Recipe {
  id: string;
  name: string;
  category: "cake" | "cream" | "sauce" | "chocolate" | "pie" | "base";
  categoryLabel: string;
  yieldCount: number;
  yieldUnit: string;
  emoji: string;
  themeColor: string;
  description: string;
  sheetGid: string;
  sections: RecipeSection[];
  tips?: string[];
  bakingInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IngredientMasterPrice {
  id: string;
  name: string;
  brand: string;
  packPrice: number; // e.g. 150 บาท
  packSize: number;  // e.g. 500
  packUnit: string;  // e.g. กรัม
  costPerUnit: number; // packPrice / packSize
  notes?: string;
  updatedAt: string;
}

export interface CostCalculationResult {
  recipeId: string;
  recipeName: string;
  totalIngredientCost: number;
  packagingCost: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  costPerPortion: number;
  suggestedPrice30: number; // 30% food cost
  suggestedPrice40: number; // 40% food cost
  suggestedPrice50: number; // 50% food cost
  customMarginPrice: number;
  breakdown: {
    ingredientId: string;
    name: string;
    brand: string;
    amount: number;
    unit: string;
    unitPrice: number;
    totalCost: number;
  }[];
}

export interface ShoppingListItem {
  key: string;
  name: string;
  brand: string;
  totalAmount: number;
  unit: string;
  estimatedCost: number;
  checked: boolean;
  recipes: { recipeName: string; amount: number; unit: string }[];
}
