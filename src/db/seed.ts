import { db } from './index';
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
    nameAccent: 'FOLIM',
    shortCode: 'BFP',
    tabColor: '#4FC3F7',
    indication: 'In vitamin B12 deficiency and recurring mouth ulcers.',
    composition:
      'Biotin 5mg, L-Methylfolate Calcium 1mg, Methylcobalamin 1500mcg & Pyridoxal-5-Phosphate 0.5mg.',
    tagline: "India's Smartest Bioactive B-Complex Formula — With Biotin Advantage.",
    formLabel: 'Tablets',
    mainImage: './seed/clinical-ulcer.jpg',
    notes: 'Sample detailing slide inspired by the BI-FOLIM visual aid.',
    createdAt: now - 86000000,
    updatedAt: now - 86000000,
  },
  {
    id: 'prod-bfd',
    categoryId: 'cat-b-complex',
    name: 'BI-FOL D',
    nameAccent: 'FOL D',
    shortCode: 'BFD',
    tabColor: '#FFB74D',
    indication: 'In diabetic neuropathy with folate & vitamin D support.',
    composition:
      'L-Methylfolate 1mg, Methylcobalamin 1500mcg, Pyridoxal-5-Phosphate 0.5mg & Vitamin D3 1000 IU.',
    tagline: 'Targeted bioactive nutrition for diabetic nerve care.',
    formLabel: 'Tablets',
    mainImage: './seed/clinical-folate.jpg',
    notes: 'Demo product for multi-select showcase.',
    createdAt: now - 85000000,
    updatedAt: now - 85000000,
  },
  {
    id: 'prod-afc',
    categoryId: 'cat-b-complex',
    name: 'AFC-PLUS',
    nameAccent: 'PLUS',
    shortCode: 'AFC',
    tabColor: '#81C784',
    indication: 'In anemia with active folate & iron co-factors.',
    composition:
      'L-Methylfolate Calcium 1mg, Ferrous Ascorbate 100mg, Cyanocobalamin 15mcg & Zinc 22.5mg.',
    tagline: 'Active folate complex for faster hematinic response.',
    formLabel: 'Tablets',
    mainImage: './seed/clinical-biotin.jpg',
    createdAt: now - 84000000,
    updatedAt: now - 84000000,
  },
  {
    id: 'prod-mecobal',
    categoryId: 'cat-neuro',
    name: 'MECO-FORTE',
    nameAccent: 'FORTE',
    shortCode: 'MCF',
    tabColor: '#CE93D8',
    indication: 'In peripheral neuropathy and nerve regeneration support.',
    composition: 'Methylcobalamin 1500mcg, Alpha Lipoic Acid 100mg & Benfotiamine 100mg.',
    tagline: 'High-potency neuro-nutrient triad for daily detailing.',
    formLabel: 'Capsules',
    mainImage: './seed/clinical-neuro.jpg',
    createdAt: now - 83000000,
    updatedAt: now - 83000000,
  },
  {
    id: 'prod-biot',
    categoryId: 'cat-b-complex',
    name: 'BIO-SHINE',
    nameAccent: 'SHINE',
    shortCode: 'BSH',
    tabColor: '#F48FB1',
    indication: 'In biotin deficiency with brittle nails and hair fall.',
    composition: 'Biotin 10mg, Zinc 15mg & Selenium 55mcg.',
    tagline: 'Dermatology-ready biotin support with mineral synergy.',
    formLabel: 'Tablets',
    mainImage: './seed/clinical-biotin.jpg',
    createdAt: now - 82000000,
    updatedAt: now - 82000000,
  },
];

export async function ensureSeedData(): Promise<void> {
  const count = await db.categories.count();
  if (count > 0) return;
  await db.transaction('rw', db.categories, db.products, async () => {
    await db.categories.bulkAdd(categories);
    await db.products.bulkAdd(products);
  });
}
