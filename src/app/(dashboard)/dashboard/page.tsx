'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Upload, BookOpen, Brain, TrendingUp, Award, Search, Target, LogOut, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@/utils/api-client';
import { UploadedFile, StudySession } from '@/types';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { uploadFile } = useFileUpload();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [query, setQuery] = useState('');
  const [assistantReply, setAssistantReply] = useState('Upload notes, essays, or PDFs and ask for summaries, flashcards, study plans, or weakness analysis.');
  const [loading, setLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const weaknesses = useMemo(() => {
    if (!files.length) return ['Statistical Analysis', 'Thesis Development', 'Source Citation'];
    const names = files.map((f) => f.name.toLowerCase()).join(' ');
    const found = [];
    if (names.includes('stats') || names.includes('data')) found.push('Statistical Analysis');
    if (names.includes('essay') || names.includes('draft')) found.push('Thesis Development');
    if (names.includes('references') || names.includes('citation')) found.push('Source Citation');
    return found.length ? found : ['Organization', 'Clarity', 'Evidence Usage'];
  }, [files]);

  const createSession = useCallback(async () => {
    if (!user) return;
    try {
      const response = await apiClient.post('/sessions/create', {
        userId: user.id,
        title: 'New Study Session',
      });
      setCurrentSession(response.data);
      toast.success('Session created!');
    } catch (error) {
      toast.error('Failed to create session');
    }
  }, [user]);

  const handleFiles = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !currentSession) {
      toast.error('Please create a session first');
      return;
    }

    const fileList = Array.from(e.target.files || []);
    setUploadingFiles(true);

    try {
      const uploadedFiles = await Promise.all(
        fileList.map(async (file) => {
          const uploaded = await uploadFile(file, user.id);
          if (uploaded) {
            return uploaded;
          }
          return null;
        })
      );

      const validFiles = uploadedFiles.filter((f) => f !== null) as UploadedFile[];
      setFiles((prev) => [...validFiles, ...prev]);
      toast.success(`Uploaded ${validFiles.length} file(s)`);
    } catch (error) {
      toast.error('File upload failed');
    } finally {
      setUploadingFiles(false);
    }
  }, [user, currentSession, uploadFile]);

  const askAssistant = useCallback(async () => {
    if (!query.trim() || !currentSession) {
      toast.error('Please enter a question and create a session');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/assistant/analyze', {
        query,
        sessionId: currentSession.id,
        userId: user?.id,
        fileNames: files.map((f) => f.name),
      });
      setAssistantReply(response.data.response);
      setQuery('');
    } catch (error) {
      toast.error('Assistant request failed');
    } finally {
      setLoading(false);
    }
  }, [query, currentSession, user, files]);

  const generateFlashcards = useCallback(async () => {
    if (!currentSession || !user) {
      toast.error('Please create a session first');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/assistant/flashcards', {
        topic: 'Key concepts from your notes',
        count: 10,
        sessionId: currentSession.id,
        userId: user.id,
      });
      toast.success('Flashcards generated!');
    } catch (error) {
      toast.error('Failed to generate flashcards');
    } finally {
      setLoading(false);
    }
  }, [currentSession, user]);

  const generateStudyPlan = useCallback(async () => {
    if (!currentSession || !user || weaknesses.length === 0) {
      toast.error('No weak areas to create study plan');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/assistant/study-plan', {
        weaknesses,
        studyTime: 7,
        sessionId: currentSession.id,
        userId: user.id,
      });
      setAssistantReply(response.data.plan);
      toast.success('Study plan created!');
    } catch (error) {
      toast.error('Failed to create study plan');
    } finally {
      setLoading(false);
    }
  }, [currentSession, user, weaknesses]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500 text-white flex items-center justify-center text-xl">🌊</div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">ScholarFlow</h1>
              <p className="text-xs text-slate-500 -mt-0.5">Hi, {user.displayName || user.email}</p>
            </div>
          </div>
          <Button onClick={logout} variant="ghost" className="rounded-2xl">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <section className="grid lg:grid-cols-4 gap-6">
          <Card className="rounded-3xl shadow-sm lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-slate-500">Files Uploaded</p>
                <BookOpen className="w-5 h-5 text-slate-700" />
              </div>
              <div className="text-4xl font-bold">{files.length}</div>
              <p className="text-sm text-slate-500 mt-2">In this session</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-slate-500">Study Progress</p>
                <TrendingUp className="w-5 h-5 text-cyan-500" />
              </div>
              <div className="text-4xl font-bold text-cyan-600">72%</div>
              <Progress className="mt-4" value={72} />
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-slate-500">Session Active</p>
                <Award className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-4xl font-bold">{currentSession ? '✓' : '○'}</div>
              <p className="text-sm text-slate-500 mt-2">{currentSession ? 'Session running' : 'Create a session'}</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-slate-500">Weak Areas</p>
                <Target className="w-5 h-5 text-rose-500" />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {weaknesses.slice(0, 2).map((w) => (
                  <span key={w} className="px-2 py-1 rounded-full bg-rose-50 text-rose-700 text-xs">
                    {w}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <Card className="rounded-3xl shadow-sm lg:col-span-2">
            <CardContent className="p-6 md:p-8">
              {!currentSession ? (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-cyan-100 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Create a Study Session</h3>
                    <p className="text-slate-500 mb-6">Start a new session to upload files and generate study materials</p>
                    <Button onClick={createSession} className="rounded-2xl bg-cyan-500 hover:bg-cyan-600">
                      Create Session
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Upload Study Materials</h2>
                    <div className="border-2 border-dashed border-cyan-300 rounded-3xl p-10 text-center bg-cyan-50/50">
                      <Upload className="w-14 h-14 mx-auto text-cyan-500 mb-4" />
                      <h3 className="text-lg font-semibold">Upload Notes, Essays, PDFs, or Images</h3>
                      <label className="inline-block mt-6">
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          onChange={handleFiles}
                          disabled={uploadingFiles}
                          accept=".pdf,.doc,.docx,.txt,.jpg,.png,.jpeg"
                        />
                        <span className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-3 rounded-2xl cursor-pointer disabled:opacity-50">
                          <Upload className="w-4 h-4" />
                          {uploadingFiles ? 'Uploading...' : 'Choose Files'}
                        </span>
                      </label>
                    </div>
                  </div>

                  {files.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Uploaded Files ({files.length})</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {files.map((file) => (
                          <div key={file.id} className="rounded-2xl border bg-white p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                              {file.type === 'pdf' ? '📄' : file.type === 'image' ? '🖼️' : '📝'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium truncate text-sm">{file.name}</div>
                              <div className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(1)} MB</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm lg:col-span-1">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-cyan-500" />
                <h3 className="text-lg font-semibold">AI Study Assistant</h3>
              </div>
              <div className="rounded-2xl bg-slate-50 border p-4 text-sm leading-6 text-slate-700 min-h-[180px] mb-4 overflow-y-auto">
                {assistantReply}
              </div>
              <div className="mt-auto space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask for summary, quiz, or plan"
                    className="rounded-2xl text-sm"
                    disabled={!currentSession}
                  />
                  <Button
                    onClick={askAssistant}
                    disabled={loading || !currentSession}
                    className="rounded-2xl bg-cyan-500 hover:bg-cyan-600"
                    size="sm"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={generateFlashcards}
                    disabled={loading || !currentSession}
                    variant="outline"
                    className="rounded-2xl text-xs"
                    size="sm"
                  >
                    Flashcards
                  </Button>
                  <Button
                    onClick={generateStudyPlan}
                    disabled={loading || !currentSession}
                    variant="outline"
                    className="rounded-2xl text-xs"
                    size="sm"
                  >
                    Study Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
