import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { liveQuery } from 'dexie';
import { ShowcaseSlide } from './components/ShowcaseSlide';
import { Toast } from './components/Toast';
import { db } from './db';
import { ensureSeedData } from './db/seed';
import { CategoryFormPage } from './pages/CategoryFormPage';
import { CategoryProductsPage } from './pages/CategoryProductsPage';
import { ExportsPage } from './pages/ExportsPage';
import { HomePage } from './pages/HomePage';
import { ProductFormPage } from './pages/ProductFormPage';
import { SelectionPage } from './pages/SelectionPage';
import type { Category, ExportRecord, Product } from './types';
import { uid } from './utils/image';
import { buildSelectionPdf, downloadBlob } from './utils/pdf';

const SELECT_KEY = 'pharma-dva-selection';

export default function App() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [exports, setExports] = useState<ExportRecord[]>([]);
  const [selected, setSelected] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(SELECT_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [showcase, setShowcase] = useState(false);
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      await ensureSeedData();
      if (alive) setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const subCats = liveQuery(() => db.categories.orderBy('createdAt').reverse().toArray()).subscribe({
      next: setCategories,
    });
    const subProds = liveQuery(() => db.products.orderBy('createdAt').toArray()).subscribe({
      next: setProducts,
    });
    const subExp = liveQuery(() => db.exports.orderBy('createdAt').reverse().toArray()).subscribe({
      next: setExports,
    });
    return () => {
      subCats.unsubscribe();
      subProds.unsubscribe();
      subExp.unsubscribe();
    };
  }, [ready]);

  useEffect(() => {
    localStorage.setItem(SELECT_KEY, JSON.stringify(selected));
  }, [selected]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const productCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of products) map[p.categoryId] = (map[p.categoryId] ?? 0) + 1;
    return map;
  }, [products]);

  const selectedProducts = useMemo(
    () => selected.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[],
    [selected, products],
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const flash = (msg: string) => setToast(msg);

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category and its products?')) return;
    await db.transaction('rw', db.categories, db.products, async () => {
      await db.products.where('categoryId').equals(id).delete();
      await db.categories.delete(id);
    });
    setSelected((prev) => {
      const removed = new Set(products.filter((p) => p.categoryId === id).map((p) => p.id));
      return prev.filter((pid) => !removed.has(pid));
    });
    flash('Category deleted');
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await db.products.delete(id);
    setSelected((prev) => prev.filter((x) => x !== id));
    flash('Product deleted');
  };

  const startShowcase = () => {
    if (!selectedProducts.length) {
      flash('Select at least one product');
      return;
    }
    setShowcaseIndex(0);
    setShowcase(true);
  };

  const exportPdf = async () => {
    if (!selectedProducts.length) return;
    flash('Building PDF…');
    try {
      const { blob, base64, pageCount } = await buildSelectionPdf(selectedProducts);
      const title = `DVA ${selectedProducts.map((p) => p.shortCode).join('-')} ${new Date()
        .toISOString()
        .slice(0, 10)}`;
      const record: ExportRecord = {
        id: uid('exp'),
        title,
        productIds: selectedProducts.map((p) => p.id),
        productNames: selectedProducts.map((p) => p.name),
        pdfBase64: base64,
        createdAt: Date.now(),
        pageCount,
      };
      await db.exports.add(record);
      downloadBlob(blob, `${title.replace(/\s+/g, '-')}.pdf`);
      flash('PDF exported and saved locally');
      setShowcase(false);
      navigate('/exports');
    } catch (err) {
      console.error(err);
      flash('PDF export failed');
    }
  };

  if (!ready) {
    return (
      <div className="app-shell" style={{ placeItems: 'center', display: 'grid' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#3d2463' }}>
          Preparing Pharma DVA…
        </p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {!showcase ? (
        <header className="app-header">
          <Link to="/" className="brand">
            <span className="brand-mark">Pharma DVA</span>
            <span className="brand-sub">Digital Visual Aid</span>
          </Link>
          <nav className="nav-actions">
            <Link className="btn btn-ghost" to="/">
              Categories
            </Link>
            <Link className="btn btn-ghost" to="/selection">
              Selection ({selected.length})
            </Link>
            <Link className="btn btn-ghost" to="/exports">
              Exports
            </Link>
            <button type="button" className="btn btn-primary" onClick={startShowcase}>
              Present
            </button>
          </nav>
        </header>
      ) : null}

      <main className="app-main" style={showcase ? { padding: 0, overflow: 'hidden' } : undefined}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                categories={categories}
                productCounts={productCounts}
                onDelete={(cid) => void deleteCategory(cid)}
              />
            }
          />
          <Route path="/category/new" element={<CategoryFormPage onSaved={() => flash('Category saved')} />} />
          <Route
            path="/category/:id/edit"
            element={<CategoryFormPage onSaved={() => flash('Category updated')} />}
          />
          <Route
            path="/category/:id"
            element={
              <CategoryProductsPage
                categories={categories}
                products={products}
                selected={selected}
                onToggle={toggleSelect}
                onDeleteProduct={(pid) => void deleteProduct(pid)}
              />
            }
          />
          <Route
            path="/category/:id/product/:productId"
            element={<ProductFormPage onSaved={() => flash('Product saved')} />}
          />
          <Route
            path="/selection"
            element={
              <SelectionPage
                products={products}
                selected={selected}
                onToggle={toggleSelect}
                onClear={() => setSelected([])}
                onStartShowcase={startShowcase}
              />
            }
          />
          <Route
            path="/exports"
            element={
              <ExportsPage
                exports={exports}
                onDelete={(eid) => {
                  void db.exports.delete(eid);
                  flash('Export deleted');
                }}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {showcase ? (
        <ShowcaseSlide
          products={selectedProducts}
          index={showcaseIndex}
          onIndexChange={setShowcaseIndex}
          onExit={() => setShowcase(false)}
          onExport={() => void exportPdf()}
        />
      ) : null}

      <Toast message={toast} />
    </div>
  );
}
