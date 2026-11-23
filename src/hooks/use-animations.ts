"use client";

import { useEffect, useRef, useState } from "react";

export function useScoreAnimation(targetScore: number, duration = 1000) {
  const [displayScore, setDisplayScore] = useState(0);
  const displayScoreRef = useRef(0);

  useEffect(() => {
    displayScoreRef.current = displayScore;
  }, [displayScore]);

  useEffect(() => {
    let startTime: number | null = null;
    const startScore = displayScoreRef.current;
    let frameId = 0;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayScore(Math.round(startScore + (targetScore - startScore) * eased));

      if (progress < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [targetScore, duration]);

  return displayScore;
}

export function useStreakAnimation(targetStreak: number) {
  const [displayStreak, setDisplayStreak] = useState(0);
  const [isPopping, setIsPopping] = useState(false);
  const displayStreakRef = useRef(0);

  useEffect(() => {
    displayStreakRef.current = displayStreak;
  }, [displayStreak]);

  useEffect(() => {
    const startStreak = displayStreakRef.current;
    let frameId = 0;
    let popTimeout: number | undefined;
    let unpopTimeout: number | undefined;

    if (targetStreak > startStreak) {
      popTimeout = window.setTimeout(() => setIsPopping(true), 0);
      unpopTimeout = window.setTimeout(() => setIsPopping(false), 300);
    }

    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / 500, 1);
      const c1 = 1.70158;
      const c3 = c1 + 1;
      const eased =
        1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);

      setDisplayStreak(
        Math.round(startStreak + (targetStreak - startStreak) * eased),
      );

      if (progress < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => {
      if (popTimeout) window.clearTimeout(popTimeout);
      if (unpopTimeout) window.clearTimeout(unpopTimeout);
      cancelAnimationFrame(frameId);
    };
  }, [targetStreak]);

  return { displayStreak, isPopping };
}
