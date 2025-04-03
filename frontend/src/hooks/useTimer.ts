import { useEffect, useState, useCallback } from "react";

export const useTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTime((prev) => (prev < 999 ? prev + 1 : 999));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const startTimer = useCallback(() => setIsRunning(true), []);
  const stopTimer = useCallback(() => {
    setIsRunning(false);
  }, []);
  const resetTimer = useCallback(() => {
    setTime(0);
    setIsRunning(true);
  }, []);

  return { time, isRunning, startTimer, stopTimer, resetTimer };
};
