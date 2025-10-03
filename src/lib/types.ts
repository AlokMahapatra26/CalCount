export interface UserProfile {
  id: string;
  name: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  lifestyle: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain' | 'gain_muscle';
  createdAt: string;
  updatedAt: string;
  manualGoals?: NutritionGoals; // Optional manual override
}
export interface NutritionGoals {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  isManual?: boolean; // Track if goals are manually set
}

export interface FoodItem {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  createdAt: string;
}

export interface FoodEntry {
  id: string;
  foodId: string;
  quantity: number; // in grams
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string; // YYYY-MM-DD format
  createdAt: string;
}

export interface DailyNutrition {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  entries: FoodEntry[];
}

export interface BMIResult {
  bmi: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
}
