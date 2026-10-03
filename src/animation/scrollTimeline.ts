import { gsap, ScrollTrigger } from '../lib/gsap';
import { createSmoothScroll } from '../lib/lenis';
import type { WorldState } from '../three/types';

/** One scroll timeline owns the world's normalized progression. */
export function createScrollTimeline(
  root: HTMLElement,
  state: WorldState,
  options: { reducedMotion: boolean; simpleView: boolean; onChapter: (chapter: number) => void },
) {
  const journey = root.querySelector<HTMLElement>('#journey');
  if (!journey) return () => {};
  const sections = Array.from(journey.querySelectorAll<HTMLElement>('[data-chapter]'));
  const stopLenis = !options.reducedMotion && !options.simpleView ? createSmoothScroll() : () => {};
  let chapter = -1;
  let thresholds: number[] = [];
  let disposed = false;

  const measure = () => {
    const start = journey.getBoundingClientRect().top + window.scrollY;
    const distance = Math.max(1, journey.offsetHeight - window.innerHeight);
    thresholds = sections.map(section => (section.getBoundingClientRect().top + window.scrollY - start) / distance);
  };
  const syncUI = (progress: number) => {
    root.style.setProperty('--journey-progress', String(progress));
    let next = 0;
    thresholds.forEach((threshold, index) => { if (progress + 0.002 >= threshold) next = index; });
    if (next !== chapter) { chapter = next; options.onChapter(next); }
  };
  measure();
  const context = gsap.context(() => {
    gsap.fromTo(state, { progress: 0 }, {
      progress: 1,
      duration: 1,
      ease: 'none',
      onUpdate: () => state.invalidate?.(),
      scrollTrigger: {
        id: 'goodkind-world-journey',
        trigger: journey,
        start: 'top top',
        end: 'bottom bottom',
        scrub: options.reducedMotion || options.simpleView ? true : 0.65,
        invalidateOnRefresh: true,
        onRefresh: self => { measure(); syncUI(self.progress); },
        onUpdate: self => syncUI(self.progress),
      },
    });
  }, root);
  const refresh = () => { if (!disposed) ScrollTrigger.refresh(); };
  document.fonts.ready.then(refresh);
  // Canvas/texture loading does not determine the HTML document's scroll length.
  refresh();
  return () => {
    disposed = true;
    context.revert();
    stopLenis();
    root.style.removeProperty('--journey-progress');
  };
}
