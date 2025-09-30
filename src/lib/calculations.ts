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
  if (goal === 'lose') tdee -= 500; // 500 calorie deficit
  else if (goal === 'gain') tdee += 500; // 500 calorie surplus
  
  const calories = Math.round(tdee);
  const protein = Math.round(weight * 2.2); // 2.2g per kg body weight
  const fat = Math.round(calories * 0.25 / 9); // 25% of calories from fat
  const carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4); // Remaining calories from carbs
  
  return { calories, protein, carbs, fat };
}
