import { useNavigate } from 'react-router-dom';
import { LazyImage } from '../components/LazyImage';
import type { Product } from '../types';

interface Props {
  products: Product[];
  selected: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
  onStartShowcase: () => void;
}

export function SelectionPage({ products, selected, onToggle, onClear, onStartShowcase }: Props) {
  const navigate = useNavigate();
  const selectedProducts = products.filter((p) => selected.includes(p.id));
  const ready = selectedProducts.length >= 1;

  return (
    <div>
      <h1 className="page-title">Showcase selection</h1>
      <p className="page-sub">
        Multi-select products for a detailing session. Each slide is the uploaded product image.
      </p>
      <div className="toolbar">
        <span className="chip">{selected.length} selected</span>
        <button type="button" className="btn btn-danger" onClick={onClear} disabled={!selected.length}>
          Clear
        </button>
        <button type="button" className="btn btn-primary" disabled={!ready} onClick={onStartShowcase}>
          Start showcase
        </button>
        <button type="button" className="btn btn-soft" onClick={() => navigate('/')}>
          Categories
        </button>
      </div>

      {selectedProducts.length === 0 ? (
        <div className="empty">No products selected yet. Open a category and tick products, or pick below.</div>
      ) : (
        <div className="product-list" style={{ marginBottom: '1.2rem' }}>
          {selectedProducts.map((p, i) => (
            <div key={p.id} className="product-row">
              <LazyImage src={p.slideImage} alt={p.name} />
              <div>
                <h3>
                  {i + 1}. {p.name} <span className="chip">{p.shortCode}</span>
                </h3>
              </div>
              <div className="row-actions">
                <button type="button" className="btn btn-danger" onClick={() => onToggle(p.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="page-title" style={{ fontSize: '1.2rem' }}>
        All products
      </h2>
      <div className="product-list">
        {products.map((p) => (
          <div key={p.id} className="product-row">
            <LazyImage src={p.slideImage} alt={p.name} />
            <div>
              <h3>
                {p.name} <span className="chip">{p.shortCode}</span>
              </h3>
            </div>
            <div className="row-actions">
              <label className="checkbox-label">
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={() => onToggle(p.id)}
                />
                Select
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
