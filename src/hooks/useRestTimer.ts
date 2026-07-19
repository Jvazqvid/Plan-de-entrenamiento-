import { useCallback, useEffect, useRef, useState } from 'react';
import { beep } from '@/lib/sound';

interface RestTimerState {
  remaining: number | null;
  start: (seconds: number) => void;
  cancel: () => void;
  add: (seconds: number) => void;
}

interface TimerOptions {
  sound?: boolean;
  vibrate?: boolean;
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(pattern); } catch { /* ignore */ }
  }
}

/**
 * Timer de descanso entre series. Patrón de pitidos:
 *   - 1 aviso a los 10 s restantes
 *   - 1 pitido por cada uno de los últimos 5 s (5-4-3-2-1)
 *   - 1 pitido fuerte al llegar a 0
 */
export function useRestTimer(options: TimerOptions = {}): RestTimerState {
  const [remaining, setRemaining] = useState<number | null>(null);
  const targetRef = useRef<number | null>(null);
  const beepedRef = useRef<Set<number>>(new Set());
  const optRef = useRef(options);
  optRef.current = options;

  const signal = useCallback((strong: boolean) => {
    const { sound = true, vibrate: vib = true } = optRef.current;
    if (sound) beep(strong);
    if (vib) vibrate(strong ? [120, 60, 120] : 40);
  }, []);

  const tick = useCallback(() => {
    if (targetRef.current === null) return;
    const left = Math.max(0, Math.round((targetRef.current - Date.now()) / 1000));
    setRemaining(left);
    const done = beepedRef.current;
    if (left === 10 && !done.has(10)) { done.add(10); signal(false); }
    if (left <= 5 && left >= 1 && !done.has(left)) { done.add(left); signal(false); }
    if (left === 0 && !done.has(0)) {
      done.add(0);
      signal(true);
      targetRef.current = null;
      setTimeout(() => setRemaining(null), 900);
    }
  }, [signal]);

  useEffect(() => {
    if (remaining === null) return;
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [remaining, tick]);

  const start = useCallback((seconds: number) => {
    beepedRef.current = new Set();
    targetRef.current = Date.now() + seconds * 1000;
    setRemaining(seconds);
  }, []);

  const cancel = useCallback(() => {
    targetRef.current = null;
    setRemaining(null);
  }, []);

  const add = useCallback((seconds: number) => {
    if (targetRef.current === null) return;
    targetRef.current += seconds * 1000;
    setRemaining((r) => (r === null ? r : r + seconds));
  }, []);

  return { remaining, start, cancel, add };
}

/** Segundos transcurridos desde un timestamp de inicio; se refresca cada segundo. */
export function useElapsed(startedAt: number | null): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (startedAt === null) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  if (startedAt === null) return 0;
  return Math.max(0, Math.floor((now - startedAt) / 1000));
}
