export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadedFile {
  id: string;
  userId: string;
  name: string;
  size: number;
  type: 'pdf' | 'image' | 'text' | 'document';
  url: string;
  storageRef: string;
  uploadedAt: Date;
  processedAt?: Date;
  metadata?: Record<string, any>;
}

export interface StudySession {
  id: string;
  userId: string;
  title: string;
  description?: string;
  files: UploadedFile[];
  weaknesses: string[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface AssistantMessage {
  id: string;
  sessionId: string;
  userId: string;
  query: string;
  response: string;
  type: 'summary' | 'flashcard' | 'quiz' | 'study_plan' | 'analysis';
  createdAt: Date;
}

export interface Flashcard {
  id: string;
  sessionId: string;
  userId: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
}

export interface Quiz {
  id: string;
  sessionId: string;
  userId: string;
  questions: QuizQuestion[];
  score?: number;
  completedAt?: Date;
  createdAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  userAnswer?: number;
}

export interface AnalyticsData {
  userId: string;
  totalSessionsCompleted: number;
  totalStudyTime: number; // in minutes
  averageQuizScore: number;
  strongAreas: string[];
  weakAreas: string[];
  lastActivityDate: Date;
  streak: number;
}
