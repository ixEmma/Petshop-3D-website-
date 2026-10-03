import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ProductDialog } from './components/ProductDialog';
import { WorldBoundary } from './components/WorldBoundary';
import { products, type Product } from './data/products';
import { createScrollTimeline } from './animation/scrollTimeline';
import { useDisplayProfile } from './hooks/useDisplayProfile';
import { useAdaptiveQuality } from './hooks/useAdaptiveQuality';
import { ExperienceUI } from './sections/ExperienceUI';
import type { WorldMetrics, WorldState } from './three/types';

const Experience = lazy(() => import('./three/Experience'));

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch { return false; }
}

export function App() {
  const root = useRef<HTMLDivElement>(null);
  const world = useRef<WorldState>({ progress: 0, selectedProduct: -1 });
  const { quality, reducedMotion } = useDisplayProfile();
  const { renderQuality, performanceFallback, onMetrics: assessPerformance, resetPerformance } = useAdaptiveQuality(quality, reducedMotion);
  const [activeChapter, setActiveChapter] = useState(0);
  const currentChapter = useRef(0);
  const previousView = useRef(false);
  const pendingChapter = useRef<number | null>(null);
  const [simplePreference, setSimplePreference] = useState(() => new URLSearchParams(location.search).get('view') === 'simple');
  const [supported, setSupported] = useState<boolean | null>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const simpleView = simplePreference || supported === false || failed || performanceFallback;

  useEffect(() => { setSupported(supportsWebGL()); }, []);
  useLayoutEffect(() => {
    if (!root.current) return;
    if (simpleView && !previousView.current && pendingChapter.current === null) pendingChapter.current = currentChapter.current;
    previousView.current = simpleView;
    if (pendingChapter.current !== null) {
      root.current.querySelector<HTMLElement>(`[data-chapter="${pendingChapter.current}"]`)?.scrollIntoView({ behavior: 'instant' });
      pendingChapter.current = null;
    }
    return createScrollTimeline(root.current, world.current, { reducedMotion, simpleView, onChapter: chapter => { currentChapter.current = chapter; setActiveChapter(chapter); } });
  }, [reducedMotion, simpleView]);

  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => { setFailed(true); setReady(false); }, []);
  const onMetrics = useCallback((metrics: WorldMetrics) => {
    if (import.meta.env.DEV && root.current) {
      root.current.dataset.renderFps = String(metrics.fps ?? 'demand');
      root.current.dataset.renderCalls = String(metrics.calls);
    }
    assessPerformance(metrics);
  }, [assessPerformance]);
  const selectProduct = useCallback((id: string) => {
    const selected = products.find(item => item.id === id);
    if (!selected) return;
    world.current.selectedProduct = products.indexOf(selected);
    world.current.invalidate?.();
    setProduct(selected);
  }, []);
  const closeProduct = useCallback(() => { setProduct(null); world.current.selectedProduct = -1; world.current.invalidate?.(); }, []);
  const changeView = useCallback((value: boolean) => {
    pendingChapter.current = activeChapter;
    setSimplePreference(value);
    if (!value) { setFailed(false); setReady(false); setLoadingProgress(0); resetPerformance(); }
  }, [activeChapter, resetPerformance]);

  return <div ref={root} className="immersive-app" data-view={simpleView ? 'simple' : 'cinematic'} data-webgl={failed ? 'failed' : supported === null ? 'checking' : supported ? 'available' : 'unavailable'} data-ready={ready || simpleView} data-chapter={activeChapter} data-motion={reducedMotion ? 'reduced' : 'full'} data-quality={renderQuality} data-performance-fallback={performanceFallback}>
    {!simpleView && supported && <div className="world-canvas" aria-hidden="true"><WorldBoundary onError={onError}>
      <Suspense fallback={null}>
        <Experience state={world.current} quality={quality} renderQuality={renderQuality} reducedMotion={reducedMotion} onReady={onReady} onError={onError} onProgress={setLoadingProgress} onMetrics={onMetrics} onProductSelect={selectProduct} />
      </Suspense>
    </WorldBoundary></div>}
    {!simpleView && !ready && <div className="world-loading" role="status" aria-live="polite">
      <img src="/pets/dog-golden-retriever-small.webp" width="400" height="600" alt="" />
      <span className="world-loading-wordmark">goodkind</span>
      <p>{loadingProgress > 0 ? `Opening your world · ${Math.round(loadingProgress)}%` : 'A little good is on its way.'}</p>
      <div className="world-loading-track" aria-hidden="true"><span style={{ width: `${loadingProgress}%` }} /></div>
      <button type="button" onClick={() => changeView(true)}>Continue with the simpler view</button>
    </div>}
    {(failed || supported === false || performanceFallback) && <p className="world-notice" role="status">{performanceFallback ? 'Switched to the illustrated view to keep your visit smooth.' : 'The illustrated view is ready.'} You can explore the whole collection here.</p>}
    <ExperienceUI activeChapter={activeChapter} simpleView={simpleView} reducedMotion={reducedMotion} onSimpleViewChange={changeView} onProductSelect={selectProduct} selectedProductId={product?.id ?? null} onProductFocus={index => { world.current.selectedProduct = index; world.current.invalidate?.(); }} onProductBlur={() => { if (!product) { world.current.selectedProduct = -1; world.current.invalidate?.(); } }} />
    <ProductDialog product={product} onClose={closeProduct} />
  </div>;
}
