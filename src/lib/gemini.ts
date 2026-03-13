import { UserProfile, WeightLossPlan, FoodItem } from '../types';

const SILICONFLOW_API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const SILICONFLOW_API_KEY = process.env.SILICONFLOW_API_KEY;

// 文本模型：用于生成减重计划
const TEXT_MODEL = 'Qwen/Qwen2.5-72B-Instruct';
// 视觉模型（VLM）：用于识别食物图片
const VLM_MODEL = 'Qwen/Qwen2.5-VL-72B-Instruct';

async function callSiliconFlow(model: string, messages: object[], jsonSchema?: object): Promise<string> {
  if (!SILICONFLOW_API_KEY) {
    throw new Error('SILICONFLOW_API_KEY environment variable is required');
  }

  const body: Record<string, unknown> = {
    model,
    messages,
    max_tokens: 1024,
  };

  if (jsonSchema) {
    body.response_format = {
      type: 'json_schema',
      json_schema: {
        name: 'response',
        strict: true,
        schema: jsonSchema,
      },
    };
  }

  const res = await fetch(SILICONFLOW_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SILICONFLOW_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`SiliconFlow API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from SiliconFlow API');
  return content as string;
}

export async function generateWeightLossPlan(profile: UserProfile): Promise<WeightLossPlan> {
  const prompt = `
    我是一位${profile.age}岁的${profile.gender === 'male' ? '男性' : '女性'}，
    身高${profile.height}cm，体重${profile.weight}kg。
    我的活动水平是${profile.activityLevel}，计算出的TDEE是${Math.round(profile.tdee)}大卡。
    我的减重目标是：在${profile.targetMonths}个月内减去${profile.targetWeightLoss}斤。
    请为我生成一份科学的每日热量摄入计划，包括每日总热量推荐，以及早、中、晚三餐的具体卡路里分配。
    请提供一些实用的饮食建议。
    请严格按照JSON格式返回，包含字段：dailyTotal（每日总热量，数字）、breakfastCal（早餐热量，数字）、lunchCal（午餐热量，数字）、dinnerCal（晚餐热量，数字）、tips（饮食建议，字符串）。
  `;

  const schema = {
    type: 'object',
    properties: {
      dailyTotal: { type: 'number', description: '每日推荐总热量' },
      breakfastCal: { type: 'number', description: '早餐推荐热量' },
      lunchCal: { type: 'number', description: '午餐推荐热量' },
      dinnerCal: { type: 'number', description: '晚餐推荐热量' },
      tips: { type: 'string', description: '饮食建议' },
    },
    required: ['dailyTotal', 'breakfastCal', 'lunchCal', 'dinnerCal', 'tips'],
    additionalProperties: false,
  };

  const messages = [{ role: 'user', content: prompt }];
  const text = await callSiliconFlow(TEXT_MODEL, messages, schema);
  // 尝试解析JSON，兼容模型返回markdown代码块的情况
  const jsonStr = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  return JSON.parse(jsonStr) as WeightLossPlan;
}

export async function recognizeFood(base64Image: string, mimeType: string): Promise<FoodItem> {
  const prompt = `
    请识别图片中的食物，并估算其热量和三大宏量营养素（蛋白质、碳水化合物、脂肪）。
    假设图片中的食物为一份标准份量。
    请严格按照JSON格式返回，包含字段：name（食物名称）、calories（估算热量大卡，数字）、protein（蛋白质克，数字）、carbs（碳水化合物克，数字）、fat（脂肪克，数字）、servingSize（份量描述如"1碗"）。
  `;

  // 确保 base64 数据不含 Data URL 前缀
  const pureBase64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string', description: '食物名称' },
      calories: { type: 'number', description: '估算热量（大卡）' },
      protein: { type: 'number', description: '估算蛋白质（克）' },
      carbs: { type: 'number', description: '估算碳水化合物（克）' },
      fat: { type: 'number', description: '估算脂肪（克）' },
      servingSize: { type: 'string', description: '份量描述' },
    },
    required: ['name', 'calories', 'protein', 'carbs', 'fat', 'servingSize'],
    additionalProperties: false,
  };

  const messages = [
    {
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: {
            url: `data:${mimeType};base64,${pureBase64}`,
          },
        },
        { type: 'text', text: prompt },
      ],
    },
  ];

  const text = await callSiliconFlow(VLM_MODEL, messages, schema);
  const jsonStr = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  const data = JSON.parse(jsonStr);
  return {
    id: Date.now().toString(),
    ...data,
  };
}
