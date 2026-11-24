import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import type { Product } from '../types';

interface Props {
  products: Product[];
  index: number;
  onIndexChange: (next: number) => void;
  onExit: () => void;
  onExport: () => void;
}

type RevealKey = 'indication' | 'image' | 'copy';

export function ShowcaseSlide({ products, index, onIndexChange, onExit, onExport }: Props) {
  const product = products[index];
  const [revealed, setRevealed] = useState<Record<RevealKey, boolean>>({
    indication: false,
    image: false,
    copy: false,
  });

  useEffect(() => {
    setRevealed({ indication: false, image: false, copy: false });
    const t1 = window.setTimeout(() => setRevealed((r) => ({ ...r, indication: true })), 120);
    const t2 = window.setTimeout(() => setRevealed((r) => ({ ...r, image: true })), 280);
    const t3 = window.setTimeout(() => setRevealed((r) => ({ ...r, copy: true })), 420);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [product?.id]);

  const nameParts = useMemo(() => {
    if (!product) return { lead: '', accent: '' };
    if (product.nameAccent && product.name.includes(product.nameAccent)) {
      const idx = product.name.lastIndexOf(product.nameAccent);
      return {
        lead: product.name.slice(0, idx),
        accent: product.nameAccent,
      };
    }
    return { lead: product.name, accent: '' };
  }, [product]);

  if (!product) return null;

  const toggle = (key: RevealKey) => {
    setRevealed((r) => ({ ...r, [key]: !r[key] }));
  };

  const go = (dir: -1 | 1) => {
    const next = (index + dir + products.length) % products.length;
    onIndexChange(next);
  };

  return (
    <div className="showcase">
      <div className="slide-stage">
        <AnimatePresence initial={false}>
          <motion.div
            key={product.id}
            className="slide"
            initial={{ opacity: 0.35, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) go(1);
              if (info.offset.x > 80) go(-1);
            }}
          >
            <div className="slide-body">
              <div className="slide-band" aria-hidden>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                  <path
                    d="M0,40 C220,110 420,10 640,55 C860,100 1040,20 1200,70 L1200,120 L0,120 Z"
                    fill="#f7f3e8"
                  />
                </svg>
              </div>
              <motion.p
                className={`slide-indication ${revealed.indication ? 'reveal-shown' : 'reveal-hidden'}`}
                onClick={() => toggle('indication')}
                whileTap={{ scale: 0.985 }}
              >
                {product.indication}
              </motion.p>

              <motion.div
                className={`slide-image-wrap ${revealed.image ? 'reveal-shown' : 'reveal-hidden'}`}
                onClick={() => toggle('image')}
                whileTap={{ scale: 0.97 }}
              >
                <img src={product.mainImage} alt={product.name} decoding="async" />
              </motion.div>

              <motion.div
                className={`slide-copy ${revealed.copy ? 'reveal-shown' : 'reveal-hidden'}`}
                onClick={() => toggle('copy')}
                whileTap={{ scale: 0.99 }}
              >
                <div className="product-hero">
                  <div className="name">
                    <span>{nameParts.lead}</span>
                    <span className="accent">{nameParts.accent}</span>
                    <sup style={{ fontSize: '0.35em', marginLeft: 2 }}>®</sup>
                  </div>
                  <span className="form">{product.formLabel}</span>
                </div>
                <p className="composition">{product.composition}</p>
                <p className="tagline">{product.tagline}</p>
              </motion.div>
            </div>

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
