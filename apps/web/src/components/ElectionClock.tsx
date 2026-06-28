import { useState, useEffect, useRef } from "react";
import Button from "./ui/Button";

interface ElectionClockProps {
  startTime: Date | number;
  endTime: Date | number;
}

export default function ElectionClock({
  startTime,
  endTime,
}: ElectionClockProps) {
  const [now, setNow] = useState(new Date().getTime());

  const startMs = new Date(startTime).getTime();
  const endMs = new Date(endTime).getTime();

  // Helper function to determine the current phase
  const getPhase = (time: number) => {
    if (time < startMs) return "pending";
    if (time < endMs) return "active";
    return "ended";
  };

  const currentPhase = getPhase(now);

  // Track the phase when the component first mounts
  const phaseRef = useRef(currentPhase);

  // 1. Clock Tick Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 2. Phase Transition (Reload) Effect
  useEffect(() => {
    // If the current phase is different from the phase we started in, a transition happened!
    if (currentPhase !== phaseRef.current) {
      window.location.reload();
    }
  }, [currentPhase]);

  // Calculate remaining time based on current phase
  const isPending = currentPhase === "pending";
  const isActive = currentPhase === "active";
  const isEnded = currentPhase === "ended";

  const targetTime = isPending ? startMs : endMs;
  const timeDiff = Math.max(0, targetTime - now);

  // Format time (Days, Hours, Minutes, Seconds)
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  const formattedTime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

  // Dynamic Styles
  let containerStyles = "";
  let labelText = "";

  if (isPending) {
    containerStyles = "text-green-800 border-green-600 bg-green-100";
    labelText = "Starts in";
  } else if (isActive) {
    containerStyles = "text-red-800 border-red-600 bg-red-100";
    labelText = "Ends in";
  } else if (isEnded) {
    containerStyles = "text-gray-600 border-gray-400 bg-gray-100 opacity-80";
    labelText = "Election Ended";
  }

  return (
    <div
      className={`p-5 flex flex-col rounded-xl text-3xl border-2 transition-colors duration-500 ${containerStyles}`}
    >
      <p className="text-xl font-semibold opacity-90">{labelText}</p>
      <p className="font-mono font-bold mt-1">
        {isEnded ? "Closed" : <span>{formattedTime}</span>}
      </p>
    </div>
  );
}
