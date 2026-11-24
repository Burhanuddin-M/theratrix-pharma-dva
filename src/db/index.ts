import Dexie, { type EntityTable } from 'dexie';
import type { Category, ExportRecord, Product } from '../types';

export class PharmaDB extends Dexie {
  categories!: EntityTable<Category, 'id'>;
  products!: EntityTable<Product, 'id'>;
  exports!: EntityTable<ExportRecord, 'id'>;

  constructor() {
    super('theratrix-dva');
    this.version(1).stores({
      categories: 'id, name, createdAt',
      products: 'id, categoryId, shortCode, name, createdAt',
      exports: 'id, createdAt, title',
    });
  }
}

export const db = new PharmaDB();

/** One-time wipe of the legacy purple-era DB name if present. */
export async function retireLegacyDb(): Promise<void> {
  try {
    await Dexie.delete('pharma-dva');
  } catch {
    /* ignore */
  }
}
