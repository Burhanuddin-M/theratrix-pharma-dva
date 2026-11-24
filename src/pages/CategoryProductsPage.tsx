import { Link, useParams } from 'react-router-dom';
import { LazyImage } from '../components/LazyImage';
import type { Category, Product } from '../types';

interface Props {
  categories: Category[];
  products: Product[];
  selected: string[];
  onToggle: (id: string) => void;
  onDeleteProduct: (id: string) => void;
}

export function CategoryProductsPage({
  categories,
  products,
  selected,
  onToggle,
  onDeleteProduct,
}: Props) {
  const { id } = useParams();
  const category = categories.find((c) => c.id === id);
  const list = products.filter((p) => p.categoryId === id);

  if (!category) {
    return (
      <div className="empty">
        Category not found. <Link to="/">Back home</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">{category.name}</h1>
      <p className="page-sub">
        Select products for showcasing, or edit product slides. Selected count: {selected.length}
      </p>
      <div className="toolbar">
        <Link className="btn btn-dark" to={`/category/${category.id}/product/new`}>
          Add product
        </Link>
        <Link className="btn btn-accent" to="/selection">
          Review selection ({selected.length})
        </Link>
        <Link className="btn btn-dark" to="/" style={{ background: '#1e2a5a' }}>
          All categories
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="empty">No products in this category yet.</div>
      ) : (
        <div className="product-list">
          {list.map((p) => {
            const checked = selected.includes(p.id);
            return (
              <div key={p.id} className="product-row">
                <LazyImage src={p.mainImage} alt={p.name} />
                <div>
                  <h3>
                    {p.name}{' '}
                    <span className="chip" style={{ color: p.tabColor }}>
                      {p.shortCode}
                    </span>
                  </h3>
                  <p>{p.indication}</p>
                  <p style={{ marginTop: 4 }}>{p.composition}</p>
                </div>
                <div style={{ display: 'grid', gap: 8, justifyItems: 'end' }}>
                  <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 700 }}>
                    <input
                      className="checkbox"
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(p.id)}
                    />
                    Select
                  </label>
                  <Link className="btn btn-dark" to={`/category/${category.id}/product/${p.id}`}>
                    Edit
                  </Link>
                  <button type="button" className="btn btn-danger" onClick={() => onDeleteProduct(p.id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
