import Dexie, { type EntityTable } from 'dexie';
import type { Category, ExportRecord, Product } from '../types';

export class PharmaDB extends Dexie {
  categories!: EntityTable<Category, 'id'>;
  products!: EntityTable<Product, 'id'>;
  exports!: EntityTable<ExportRecord, 'id'>;

  constructor() {
    super('theratrix-dva-v2');
    this.version(1).stores({
      categories: 'id, name, createdAt',
      products: 'id, categoryId, shortCode, name, createdAt',
      exports: 'id, createdAt, title',
    });
  }
}

export const db = new PharmaDB();

/** Drop older local DBs so seed art and schema stay current. */
export async function retireLegacyDb(): Promise<void> {
  for (const name of ['pharma-dva', 'theratrix-dva']) {
    try {
      await Dexie.delete(name);
    } catch {
      /* ignore */
    }
  }
}
