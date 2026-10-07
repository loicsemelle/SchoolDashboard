import React, { useState, useEffect, useRef } from 'react';
import { Upload, Link as LinkIcon, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';

interface ImageWidgetProps {
  id: string;
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80';

export const ImageWidget: React.FC<ImageWidgetProps> = ({ id }) => {
  const storageKey = `schooldashboard_image_${id}`;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.url || DEFAULT_IMAGE;
      }
    } catch {
      // ignore
    }
    return DEFAULT_IMAGE;
  });

  const [fitMode, setFitMode] = useState<'contain' | 'cover'>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.fitMode || 'cover';
      }
    } catch {
      // ignore
    }
    return 'cover';
  });

  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ url: imageUrl, fitMode }));
    } catch {
      // LocalStorage quota might exceed with large dataURLs; catch safely
    }
  }, [imageUrl, fitMode, storageKey]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setImageUrl(urlInput.trim());
      setUrlInput('');
      setIsUrlModalOpen(false);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col rounded-xl overflow-hidden group bg-slate-950/40">
      {/* Action Bar (revealed on hover) */}
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 border border-white/10 shadow-lg">
        {/* Change fit mode */}
        <button
          onClick={() => setFitMode(fitMode === 'cover' ? 'contain' : 'cover')}
          className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          title={fitMode === 'cover' ? 'Afficher en entier (contain)' : 'Remplir le cadre (cover)'}
        >
          {fitMode === 'cover' ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </button>

        {/* Upload local file */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          title="Importer une image locale"
        >
          <Upload size={13} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Set URL */}
        <button
          onClick={() => setIsUrlModalOpen(!isUrlModalOpen)}
          className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          title="Coller un lien d'image"
        >
          <LinkIcon size={13} />
        </button>

        {/* Reset to default */}
        <button
          onClick={() => setImageUrl(DEFAULT_IMAGE)}
          className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          title="Réinitialiser l'image"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      {/* URL Input Popup */}
      {isUrlModalOpen && (
        <form
          onSubmit={handleSetUrl}
          className="absolute inset-x-2 top-12 z-20 bg-slate-900/95 border border-white/20 p-2.5 rounded-xl shadow-2xl flex flex-col gap-2"
        >
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            autoFocus
          />
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setIsUrlModalOpen(false)}
              className="px-2 py-0.5 rounded text-xs text-slate-400 hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-2.5 py-0.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              Valider
            </button>
          </div>
        </form>
      )}

      {/* Image Display */}
      <div className="flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt="Widget"
          className={`w-full h-full rounded-lg select-none pointer-events-none transition-all ${
            fitMode === 'cover' ? 'object-cover' : 'object-contain'
          }`}
          onError={() => setImageUrl(DEFAULT_IMAGE)}
        />
      </div>
    </div>
  );
};
