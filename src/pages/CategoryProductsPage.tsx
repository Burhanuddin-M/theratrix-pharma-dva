import { useNavigate, useParams } from 'react-router-dom';
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
  const navigate = useNavigate();
  const category = categories.find((c) => c.id === id);
  const list = products.filter((p) => p.categoryId === id);

  if (!category) {
    return (
      <div className="empty">
        Category not found.{' '}
        <button type="button" className="btn btn-dark" onClick={() => navigate('/')}>
          Back home
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">{category.name}</h1>
      <p className="page-sub">
        Select products for showcasing. Each product is a name + full detailing slide image. Selected:{' '}
        {selected.length}
      </p>
      <div className="toolbar">
        <button
          type="button"
          className="btn btn-dark"
          onClick={() => navigate(`/category/${category.id}/product/new`)}
        >
          Add product
        </button>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/selection')}>
          Review selection ({selected.length})
        </button>
        <button type="button" className="btn btn-soft" onClick={() => navigate('/')}>
          All categories
        </button>
      </div>

      {list.length === 0 ? (
        <div className="empty">No products in this category yet.</div>
      ) : (
        <div className="product-list">
          {list.map((p) => {
            const checked = selected.includes(p.id);
            return (
              <div key={p.id} className="product-row">
                <LazyImage src={p.slideImage} alt={p.name} />
                <div>
                  <h3>
                    {p.name} <span className="chip">{p.shortCode}</span>
                  </h3>
                  <p>Full detailing slide</p>
                </div>
                <div className="row-actions">
                  <label className="checkbox-label">
                    <input
                      className="checkbox"
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(p.id)}
                    />
                    Select
                  </label>
                  <button
                    type="button"
                    className="btn btn-soft"
                    onClick={() => navigate(`/category/${category.id}/product/${p.id}`)}
                  >
                    Edit
                  </button>
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
