import React, { useState } from 'react';
import { X, Lock, Loader2, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

// SHA-256 Hash da senha "tarantino1994"
// Gerado corretamente para garantir compatibilidade
const ADMIN_HASH = "365b9395f1d41870198031d2797e9742df5a3d758c0c1692244198305c56f8d0";

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  if (!isOpen) return null;

  const verifyPassword = async (input: string) => {
    // A API Web Crypto (crypto.subtle) só funciona em HTTPS ou Localhost.
    // Verificamos se está disponível. Se não, usamos comparação direta como fallback.
    const isCryptoAvailable = window.crypto && window.crypto.subtle && window.isSecureContext;
    
    if (!isCryptoAvailable) {
      console.warn("Web Crypto API não disponível ou ambiente não seguro. Usando verificação básica.");
      return input === "tarantino1994";
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex === ADMIN_HASH;
    } catch (e) {
      console.error("Erro ao processar hash:", e);
      return input === "tarantino1994";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setIsChecking(true);
    setError(null);

    try {
      const isValid = await verifyPassword(password);
      
      // Delay para feedback tátil/visual
      await new Promise(resolve => setTimeout(resolve, 600));

      if (isValid) {
        onLogin();
        setPassword('');
        onClose();
      } else {
        setError("Senha incorreta.");
        setPassword('');
      }
    } catch (err) {
      console.error("Erro na verificação:", err);
      setError("Erro ao processar login.");
    } finally {
      setIsChecking(false);
    }
  };

  const isInsecure = typeof window !== 'undefined' && !window.isSecureContext;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-teal-500" />
            Acesso Restrito
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isInsecure && (
            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex items-start gap-3 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-amber-200 leading-tight">
                Modo de compatibilidade ativado para ambiente sem HTTPS.
              </p>
            </div>
          )}

          <div>
            <label className="block text-slate-400 text-sm font-bold mb-2">Senha Master</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              className={`w-full bg-slate-900 border ${error ? 'border-red-500' : 'border-slate-600'} rounded px-3 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors text-base`}
              placeholder="Digite a senha de admin"
              autoFocus
              disabled={isChecking}
            />
            {error && <p className="text-red-400 text-xs mt-2 font-bold">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isChecking || !password}
            className="w-full px-4 py-4 md:py-3 bg-teal-600 text-white rounded hover:bg-teal-500 font-bold transition-colors shadow-lg shadow-teal-900/20 text-base md:text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isChecking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verificando...
              </>
            ) : (
              'Desbloquear Painel'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};