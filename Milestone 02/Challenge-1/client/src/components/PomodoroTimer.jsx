import { useEffect, useState } from "react";

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function PomodoroTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(FOCUS_SECONDS);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) {
          return prev - 1;
        }

        if (mode === "focus") {
          setMode("break");
          return BREAK_SECONDS;
        }

        setMode("focus");
        return FOCUS_SECONDS;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, mode]);

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMode("focus");
    setTimeLeft(FOCUS_SECONDS);
  };

  return (
    <div className="pomodoro-timer">
      <h3>Pomodoro Timer</h3>
      <p className="pomodoro-mode">
        {mode === "focus" ? "Focus Session" : "Break Session"}
      </p>
      <p className="pomodoro-time">{formatTime(timeLeft)}</p>

      <div className="pomodoro-controls">
        <button type="button" onClick={handleStartPause}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button type="button" className="secondary" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
