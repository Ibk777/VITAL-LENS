import React, { useState } from 'react';
import { Send, FileText } from 'lucide-react';
import { cn } from '../utils/cn';

interface ManualEntryProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export function ManualEntry({ onSubmit, isLoading }: ManualEntryProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your lab results here (e.g., Glucose: 110 mg/dL, HbA1c: 5.7%)..."
          className={cn(
            "w-full min-h-[160px] p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-slate-700 placeholder:text-slate-400",
            isLoading && "opacity-50 pointer-events-none"
          )}
        />
        <div className="absolute top-4 right-4 text-slate-300">
          <FileText size={20} />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className={cn(
          "w-full py-3 px-6 bg-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:transform active:scale-[0.98] transition-all flex items-center justify-center gap-2",
          (isLoading || !text.trim()) && "opacity-50 cursor-not-allowed shadow-none"
        )}
      >
        {isLoading ? (
          "Processing..."
        ) : (
          <>
            Interpret Results
            <Send size={18} />
          </>
        )}
      </button>
    </form>
  );
}
