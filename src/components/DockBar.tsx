import React, { useState } from 'react';
import {
  Clock,
  Timer,
  CheckSquare,
  StickyNote,
  Image as ImageIcon,
  Palette,
  Maximize,
  Minimize,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { BackgroundOption, WidgetType } from '../types/dashboard';
import { DEFAULT_BACKGROUNDS } from '../data/backgrounds';

interface DockBarProps {
  onToggleWidget: (type: WidgetType) => void;
  onAddMultiWidget: (type: 'notes' | 'image') => void;
  activeWidgetCounts: Record<WidgetType, number>;
  currentBg: BackgroundOption;
  onChangeBg: (bg: BackgroundOption) => void;
  onResetLayout: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const DockBar: React.FC<DockBarProps> = ({
  onToggleWidget,
  onAddMultiWidget,
  activeWidgetCounts,
  currentBg,
  onChangeBg,
  onResetLayout,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [customBgUrl, setCustomBgUrl] = useState('');

  const handleCustomBgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customBgUrl.trim()) {
      onChangeBg({
        id: 'custom-' + Date.now(),
        name: 'Personnalisé',
        type: 'image',
        value: customBgUrl.trim(),
        thumbnail: customBgUrl.trim(),
      });
      setCustomBgUrl('');
      setShowBgPicker(false);
    }
  };

  return (
    <>
      {/* Background Selector Modal / Popover */}
      {showBgPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/20 p-5 rounded-2xl max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <Palette size={18} className="text-cyan-400" />
                Choisir un fond d'écran
              </h3>
              <button
                onClick={() => setShowBgPicker(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                Fermer
              </button>
            </div>

            {/* Background Previews */}
            <div className="grid grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-1">
              {DEFAULT_BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => {
                    onChangeBg(bg);
                    setShowBgPicker(false);
                  }}
                  className={`group relative h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    currentBg.id === bg.id
                      ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-[1.02]'
                      : 'border-white/10 hover:border-white/40'
                  }`}
                >
                  {bg.type === 'image' ? (
                    <img
                      src={bg.thumbnail}
                      alt={bg.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ background: bg.thumbnail }}
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs py-1 px-1.5 text-[11px] text-white font-medium text-center truncate">
                    {bg.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom URL Input */}
            <form onSubmit={handleCustomBgSubmit} className="pt-2 border-t border-white/10 flex gap-2">
              <input
                type="url"
                value={customBgUrl}
                onChange={(e) => setCustomBgUrl(e.target.value)}
                placeholder="Ou collez l'URL d'une image..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
              >
                Appliquer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Bottom Dock */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 select-none">
        <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/85 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl">
          {/* Logo / Brand badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-black tracking-wider text-cyan-400 bg-white/5 rounded-xl border border-white/10 mr-1">
            <Sparkles size={14} className="text-cyan-300" />
            <span>CLASSE</span>
          </div>

          {/* Horloge */}
          <button
            onClick={() => onToggleWidget('clock')}
            className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              activeWidgetCounts.clock > 0
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Afficher/Masquer l'Horloge"
          >
            <Clock size={19} />
            <span className="text-[10px] font-semibold">Horloge</span>
            {activeWidgetCounts.clock > 0 && (
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          {/* Minuteur */}
          <button
            onClick={() => onToggleWidget('timer')}
            className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              activeWidgetCounts.timer > 0
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Afficher/Masquer le Minuteur"
          >
            <Timer size={19} />
            <span className="text-[10px] font-semibold">Minuteur</span>
            {activeWidgetCounts.timer > 0 && (
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          {/* To-Do List */}
          <button
            onClick={() => onToggleWidget('todo')}
            className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              activeWidgetCounts.todo > 0
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Afficher/Masquer la Liste de tâches"
          >
            <CheckSquare size={19} />
            <span className="text-[10px] font-semibold">Tâches</span>
            {activeWidgetCounts.todo > 0 && (
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          {/* Notes */}
          <div className="relative group">
            <button
              onClick={() => onToggleWidget('notes')}
              className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                activeWidgetCounts.notes > 0
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title="Afficher/Masquer les Notes"
            >
              <StickyNote size={19} />
              <span className="text-[10px] font-semibold">Notes</span>
              {activeWidgetCounts.notes > 0 && (
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              )}
            </button>
            {/* Quick add note button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddMultiWidget('notes');
              }}
              className="absolute -top-1.5 -right-1 w-4 h-4 bg-cyan-400 text-slate-950 rounded-full text-[10px] font-black items-center justify-center hidden group-hover:flex shadow hover:scale-110 transition-transform"
              title="Ajouter une autre note"
            >
              +
            </button>
          </div>

          {/* Images */}
          <div className="relative group">
            <button
              onClick={() => onToggleWidget('image')}
              className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                activeWidgetCounts.image > 0
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title="Afficher/Masquer l'Image"
            >
              <ImageIcon size={19} />
              <span className="text-[10px] font-semibold">Image</span>
              {activeWidgetCounts.image > 0 && (
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              )}
            </button>
            {/* Quick add image button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddMultiWidget('image');
              }}
              className="absolute -top-1.5 -right-1 w-4 h-4 bg-cyan-400 text-slate-950 rounded-full text-[10px] font-black items-center justify-center hidden group-hover:flex shadow hover:scale-110 transition-transform"
              title="Ajouter une autre image"
            >
              +
            </button>
          </div>

          <div className="w-[1px] h-8 bg-white/15 mx-1" />

          {/* Background switcher */}
          <button
            onClick={() => setShowBgPicker(true)}
            className="flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Changer le fond d'écran"
          >
            <Palette size={19} />
            <span className="text-[10px] font-medium">Fond</span>
          </button>

          {/* Reset Layout */}
          <button
            onClick={onResetLayout}
            className="flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Réorganiser les widgets"
          >
            <RotateCcw size={18} />
            <span className="text-[10px] font-medium">Disposition</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={onToggleFullscreen}
            className="flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title={isFullscreen ? 'Quitter le plein écran' : 'Passer en plein écran'}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            <span className="text-[10px] font-medium">Écran</span>
          </button>
        </div>
      </div>
    </>
  );
};
