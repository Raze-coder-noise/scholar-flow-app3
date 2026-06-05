# scholar-flow-app3
"ScholarFlow - Academic Progress &amp; AI Study Assistant"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A2540',
        accent: '#00B4D8',
        light: '#F8FAFC',
      }
    },
  },
  plugins: [],
}@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', system_ui, sans-serif;
}import { useState } from 'react';
import { Upload, BookOpen, TrendingUp, Target, Award, Users } from 'lucide-react';

function App() {
  const [files, setFiles] = useState([]);
  const [progress] = useState(72);
  const [weaknesses] = useState(["Statistical Analysis", "Thesis Development", "Source Citation"]);

  const handleUpload = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type.includes('image') ? 'image' : 'document',
      date: new Date().toLocaleDateString(),
      size: (file.size / 1024 / 1024).toFixed(1) + ' MB'
    }));
    setFiles([...files, ...newFiles]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="bg-primary text-white p-5 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center text-2xl">🌊</div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ScholarFlow</h1>
            <p className="text-xs text-blue-300 -mt-1">Flow Through Knowledge</p>
          </div>
        </div>
        
        <div className="flex gap-8 text-sm font-medium">
          <a href="#" className="hover:text-accent transition">Dashboard</a>
          <a href="#" className="hover:text-accent transition">My Files</a>
          <a href="#" className="hover:text-accent transition">Insights</a>
          <a href="#" className="hover:text-accent transition">Career</a>
          <a href="#" className="hover:text-accent transition">Books</a>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm">Alex Rivera</div>
          <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center">👨‍🎓</div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-4xl font-semibold text-primary mb-2">Good morning, Alex 👋</h2>
        <p className="text-gray-600 mb-10">Here's your academic progress overview</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Overall Progress</p>
                <p className="text-5xl font-bold text-accent mt-2">{progress}%</p>
              </div>
              <TrendingUp className="w-10 h-10 text-accent" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <p className="text-gray-500 text-sm">Files Uploaded</p>
            <p className="text-5xl font-bold text-primary mt-2">{files.length + 19}</p>
            <p className="text-sm text-gray-500 mt-1">This semester</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <p className="text-gray-500 text-sm">AI Weak Areas</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {weaknesses.map((w, i) => (
                <span key={i} className="px-4 py-1.5 bg-red-100 text-red-700 text-sm rounded-2xl">
                  {w}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow flex flex-col justify-between">
            <div>
              <p className="text-gray-500 text-sm">Current Streak</p>
              <p className="text-5xl font-bold text-primary mt-2">12 <span className="text-2xl">days</span></p>
            </div>
            <Award className="w-10 h-10 text-amber-500 self-end" />
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white border-2 border-dashed border-accent rounded-3xl p-16 text-center mb-12 hover:border-[#0099b8] transition">
          <Upload className="w-20 h-20 mx-auto text-accent mb-6" />
          <h3 className="text-2xl font-semibold mb-3">Upload Your Work</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Drop PDFs, DOCX, Essays, Notes, or Images. Our AI will analyze and organize everything.
          </p>
          <label className="bg-accent hover:bg-[#0099b8] text-white px-10 py-4 rounded-2xl text-lg font-medium cursor-pointer inline-block transition">
            Choose Files to Upload
            <input 
              type="file" 
              multiple 
              className="hidden" 
              onChange={handleUpload}
              accept=".pdf,.docx,.jpg,.png,.jpeg"
            />
          </label>
        </div>

        {/* Recent Files */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold flex items-center gap-3">
              <BookOpen className="w-6 h-6" /> Recent Submissions
            </h3>
            <button className="text-accent hover:underline">View All Files →</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.length > 0 ? (
              files.map(file => (
                <div key={file.id} className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition flex gap-5">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl">
                    {file.type === 'image' ? '🖼️' : '📝'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-gray-500">{file.date} • {file.size}</p>
                    <span className="inline-block mt-3 text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">
                      Analyzed
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500 py-12">No files uploaded yet. Upload your first assignment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;