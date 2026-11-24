import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { db } from '../db';
import type { Product } from '../types';
import { compressImage, uid } from '../utils/image';

const TAB_COLORS = ['#4FC3F7', '#FFB74D', '#81C784', '#CE93D8', '#F48FB1', '#FF8A65'];

interface Props {
  onSaved: () => void;
}

export function ProductFormPage({ onSaved }: Props) {
  const { id, productId } = useParams();
  const isNew = !productId || productId === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    nameAccent: '',
    shortCode: '',
    tabColor: TAB_COLORS[0],
    indication: '',
    composition: '',
    tagline: '',
    formLabel: 'Tablets',
    mainImage: './seed/clinical-ulcer.jpg',
    notes: '',
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isNew || !productId) return;
    void db.products.get(productId).then((p) => {
      if (!p) return;
      setForm({
        name: p.name,
        nameAccent: p.nameAccent ?? '',
        shortCode: p.shortCode,
        tabColor: p.tabColor,
        indication: p.indication,
        composition: p.composition,
        tagline: p.tagline,
        formLabel: p.formLabel,
        mainImage: p.mainImage,
        notes: p.notes ?? '',
      });
    });
  }, [isNew, productId]);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const onFile = async (file?: File | null) => {
    if (!file) return;
    setBusy(true);
    try {
      set('mainImage', await compressImage(file));
    } finally {
      setBusy(false);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    const now = Date.now();
    if (isNew) {
      const row: Product = {
        id: uid('prod'),
        categoryId: id,
        name: form.name.trim(),
        nameAccent: form.nameAccent.trim() || undefined,
        shortCode: form.shortCode.trim().toUpperCase(),
        tabColor: form.tabColor,
        indication: form.indication.trim(),
        composition: form.composition.trim(),
        tagline: form.tagline.trim(),
        formLabel: form.formLabel.trim() || 'Tablets',
        mainImage: form.mainImage,
        notes: form.notes.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      };
      await db.products.add(row);
    } else if (productId) {
      await db.products.update(productId, {
        name: form.name.trim(),
        nameAccent: form.nameAccent.trim() || undefined,
        shortCode: form.shortCode.trim().toUpperCase(),
        tabColor: form.tabColor,
        indication: form.indication.trim(),
        composition: form.composition.trim(),
        tagline: form.tagline.trim(),
        formLabel: form.formLabel.trim() || 'Tablets',
        mainImage: form.mainImage,
        notes: form.notes.trim() || undefined,
        updatedAt: now,
      });
    }
    onSaved();
    navigate(`/category/${id}`);
  };

  return (
    <div>
      <h1 className="page-title">{isNew ? 'New product' : 'Edit product'}</h1>
      <p className="page-sub">Slide fields used in showcase and PDF export.</p>
      <form className="form-panel form-grid" onSubmit={submit}>
        <label>
          Product name
          <input value={form.name} onChange={(e) => set('name', e.target.value)} required />
        </label>
        <label>
          Accent portion (colored)
          <input
            value={form.nameAccent}
            onChange={(e) => set('nameAccent', e.target.value)}
            placeholder="e.g. FOLIM"
          />
        </label>
        <label>
          Short code (tab)
          <input
            value={form.shortCode}
            onChange={(e) => set('shortCode', e.target.value)}
            required
            maxLength={6}
          />
        </label>
        <label>
          Tab color
          <select value={form.tabColor} onChange={(e) => set('tabColor', e.target.value)}>
            {TAB_COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Form label
          <input value={form.formLabel} onChange={(e) => set('formLabel', e.target.value)} />
        </label>
        <label>
          Indication / header
          <textarea
            rows={2}
            value={form.indication}
            onChange={(e) => set('indication', e.target.value)}
            required
          />
        </label>
        <label>
          Composition
          <textarea
            rows={2}
            value={form.composition}
            onChange={(e) => set('composition', e.target.value)}
            required
          />
        </label>
        <label>
          Tagline
          <textarea rows={2} value={form.tagline} onChange={(e) => set('tagline', e.target.value)} required />
        </label>
        <label>
          Notes
          <textarea rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
        </label>
        <label>
          Main image
          <input type="file" accept="image/*" onChange={(e) => void onFile(e.target.files?.[0])} />
        </label>
        {form.mainImage ? (
          <img
            src={form.mainImage}
            alt="Product"
            style={{ width: 160, height: 160, objectFit: 'cover', borderRadius: '50%' }}
          />
        ) : null}
        <div className="form-actions">
          <button className="btn btn-dark" disabled={busy} type="submit">
            Save product
          </button>
          <Link className="btn btn-danger" to={`/category/${id}`}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
