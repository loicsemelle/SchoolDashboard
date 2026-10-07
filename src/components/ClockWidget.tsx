import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon, Calendar } from 'lucide-react';

export const ClockWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [isAnalog, setIsAnalog] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  // French date formatting
  const dateStr = time.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  // Analog angles
  const secAngle = seconds * 6;
  const minAngle = minutes * 6 + seconds * 0.1;
  const hrAngle = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div className="flex flex-col items-center justify-between h-full select-none py-2">
      {/* Top Controls */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setIsAnalog(!isAnalog)}
          className="text-xs px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
        >
          {isAnalog ? 'Mode Numérique' : 'Mode Analogique'}
        </button>
        {!isAnalog && (
          <button
            onClick={() => setShowSeconds(!showSeconds)}
            className="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
          >
            {showSeconds ? 'Masquer sec.' : 'Afficher sec.'}
          </button>
        )}
      </div>

      {/* Clock Display */}
      <div className="flex-1 flex items-center justify-center w-full">
        {isAnalog ? (
          <div className="relative w-36 h-36 rounded-full border-2 border-white/30 bg-slate-950/40 shadow-inner flex items-center justify-center">
            {/* Hour markers */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-2.5 bg-white/40 rounded-full"
                style={{
                  transform: `rotate(${i * 30}deg) translateY(-60px)`,
                  transformOrigin: 'center center',
                }}
              />
            ))}

            {/* Hour hand */}
            <div
              className="absolute w-1.5 h-10 bg-white rounded-full origin-bottom shadow"
              style={{
                transform: `rotate(${hrAngle}deg) translateY(-50%)`,
                bottom: '50%',
              }}
            />

            {/* Minute hand */}
            <div
              className="absolute w-1 h-14 bg-cyan-400 rounded-full origin-bottom shadow"
              style={{
                transform: `rotate(${minAngle}deg) translateY(-50%)`,
                bottom: '50%',
              }}
            />

            {/* Second hand */}
            <div
              className="absolute w-0.5 h-16 bg-rose-500 rounded-full origin-bottom"
              style={{
                transform: `rotate(${secAngle}deg) translateY(-50%)`,
                bottom: '50%',
              }}
            />

            {/* Center dot */}
            <div className="w-3 h-3 bg-white rounded-full z-10 border-2 border-slate-900" />
          </div>
        ) : (
          <div className="text-center">
            <div className="text-5xl font-black tracking-tight text-white drop-shadow-md font-mono flex items-center justify-center">
              <span>{formattedHours}</span>
              <span className="text-cyan-400 animate-pulse mx-1">:</span>
              <span>{formattedMinutes}</span>
              {showSeconds && (
                <>
                  <span className="text-cyan-400/60 mx-1">:</span>
                  <span className="text-3xl text-cyan-300 self-baseline">{formattedSeconds}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Date banner */}
      <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium bg-white/10 px-3 py-1 rounded-full border border-white/10 mt-2">
        <Calendar size={13} className="text-cyan-400" />
        <span>{capitalizedDate}</span>
      </div>
    </div>
  );
};
