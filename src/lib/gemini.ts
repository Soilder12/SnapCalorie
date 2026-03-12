import { GoogleGenAI, Type } from '@google/genai';
import { UserProfile, WeightLossPlan, FoodItem } from '../types';

let ai: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

export async function generateWeightLossPlan(profile: UserProfile): Promise<WeightLossPlan> {
  const client = getGeminiClient();
  const prompt = `
    我是一位${profile.age}岁的${profile.gender === 'male' ? '男性' : '女性'}，
    身高${profile.height}cm，体重${profile.weight}kg。
    我的活动水平是${profile.activityLevel}，计算出的TDEE是${Math.round(profile.tdee)}大卡。
    我的减重目标是：在${profile.targetMonths}个月内减去${profile.targetWeightLoss}斤。
    请为我生成一份科学的每日热量摄入计划，包括每日总热量推荐，以及早、中、晚三餐的具体卡路里分配。
    请提供一些实用的饮食建议。
  `;

  const response = await client.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dailyTotal: { type: Type.NUMBER, description: '每日推荐总热量' },
          breakfastCal: { type: Type.NUMBER, description: '早餐推荐热量' },
          lunchCal: { type: Type.NUMBER, description: '午餐推荐热量' },
          dinnerCal: { type: Type.NUMBER, description: '晚餐推荐热量' },
          tips: { type: Type.STRING, description: '饮食建议' },
        },
        required: ['dailyTotal', 'breakfastCal', 'lunchCal', 'dinnerCal', 'tips'],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error('Failed to generate plan');
  return JSON.parse(text) as WeightLossPlan;
}

export async function recognizeFood(base64Image: string, mimeType: string): Promise<FoodItem> {
  const client = getGeminiClient();
  const prompt = `
    请识别图片中的食物，并估算其热量和三大宏量营养素（蛋白质、碳水化合物、脂肪）。
    假设图片中的食物为一份标准份量。
  `;

  const response = await client.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1] || base64Image,
            mimeType,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: '食物名称' },
          calories: { type: Type.NUMBER, description: '估算热量（大卡）' },
          protein: { type: Type.NUMBER, description: '估算蛋白质（克）' },
          carbs: { type: Type.NUMBER, description: '估算碳水化合物（克）' },
          fat: { type: Type.NUMBER, description: '估算脂肪（克）' },
          servingSize: { type: Type.STRING, description: '份量描述，如"1碗", "1个", "100克"' },
        },
        required: ['name', 'calories', 'protein', 'carbs', 'fat', 'servingSize'],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error('Failed to recognize food');
  const data = JSON.parse(text);
  return {
    id: Date.now().toString(),
    ...data,
  };
}
