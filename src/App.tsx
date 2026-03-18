import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ManualEntry } from './components/ManualEntry';
import { ResultsDisplay } from './components/ResultsDisplay';
import { interpretMedicalTest } from './services/gemini';
import { History, Shield, Info, ArrowRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InterpretationHistory {
  id: string;
  date: string;
  summary: string;
  fullText: string;
}

export default function App() {
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
  const [history, setHistory] = useState<InterpretationHistory[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('vitalens_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (text: string) => {
    const newEntry: InterpretationHistory = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      summary: text.split('\n').find(line => line.length > 20 && !line.includes('DISCLAIMER'))?.substring(0, 100) + '...' || 'Medical Interpretation',
      fullText: text,
    };
    const updatedHistory = [newEntry, ...history].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem('vitalens_history', JSON.stringify(updatedHistory));
  };

  const handleInterpretation = async (text: string, imageBase64?: string) => {
    setIsLoading(true);
    setError(null);
    setInterpretation(null);
    
    try {
      const result = await interpretMedicalTest(text, imageBase64);
      setInterpretation(result);
      saveToHistory(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Input & Info */}
          <div className="lg:col-span-5 space-y-8">
            <section>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">
                Understand your health data.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Upload your lab results or paste them manually. Our AI provides a clear, structured breakdown of what your numbers mean.
              </p>
            </section>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    activeTab === 'upload' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Upload Image
                </button>
                <button
                  onClick={() => setActiveTab('manual')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    activeTab === 'manual' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Manual Entry
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'upload' ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <FileUpload 
                      onFileSelect={(base64) => handleInterpretation("", base64)} 
                      isLoading={isLoading} 
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="manual"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <ManualEntry 
                      onSubmit={(text) => handleInterpretation(text)} 
                      isLoading={isLoading} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Features/Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-2">
                <Shield className="text-emerald-600" size={20} />
                <span className="text-sm font-semibold">Private & Secure</span>
                <p className="text-xs text-slate-500">Your data is processed and not stored on our servers.</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col gap-2">
                <Activity className="text-emerald-600" size={20} />
                <span className="text-sm font-semibold">AI-Powered</span>
                <p className="text-xs text-slate-500">Advanced analysis based on latest medical guidelines.</p>
              </div>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400 px-2">
                  <History size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Recent Interpretations</span>
                </div>
                <div className="space-y-2">
                  {history.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => setInterpretation(entry.fullText)}
                      className="w-full p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-300 hover:bg-emerald-50/30 transition-all text-left group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-slate-400">{entry.date}</span>
                        <ArrowRight size={14} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-1">{entry.summary}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {interpretation ? (
                <ResultsDisplay key="results" interpretation={interpretation} />
              ) : isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-slate-200 border-dashed"
                >
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Activity className="text-emerald-600 animate-pulse" size={32} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing your results...</h3>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    We're processing your data and generating a detailed interpretation. This usually takes a few seconds.
                  </p>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 bg-red-50 border border-red-100 rounded-3xl text-center"
                >
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-red-900 mb-2">Interpretation Failed</h3>
                  <p className="text-red-700 mb-6">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="px-6 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-slate-200 border-dashed"
                >
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                    <ClipboardList size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No results to show</h3>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    Upload an image or enter your lab results on the left to see the AI-powered interpretation here.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-12 border-t border-slate-200 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Stethoscope size={20} />
            <span className="font-bold tracking-tight">VitaLens AI</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-400">
            <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600">Terms of Service</a>
            <a href="#" className="hover:text-slate-600">Contact Support</a>
          </div>
          <p className="text-xs text-slate-400">
            © 2024 VitaLens AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Helper icons that were missing in imports
function ClipboardList(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}

function Stethoscope(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6h2a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
}
