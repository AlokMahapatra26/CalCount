import { UserProfile, FoodItem, FoodEntry, DailyNutrition } from './types';
import { v4 as uuidv4 } from 'uuid';

export class StorageManager {
  private static getStorageKey(type: string): string {
    return `nutrition-tracker-${type}`;
  }

  static getUserProfile(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(this.getStorageKey('profile'));
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static saveUserProfile(profile: UserProfile): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.getStorageKey('profile'), JSON.stringify(profile));
  }

  static getFoodItems(): FoodItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.getStorageKey('foods'));
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveFoodItem(food: Omit<FoodItem, 'id' | 'createdAt'>): FoodItem {
    const newFood: FoodItem = {
      ...food,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    const foods = this.getFoodItems();
    foods.push(newFood);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getStorageKey('foods'), JSON.stringify(foods));
    }
    
    return newFood;
  }

  static updateFoodItem(id: string, updates: Partial<FoodItem>): void {
    const foods = this.getFoodItems();
    const index = foods.findIndex(f => f.id === id);
    if (index !== -1) {
      foods[index] = { ...foods[index], ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.getStorageKey('foods'), JSON.stringify(foods));
      }
    }
  }

  static deleteFoodItem(id: string): void {
    const foods = this.getFoodItems().filter(f => f.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getStorageKey('foods'), JSON.stringify(foods));
    }
  }

  static getFoodEntries(): FoodEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.getStorageKey('entries'));
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveFoodEntry(entry: Omit<FoodEntry, 'id' | 'createdAt'>): FoodEntry {
    const newEntry: FoodEntry = {
      ...entry,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    const entries = this.getFoodEntries();
    entries.push(newEntry);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getStorageKey('entries'), JSON.stringify(entries));
    }
    
    return newEntry;
  }

  static deleteFoodEntry(id: string): void {
    const entries = this.getFoodEntries().filter(e => e.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getStorageKey('entries'), JSON.stringify(entries));
    }
  }

  static exportAllData(): string {
    const profile = this.getUserProfile();
    const foods = this.getFoodItems();
    const entries = this.getFoodEntries();
    
    const csvData = [
      // Profile CSV
      'Profile Data',
      'Name,Age,Height(cm),Weight(kg),Lifestyle,Goal',
      profile ? `${profile.name},${profile.age},${profile.height},${profile.weight},${profile.lifestyle},${profile.goal}` : '',
      '',
      // Foods CSV
      'Food Items',
      'Name,Calories/100g,Protein/100g,Carbs/100g,Fat/100g',
      ...foods.map(f => `${f.name},${f.caloriesPer100g},${f.proteinPer100g},${f.carbsPer100g},${f.fatPer100g}`),
      '',
      // Entries CSV
      'Food Entries',
      'Food Name,Quantity(g),Meal Type,Date,Calories,Protein,Carbs,Fat',
      ...entries.map(e => {
        const food = foods.find(f => f.id === e.foodId);
        if (!food) return '';
        const multiplier = e.quantity / 100;
        return `${food.name},${e.quantity},${e.mealType},${e.date},${food.caloriesPer100g * multiplier},${food.proteinPer100g * multiplier},${food.carbsPer100g * multiplier},${food.fatPer100g * multiplier}`;
      }).filter(Boolean)
    ].join('\n');
    
    return csvData;
  }

  static clearAllData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.getStorageKey('profile'));
    localStorage.removeItem(this.getStorageKey('foods'));
    localStorage.removeItem(this.getStorageKey('entries'));
  }
}
