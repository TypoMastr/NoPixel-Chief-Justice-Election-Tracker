import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-600 rounded-lg shadow-2xl w-full max-w-sm animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-teal-400" />
            Admin Access
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={`w-full bg-slate-900 border ${error ? 'border-red-500' : 'border-slate-600'} rounded px-3 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors`}
              placeholder="Enter admin password"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-2 font-bold">Incorrect password.</p>}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-teal-600 text-white rounded hover:bg-teal-500 font-bold transition-colors shadow-lg shadow-teal-500/20"
          >
            Unlock System
          </button>
        </form>
      </div>
    </div>
  );
};