import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Bell, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playChimeSound } from '../utils/sound';

export const TimerWidget: React.FC = () => {
  const [totalDuration, setTotalDuration] = useState<number>(300); // 5 minutes default
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setIsFinished(true);
            if (soundEnabled) {
              playChimeSound();
            }
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
              });
            } catch {
              // fallback
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, soundEnabled, timeLeft]);

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(totalDuration);
      setIsFinished(false);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
      setIsFinished(false);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalDuration);
    setIsFinished(false);
  };

  const addTime = (secondsToAdd: number) => {
    const newTotal = totalDuration + secondsToAdd;
    setTotalDuration(newTotal);
    setTimeLeft((prev) => prev + secondsToAdd);
    setIsFinished(false);
  };

  const setCustomMinutes = (minutes: number) => {
    const seconds = minutes * 60;
    setIsRunning(false);
    setTotalDuration(seconds);
    setTimeLeft(seconds);
    setIsFinished(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Percentage for progress ring
  const percentage = totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 0;
  const strokeDashoffset = 283 - (283 * percentage) / 100;

  return (
    <div className="flex flex-col items-center justify-between h-full select-none py-1">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-1 mb-1">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-1 rounded-lg text-xs flex items-center gap-1 transition-colors ${
            soundEnabled ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 bg-white/5'
          }`}
          title={soundEnabled ? 'Son activé' : 'Son désactivé'}
        >
          {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          <span className="text-[10px]">{soundEnabled ? 'Sonnerie ON' : 'Muet'}</span>
        </button>

        {isFinished && (
          <span className="animate-bounce flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
            <Bell size={12} /> Temps écoulé !
          </span>
        )}
      </div>

      {/* Circular Progress & Time Display */}
      <div className="relative flex items-center justify-center my-auto">
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r="45"
            stroke="currentColor"
            strokeWidth="7"
            className="text-white/10"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r="45"
            stroke="currentColor"
            strokeWidth="7"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-500 ${
              isFinished
                ? 'text-red-500'
                : timeLeft < 60 && isRunning
                ? 'text-amber-400'
                : 'text-cyan-400'
            }`}
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className={`text-3xl font-black font-mono tracking-tight ${
              isFinished ? 'text-red-400 animate-pulse' : 'text-white'
            }`}
          >
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {isRunning ? 'En cours' : timeLeft === 0 ? 'Fini' : 'En pause'}
          </span>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={toggleTimer}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm shadow-lg transition-all transform active:scale-95 ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/30'
          }`}
        >
          {isRunning ? <Pause size={15} /> : <Play size={15} />}
          <span>{isRunning ? 'Pause' : 'Démarrer'}</span>
        </button>

        <button
          onClick={resetTimer}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          title="Réinitialiser"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Quick Presets */}
      <div className="w-full flex items-center justify-center gap-1.5 pt-3 border-t border-white/10 mt-2 flex-wrap">
        <button
          onClick={() => setCustomMinutes(1)}
          className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-xs text-slate-300 hover:text-white transition-colors"
        >
          1m
        </button>
        <button
          onClick={() => setCustomMinutes(3)}
          className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-xs text-slate-300 hover:text-white transition-colors"
        >
          3m
        </button>
        <button
          onClick={() => setCustomMinutes(5)}
          className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-xs text-slate-300 hover:text-white transition-colors"
        >
          5m
        </button>
        <button
          onClick={() => setCustomMinutes(10)}
          className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-xs text-slate-300 hover:text-white transition-colors"
        >
          10m
        </button>
        <button
          onClick={() => setCustomMinutes(15)}
          className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-xs text-slate-300 hover:text-white transition-colors"
        >
          15m
        </button>
        <button
          onClick={() => addTime(60)}
          className="px-2 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-xs text-cyan-300 flex items-center gap-0.5 transition-colors"
          title="Ajouter 1 minute"
        >
          <Plus size={11} /> 1m
        </button>
      </div>
    </div>
  );
};
