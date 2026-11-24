import { Link } from 'react-router-dom';
import { LazyImage } from '../components/LazyImage';
import type { Category } from '../types';

interface Props {
  categories: Category[];
  productCounts: Record<string, number>;
  onDelete: (id: string) => void;
}

export function HomePage({ categories, productCounts, onDelete }: Props) {
  return (
    <div>
      <h1 className="page-title">Categories</h1>
      <p className="page-sub">
        Build detailing sessions from therapeutic categories. Open a category to manage products, then
        multi-select for showcase.
      </p>
      <div className="toolbar">
        <Link className="btn btn-dark" to="/category/new">
          Add category
        </Link>
        <Link className="btn btn-accent" to="/selection">
          Build showcase
        </Link>
        <Link className="btn btn-dark" to="/exports" style={{ background: '#1e2a5a' }}>
          Past exports
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="empty">No categories yet. Add one to get started.</div>
      ) : (
        <div className="grid-cards">
          {categories.map((cat) => (
            <div key={cat.id} className="media-card" style={{ display: 'block' }}>
              <Link to={`/category/${cat.id}`}>
                <LazyImage src={cat.coverImage} alt={cat.name} />
                <div className="meta">
                  <h3>{cat.name}</h3>
                  <p>{productCounts[cat.id] ?? 0} products</p>
                </div>
              </Link>
              <div className="toolbar" style={{ padding: '0 1rem 1rem', margin: 0 }}>
                <Link className="btn btn-dark" to={`/category/${cat.id}/edit`}>
                  Edit
                </Link>
                <button type="button" className="btn btn-danger" onClick={() => onDelete(cat.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
