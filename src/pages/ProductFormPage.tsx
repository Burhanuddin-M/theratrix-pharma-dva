import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../db';
import type { Product } from '../types';
import { compressImage, uid } from '../utils/image';
import { deriveShortCode, tabColorForName } from '../utils/shortCode';

interface Props {
  onSaved: () => void;
}

export function ProductFormPage({ onSaved }: Props) {
  const { id, productId } = useParams();
  const isNew = !productId || productId === 'new';
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [slideImage, setSlideImage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isNew || !productId) return;
    void db.products.get(productId).then((p) => {
      if (!p) return;
      setName(p.name);
      setSlideImage(p.slideImage);
    });
  }, [isNew, productId]);

  const onFile = async (file?: File | null) => {
    if (!file) return;
    setBusy(true);
    try {
      setSlideImage(await compressImage(file, 1920, 0.88));
    } finally {
      setBusy(false);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    const trimmed = name.trim();
    if (!trimmed || !slideImage) return;
    const now = Date.now();
    const shortCode = deriveShortCode(trimmed);
    const tabColor = tabColorForName(trimmed);
    if (isNew) {
      const row: Product = {
        id: uid('prod'),
        categoryId: id,
        name: trimmed,
        shortCode,
        tabColor,
        slideImage,
        createdAt: now,
        updatedAt: now,
      };
      await db.products.add(row);
    } else if (productId) {
      await db.products.update(productId, {
        name: trimmed,
        shortCode,
        tabColor,
        slideImage,
        updatedAt: now,
      });
    }
    onSaved();
    navigate(`/category/${id}`);
  };

  return (
    <div>
      <h1 className="page-title">{isNew ? 'New product' : 'Edit product'}</h1>
      <p className="page-sub">
        Name is a reference label. Upload one full detailing slide image — it shows full-bleed in
        showcase.
      </p>
      <form className="form-panel form-grid" onSubmit={(e) => void submit(e)}>
        <label>
          Product name
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} />
        </label>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.85rem' }}>
          Tab code preview: <strong>{deriveShortCode(name || 'PRD')}</strong>
        </p>
        <label>
          Detailing slide image (full visual aid)
          <input type="file" accept="image/*" onChange={(e) => void onFile(e.target.files?.[0])} />
        </label>
        {slideImage ? (
          <img
            src={slideImage}
            alt="Slide preview"
            style={{
              width: '100%',
              maxHeight: 280,
              objectFit: 'contain',
              borderRadius: 12,
              background: '#0a1518',
              border: '1px solid var(--border)',
            }}
          />
        ) : null}
        <div className="form-actions">
          <button
            className="btn btn-primary"
            disabled={busy || !name.trim() || !slideImage}
            type="submit"
          >
            Save product
          </button>
          <button type="button" className="btn btn-soft" onClick={() => navigate(`/category/${id}`)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
