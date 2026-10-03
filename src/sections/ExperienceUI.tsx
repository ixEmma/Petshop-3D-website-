import { useEffect, useRef, useState } from 'react';
import { Arrow, Spark } from '../components/Icons';
import { petAssets, type PetId } from '../data/petAssets';
import { products } from '../data/products';
import { setSmoothScrollPaused } from '../lib/lenis';

type ExperienceUIProps = {
  activeChapter: number;
  simpleView: boolean;
  reducedMotion: boolean;
  onSimpleViewChange: (value: boolean) => void;
  onProductSelect: (id: string) => void;
  selectedProductId: string | null;
  onProductFocus: (index: number) => void;
  onProductBlur: () => void;
};

const chapters = [
  { id: 'arrival', name: 'The arrival' },
  { id: 'companions', name: 'Good company' },
  { id: 'collection', name: 'Everyday objects' },
  { id: 'philosophy', name: 'Our point of view' },
  { id: 'finale', name: 'A little closer' },
];

const companions: { id: PetId; name: string; note: string }[] = [
  { id: 'dog', name: 'Dogs', note: 'The best kind of shadow.' },
  { id: 'cat', name: 'Cats', note: 'Good company. On their terms.' },
  { id: 'rabbit', name: 'Small pets', note: 'Little ones. Whole lot of heart.' },
  { id: 'parrot', name: 'Birds', note: 'A little more wild.' },
];

const principles = [
  ['Fewer, better things.', 'A small edit with a reason for every object.'],
  ['Made for real life.', 'For early walks, late naps, and everything between.'],
  ['Simple by nature.', 'Useful shapes. Warm materials. Nothing extra.'],
  ['Always good company.', 'A point of view shared by pet people.'],
];

function PetPortrait({ id, className = '' }: { id: PetId; className?: string }) {
  const pet = petAssets[id];
  return <img className={`fallback-pet ${className}`} src={pet.src} srcSet={`${pet.small} 400w, ${pet.src} 800w`} sizes="(max-width: 700px) 60vw, 35vw" width="800" height="1200" alt={pet.alt} loading={id === 'dog' ? 'eager' : 'lazy'} />;
}

export function ExperienceUI({ activeChapter, simpleView, reducedMotion, onSimpleViewChange, onProductSelect, selectedProductId, onProductFocus, onProductBlur }: ExperienceUIProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [companion, setCompanion] = useState<PetId>('dog');
  const menuRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const currentChapter = Math.min(4, Math.max(0, activeChapter));

  useEffect(() => {
    const dialog = menuRef.current;
    if (!menuOpen || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setSmoothScrollPaused(true);
    dialog.showModal();
    closeButtonRef.current?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      setSmoothScrollPaused(false);
      menuButtonRef.current?.focus({ preventScroll: true });
    };
  }, [menuOpen]);

  const sectionClass = (index: number) => `journey-chapter chapter-${chapters[index].id}${currentChapter === index ? ' is-active' : ''}`;

  return <div className="experience-ui">
    <a className="skip-link" href="#journey">Skip to the experience</a>
    <header className="world-header">
      <a className="wordmark" href="#arrival" aria-label="Goodkind, back to the beginning">goodkind</a>
      <p className="header-note">A little world.<br />A lot of good.</p>
      <nav className="world-nav" aria-label="Main navigation">
        <a href="#companions">The companions</a>
        <a href="#collection">The collection</a>
        <a href="#philosophy">Our philosophy</a>
      </nav>
      <button className="menu-toggle" type="button" ref={menuButtonRef} aria-haspopup="dialog" aria-controls="world-menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>Explore <span aria-hidden="true">＋</span></button>
    </header>

    {/* biome-ignore lint/a11y/useKeyWithClickEvents: Native dialog Escape handling and an explicit close button provide keyboard dismissal; clicking the backdrop is an additional pointer convenience. */}
    <dialog id="world-menu" className="world-menu" ref={menuRef} aria-labelledby="world-menu-title" onCancel={(event) => { event.preventDefault(); setMenuOpen(false); }} onClick={(event) => { if (event.target === event.currentTarget) setMenuOpen(false); }} data-lenis-prevent>
      <div className="world-menu-inner">
        <div className="menu-top"><p id="world-menu-title" className="eyebrow">Explore goodkind</p><button ref={closeButtonRef} type="button" className="menu-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation">×</button></div>
        <nav aria-label="Explore the world">{chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{chapter.name}<Arrow diagonal /></a>)}</nav>
        <p className="menu-signoff">For the ones who make<br />a house feel like home.</p>
      </div>
    </dialog>

    <main id="journey" tabIndex={-1}>
      <section id="arrival" className={sectionClass(0)} data-chapter="0" aria-labelledby="arrival-title">
        <div className="chapter-frame" inert={!simpleView && currentChapter !== 0}>
          <div className="chapter-copy arrival-copy">
            <p className="chapter-kicker"><span>01 / 05</span> The arrival</p>
            <h1 id="arrival-title">A world of<br /><em>good company.</em></h1>
            <p className="chapter-description">For the ones who turn an ordinary day into a very good one.</p>
            <a className="journey-link journey-link-primary" href="#companions">Take a walk <span><Arrow /></span></a>
            <p className="arrival-aside">Come in. Stay curious.</p>
          </div>
          {simpleView && <div className="fallback-scene fallback-arrival"><span className="fallback-arch" aria-hidden="true" /><PetPortrait id="dog" /></div>}
          <div className="frame-footnote"><span>A GOODKIND EXPLORATION</span><span className="scroll-invitation">Scroll to wander <span aria-hidden="true">↓</span></span></div>
          <span className="world-caption" aria-hidden="true"><span>THE WELCOMING COMMITTEE</span><i>Always happy to see you.</i></span>
        </div>
      </section>

      <section id="companions" className={sectionClass(1)} data-chapter="1" aria-labelledby="companions-title">
        <div className="chapter-frame" inert={!simpleView && currentChapter !== 1}>
          <div className="chapter-copy companions-copy">
            <p className="chapter-kicker"><span>02 / 05</span> Good company</p>
            <h2 id="companions-title">Every kind<br />of <em>character.</em></h2>
            <p className="chapter-description">Four paws. Two wings. A personality all their own. There’s a place for everyone here.</p>
            <fieldset className="companion-index" aria-label="Meet the companions">{companions.map((pet, index) => <button type="button" key={pet.id} className={companion === pet.id ? 'is-selected' : ''} aria-pressed={companion === pet.id} onClick={() => setCompanion(pet.id)}><span className="item-number">0{index + 1}</span><span>{pet.name}</span><Arrow diagonal /></button>)}</fieldset>
            <p className="companion-note" aria-live="polite">{companions.find(pet => pet.id === companion)?.note}</p>
            <a className="journey-link understated-link" href="#collection">Find their everyday good <Arrow /></a>
          </div>
          {simpleView && <div className="fallback-scene fallback-companions"><span className="fallback-arch" aria-hidden="true" /><PetPortrait id={companion} /></div>}
          <div className="frame-footnote"><span>DIFFERENT BY NATURE</span><span>Better together.</span></div>
          <span className="world-caption" aria-hidden="true"><span>A PLACE FOR EVERY PERSONALITY</span><i>They make the rules.</i></span>
        </div>
      </section>

      <section id="collection" className={sectionClass(2)} data-chapter="2" aria-labelledby="collection-title">
        <div className="chapter-frame" inert={!simpleView && currentChapter !== 2}>
          <div className="chapter-copy collection-copy">
            <p className="chapter-kicker"><span>03 / 05</span> Everyday objects</p>
            <h2 id="collection-title">Little rituals.<br /><em>Good things.</em></h2>
            <p className="chapter-description">A considered collection for the beautifully ordinary moments you share.</p>
            <ol className="product-index">{products.map((product, index) => <li key={product.id}><button type="button" className={selectedProductId === product.id ? 'is-selected' : ''} onClick={() => onProductSelect(product.id)} onPointerEnter={() => onProductFocus(index)} onPointerLeave={onProductBlur} onFocus={() => onProductFocus(index)} onBlur={onProductBlur} aria-haspopup="dialog" aria-label={`Explore ${product.name}, ${product.price}`}><span className="item-number">0{index + 1}</span><span className="product-line-name">{product.name}<small>{product.type}</small></span><span className="product-line-price">{product.price}</span><Arrow diagonal /></button></li>)}</ol>
            <p className="collection-instruction">Choose an object for a closer look.</p>
          </div>
          {simpleView && <div className="fallback-scene fallback-collection">{products.map((product, index) => <button key={product.id} className={`fallback-product fallback-product-${index}`} type="button" onClick={() => onProductSelect(product.id)} aria-label={`View ${product.name}`}><img src={product.image} alt="" loading="lazy" width="640" height="640" /></button>)}</div>}
          <div className="frame-footnote"><span>THE EVERYDAY COLLECTION</span><span>Four small essentials.</span></div>
          <span className="world-caption" aria-hidden="true"><span>MADE FOR THE MOMENTS BETWEEN</span><i>Play. Eat. Repeat.</i></span>
        </div>
      </section>

      <section id="philosophy" className={sectionClass(3)} data-chapter="3" aria-labelledby="philosophy-title">
        <div className="chapter-frame" inert={!simpleView && currentChapter !== 3}>
          <div className="chapter-copy philosophy-copy">
            <p className="chapter-kicker"><span>04 / 05</span> Our point of view</p>
            <h2 id="philosophy-title">A little less.<br /><em>A little better.</em></h2>
            <p className="chapter-description">We believe a good life with pets is made of small things, thoughtfully chosen.</p>
            <ol className="principle-index">{principles.map(([title, description], index) => <li key={title}><span className="item-number">0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
          </div>
          {simpleView && <div className="fallback-scene fallback-philosophy"><span className="fallback-arch" aria-hidden="true" /><PetPortrait id="cat" /></div>}
          <div className="frame-footnote"><span>THOUGHTFULLY, ALWAYS</span><span>Nothing extra. Plenty of heart.</span></div>
          <span className="world-caption" aria-hidden="true"><Spark /><i>Room for the good stuff.</i></span>
        </div>
      </section>

      <section id="finale" className={sectionClass(4)} data-chapter="4" aria-labelledby="finale-title">
        <div className="chapter-frame" inert={!simpleView && currentChapter !== 4}>
          <div className="chapter-copy finale-copy">
            <p className="chapter-kicker"><span>05 / 05</span> A little closer</p>
            <h2 id="finale-title">Their world.<br /><em>And yours.</em></h2>
            <p className="chapter-description">More shared moments. More muddy paws. More reasons to come home.</p>
            <a className="journey-link journey-link-primary" href="#collection">Find your good thing <span><Arrow /></span></a>
            <a className="restart-link" href="#arrival">Wander again <span aria-hidden="true">↗</span></a>
          </div>
          {simpleView && <div className="fallback-scene fallback-finale"><PetPortrait id="cat" className="finale-cat" /><PetPortrait id="dog" className="finale-dog" /><PetPortrait id="rabbit" className="finale-rabbit" /><PetPortrait id="parrot" className="finale-parrot" /></div>}
          <div className="frame-footnote"><span>GOOD THINGS START WITH GOOD COMPANY</span><span>Glad you’re here.</span></div>
        </div>
      </section>
    </main>

    <footer className="world-footer">
      <div className="footer-topline"><p>For pets.<br />For their people.</p><a href="#arrival">Back to the beginning <Arrow diagonal /></a></div>
      <a className="footer-wordmark" href="#arrival" aria-label="Goodkind, back to the beginning">goodkind</a>
      <div className="footer-colophon"><span>© {new Date().getFullYear()} Goodkind</span><p>An independent concept, made with care.</p><span>A little more good.</span></div>
    </footer>

    <aside className="experience-controls" aria-label="Experience controls">
      <label className="view-control"><input type="checkbox" checked={simpleView} onChange={event => onSimpleViewChange(event.target.checked)} /><span className="view-control-box" aria-hidden="true" />Simpler view</label>
      {reducedMotion && !simpleView && <span className="motion-status">A calmer pace</span>}
    </aside>
    <nav className="chapter-track" aria-label="Journey chapters"><span className="track-current" aria-hidden="true">0{currentChapter + 1}<span> / 05</span></span><ol>{chapters.map((chapter, index) => <li key={chapter.id}><a href={`#${chapter.id}`} aria-label={`${index + 1}. ${chapter.name}`} aria-current={currentChapter === index ? 'step' : undefined}><span /></a></li>)}</ol><span className="track-label" aria-hidden="true">{chapters[currentChapter].name}</span></nav>
  </div>;
}
