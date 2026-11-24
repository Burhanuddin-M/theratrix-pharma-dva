import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../db';
import type { Category } from '../types';
import { compressImage, uid } from '../utils/image';

interface Props {
  onSaved: () => void;
}

export function CategoryFormPage({ onSaved }: Props) {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [coverImage, setCoverImage] = useState('./seed/category-b-complex.jpg');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isNew) return;
    void db.categories.get(id!).then((cat) => {
      if (!cat) return;
      setName(cat.name);
      setCoverImage(cat.coverImage);
    });
  }, [id, isNew]);

  const onFile = async (file?: File | null) => {
    if (!file) return;
    setBusy(true);
    try {
      const data = await compressImage(file);
      setCoverImage(data);
    } finally {
      setBusy(false);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (isNew) {
      const row: Category = {
        id: uid('cat'),
        name: name.trim(),
        coverImage,
        createdAt: now,
        updatedAt: now,
      };
      await db.categories.add(row);
    } else {
      await db.categories.update(id!, {
        name: name.trim(),
        coverImage,
        updatedAt: now,
      });
    }
    onSaved();
    navigate('/');
  };

  return (
    <div>
      <h1 className="page-title">{isNew ? 'New category' : 'Edit category'}</h1>
      <p className="page-sub">Name and cover image for the category tile.</p>
      <form className="form-panel form-grid" onSubmit={submit}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} />
        </label>
        <label>
          Cover image
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
        </label>
        {coverImage ? (
          <img
            src={coverImage}
            alt="Cover preview"
            style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 14 }}
          />
        ) : null}
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={busy || !name.trim()}>
            Save
          </button>
          <button type="button" className="btn btn-soft" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
