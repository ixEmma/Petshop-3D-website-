import { useCallback, useEffect, useRef, useState } from 'react';
import type { QualityProfile, WorldMetrics } from '../three/types';

const levels: QualityProfile[] = ['desktop', 'tablet', 'mobile'];

/** Use sustained frame measurements, never the user agent, to reduce GPU work. */
export function useAdaptiveQuality(quality: QualityProfile, reducedMotion: boolean) {
  const [level, setLevel] = useState(0);
  const [performanceFallback, setPerformanceFallback] = useState(false);
  const sample = useRef({ profile: '', since: 0, slow: 0 });
  const renderQuality = levels[Math.max(level, levels.indexOf(quality))];

  useEffect(() => {
    // A newly focused/backgrounded tab needs a fresh measurement window.
    const reset = () => { sample.current = { profile: '', since: performance.now(), slow: 0 }; };
    document.addEventListener('visibilitychange', reset);
    return () => document.removeEventListener('visibilitychange', reset);
  }, []);

  const onMetrics = useCallback((metrics: WorldMetrics) => {
    const current = sample.current;
    if (reducedMotion || metrics.fps === null || document.hidden || document.querySelector('dialog[open]')) return;
    if (current.profile !== metrics.quality) {
      current.profile = metrics.quality; current.since = performance.now(); current.slow = 0;
      return;
    }
    // Shader compilation and allocation after a quality change are not steady state.
    if (performance.now() - current.since < 6000) return;
    current.slow = metrics.fps < (metrics.quality === 'mobile' ? 12 : 24) ? current.slow + 1 : 0;
    if (current.slow < 3) return;
    current.slow = 0;
    if (metrics.quality === 'mobile') setPerformanceFallback(true);
    else setLevel(levels.indexOf(metrics.quality) + 1);
  }, [reducedMotion]);

  const resetPerformance = useCallback(() => {
    sample.current = { profile: '', since: performance.now(), slow: 0 };
    setLevel(0); setPerformanceFallback(false);
  }, []);

  return { renderQuality, performanceFallback, onMetrics, resetPerformance };
}
