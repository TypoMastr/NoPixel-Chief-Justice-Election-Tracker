import React, { useState } from 'react';
import { Lock, Loader2, ShieldAlert, Eye, EyeOff, Database, CheckCircle2, X } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

/**
 * SHA-256 Hash Function using native Web Crypto API
 * This function converts user input into a unique cryptographic fingerprint (Hash).
 */
async function getHash(message: string) {
  try {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (e) {
    console.error("Critical error in hash generation:", e);
    return null;
  }
}

// Cryptographic hash of the master key. The original password is not stored in this code.
const MASTER_HASH = "613dbe3d6c1ba08e5e4f8383f3148ec8e33aa334ede1f7536db8eaf7e4742383";

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'checking' | 'success'>('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = password.trim();
    
    if (!cleanInput) return;
    
    setStatus('checking');
    setError(null);

    try {
      const inputHash = await getHash(cleanInput);
      
      // 1. Verification via Local Hash (Secure against code inspection)
      if (inputHash === MASTER_HASH) {
        handleSuccess();
        return;
      }

      // 2. Supabase Fallback for dynamic keys if they exist
      const { data } = await supabase
        .from('admin_access')
        .select('secret_key')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const dbHash = data?.secret_key?.trim();
      
      if (dbHash && inputHash === dbHash) {
        handleSuccess();
      } else {
        setError("Incorrect password.");
        setStatus('idle');
      }
    } catch (err) {
      setError("System error. Please try again.");
      setStatus('idle');
    }
  };

  const handleSuccess = async () => {
    setStatus('success');
    await new Promise(r => setTimeout(r, 400));
    onLogin();
    setPassword('');
    setStatus('idle');
    onClose();
  };

  const handleClose = () => {
    if (status === 'checking') return;
    setPassword('');
    setError(null);
    setStatus('idle');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-500">
      <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-white/5 relative">
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors rounded-full hover:bg-white/5 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 pb-4 text-center">
          <div className="relative inline-block mb-6">
            <div className={`p-5 rounded-3xl transition-all duration-500 ${status === 'success' ? 'bg-teal-500/20' : 'bg-slate-800'}`}>
              <Lock className={`w-10 h-10 ${status === 'success' ? 'text-teal-400' : 'text-slate-400'}`} />
            </div>
            {status === 'checking' && (
              <div className="absolute -bottom-2 -right-2 bg-blue-500 p-1.5 rounded-full animate-spin border-4 border-slate-900">
                <Database className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">Administration</h3>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Restricted Access</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                className={`w-full bg-black/40 border-2 ${error ? 'border-red-500/50' : 'border-white/5'} rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-teal-500/50 transition-all text-xl font-mono tracking-[0.3em] text-center`}
                placeholder="PASSWORD"
                autoFocus
                autoComplete="off"
                disabled={status !== 'idle'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-teal-400 p-2"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {error && (
              <div className="flex items-center justify-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-widest animate-bounce">
                <ShieldAlert className="w-3 h-3" />
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={status !== 'idle' || !password.trim()}
            className="w-full py-5 bg-white text-slate-950 rounded-2xl hover:bg-teal-400 font-black uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-3"
          >
            {status === 'checking' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : status === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-teal-950" />
            ) : (
              "Access Panel"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};