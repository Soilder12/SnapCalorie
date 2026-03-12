export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
export type Gender = 'male' | 'female';

export interface UserProfile {
  gender: Gender;
  age: number;
  height: number; // cm
  weight: number; // kg
  activityLevel: ActivityLevel;
  targetWeightLoss: number; // kg
  targetMonths: number; // months
  tdee: number;
}

export interface WeightLossPlan {
  dailyTotal: number;
  breakfastCal: number;
  lunchCal: number;
  dinnerCal: number;
  tips: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

export interface MealRecord {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food: FoodItem;
  amount: number; // multiplier of servingSize
}

export interface ExerciseRecord {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  duration: number; // minutes
  caloriesBurned: number;
}
