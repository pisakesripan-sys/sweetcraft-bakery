import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Bell, Timer, Volume2, X } from "lucide-react";

export const TimerWidget: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen = true, onClose }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [initialSeconds, setInitialSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [customMinutes, setCustomMinutes] = useState<string>("5");
  const [isAlerting, setIsAlerting] = useState<boolean>(false);
  const [minimized, setMinimized] = useState<boolean>(false);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsAlerting(true);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, secondsLeft]);

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.log("Audio not supported", e);
    }
  };

  const startTimer = (secs: number) => {
    setInitialSeconds(secs);
    setSecondsLeft(secs);
    setIsRunning(true);
    setIsAlerting(false);
  };

  const togglePause = () => {
    if (secondsLeft === 0 && initialSeconds > 0) {
      setSecondsLeft(initialSeconds);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
    setIsAlerting(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
    setIsAlerting(false);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = initialSeconds > 0 ? ((initialSeconds - secondsLeft) / initialSeconds) * 100 : 0;

  const presets = [
    { label: "15 วิ", secs: 15 },
    { label: "1 นาที", secs: 60 },
    { label: "5 นาที", secs: 300 },
    { label: "15 นาที", secs: 900 },
    { label: "25 นาที (อบ)", secs: 1500 },
    { label: "35 นาที (ชีสเค้ก)", secs: 2100 },
  ];

  if (!isOpen) return null;

  if (minimized) {
    return (
      <div 
        onClick={() => setMinimized(false)}
        className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 cursor-pointer hover:scale-105 transition-all border border-stone-700"
      >
        <Timer className={`w-5 h-5 ${isRunning ? "text-amber-400 animate-spin" : "text-stone-300"}`} />
        <span className="font-mono font-bold text-lg">{formatTime(secondsLeft)}</span>
        {isAlerting && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 w-80 bg-white rounded-3xl shadow-2xl border transition-all ${
      isAlerting ? "border-red-500 ring-4 ring-red-500/20 animate-bounce" : "border-stone-200"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-stone-100">
        <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm">
          <Timer className="w-4 h-4 text-amber-600" />
          <span>ตัวจับเวลาในครัว (Kitchen Timer)</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(true)}
            className="text-xs text-stone-400 hover:text-stone-600 px-1.5 py-0.5 rounded"
            title="ย่อขนาด"
          >
            _
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Timer Display */}
      <div className="p-5 text-center">
        <div className="relative inline-block my-2">
          <div className={`font-mono text-5xl font-bold tracking-tight ${
            isAlerting ? "text-red-600 animate-pulse" : secondsLeft > 0 ? "text-stone-800" : "text-stone-300"
          }`}>
            {formatTime(secondsLeft)}
          </div>
          {isAlerting && (
            <div className="flex items-center justify-center gap-1.5 text-red-600 text-xs font-bold mt-1">
              <Bell className="w-4 h-4 animate-spin" /> หมดเวลาแล้ว!
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {initialSeconds > 0 && (
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mb-4">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            onClick={togglePause}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-md transition-all ${
              isRunning
                ? "bg-amber-600 hover:bg-amber-700"
                : secondsLeft > 0
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" /> พัก
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> {secondsLeft > 0 ? "จับเวลาต่อ" : "เริ่ม"}
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            disabled={secondsLeft === 0 && initialSeconds === 0}
            className="p-2.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-2xl border border-stone-200 transition-colors disabled:opacity-40"
            title="รีเซ็ตเวลา"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={playBeep}
            className="p-2.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-2xl border border-stone-200 transition-colors"
            title="ทดสอบเสียงกระดิ่ง"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => startTimer(p.secs)}
              className="px-2 py-1.5 text-xs bg-stone-50 hover:bg-amber-50 hover:text-amber-900 border border-stone-200 rounded-xl transition-colors text-stone-600 font-medium"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Custom Minutes Input */}
        <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
          <span className="text-xs text-stone-500">กำหนดเอง:</span>
          <input
            type="number"
            min="1"
            max="180"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            className="w-16 px-2 py-1 text-xs border border-stone-200 rounded-lg text-center font-mono focus:outline-none focus:border-amber-500"
          />
          <span className="text-xs text-stone-500">นาที</span>
          <button
            onClick={() => {
              const m = parseFloat(customMinutes) || 1;
              startTimer(Math.round(m * 60));
            }}
            className="ml-auto px-3 py-1 bg-stone-800 hover:bg-black text-white text-xs font-medium rounded-lg transition-colors"
          >
            ตั้งเวลา
          </button>
        </div>
      </div>
    </div>
  );
};
