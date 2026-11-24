export interface Category {
  id: string;
  name: string;
  coverImage: string;
  createdAt: number;
  updatedAt: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  nameAccent?: string;
  shortCode: string;
  tabColor: string;
  indication: string;
  composition: string;
  tagline: string;
  formLabel: string;
  mainImage: string;
  notes?: string;
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
