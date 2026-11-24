import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Product } from '../types';

interface Props {
  products: Product[];
  index: number;
  onIndexChange: (next: number) => void;
  onExit: () => void;
  onExport: () => void;
  exporting?: boolean;
  /** Fresh present session — show Save export. Hidden when reopening a past export. */
  allowExport?: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;
const TRIPLE_MS = 450;

export function ShowcaseSlide({
  products,
  index,
  onIndexChange,
  onExit,
  onExport,
  exporting = false,
  allowExport = true,
}: Props) {
  const product = products[index];
  const reduceMotion = useReducedMotion();
  const [pulse, setPulse] = useState(0);
  const [direction, setDirection] = useState(1);
  const prevIndex = useRef(index);
  const clickCount = useRef(0);
  const clickTimer = useRef<number | null>(null);

  useEffect(() => {
    if (index !== prevIndex.current) {
      const last = products.length - 1;
      if (prevIndex.current === last && index === 0) setDirection(1);
      else if (prevIndex.current === 0 && index === last) setDirection(-1);
      else setDirection(index > prevIndex.current ? 1 : -1);
      prevIndex.current = index;
    }
    setPulse((n) => n + 1);
  }, [index, product?.id, products.length]);

  useEffect(
    () => () => {
      if (clickTimer.current != null) window.clearTimeout(clickTimer.current);
    },
    [],
  );

  if (!product) return null;

  const go = (dir: -1 | 1) => {
    if (!products.length || exporting) return;
    setDirection(dir);
    onIndexChange((index + dir + products.length) % products.length);
  };

  const replay = () => {
    if (exporting) return;
    setPulse((n) => n + 1);
  };

  const onSlideActivate = () => {
    if (exporting) return;
    clickCount.current += 1;
    if (clickTimer.current != null) window.clearTimeout(clickTimer.current);

    if (clickCount.current >= 3) {
      clickCount.current = 0;
      onExit();
      return;
    }

    clickTimer.current = window.setTimeout(() => {
      if (clickCount.current === 1) replay();
      clickCount.current = 0;
      clickTimer.current = null;
    }, TRIPLE_MS);
  };

  const slideVariants = reduceMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (dir: number) => ({
          opacity: 0,
          x: dir > 0 ? 56 : -56,
          scale: 1.015,
        }),
        center: {
          opacity: 1,
          x: 0,
          scale: 1,
        },
        exit: (dir: number) => ({
          opacity: 0,
          x: dir > 0 ? -40 : 40,
          scale: 0.985,
          pointerEvents: 'none' as const,
        }),
      };

  return (
    <div className="showcase" role="dialog" aria-label="Product showcase" aria-busy={exporting}>
      <div className="slide-stage">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={product.id}
            className="slide slide-fullbleed"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduceMotion ? 0.18 : 0.48, ease }}
            style={{ position: 'absolute', inset: 0, zIndex: 2 }}
          >
            <button
              type="button"
              className="slide-bleed-hit"
              onClick={onSlideActivate}
              disabled={exporting}
              aria-label={`${product.name} slide. Triple-click to exit.`}
              onTouchStart={(e) => {
                const t = e.changedTouches[0];
                (e.currentTarget as HTMLElement).dataset.tx = String(t.clientX);
              }}
              onTouchEnd={(e) => {
                if (exporting) return;
                const start = Number((e.currentTarget as HTMLElement).dataset.tx || 0);
                const end = e.changedTouches[0].clientX;
                const dx = end - start;
                if (Math.abs(dx) < 24) return;
                // Swipe — cancel pending triple-click so it doesn’t exit mid-swipe.
                if (clickTimer.current != null) {
                  window.clearTimeout(clickTimer.current);
                  clickTimer.current = null;
                }
                clickCount.current = 0;
                if (dx < -70) go(1);
                if (dx > 70) go(-1);
              }}
            >
              <motion.div
                key={`veil-${product.id}-${pulse}`}
                className="slide-reveal-veil"
                initial={reduceMotion ? { opacity: 0.35 } : { scaleX: 1 }}
                animate={reduceMotion ? { opacity: 0 } : { scaleX: 0 }}
                transition={{ duration: reduceMotion ? 0.25 : 0.7, ease, delay: 0.04 }}
                style={{ transformOrigin: direction >= 0 ? 'right center' : 'left center' }}
                aria-hidden
              />
              <motion.img
                key={`img-${product.id}-${pulse}`}
                className="slide-bleed-image"
                src={product.slideImage}
                alt={product.name}
                decoding="async"
                draggable={false}
                initial={
                  reduceMotion
                    ? { opacity: 0.4 }
                    : { opacity: 0, scale: 1.06, filter: 'brightness(0.85)' }
                }
                animate={
                  reduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, scale: 1, filter: 'brightness(1)' }
                }
                transition={{ duration: reduceMotion ? 0.28 : 0.85, ease }}
              />
            </button>

            <div className="product-tabs" aria-label="Selected products">
              {products.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  className={i === index ? 'active' : ''}
                  style={{ color: p.tabColor }}
                  disabled={exporting}
                  onClick={() => {
                    if (exporting) return;
                    setDirection(i > index ? 1 : -1);
                    onIndexChange(i);
                  }}
                >
                  {p.shortCode}
                </button>
              ))}
              {allowExport ? (
                <button
                  type="button"
                  className="tab-export"
                  disabled={exporting}
                  onClick={onExport}
                  aria-label={exporting ? 'Saving export' : 'Save export'}
                >
                  {exporting ? '…' : 'Save'}
                </button>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {exporting ? (
            <motion.div
              className="export-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              role="status"
              aria-live="polite"
            >
              <motion.div
                className="export-overlay-card"
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.4, ease }}
              >
                <div className="export-ring" aria-hidden>
                  <motion.span
                    className="export-ring-spin"
                    animate={reduceMotion ? undefined : { rotate: 360 }}
                    transition={
                      reduceMotion
                        ? undefined
                        : { duration: 1.4, ease: 'linear', repeat: Infinity }
                    }
                  />
                </div>
                <p className="export-overlay-title">Saving export</p>
                <p className="export-overlay-sub">
                  Preparing {products.length} detailing slide
                  {products.length === 1 ? '' : 's'}…
                </p>
                <div className="export-progress-track" aria-hidden>
                  <motion.div
                    className="export-progress-bar"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                      duration: 1.6,
                      ease: 'easeInOut',
                      repeat: Infinity,
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
