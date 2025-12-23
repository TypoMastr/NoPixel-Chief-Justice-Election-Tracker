import React from 'react';
import { X, Copy, Check } from 'lucide-react';
import { useToast } from './ToastProvider';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportText: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, reportText }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      showToast('Report copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h3 className="text-xl font-bold text-teal-400 flex items-center gap-2">
            📄 Election Report Preview
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-black/20 custom-scrollbar">
          <pre className="text-slate-300 font-mono text-sm whitespace-pre-wrap break-words leading-relaxed">
            {reportText}
          </pre>
        </div>

        <div className="p-6 border-t border-slate-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 font-bold transition-all border border-white/5"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="flex-[2] px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-500 font-bold transition-all shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2 group"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Copy Report Text
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
