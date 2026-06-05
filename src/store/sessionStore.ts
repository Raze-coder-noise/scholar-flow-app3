import { create } from 'zustand';
import { StudySession, UploadedFile } from '@/types';

interface SessionState {
  currentSession: StudySession | null;
  files: UploadedFile[];
  weaknesses: string[];
  setCurrentSession: (session: StudySession) => void;
  addFiles: (files: UploadedFile[]) => void;
  removeFile: (fileId: string) => void;
  setWeaknesses: (weaknesses: string[]) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  currentSession: null,
  files: [],
  weaknesses: [],
  setCurrentSession: (session) => set({ currentSession: session }),
  addFiles: (files) => set((state) => ({ files: [...state.files, ...files] })),
  removeFile: (fileId) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== fileId),
    })),
  setWeaknesses: (weaknesses) => set({ weaknesses }),
  clearSession: () =>
    set({
      currentSession: null,
      files: [],
      weaknesses: [],
    }),
}));
