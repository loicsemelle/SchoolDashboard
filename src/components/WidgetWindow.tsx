import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Minus, Square, GripHorizontal } from 'lucide-react';
import { WidgetInstance } from '../types/dashboard';

interface WidgetWindowProps {
  widget: WidgetInstance;
  onUpdate: (id: string, updates: Partial<WidgetInstance>) => void;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  minWidth?: number;
  minHeight?: number;
}

export const WidgetWindow: React.FC<WidgetWindowProps> = ({
  widget,
  onUpdate,
  onClose,
  onFocus,
  children,
  icon,
  minWidth = 260,
  minHeight = 160,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });
  const resizeStartRef = useRef<{ mouseX: number; mouseY: number; startW: number; startH: number }>({
    mouseX: 0,
    mouseY: 0,
    startW: 0,
    startH: 0,
  });

  // Handle Dragging
  const handleDragStart = (e: React.MouseEvent) => {
    // Only drag with left click and if not clicking a button/input
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('textarea')) {
      return;
    }

    onFocus(widget.id);
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: widget.x,
      startY: widget.y,
    };
    e.preventDefault();
  };

  // Handle Resizing
  const handleResizeStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    onFocus(widget.id);
    setIsResizing(true);
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startW: widget.width,
      startH: widget.height,
    };
    e.preventDefault();
  };

  // Global Mouse Move & Mouse Up listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStartRef.current.mouseX;
        const dy = e.clientY - dragStartRef.current.mouseY;

        const newX = Math.max(10, Math.min(window.innerWidth - 80, dragStartRef.current.startX + dx));
        const newY = Math.max(10, Math.min(window.innerHeight - 120, dragStartRef.current.startY + dy));

        onUpdate(widget.id, { x: newX, y: newY });
      } else if (isResizing) {
        const dw = e.clientX - resizeStartRef.current.mouseX;
        const dh = e.clientY - resizeStartRef.current.mouseY;

        const newW = Math.max(minWidth, Math.min(window.innerWidth - widget.x - 20, resizeStartRef.current.startW + dw));
        const newH = Math.max(minHeight, Math.min(window.innerHeight - widget.y - 80, resizeStartRef.current.startH + dh));

        onUpdate(widget.id, { width: newW, height: newH });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
      if (isResizing) setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, widget.id, widget.x, widget.y, minWidth, minHeight, onUpdate]);

  const toggleMinimize = useCallback(() => {
    onUpdate(widget.id, { isMinimized: !widget.isMinimized });
  }, [widget.id, widget.isMinimized, onUpdate]);

  return (
    <div
      onMouseDown={() => onFocus(widget.id)}
      style={{
        transform: `translate3d(${widget.x}px, ${widget.y}px, 0)`,
        width: `${widget.width}px`,
        height: widget.isMinimized ? 'auto' : `${widget.height}px`,
        zIndex: widget.zIndex,
      }}
      className={`absolute top-0 left-0 flex flex-col rounded-2xl border border-white/20 bg-slate-900/80 backdrop-blur-xl shadow-2xl transition-shadow ${
        isDragging ? 'shadow-cyan-500/20 ring-2 ring-cyan-400/50 cursor-grabbing' : 'hover:border-white/30'
      }`}
    >
      {/* Window Header */}
      <div
        onMouseDown={handleDragStart}
        className="flex items-center justify-between px-3.5 py-2.5 bg-white/10 select-none cursor-grab active:cursor-grabbing rounded-t-2xl border-b border-white/10"
      >
        <div className="flex items-center gap-2 text-white font-medium text-sm truncate">
          <span className="text-cyan-400 flex items-center">{icon}</span>
          <span className="truncate">{widget.title}</span>
        </div>

        <div className="flex items-center gap-1 ml-2 text-slate-300">
          <button
            onClick={toggleMinimize}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors text-slate-300 hover:text-white"
            title={widget.isMinimized ? 'Agrandir' : 'Réduire'}
          >
            {widget.isMinimized ? <Square size={13} /> : <Minus size={13} />}
          </button>
          <button
            onClick={() => onClose(widget.id)}
            className="p-1 hover:bg-red-500/80 rounded-lg transition-colors text-slate-300 hover:text-white"
            title="Fermer"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Window Content */}
      {!widget.isMinimized && (
        <div className="flex-1 overflow-auto p-3 text-slate-100 flex flex-col min-h-0 relative">
          {children}

          {/* Resize Handle */}
          <div
            onMouseDown={handleResizeStart}
            className="absolute bottom-1 right-1 w-4 h-4 cursor-se-resize flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
            title="Redimensionner"
          >
            <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-white/70 fill-current">
              <path d="M7 9 L9 7 L9 9 Z M3 9 L9 3 L9 5 L5 9 Z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
