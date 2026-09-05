# Interview Cracker

Interview Cracker is an AI-powered mock interview platform. Users paste a job description, and our system generates tailored interview questions based on the role's requirements. After answering questions through a chat-style interface (supporting text or voice input), users receive detailed feedback on their responses evaluated across content accuracy and communication clarity, culminating in a comprehensive summary report.

## Project Structure

- **frontend/**: React + Vite application with Tailwind CSS
- **backend/**: Node.js + Express server with Google Gemini API integration

## Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Modern ES modules

**Backend:**
- Express.js
- Google Generative AI (Gemini)
- dotenv for environment management
- CORS enabled for cross-origin requests

## Environment Setup

1. Create a `.env` file in `backend/` directory
2. Copy the contents from `backend/.env.example`
3. Add your Gemini API key (get it from https://makersuite.google.com/app/apikey)

```bash
# backend/.env
GEMINI_API_KEY=your_api_key_here
BACKEND_PORT=5000
NODE_ENV=development
```

## Getting Started

### Backend Setup
```bash
cd backend
npm install
npm run dev  # Runs on http://localhost:5000
```

### Frontend Setup (in another terminal)
```bash
cd frontend
npm install
npm run dev  # Opens at http://localhost:5173
```

## API Endpoints

### Interview Analysis
- **POST** `/api/interview/analyze-jd`
  - Input: `{ jobDescription: string }`
  - Output: `{ skills: string[], seniority: string, questions: Object[] }`

### Answer Evaluation
- **POST** `/api/interview/evaluate-answer`
  - Input: `{ question: string, answer: string, skills: string[] }`
  - Output: `{ contentAccuracy: number, communicationClarity: number, feedback: string, ... }`

### Health Check
- **GET** `/api/health`
  - Returns server status

## Features (Planned)

- [x] Project scaffolding
- [x] JD input screen
- [x] Claude-powered analysis
- [ ] Chat-style interview questions
- [ ] Answer evaluation with dual-axis feedback
- [ ] Final report generation
- [ ] Voice input support (Web Speech API)
- [ ] Responsive mobile UI
