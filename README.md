# ScholarFlow - Academic Progress & AI Study Assistant

A full-featured, production-ready web application for academic learning with AI-powered study assistance.

## Features

- Authentication: Secure Firebase-based auth with email/password
- File Upload: Upload study materials (PDFs, images, documents) to Firebase Storage
- AI Study Assistant: Claude-powered analysis, summaries, and recommendations
- Flashcard Generation: Auto-generate flashcards from your materials
- Quiz Creation: AI-generated quizzes with multiple-choice questions
- Study Plans: Personalized 7-day study plans targeting weak areas
- Session Management: Create and manage multiple study sessions
- Progress Tracking: Monitor your academic progress
- Responsive Design: Beautiful, modern UI with Tailwind CSS
- Type-Safe: Full TypeScript support

## Tech Stack

- Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS
- Backend: Next.js API Routes
- Database: Firebase Firestore
- Storage: Firebase Storage
- Authentication: Firebase Auth
- AI: Anthropic Claude API
- State Management: Zustand
- UI Components: Radix UI, Shadcn/ui patterns
- HTTP Client: Axios
- Notifications: React Hot Toast

## Prerequisites

- Node.js 18+ and npm/yarn
- Firebase account and project
- Anthropic Claude API key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Raze-coder-noise/scholar-flow-app3.git
cd scholar-flow-app3
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy .env.example to .env.local and fill in your credentials:

```bash
cp .env.example .env.local
```

**Firebase Setup**:
1. Create a project at Firebase Console
2. Enable Authentication (Email/Password)
3. Create a Firestore Database
4. Create a Storage Bucket
5. Get your config from Project Settings
6. Generate a service account key for admin SDK

**Anthropic Setup**:
1. Get your API key from Anthropic Console

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 5. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
appauth/         # Auth pages
app/dashboard/   # Dashboard pages
app/api/         # API routes
components/ui/   # Reusable UI components
hooks/           # Custom React hooks
lib/             # Library setup (Firebase, etc)
store/           # Zustand stores
types/           # TypeScript type definitions
utils/           # Utility functions
```

## API Endpoints

### Authentication
- POST /api/auth/register - Create new account
- POST /api/auth/login - Login and get token

### Files
- POST /api/files/upload - Upload study material

### AI Assistant
- POST /api/assistant/analyze - Analyze materials and answer questions
- POST /api/assistant/flashcards - Generate flashcards
- POST /api/assistant/quiz - Generate quiz questions
- POST /api/assistant/study-plan - Create personalized study plan

### Sessions
- POST /api/sessions/create - Create new study session
- GET /api/sessions/[sessionId] - Get session details
- PUT /api/sessions/[sessionId] - Update session

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel dashboard.

### Docker

```bash
docker build -t scholar-flow .
docker run -p 3000:3000 scholar-flow
```

## Security Considerations

- All sensitive keys are in .env.local (never committed)
- Firebase security rules should be configured in console
- API routes validate user authentication
- CORS headers are properly configured
- Input validation on all endpoints
- Rate limiting should be added for production

## Future Enhancements

- Mobile app (React Native)
- Video tutorial support
- Collaborative study groups
- Analytics dashboard
- Export study materials
- Offline support with service workers
- Email notifications
- Social features
- Advanced analytics
- Integration with LMS platforms

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

## License

MIT License

## Support

For issues, questions, or suggestions open a GitHub issue or contact the team.

---

Built with ❤️ by the ScholarFlow Team
