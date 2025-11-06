import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('Testing Gemini API...');
console.log('API Key (first 10 chars):', API_KEY?.substring(0, 10) + '...');

async function testAPI() {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Try listing models
    console.log('\n🔍 Attempting to list available models...');
    
    // Try different model names
    const modelNamesToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest',
      'models/gemini-pro',
      'models/gemini-1.5-flash'
    ];
    
    for (const modelName of modelNamesToTry) {
      try {
        console.log(`\n📝 Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say hello');
        const response = await result.response;
        const text = response.text();
        console.log(`✅ SUCCESS with ${modelName}:`, text.substring(0, 50));
        break; // Stop on first success
      } catch (error) {
        console.log(`❌ Failed with ${modelName}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testAPI();
