import { useState, useEffect, useRef, useMemo } from 'react';
import { useContentStore } from '../store/contentStore';
import { useProjects } from '../context/ProjectContext';

const MIN_DISPLAY_MS = 5000;
const PHASES = ['logo', 'text', 'neural', 'progress', 'collapse', 'done'];

const loadingMessages = [
  { threshold: 0, message: 'Initializing...' },
  { threshold: 20, message: 'Loading CMS Content...' },
  { threshold: 45, message: 'Loading Projects...' },
  { threshold: 65, message: 'Loading Experience...' },
  { threshold: 85, message: 'Loading Assets...' },
  { threshold: 95, message: 'Almost Ready...' },
];

export const usePortfolioLoading = () => {
  const contentLoading = useContentStore((s) => s.loading);
  const { loading: projectsLoading } = useProjects();

  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [visibleChars, setVisibleChars] = useState(1);
  const startRef = useRef(Date.now());
  const collapseStarted = useRef(false);

  const actualLoadingDone = useMemo(
    () => !contentLoading && !projectsLoading,
    [contentLoading, projectsLoading]
  );

  useEffect(() => {
    if (phase >= 4) return;
    const timers = [
      setTimeout(() => { if (phase < 1) setPhase(1); }, 600),
      setTimeout(() => { if (phase < 2) setPhase(2); }, 1800),
      setTimeout(() => { if (phase < 3) setPhase(3); }, 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  useEffect(() => {
    if (phase < 1 || phase >= 4) return;
    if (visibleChars >= 8) return;
    const t = setTimeout(() => setVisibleChars((p) => Math.min(p + 1, 8)), 160 + Math.random() * 80);
    return () => clearTimeout(t);
  }, [phase, visibleChars]);

  useEffect(() => {
    const calc = () => {
      let p = 0;
      if (!contentLoading) p += 50;
      if (!projectsLoading) p += 30;
      if (document.readyState === 'complete') p += 20;
      setProgress((prev) => Math.min(Math.max(prev, p), 95));
    };
    calc();
    if (document.readyState !== 'complete') {
      document.addEventListener('readystatechange', calc);
      return () => document.removeEventListener('readystatechange', calc);
    }
  }, [contentLoading, projectsLoading]);

  useEffect(() => {
    if (!actualLoadingDone || collapseStarted.current) return;
    collapseStarted.current = true;

    const elapsed = Date.now() - startRef.current;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

    const t1 = setTimeout(() => {
      setProgress(100);
      setPhase(4);
      setVisibleChars(8);
    }, remaining);

    const t2 = setTimeout(() => {
      setPhase(5);
      setIsComplete(true);
    }, remaining + 800);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [actualLoadingDone]);

  const currentPhase = useMemo(() => PHASES[phase] || 'logo', [phase]);

  const loadingMessage = useMemo(() => {
    const msg = [...loadingMessages].reverse().find((m) => progress >= m.threshold);
    return msg?.message || loadingMessages[0].message;
  }, [progress]);

  return {
    phase: currentPhase,
    progress,
    visibleChars,
    isComplete,
    loadingMessage,
  };
};
