import React from 'react';
import { Stethoscope } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full py-6 px-4 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Stethoscope size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">VitaLens AI</h1>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Lab Result Interpreter</p>
          </div>
        </div>
        
        <nav className="hidden sm:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">How it works</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Privacy</a>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all">
            Get Started
          </button>
        </nav>
      </div>
    </header>
  );
}
