import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';
import { UserProfile, WeightLossPlan, MealRecord, ExerciseRecord } from '../types';

interface AppState {
  profile: UserProfile | null;
  plan: WeightLossPlan | null;
  meals: MealRecord[];
  exercises: ExerciseRecord[];
  setProfile: (profile: UserProfile) => void;
  setPlan: (plan: WeightLossPlan) => void;
  addMeal: (meal: MealRecord) => void;
  removeMeal: (id: string) => void;
  addExercise: (exercise: ExerciseRecord) => void;
  removeExercise: (id: string) => void;
  clearData: () => void;
}

const storage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await localforage.getItem(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await localforage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await localforage.removeItem(name);
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      plan: null,
      meals: [],
      exercises: [],
      setProfile: (profile) => set({ profile }),
      setPlan: (plan) => set({ plan }),
      addMeal: (meal) => set((state) => ({ meals: [...state.meals, meal] })),
      removeMeal: (id) => set((state) => ({ meals: state.meals.filter((m) => m.id !== id) })),
      addExercise: (exercise) => set((state) => ({ exercises: [...state.exercises, exercise] })),
      removeExercise: (id) => set((state) => ({ exercises: state.exercises.filter((e) => e.id !== id) })),
      clearData: () => set({ profile: null, plan: null, meals: [], exercises: [] }),
    }),
    {
      name: 'snapcalorie-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
