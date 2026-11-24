import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Product } from '../types';

interface Props {
  products: Product[];
  index: number;
  onIndexChange: (next: number) => void;
  onExit: () => void;
  onExport: () => void;
}

export function ShowcaseSlide({ products, index, onIndexChange, onExit, onExport }: Props) {
  const product = products[index];
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    setPulse(false);
    const t = window.setTimeout(() => setPulse(true), 40);
    return () => window.clearTimeout(t);
  }, [product?.id]);

  if (!product) return null;

  const go = (dir: -1 | 1) => {
    if (!products.length) return;
    onIndexChange((index + dir + products.length) % products.length);
  };

  const replay = () => {
    setPulse(false);
    window.setTimeout(() => setPulse(true), 40);
  };

  return (
    <div className="showcase" role="dialog" aria-label="Product showcase">
      <div className="slide-stage">
        <AnimatePresence initial={false}>
          <motion.div
            key={product.id}
            className="slide slide-fullbleed"
            initial={{ opacity: 0.2, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20, pointerEvents: 'none' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0, zIndex: 2 }}
          >
            <button
              type="button"
              className="slide-bleed-hit"
              onClick={replay}
              aria-label={`Animate ${product.name} slide`}
              onTouchStart={(e) => {
                const t = e.changedTouches[0];
                (e.currentTarget as HTMLElement).dataset.tx = String(t.clientX);
              }}
              onTouchEnd={(e) => {
                const start = Number((e.currentTarget as HTMLElement).dataset.tx || 0);
                const end = e.changedTouches[0].clientX;
                const dx = end - start;
                if (Math.abs(dx) < 24) return;
                if (dx < -70) go(1);
                if (dx > 70) go(-1);
              }}
            >
              <motion.img
                className="slide-bleed-image"
                src={product.slideImage}
                alt={product.name}
                decoding="async"
                draggable={false}
                animate={pulse ? { opacity: 1, scale: 1 } : { opacity: 0.35, scale: 1.04 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className="slide-bleed-label">{product.name}</span>
            </button>

            <div className="product-tabs" aria-label="Selected products">
              {products.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  className={i === index ? 'active' : ''}
                  style={{ color: p.tabColor }}
                  onClick={() => onIndexChange(i)}
                >
                  {p.shortCode}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="landscape-hint">Rotate for a fuller detailing slide · portrait still works</p>
      <div className="showcase-controls">
        <button type="button" className="btn btn-ghost" onClick={onExit}>
          Exit
        </button>
        <div className="center">
          <button type="button" className="btn btn-ghost" onClick={() => go(-1)}>
            Prev
          </button>
          <span className="muted">
            {index + 1} / {products.length}
          </span>
          <button type="button" className="btn btn-ghost" onClick={() => go(1)}>
            Next
          </button>
        </div>
        <button type="button" className="btn btn-primary" onClick={onExport}>
          Export PDF
        </button>
      </div>
    </div>
  );
}
