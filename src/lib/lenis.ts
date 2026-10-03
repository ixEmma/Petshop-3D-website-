import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

let activeLenis: Lenis | null = null;
let paused = false;

export function setSmoothScrollPaused(value: boolean) {
  paused = value;
  if (value) activeLenis?.stop();
  else activeLenis?.start();
}

export function createSmoothScroll() {
  const lenis = new Lenis({ duration: 0.85, smoothWheel: true, syncTouch: false, autoRaf: false, anchors: { offset: -24 } });
  activeLenis = lenis;
  if (paused) lenis.stop();
  const update = () => ScrollTrigger.update();
  const tick = (seconds: number) => lenis.raf(seconds * 1000);
  lenis.on('scroll', update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.off('scroll', update);
    lenis.stop();
    lenis.destroy();
    if (activeLenis === lenis) activeLenis = null;
    gsap.ticker.lagSmoothing(500, 33);
  };
}
