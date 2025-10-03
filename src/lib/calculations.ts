// lib/calculations.ts
import { UserProfile, NutritionGoals, BMIResult } from './types';

export function calculateBMI(height: number, weight: number): BMIResult {
  const heightInM = height / 100;
  const bmi = weight / (heightInM * heightInM);
  
  let category: BMIResult['category'];
  if (bmi < 18.5) category = 'underweight';
  else if (bmi < 25) category = 'normal';
  else if (bmi < 30) category = 'overweight';
  else category = 'obese';

  return { bmi: Math.round(bmi * 10) / 10, category };
}

export function calculateNutritionGoals(profile: UserProfile): NutritionGoals {
  // Return manual goals if set
  if (profile.manualGoals) {
    return { ...profile.manualGoals, isManual: true };
  }

  const { weight, height, age, lifestyle, goal } = profile;
  
  // Calculate BMR using Mifflin-St Jeor Equation
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // For males (simplified)
  
  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  
  let tdee = bmr * activityMultipliers[lifestyle];
  
  // Adjust based on goal
  let calories: number;
  let protein: number;
  let fat: number;
  let carbs: number;

  switch (goal) {
    case 'lose':
      calories = Math.round(tdee - 500); // 500 calorie deficit
      protein = Math.round(weight * 2.4); // Higher protein for muscle preservation
      fat = Math.round(calories * 0.25 / 9); // 25% from fat
      carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);
      break;

    case 'gain':
      calories = Math.round(tdee + 500); // 500 calorie surplus for weight gain
      protein = Math.round(weight * 2.0); // 2g per kg
      fat = Math.round(calories * 0.25 / 9); // 25% from fat
      carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);
      break;

    case 'gain_muscle':
      calories = Math.round(tdee + 300); // Smaller surplus for lean bulk
      protein = Math.round(weight * 2.2); // Higher protein for muscle synthesis
      fat = Math.round(calories * 0.25 / 9); // 25% from fat
      carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);
      break;

    case 'maintain':
    default:
      calories = Math.round(tdee);
      protein = Math.round(weight * 2.0);
      fat = Math.round(calories * 0.25 / 9);
      carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);
      break;
  }
  
  return { calories, protein, carbs, fat, isManual: false };
}
