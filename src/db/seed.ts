import { db, retireLegacyDb } from './index';
import type { Category, Product } from '../types';

const now = Date.now();

const categories: Category[] = [
  {
    id: 'cat-b-complex',
    name: 'Bioactive B-Complex',
    coverImage: './seed/category-b-complex.jpg',
    createdAt: now - 86400000,
    updatedAt: now - 86400000,
  },
  {
    id: 'cat-neuro',
    name: 'Neuro Support',
    coverImage: './seed/category-neuro.jpg',
    createdAt: now - 80000000,
    updatedAt: now - 80000000,
  },
];

const products: Product[] = [
  {
    id: 'prod-bifolim',
    categoryId: 'cat-b-complex',
    name: 'BI-FOLIM',
    shortCode: 'BFP',
    tabColor: '#4ca7d0',
    slideImage: './seed/slide-bifolim.jpg',
    createdAt: now - 86000000,
    updatedAt: now - 86000000,
  },
  {
    id: 'prod-bfd',
    categoryId: 'cat-b-complex',
    name: 'BI-FOL D',
    shortCode: 'BFD',
    tabColor: '#e52b1f',
    slideImage: './seed/slide-bfd.jpg',
    createdAt: now - 85000000,
    updatedAt: now - 85000000,
  },
  {
    id: 'prod-afc',
    categoryId: 'cat-b-complex',
    name: 'AFC-PLUS',
    shortCode: 'AFC',
    tabColor: '#277ea8',
    slideImage: './seed/slide-afc.jpg',
    createdAt: now - 84000000,
    updatedAt: now - 84000000,
  },
  {
    id: 'prod-mecobal',
    categoryId: 'cat-neuro',
    name: 'MECO-FORTE',
    shortCode: 'MCF',
    tabColor: '#c91f16',
    slideImage: './seed/slide-meco.jpg',
    createdAt: now - 83000000,
    updatedAt: now - 83000000,
  },
  {
    id: 'prod-biot',
    categoryId: 'cat-b-complex',
    name: 'BIO-SHINE',
    shortCode: 'BSH',
    tabColor: '#5bb8d9',
    slideImage: './seed/slide-bioshine.jpg',
    createdAt: now - 82000000,
    updatedAt: now - 82000000,
  },
];

export async function ensureSeedData(): Promise<void> {
  await retireLegacyDb();
  const count = await db.categories.count();
  if (count > 0) return;
  await db.transaction('rw', db.categories, db.products, async () => {
    await db.categories.bulkAdd(categories);
    await db.products.bulkAdd(products);
  });
}
