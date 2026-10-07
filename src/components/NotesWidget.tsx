import React, { useState, useEffect } from 'react';
import { Type } from 'lucide-react';

interface NotesWidgetProps {
  id: string;
}

const COLOR_THEMES = [
  { id: 'yellow', bg: 'bg-amber-100/90 text-amber-950', ring: 'bg-amber-300' },
  { id: 'cyan', bg: 'bg-sky-100/90 text-sky-950', ring: 'bg-sky-300' },
  { id: 'emerald', bg: 'bg-emerald-100/90 text-emerald-950', ring: 'bg-emerald-300' },
  { id: 'rose', bg: 'bg-rose-100/90 text-rose-950', ring: 'bg-rose-300' },
  { id: 'dark', bg: 'bg-slate-800/90 text-slate-100', ring: 'bg-slate-600' },
];

export const NotesWidget: React.FC<NotesWidgetProps> = ({ id }) => {
  const storageKey = `schooldashboard_note_${id}`;

  const [content, setContent] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved).content ?? '';
    } catch {
      // ignore
    }
    return 'Bienvenue en classe ! 👋\n\nN’oubliez pas de lever la main pour prendre la parole.';
  });

  const [colorTheme, setColorTheme] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved).colorTheme ?? 'yellow';
    } catch {
      // ignore
    }
    return 'yellow';
  });

  const [isHandwritten, setIsHandwritten] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved).isHandwritten ?? true;
    } catch {
      // ignore
    }
    return true;
  });

  const [fontSize, setFontSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved).fontSize ?? 18;
    } catch {
      // ignore
    }
    return 18;
  });

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ content, colorTheme, isHandwritten, fontSize })
    );
  }, [content, colorTheme, isHandwritten, fontSize, storageKey]);

  const activeTheme = COLOR_THEMES.find((t) => t.id === colorTheme) || COLOR_THEMES[0];

  return (
    <div className={`flex flex-col h-full rounded-xl p-2.5 transition-colors ${activeTheme.bg}`}>
      {/* Note Toolbar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/10">
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {COLOR_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setColorTheme(theme.id)}
              className={`w-3.5 h-3.5 rounded-full ${theme.ring} border border-black/20 transition-transform ${
                colorTheme === theme.id ? 'scale-125 ring-2 ring-black/40' : 'hover:scale-110 opacity-70'
              }`}
            />
          ))}
        </div>

        {/* Font controls */}
        <div className="flex items-center gap-1.5 text-xs opacity-75">
          <button
            onClick={() => setIsHandwritten(!isHandwritten)}
            className="p-1 rounded hover:bg-black/10 transition-colors flex items-center gap-0.5"
            title={isHandwritten ? 'Police Manuscrite activée' : 'Police Standard'}
          >
            <Type size={13} />
            <span className="text-[10px] font-bold">{isHandwritten ? 'Cursive' : 'Standard'}</span>
          </button>

          <button
            onClick={() => setFontSize((s) => Math.max(13, s - 2))}
            className="px-1 py-0.5 rounded hover:bg-black/10 text-[10px] font-bold"
            title="Diminuer la taille"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize((s) => Math.min(32, s + 2))}
            className="px-1 py-0.5 rounded hover:bg-black/10 text-[10px] font-bold"
            title="Agrandir la taille"
          >
            A+
          </button>
        </div>
      </div>

      {/* Note Textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Écrivez votre consigne ou note ici..."
        style={{ fontSize: `${fontSize}px` }}
        className={`flex-1 w-full bg-transparent resize-none border-none outline-none leading-relaxed ${
          isHandwritten ? 'font-handwriting font-semibold' : 'font-sans'
        }`}
      />
    </div>
  );
};
