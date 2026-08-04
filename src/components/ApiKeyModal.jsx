import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Key, ExternalLink, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ApiKeyModal() {
  const { isApiKeyModalOpen, setIsApiKeyModalOpen, henrikApiKey, setHenrikApiKey } = useApp();
  const [inputKey, setInputKey] = useState(henrikApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isApiKeyModalOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setHenrikApiKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsApiKeyModalOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-val-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-val-card border border-val-border rounded-xl w-full max-w-md p-6 relative shadow-2xl space-y-4">
        
        {/* Close Button */}
        <button
          onClick={() => setIsApiKeyModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-val-muted hover:text-white hover:bg-val-black/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-val-red/10 border border-val-red/30 flex items-center justify-center text-val-red shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-val text-xl text-white font-bold">Henrik API Key Config</h3>
            <p className="text-xs text-val-muted">Required for fetching live Valorant match histories</p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs text-val-cyan font-mono uppercase block mb-1">
              Henrik Dev API Key
            </label>
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="e.g. HENVAL-xxxxxxxx-xxxx-xxxx"
              className="w-full bg-val-black/80 border border-val-border focus:border-val-red rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder-val-muted outline-none transition-all"
            />
            <p className="text-[11px] text-val-muted mt-1">
              Key can also be set in <code className="text-val-cyan">.env</code> via <code className="text-val-cyan">VITE_HENRIK_API_KEY</code>.
            </p>
          </div>

          {/* Key Info / Instructions */}
          <div className="bg-val-black/50 border border-val-border/60 rounded-lg p-3 text-xs text-gray-300 space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-val-cyan" />
              How to get a free API Key:
            </div>
            <ol className="list-decimal list-inside text-val-muted space-y-1 pl-1">
              <li>Visit Henrik Dev's documentation portal</li>
              <li>Join their official Discord server to generate a free tier API key</li>
              <li>Paste your API key above to enable unlimited live player lookups</li>
            </ol>
            <a
              href="https://docs.henrikdev.xyz/"
              target="_blank"
              rel="noreferrer"
              className="text-val-cyan hover:underline inline-flex items-center gap-1 text-[11px] font-mono"
            >
              Open Henrik API Documentation <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {savedSuccess && (
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-lg text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>API Key Saved Successfully!</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsApiKeyModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-val-black/60 hover:bg-val-black border border-val-border text-xs text-val-muted hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-val-red hover:bg-val-red-hover text-xs font-val tracking-wider text-white shadow-glow-red transition-all"
            >
              SAVE API KEY
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
