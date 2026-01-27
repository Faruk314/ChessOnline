import { useState, useEffect } from "react";

interface TimerProps {
  remainingTime: number;
  isTimerActive: boolean;
  hasTimerStarted: boolean;
}

const Timer = ({
  remainingTime,
  isTimerActive,
  hasTimerStarted,
}: TimerProps) => {
  const [displayTime, setDisplayTime] = useState(remainingTime);

  useEffect(() => {
    setDisplayTime(remainingTime);

    let interval: NodeJS.Timeout;

    if (isTimerActive && hasTimerStarted) {
      interval = setInterval(() => {
        setDisplayTime((prev) => (prev > 0 ? prev - 1000 : 0));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [remainingTime, isTimerActive, hasTimerStarted]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const isLowTime = displayTime < 30000;

  return (
    <div
      className={`flex items-center justify-center bg-black/40 rounded-xl px-3 md:px-5 border transition-all duration-300 min-w-[90px] md:min-w-[120px] py-1 ${
        isTimerActive
          ? "border-gray-500 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
          : "border-gray-800 opacity-60"
      }`}
    >
      <span
        className={`font-mono text-xl md:text-3xl font-bold tracking-widest ${
          isLowTime && isTimerActive && hasTimerStarted
            ? "text-red-500 animate-pulse"
            : "text-emerald-400"
        }`}
      >
        {formatTime(displayTime)}
      </span>
    </div>
  );
};

export default Timer;
