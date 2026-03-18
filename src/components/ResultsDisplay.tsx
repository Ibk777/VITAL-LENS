import React from 'react';
import Markdown from 'react-markdown';
import { AlertCircle, CheckCircle2, ClipboardList, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface ResultsDisplayProps {
  interpretation: string;
}

export function ResultsDisplay({ interpretation }: ResultsDisplayProps) {
  if (!interpretation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-bottom border-slate-200 px-6 py-4 flex items-center gap-2">
          <ClipboardList className="text-emerald-600" size={20} />
          <h2 className="font-semibold text-slate-800">AI Interpretation</h2>
        </div>
        
        <div className="p-6 prose prose-slate max-w-none">
          <div className="markdown-body">
            <Markdown>{interpretation}</Markdown>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="text-amber-600 shrink-0" size={20} />
          <div>
            <h4 className="text-sm font-semibold text-amber-900">Important Note</h4>
            <p className="text-xs text-amber-800 mt-1">
              This analysis is based on general medical knowledge. Your specific health history, medications, and symptoms are crucial for a proper diagnosis.
            </p>
          </div>
        </div>
        
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3">
          <MessageSquare className="text-emerald-600 shrink-0" size={20} />
          <div>
            <h4 className="text-sm font-semibold text-emerald-900">Next Steps</h4>
            <p className="text-xs text-emerald-800 mt-1">
              Save this interpretation and bring it to your next appointment. Use the suggested questions to start a conversation with your doctor.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
