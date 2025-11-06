# Quick Start Guide

Get the AI Learning Map Generator running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- OpenAI API key

## Step-by-Step Setup

### 1️⃣ Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-...`)
5. Store it safely - you'll need it in step 3

### 2️⃣ Install Dependencies

Open PowerShell and run:

```powershell
# Navigate to project directory
cd "C:\Users\AMAN KUMAR SINGH\OneDrive\Desktop\assignment-fueler"

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..\frontend
npm install
```

### 3️⃣ Configure Environment

```powershell
# Go to backend directory
cd ..\backend

# Create .env file from template
copy .env.example .env

# Open .env in notepad
notepad .env
```

In the `.env` file, replace `your_openai_api_key_here` with your actual API key:

```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
PORT=5000
NODE_ENV=development
```

Save and close the file.

### 4️⃣ Start the Application

You'll need TWO terminal windows.

**Terminal 1 - Backend:**
```powershell
cd "C:\Users\AMAN KUMAR SINGH\OneDrive\Desktop\assignment-fueler\backend"
npm start
```

You should see:
```
🚀 Learning Map API server running on port 5000
📍 Health check: http://localhost:5000/api/health
📍 Generate endpoint: http://localhost:5000/api/generate
```

**Terminal 2 - Frontend:**
```powershell
cd "C:\Users\AMAN KUMAR SINGH\OneDrive\Desktop\assignment-fueler\frontend"
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 5️⃣ Open the Application

Open your browser and go to: **http://localhost:3000**

## First Use

1. **Enter a topic** in the input field (try "Machine Learning")
2. **Select a level** (optional) - try "All Levels" first
3. **Click "Generate Learning Map"**
4. Wait 5-10 seconds for AI to generate your roadmap
5. **Explore!** 
   - Click nodes to see details
   - Drag to pan around
   - Scroll to zoom
   - Use the minimap to navigate

## Troubleshooting

### "Cannot find module"
```powershell
# Make sure you installed dependencies
cd backend
npm install
cd ..\frontend
npm install
```

### "Port 5000 is already in use"
Edit `backend/.env` and change PORT to something else:
```env
PORT=5001
```

Then update `frontend/vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5001',  // Changed from 5000
    changeOrigin: true,
  },
},
```

### "Invalid API Key"
- Check your `.env` file has the correct key
- Make sure there are no spaces or quotes around the key
- Verify the key is active at https://platform.openai.com/api-keys
- Restart the backend server after updating `.env`

### "CORS Error"
- Make sure backend is running on port 5000
- Frontend should automatically proxy `/api` requests
- Try restarting both servers

### Backend won't start
```powershell
# Check if Node.js is installed
node --version
# Should show v18.0.0 or higher

# Check if you're in the right directory
pwd
# Should end with \backend
```

### Frontend won't start
```powershell
# Check if you're in the right directory
pwd
# Should end with \frontend

# Clear Vite cache and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

## Common Issues

### Slow AI Response
- Normal: 5-10 seconds
- OpenAI free tier may be slower
- Complex topics take longer
- Check your internet connection

### Map looks crowded
- Try filtering by level (beginner/intermediate/advanced)
- Use zoom controls to focus on specific areas
- Click nodes to see details in the panel instead

### Can't see all nodes
- Use the minimap (bottom right)
- Drag to pan around
- Zoom out to see overview
- Check level filter isn't hiding nodes

## Next Steps

Once everything is working:

1. ✅ Try different topics
2. ✅ Experiment with level filtering
3. ✅ Export a roadmap as JSON
4. ✅ Explore the interactive features
5. ✅ Read the full README.md
6. ✅ Check out DESIGN_DECISIONS.md
7. ✅ Review deployment options in DEPLOYMENT.md

## Development Commands

### Backend
```powershell
npm start          # Start production server
npm run dev        # Start with auto-reload (requires nodemon)
```

### Frontend
```powershell
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Production Deployment

When ready to deploy:

1. Read `DEPLOYMENT.md` for detailed instructions
2. Deploy backend to Render.com (free)
3. Deploy frontend to Vercel.com (free)
4. Update environment variables
5. Test the live application

## Getting Help

- Check README.md for full documentation
- Review API_INTEGRATION.md for AI details
- Read DESIGN_DECISIONS.md for architecture
- Check DEPLOYMENT.md for hosting

## Success! 🎉

If you can:
- ✅ Enter a topic
- ✅ Generate a learning map
- ✅ See interactive nodes
- ✅ Click nodes for details
- ✅ Filter by level
- ✅ Export as JSON

**You're all set!** The application is working correctly.

---

**Happy Learning! 🎓**
