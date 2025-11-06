# 🎓 AI-Powered Interactive Learning Map Generator

An intelligent web application that transforms any topic into a visual, interactive learning roadmap using AI. Built with React, Node.js, and OpenAI's GPT model.

![Learning Map Generator](https://img.shields.io/badge/AI-Powered-blue) ![React](https://img.shields.io/badge/React-18.2-61dafb) ![Node.js](https://img.shields.io/badge/Node.js-18+-green)

## 🌟 Features

### Core Features
- ✨ **AI-Powered Content Generation**: Uses OpenAI's GPT model to generate comprehensive learning roadmaps
- 🗺️ **Interactive Visual Map**: Beautiful, interactive node-based visualization using React Flow
- 🎯 **Smart Organization**: Topics automatically organized into main branches and subtopics
- 📚 **Resource Recommendations**: Each node includes curated learning resources (articles, videos, courses, books)
- 🔍 **Node Details Panel**: Click any node to view detailed descriptions and resources

### Bonus Features
- 🎚️ **Level Filtering**: Filter content by beginner, intermediate, or advanced levels
- 📥 **JSON Export**: Export your learning roadmap as a JSON file for offline use
- 🔄 **Expandable Nodes**: Main topics expand to reveal related subtopics
- 🎨 **Visual Level Indicators**: Color-coded difficulty levels for easy navigation
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### Project Structure
```
assignment-fueler/
├── backend/                 # Node.js + Express API
│   ├── server.js           # Main server with AI integration
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment variables template
│
└── frontend/               # React + Vite application
    ├── src/
    │   ├── components/     # React components
    │   │   ├── TopicInput.jsx         # Topic input form
    │   │   ├── LearningMapFlow.jsx    # Main map visualization
    │   │   ├── CustomNode.jsx         # Custom node component
    │   │   └── NodeDetailsPanel.jsx   # Details sidebar
    │   ├── App.jsx         # Main application component
    │   └── main.jsx        # Application entry point
    ├── package.json        # Frontend dependencies
    └── vite.config.js      # Vite configuration
```

### Technology Stack

**Frontend:**
- React 18.2 - UI library
- React Flow 11.10 - Interactive node-based graphs
- Vite 5.0 - Build tool and dev server
- Axios - HTTP client

**Backend:**
- Node.js - Runtime environment
- Express 4.18 - Web framework
- OpenAI API 4.20 - AI integration
- CORS - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone or navigate to the project directory**
```bash
cd assignment-fueler
```

2. **Set up the Backend**
```bash
cd backend
npm install
```

3. **Configure Environment Variables**
```bash
# Copy the example environment file
copy .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=your_openai_api_key_here
```

4. **Set up the Frontend**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start the Backend Server** (in one terminal)
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

2. **Start the Frontend Development Server** (in another terminal)
```bash
cd frontend
npm run dev
# Application runs on http://localhost:3000
```

3. **Open your browser** and navigate to `http://localhost:3000`

## 📖 Usage Guide

### Generating a Learning Map

1. **Enter a Topic**: Type any subject you want to learn (e.g., "Machine Learning", "Web Development")
2. **Select Learning Level** (Optional): Choose beginner, intermediate, advanced, or all levels
3. **Click Generate**: The AI will create a comprehensive learning roadmap
4. **Explore the Map**: 
   - Click and drag to navigate
   - Scroll to zoom in/out
   - Click nodes to view details and resources

### Using the Interactive Features

- **Node Details**: Click any node to open the details panel with descriptions and resources
- **Level Filtering**: Use the dropdown to filter content by difficulty level
- **Export**: Click "Export as JSON" to download your learning roadmap
- **Navigation**: Use the minimap (bottom right) for quick navigation

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Generate Learning Map
```http
POST /api/generate
Content-Type: application/json

{
  "topic": "Machine Learning",
  "level": "beginner" // optional: "beginner" | "intermediate" | "advanced" | "all"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "topic": "Machine Learning",
    "description": "Overview of the topic",
    "nodes": [
      {
        "id": "ml_basics",
        "label": "ML Basics",
        "description": "Fundamental concepts",
        "level": "beginner",
        "resources": [
          {
            "title": "Introduction to ML",
            "url": "https://example.com",
            "type": "course"
          }
        ],
        "subtopics": [...]
      }
    ]
  },
  "timestamp": "2025-11-06T10:30:00.000Z"
}
```

#### Health Check
```http
GET /api/health
```

#### Get Example Topics
```http
GET /api/examples
```

## 🎨 Design Decisions

### 1. **AI Integration Strategy**
- **Choice**: OpenAI's GPT-3.5-turbo model
- **Rationale**: 
  - Cost-effective for educational content generation
  - Fast response times for better UX
  - Structured JSON output capabilities
- **Trade-off**: Could use GPT-4 for more detailed content, but at higher cost

### 2. **Visualization Library**
- **Choice**: React Flow
- **Rationale**:
  - Built specifically for React
  - Excellent performance with large graphs
  - Rich interactive features out of the box
  - Active community and good documentation
- **Alternative Considered**: D3.js (more complex, steeper learning curve)

### 3. **Circular Layout Algorithm**
- **Choice**: Custom circular positioning for main nodes
- **Rationale**:
  - Clear visual hierarchy (center → branches → subtopics)
  - Reduces edge crossings
  - Aesthetically pleasing and intuitive
- **Trade-off**: May require manual adjustment for very large graphs

### 4. **State Management**
- **Choice**: React hooks (useState, useMemo, useCallback)
- **Rationale**:
  - Sufficient for application complexity
  - No need for Redux/Context API overhead
  - Better performance with memoization
- **When to Upgrade**: If adding user authentication or persistent state

### 5. **Modular Component Design**
```
App.jsx (Main Container)
├── TopicInput.jsx (Form & Input)
├── LearningMapFlow.jsx (Visualization Logic)
│   ├── CustomNode.jsx (Node Rendering)
│   └── NodeDetailsPanel.jsx (Details Display)
```
**Benefits**: Easy to test, maintain, and extend

## 🚢 Deployment

### Deploy Backend (Render)

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
4. Add environment variable: `OPENAI_API_KEY`

### Deploy Frontend (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend directory: `cd frontend`
3. Deploy: `vercel --prod`
4. Update API endpoint in code to your Render backend URL

**Or use Vercel Dashboard:**
1. Import your GitHub repository
2. Set root directory to `frontend`
3. Framework Preset: Vite
4. Add environment variable for backend URL if needed

## 🧪 Testing

### Manual Testing Checklist
- [ ] Topic input validation
- [ ] AI response handling (success & errors)
- [ ] Node interactions (click, hover)
- [ ] Level filtering functionality
- [ ] JSON export feature
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### Example Test Topics
- Machine Learning
- Web Development
- Data Science
- Cloud Computing
- Digital Marketing
- Photography
- Cooking Techniques

## 🛠️ Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style
- ES6+ JavaScript
- Modular component design
- Clear, descriptive naming
- Comprehensive comments
- Consistent formatting

## 🔮 Future Enhancements

### Potential Features
1. **User Authentication**: Save and manage multiple learning maps
2. **Progress Tracking**: Mark completed topics and track learning journey
3. **Collaborative Maps**: Share and collaborate on learning paths
4. **Custom Resources**: Allow users to add their own resources
5. **AI Chat Integration**: Ask questions about specific topics
6. **Gamification**: Badges, streaks, and achievements
7. **Mobile App**: React Native version for iOS/Android
8. **Multiple AI Providers**: Support for different AI models

### Performance Optimizations
- Implement caching for AI responses
- Add database for storing generated maps
- Lazy loading for large graphs
- Progressive Web App (PWA) capabilities

## 📝 Environment Variables

### Backend (.env)
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
NODE_ENV=development
```

### Frontend (Optional)
```env
VITE_API_URL=http://localhost:5000
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Built with passion for the Fueler interview assignment.

## 🙏 Acknowledgments

- OpenAI for the powerful GPT API
- React Flow team for the excellent visualization library
- The React and Node.js communities

---

**Note**: This is a portfolio project demonstrating full-stack development skills, AI integration, and product thinking. It showcases:
- Clean, modular code architecture
- Modern React patterns and hooks
- RESTful API design
- AI/LLM integration
- Interactive data visualization
- User-centric design
- Comprehensive documentation

For any questions or feedback, please open an issue on GitHub.
