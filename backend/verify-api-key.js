import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('🔐 API Key Verification\n');
console.log('API Key exists:', !!API_KEY);
console.log('API Key length:', API_KEY?.length);
console.log('API Key format:', API_KEY?.substring(0, 15) + '...');
console.log('\n📋 Checking API key format:');

if (!API_KEY) {
  console.log('❌ No API key found!');
} else if (API_KEY === 'your_gemini_api_key_here') {
  console.log('❌ Default placeholder key detected!');
} else if (!API_KEY.startsWith('AIzaSy')) {
  console.log('⚠️  API key doesn\'t start with "AIzaSy" - may be invalid format');
} else if (API_KEY.length !== 39) {
  console.log(`⚠️  API key length is ${API_KEY.length}, expected 39 characters`);
} else {
  console.log('✅ API key format looks valid');
}

console.log('\n🔄 Next steps:');
console.log('1. Verify your API key at: https://aistudio.google.com/app/apikey');
console.log('2. Make sure the API key has "Generative Language API" enabled');
console.log('3. Try regenerating a new API key if this one doesn\'t work');
console.log('4. Check if there are any restrictions on the API key');

// Try making a direct fetch request
console.log('\n🌐 Testing direct API access...');

const testUrl = `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`;

try {
  const response = await fetch(testUrl);
  const data = await response.json();
  
  if (response.ok) {
    console.log('✅ API key is valid! Available models:');
    if (data.models) {
      data.models.forEach(model => {
        console.log(`  - ${model.name} (${model.displayName})`);
      });
    }
  } else {
    console.log('❌ API request failed:');
    console.log('Status:', response.status, response.statusText);
    console.log('Error:', data);
  }
} catch (error) {
  console.log('❌ Network error:', error.message);
}
