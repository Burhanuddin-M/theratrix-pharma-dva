export interface Category {
  id: string;
  name: string;
  coverImage: string;
  createdAt: number;
  updatedAt: number;
}

/** Product is a labeled detailing slide: name + one full-bleed image. */
export interface Product {
  id: string;
  categoryId: string;
  name: string;
  /** Short tab label derived from name (editable optional override). */
  shortCode: string;
  tabColor: string;
  /** Full detailing slide image (shown 16:9 full-bleed in showcase). */
  slideImage: string;
  createdAt: number;
  updatedAt: number;
}

export interface ExportRecord {
  id: string;
  title: string;
  productIds: string[];
  productNames: string[];
  pdfBase64: string;
  createdAt: number;
  pageCount: number;
}

export type SelectionState = string[];
