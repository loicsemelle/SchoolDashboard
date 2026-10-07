import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock as ClockIcon,
  Timer as TimerIcon,
  CheckSquare,
  StickyNote,
  Image as ImageIcon,
} from 'lucide-react';
import { WidgetInstance, WidgetType, BackgroundOption } from './types/dashboard';
import { DEFAULT_BACKGROUNDS } from './data/backgrounds';
import { WidgetWindow } from './components/WidgetWindow';
import { ClockWidget } from './components/ClockWidget';
import { TimerWidget } from './components/TimerWidget';
import { TodoListWidget } from './components/TodoListWidget';
import { NotesWidget } from './components/NotesWidget';
import { ImageWidget } from './components/ImageWidget';
import { DockBar } from './components/DockBar';

const STORAGE_LAYOUT_KEY = 'schooldashboard_layout_v1';
const STORAGE_BG_KEY = 'schooldashboard_background_v1';

const DEFAULT_WIDGETS: WidgetInstance[] = [
  {
    id: 'clock-1',
    type: 'clock',
    title: 'Horloge & Date',
    x: 40,
    y: 40,
    width: 320,
    height: 220,
    zIndex: 10,
  },
  {
    id: 'timer-1',
    type: 'timer',
    title: 'Minuteur',
    x: 40,
    y: 280,
    width: 320,
    height: 330,
    zIndex: 11,
  },
  {
    id: 'notes-1',
    type: 'notes',
    title: 'Consignes & Notes',
    x: 390,
    y: 40,
    width: 360,
    height: 270,
    zIndex: 12,
  },
  {
    id: 'todo-1',
    type: 'todo',
    title: 'Tâches du jour',
    x: 390,
    y: 330,
    width: 360,
    height: 310,
    zIndex: 13,
  },
  {
    id: 'image-1',
    type: 'image',
    title: 'Illustration de classe',
    x: 780,
    y: 40,
    width: 440,
    height: 380,
    zIndex: 14,
  },
];

export const App: React.FC = () => {
  const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LAYOUT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_WIDGETS;
  });

  const [currentBg, setCurrentBg] = useState<BackgroundOption>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BG_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_BACKGROUNDS[0]; // Classroom board by default
  });

  const [maxZIndex, setMaxZIndex] = useState<number>(20);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync layout to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_LAYOUT_KEY, JSON.stringify(widgets));
  }, [widgets]);

  // Sync background to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_BG_KEY, JSON.stringify(currentBg));
  }, [currentBg]);

  // Fullscreen listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const bringToFront = useCallback((id: string) => {
    setMaxZIndex((prev) => {
      const nextZ = prev + 1;
      setWidgets((current) =>
        current.map((w) => (w.id === id ? { ...w, zIndex: nextZ } : w))
      );
      return nextZ;
    });
  }, []);

  const updateWidget = useCallback((id: string, updates: Partial<WidgetInstance>) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
  }, []);

  const closeWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const toggleWidget = useCallback((type: WidgetType) => {
    setWidgets((prev) => {
      const existing = prev.find((w) => w.type === type);
      if (existing) {
        // Close it if already open
        return prev.filter((w) => w.id !== existing.id);
      } else {
        // Open a new one
        const defaults = DEFAULT_WIDGETS.find((w) => w.type === type);
        const newWidget: WidgetInstance = {
          id: `${type}-${Date.now()}`,
          type,
          title:
            type === 'clock'
              ? 'Horloge & Date'
              : type === 'timer'
              ? 'Minuteur'
              : type === 'todo'
              ? 'Tâches du jour'
              : type === 'notes'
              ? 'Notes'
              : 'Image',
          x: Math.min(window.innerWidth - 360, Math.max(50, 100 + prev.length * 30)),
          y: Math.min(window.innerHeight - 360, Math.max(50, 80 + prev.length * 30)),
          width: defaults ? defaults.width : 320,
          height: defaults ? defaults.height : 260,
          zIndex: maxZIndex + 1,
        };
        setMaxZIndex((z) => z + 1);
        return [...prev, newWidget];
      }
    });
  }, [maxZIndex]);

  const addMultiWidget = useCallback((type: 'notes' | 'image') => {
    const newWidget: WidgetInstance = {
      id: `${type}-${Date.now()}`,
      type,
      title: type === 'notes' ? `Note #${widgets.filter(w => w.type === 'notes').length + 1}` : `Image #${widgets.filter(w => w.type === 'image').length + 1}`,
      x: Math.min(window.innerWidth - 380, 150 + Math.random() * 200),
      y: Math.min(window.innerHeight - 380, 100 + Math.random() * 150),
      width: type === 'notes' ? 340 : 400,
      height: type === 'notes' ? 260 : 340,
      zIndex: maxZIndex + 1,
    };
    setMaxZIndex((z) => z + 1);
    setWidgets((prev) => [...prev, newWidget]);
  }, [maxZIndex, widgets]);

  const resetLayout = useCallback(() => {
    setWidgets(DEFAULT_WIDGETS);
  }, []);

  // Compute active counts for bottom dock
  const activeWidgetCounts: Record<WidgetType, number> = {
    clock: widgets.filter((w) => w.type === 'clock').length,
    timer: widgets.filter((w) => w.type === 'timer').length,
    todo: widgets.filter((w) => w.type === 'todo').length,
    notes: widgets.filter((w) => w.type === 'notes').length,
    image: widgets.filter((w) => w.type === 'image').length,
  };

  const renderWidgetContent = (widget: WidgetInstance) => {
    switch (widget.type) {
      case 'clock':
        return <ClockWidget />;
      case 'timer':
        return <TimerWidget />;
      case 'todo':
        return <TodoListWidget />;
      case 'notes':
        return <NotesWidget id={widget.id} />;
      case 'image':
        return <ImageWidget id={widget.id} />;
      default:
        return null;
    }
  };

  const getWidgetIcon = (type: WidgetType) => {
    switch (type) {
      case 'clock':
        return <ClockIcon size={16} />;
      case 'timer':
        return <TimerIcon size={16} />;
      case 'todo':
        return <CheckSquare size={16} />;
      case 'notes':
        return <StickyNote size={16} />;
      case 'image':
        return <ImageIcon size={16} />;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-slate-950">
      {/* Background Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out pointer-events-none"
        style={{
          backgroundImage:
            currentBg.type === 'image'
              ? `url("${currentBg.value}")`
              : currentBg.value,
        }}
      >
        <div className="absolute inset-0 bg-black/25 backdrop-brightness-95 pointer-events-none" />
      </div>

      {/* Floating Canvas / Active Widgets */}
      <div className="relative w-full h-full pb-24">
        {widgets.map((widget) => (
          <WidgetWindow
            key={widget.id}
            widget={widget}
            onUpdate={updateWidget}
            onClose={closeWidget}
            onFocus={bringToFront}
            icon={getWidgetIcon(widget.type)}
          >
            {renderWidgetContent(widget)}
          </WidgetWindow>
        ))}
      </div>

      {/* Bottom Dock Control Bar */}
      <DockBar
        onToggleWidget={toggleWidget}
        onAddMultiWidget={addMultiWidget}
        activeWidgetCounts={activeWidgetCounts}
        currentBg={currentBg}
        onChangeBg={setCurrentBg}
        onResetLayout={resetLayout}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  );
};

export default App;
