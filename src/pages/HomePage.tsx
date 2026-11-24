import { Link, useNavigate } from 'react-router-dom';
import { LazyImage } from '../components/LazyImage';
import type { Category } from '../types';

interface Props {
  categories: Category[];
  productCounts: Record<string, number>;
  onDelete: (id: string) => void;
}

export function HomePage({ categories, productCounts, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="page-title">Categories</h1>
      <p className="page-sub">
        Build detailing sessions from therapeutic categories. Open a category to manage products, then
        multi-select for showcase.
      </p>
      <div className="toolbar">
        <button type="button" className="btn btn-dark" onClick={() => navigate('/category/new')}>
          Add category
        </button>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/selection')}>
          Build showcase
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/exports')}>
          Past exports
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="empty">No categories yet. Add one to get started.</div>
      ) : (
        <div className="grid-cards">
          {categories.map((cat) => (
            <article key={cat.id} className="media-card">
              <Link className="card-link" to={`/category/${cat.id}`}>
                <LazyImage src={cat.coverImage} alt={cat.name} />
                <div className="meta">
                  <h3>{cat.name}</h3>
                  <p>
                    {productCounts[cat.id] ?? 0} product{(productCounts[cat.id] ?? 0) === 1 ? '' : 's'}
                  </p>
                </div>
              </Link>
              <div className="card-actions">
                <button
                  type="button"
                  className="btn btn-soft"
                  onClick={() => navigate(`/category/${cat.id}/edit`)}
                >
                  Edit
                </button>
                <button type="button" className="btn btn-danger" onClick={() => onDelete(cat.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
