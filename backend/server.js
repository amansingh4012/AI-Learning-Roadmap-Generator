import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Google Gemini
let genAI = null;
let model = null;
const USE_DEMO_MODE = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here' || process.env.USE_DEMO_MODE === 'true';

if (!USE_DEMO_MODE) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Using gemini-2.5-flash (latest available model for this API key)
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    console.log('✅ Google Gemini API configured with gemini-2.5-flash (FREE!)');
  } catch (error) {
    console.warn('⚠️  Gemini initialization failed, using demo mode');
    console.error(error);
  }
}

if (USE_DEMO_MODE) {
  console.log('🎭 Running in DEMO MODE - using mock data (no API key required)');
}

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware for production debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Serve static files from the React app (for production)
const frontendPath = path.join(__dirname, '../frontend/dist');
console.log('📁 Static files path:', frontendPath);
app.use(express.static(frontendPath));

/**
 * Generate demo learning map data (used when OpenAI API is not available)
 * @param {string} topic - The topic to generate a learning map for
 * @param {string} level - Optional learning level filter
 * @returns {Object} Structured learning map data
 */
function generateDemoLearningMap(topic, level = 'all') {
  const demoMaps = {
    'Machine Learning': {
      topic: 'Machine Learning',
      description: 'Machine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.',
      nodes: [
        {
          id: 'ml_fundamentals',
          label: 'ML Fundamentals',
          description: 'Understanding the core concepts, types of ML, and basic mathematics required for machine learning.',
          level: 'beginner',
          resources: [
            { title: 'Introduction to Machine Learning', url: 'https://www.coursera.org/learn/machine-learning', type: 'course' },
            { title: 'Machine Learning Crash Course', url: 'https://developers.google.com/machine-learning/crash-course', type: 'course' }
          ],
          subtopics: [
            {
              id: 'ml_types',
              label: 'Types of ML',
              description: 'Supervised, unsupervised, and reinforcement learning approaches.',
              level: 'beginner',
              resources: [
                { title: 'Understanding ML Types', url: 'https://towardsdatascience.com/types-of-machine-learning', type: 'article' }
              ]
            },
            {
              id: 'ml_math',
              label: 'Math Foundations',
              description: 'Linear algebra, calculus, and statistics for ML.',
              level: 'beginner',
              resources: [
                { title: 'Mathematics for ML', url: 'https://mml-book.github.io/', type: 'book' }
              ]
            }
          ]
        },
        {
          id: 'supervised_learning',
          label: 'Supervised Learning',
          description: 'Learning from labeled data to make predictions.',
          level: 'intermediate',
          resources: [
            { title: 'Supervised Learning Guide', url: 'https://scikit-learn.org/stable/supervised_learning.html', type: 'article' },
            { title: 'Practical ML with Python', url: 'https://www.youtube.com/watch?v=7eh4d6sabA0', type: 'video' }
          ],
          subtopics: [
            {
              id: 'regression',
              label: 'Regression',
              description: 'Predicting continuous values using various regression techniques.',
              level: 'intermediate',
              resources: [
                { title: 'Linear Regression Tutorial', url: 'https://realpython.com/linear-regression-in-python/', type: 'article' }
              ]
            },
            {
              id: 'classification',
              label: 'Classification',
              description: 'Categorizing data into predefined classes.',
              level: 'intermediate',
              resources: [
                { title: 'Classification Algorithms', url: 'https://www.datacamp.com/tutorial/classification', type: 'article' }
              ]
            }
          ]
        },
        {
          id: 'deep_learning',
          label: 'Deep Learning',
          description: 'Neural networks with multiple layers for complex pattern recognition.',
          level: 'advanced',
          resources: [
            { title: 'Deep Learning Specialization', url: 'https://www.coursera.org/specializations/deep-learning', type: 'course' },
            { title: 'Deep Learning Book', url: 'https://www.deeplearningbook.org/', type: 'book' }
          ],
          subtopics: [
            {
              id: 'neural_networks',
              label: 'Neural Networks',
              description: 'Understanding artificial neural network architectures.',
              level: 'advanced',
              resources: [
                { title: 'Neural Networks from Scratch', url: 'https://www.youtube.com/watch?v=aircAruvnKk', type: 'video' }
              ]
            },
            {
              id: 'cnns',
              label: 'CNNs',
              description: 'Convolutional Neural Networks for image processing.',
              level: 'advanced',
              resources: [
                { title: 'CNN Architecture Guide', url: 'https://cs231n.github.io/', type: 'article' }
              ]
            }
          ]
        }
      ]
    }
  };

  // Get demo data or create generic one
  const demoData = demoMaps[topic] || {
    topic: topic,
    description: `This is a demo learning roadmap for ${topic}. For full AI-generated content, please configure your OpenAI API key.`,
    nodes: [
      {
        id: 'basics',
        label: `${topic} Basics`,
        description: `Introduction to fundamental concepts in ${topic}.`,
        level: 'beginner',
        resources: [
          { title: `Introduction to ${topic}`, url: '#', type: 'article' },
          { title: `${topic} Fundamentals Course`, url: '#', type: 'course' }
        ],
        subtopics: [
          {
            id: 'basics_sub1',
            label: 'Core Concepts',
            description: `Understanding the core principles of ${topic}.`,
            level: 'beginner',
            resources: [{ title: 'Core Concepts Guide', url: '#', type: 'article' }]
          }
        ]
      },
      {
        id: 'intermediate',
        label: `Intermediate ${topic}`,
        description: `Building on the basics with more advanced topics.`,
        level: 'intermediate',
        resources: [
          { title: `Advanced ${topic} Tutorial`, url: '#', type: 'video' }
        ],
        subtopics: []
      },
      {
        id: 'advanced',
        label: `Advanced ${topic}`,
        description: `Expert-level concepts and best practices.`,
        level: 'advanced',
        resources: [
          { title: `Mastering ${topic}`, url: '#', type: 'book' }
        ],
        subtopics: []
      }
    ]
  };

  return demoData;
}

/**
 * Generate a structured learning roadmap using AI
 * @param {string} topic - The topic to generate a learning map for
 * @param {string} level - Optional learning level filter
 * @returns {Object} Structured learning map data
 */
async function generateLearningMap(topic, level = 'all') {
  // Use demo mode if Gemini is not available
  if (USE_DEMO_MODE || !model) {
    console.log(`📚 Generating demo map for: ${topic}`);
    return generateDemoLearningMap(topic, level);
  }

  try {
    console.log('🤖 Calling Gemini API...');
    const levelFilter = level !== 'all' ? `Focus on ${level} level content.` : '';
    
    const prompt = `Create a comprehensive learning roadmap for the topic: "${topic}".
    
${levelFilter}

Return a JSON object with the following structure:
{
  "topic": "main topic name",
  "description": "brief overview of the topic",
  "nodes": [
    {
      "id": "unique_id",
      "label": "Node Title",
      "description": "Detailed description of this concept",
      "level": "beginner|intermediate|advanced",
      "resources": [
        {"title": "Resource name", "url": "resource link", "type": "article|video|course|book"}
      ],
      "subtopics": [
        {
          "id": "sub_unique_id",
          "label": "Subtopic Title",
          "description": "Description of subtopic",
          "level": "beginner|intermediate|advanced",
          "resources": [...]
        }
      ]
    }
  ]
}

Guidelines:
- Create 5-8 main nodes representing major branches/subtopics
- Each main node should have 2-4 subtopics
- Include practical, real resources (courses, articles, videos)
- Assign appropriate difficulty levels
- Make descriptions clear and actionable
- Organize in a logical learning progression

Return ONLY the JSON object, no additional text.`;

    // Use Google Gemini's free API
    console.log('📤 Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    console.log('📥 Received response from Gemini');
    
    const response = await result.response;
    
    if (!response) {
      throw new Error('No response received from Gemini API');
    }
    
    let responseText = response.text().trim();
    
    if (!responseText) {
      throw new Error('Empty response received from Gemini API');
    }
    
    console.log('📝 Response length:', responseText.length, 'characters');
    console.log('📝 First 200 chars:', responseText.substring(0, 200));
    
    // Remove markdown code blocks if present
    if (responseText.startsWith('```')) {
      console.log('🧹 Removing markdown code blocks...');
      responseText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      console.log('📝 Cleaned response, first 100 chars:', responseText.substring(0, 100));
    }
    
    // Parse the JSON response
    let learningMap;
    try {
      console.log('🔄 Attempting to parse JSON...');
      learningMap = JSON.parse(responseText);
      console.log('✅ JSON parsed successfully! Nodes count:', learningMap.nodes?.length);
    } catch (parseError) {
      console.log('⚠️  Direct JSON parse failed, trying to extract...');
      console.log('Parse error:', parseError.message);
      
      // Try to extract JSON if there's extra text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        learningMap = JSON.parse(jsonMatch[0]);
        console.log('✅ JSON extracted and parsed! Nodes count:', learningMap.nodes?.length);
      } else {
        console.error('❌ Failed to extract JSON from response');
        console.error('Response text:', responseText.substring(0, 500));
        throw new Error('Failed to parse AI response as JSON');
      }
    }
    
    // Validate the structure
    if (!learningMap.topic || !learningMap.nodes || !Array.isArray(learningMap.nodes)) {
      console.error('❌ Invalid learning map structure:', learningMap);
      throw new Error('Invalid learning map structure received from AI');
    }

    console.log('✅ Validation passed! Returning learning map');
    return learningMap;
  } catch (error) {
    console.error('❌ Error generating learning map with Gemini:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    // If API error, fall back to demo mode
    console.warn('⚠️  Gemini API error, falling back to demo mode');
    return generateDemoLearningMap(topic, level);
  }
}

// Routes

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Learning Map API is running',
    mode: USE_DEMO_MODE ? 'demo' : 'ai',
    aiProvider: 'Google Gemini (FREE)',
    note: USE_DEMO_MODE ? 'Using demo data. Configure GEMINI_API_KEY for AI-generated content.' : 'Using Google Gemini API (Free)'
  });
});

/**
 * Generate learning map endpoint
 * POST /api/generate
 * Body: { topic: string, level?: string }
 */
app.post('/api/generate', async (req, res) => {
  try {
    const { topic, level = 'all' } = req.body;

    if (!topic || topic.trim() === '') {
      return res.status(400).json({ 
        success: false,
        error: 'Topic is required',
        message: 'Please provide a topic to generate a learning map'
      });
    }

    console.log(`\n🎯 Generating learning map for topic: ${topic}, level: ${level}`);

    const learningMap = await generateLearningMap(topic, level);

    console.log('✅ Learning map generated successfully!');
    console.log('📊 Data:', {
      topic: learningMap.topic,
      nodeCount: learningMap.nodes?.length,
      hasDescription: !!learningMap.description
    });

    res.json({
      success: true,
      data: learningMap,
      timestamp: new Date().toISOString()
    });
    
    console.log('📤 Response sent to client\n');

  } catch (error) {
    console.error('❌ Error in /api/generate:', error);
    console.error('❌ Error stack:', error.stack);
    
    // Ensure we always send a JSON response
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate learning map',
        message: error.message || 'Unknown error occurred',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
});

/**
 * Get example topics endpoint
 */
app.get('/api/examples', (req, res) => {
  const examples = [
    'Machine Learning',
    'Web Development',
    'Data Science',
    'Cloud Computing',
    'Mobile App Development',
    'Blockchain Technology',
    'Cybersecurity',
    'Digital Marketing'
  ];
  
  res.json({ examples });
});

// Serve React app for all non-API routes (must be after API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Learning Map API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Generate endpoint: http://localhost:${PORT}/api/generate`);
});

export default app;
