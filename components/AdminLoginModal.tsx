import React, { useState } from 'react';
import { X, Lock, Loader2 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

// SHA-256 Hash da senha "tarantino1994"
// Gerado via ferramenta online. Se mudar a senha, gere um novo hash SHA-256.
const ADMIN_HASH = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8";

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  if (!isOpen) return null;

  const verifyPassword = async (input: string) => {
    // Encoder para converter string em buffer
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    
    // Hash usando a API nativa do navegador (Web Crypto API)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Converter buffer para string Hex
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex === ADMIN_HASH;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setError(false);

    try {
      const isValid = await verifyPassword(password);
      
      // Pequeno delay artificial para evitar ataques de timing e dar feedback visual
      await new Promise(resolve => setTimeout(resolve, 500));

      if (isValid) {
        onLogin();
        setPassword('');
        setError(false);
        onClose();
      } else {
        setError(true);
        setPassword('');
      }
    } catch (err) {
      console.error("Error verifying password", err);
      setError(true);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-teal-500" />
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
              className={`w-full bg-slate-900 border ${error ? 'border-red-500' : 'border-slate-600'} rounded px-3 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors text-base`}
              placeholder="Enter admin password"
              autoFocus
              disabled={isChecking}
            />
            {error && <p className="text-red-400 text-xs mt-2 font-bold">Incorrect password.</p>}
          </div>

          <button
            type="submit"
            disabled={isChecking}
            className="w-full px-4 py-4 md:py-3 bg-teal-600 text-white rounded hover:bg-teal-500 font-bold transition-colors shadow-lg shadow-teal-900/20 text-base md:text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isChecking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
              </>
            ) : (
              'Unlock Dashboard'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};