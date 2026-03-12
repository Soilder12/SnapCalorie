import { UserProfile } from '../types';

export function calculateBMR(profile: UserProfile): number {
  // Mifflin-St Jeor Equation
  const { weight, height, age, gender } = profile;
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  return bmr;
}

export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };
  return bmr * activityMultipliers[profile.activityLevel];
}

export const EXERCISE_DB = [
  { id: '1', name: '步行 (慢速)', met: 2.5 },
  { id: '2', name: '步行 (中速)', met: 3.5 },
  { id: '3', name: '步行 (快速)', met: 4.3 },
  { id: '4', name: '跑步 (慢跑)', met: 7.0 },
  { id: '5', name: '跑步 (中速)', met: 9.8 },
  { id: '6', name: '骑自行车 (休闲)', met: 4.0 },
  { id: '7', name: '骑自行车 (中速)', met: 8.0 },
  { id: '8', name: '游泳 (自由泳)', met: 8.3 },
  { id: '9', name: '瑜伽', met: 2.5 },
  { id: '10', name: '力量训练 (举重)', met: 3.5 },
  { id: '11', name: '跳绳 (中速)', met: 10.0 },
  { id: '12', name: '篮球', met: 6.0 },
  { id: '13', name: '羽毛球', met: 5.5 },
  { id: '14', name: '网球', met: 7.3 },
  { id: '15', name: '有氧操', met: 6.5 },
];

export function calculateExerciseCalories(met: number, weightKg: number, durationMinutes: number): number {
  // Calories burned = MET * weight (kg) * duration (hours)
  return met * weightKg * (durationMinutes / 60);
}
