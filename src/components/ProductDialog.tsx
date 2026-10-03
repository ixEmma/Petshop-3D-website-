import { useEffect, useRef } from 'react';
import type { Product } from '../data/products';
import { setSmoothScrollPaused } from '../lib/lenis';

export function ProductDialog({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!product || !dialog) return;
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setSmoothScrollPaused(true);
    dialog.showModal();
    closeRef.current?.focus();
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; setSmoothScrollPaused(false); returnFocus?.focus({ preventScroll: true }); };
  }, [product]);
  // biome-ignore lint/a11y/useKeyWithClickEvents: Native Escape/onCancel and the close button are the keyboard alternatives; this handler only dismisses backdrop clicks.
  return <dialog ref={ref} className="product-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} data-lenis-prevent>
    {product ? <div className="dialog-content"><button ref={closeRef} className="dialog-close" type="button" onClick={onClose} aria-label="Close product details"><span aria-hidden="true">×</span></button>
      <div className={`dialog-art ${product.color}`}><img src={product.image} alt="" /></div>
      <div className="dialog-copy"><p className="eyebrow">A closer look</p><h2 id="dialog-title">{product.name}</h2><p className="dialog-price">{product.price} <span>— concept price</span></p><p id="dialog-description">{product.description}</p><ul>{product.details.map(detail => <li key={detail}>{detail}</li>)}</ul><p className="dialog-note">Part of a fictional collection. Display only; no purchasing is available.</p></div>
    </div> : null}
  </dialog>;
}
