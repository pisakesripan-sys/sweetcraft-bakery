import React, { useState, useEffect } from "react";
import { Lock, Unlock, KeyRound, ChefHat, ShieldCheck } from "lucide-react";

interface PinLockProps {
  onUnlock: () => void;
}

export const PinLock: React.FC<PinLockProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [savedPin, setSavedPin] = useState(() => {
    return localStorage.getItem("sweetcraft_app_pin") || "1234";
  });

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      if (newPin === savedPin) {
        localStorage.setItem("sweetcraft_unlocked", "true");
        onUnlock();
      } else if (newPin.length === savedPin.length) {
        setError(true);
        setTimeout(() => setPin(""), 800);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin("");
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#faf6f0] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 border border-stone-200/80 shadow-2xl text-center animate-in fade-in zoom-in-95">
        {/* Logo */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black text-stone-800 tracking-tight">SweetCraft Master</h2>
        <p className="text-xs text-stone-500 mt-1 mb-6">
          เว็บแอปนี้สงวนสิทธิ์เฉพาะผู้มีรหัสผ่านเข้าใช้งาน
        </p>

        {/* PIN Dots Display */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                error
                  ? "bg-red-500 scale-110 animate-bounce"
                  : pin.length > idx
                  ? "bg-amber-600 scale-125 shadow-sm"
                  : "bg-stone-200"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-500 font-bold mb-4 animate-shake">
            รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto mb-6">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="w-16 h-16 rounded-2xl bg-stone-50 hover:bg-amber-50 active:bg-amber-100 text-stone-800 hover:text-amber-900 font-mono text-2xl font-bold border border-stone-200/80 shadow-sm hover:shadow transition-all flex items-center justify-center mx-auto active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="w-16 h-16 rounded-2xl text-xs font-semibold text-stone-400 hover:text-stone-700 flex items-center justify-center mx-auto"
          >
            ล้าง
          </button>
          <button
            onClick={() => handleKeyPress("0")}
            className="w-16 h-16 rounded-2xl bg-stone-50 hover:bg-amber-50 active:bg-amber-100 text-stone-800 hover:text-amber-900 font-mono text-2xl font-bold border border-stone-200/80 shadow-sm hover:shadow transition-all flex items-center justify-center mx-auto active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="w-16 h-16 rounded-2xl text-xs font-semibold text-stone-400 hover:text-stone-700 flex items-center justify-center mx-auto"
          >
            ⌫
          </button>
        </div>

        <div className="pt-4 border-t border-stone-100">
          <p className="text-[11px] text-stone-400">
            รหัสผ่านเริ่มต้นคือ: <strong className="text-amber-800 font-mono font-bold">1234</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
