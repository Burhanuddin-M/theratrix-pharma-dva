import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}

export function LazyImage({ src, alt, className, style }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '120px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <img
      ref={ref}
      src={visible ? src : undefined}
      alt={alt}
      className={className}
      style={{
        ...style,
        opacity: loaded ? 1 : 0.35,
        transition: 'opacity 0.35s ease',
        background: 'linear-gradient(120deg,#e8e0f0,#f7f3e8)',
      }}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
    />
  );
}
