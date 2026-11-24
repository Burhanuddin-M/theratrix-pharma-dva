import { jsPDF } from 'jspdf';
import type { Product } from '../types';
import { loadImage } from './image';

export async function buildSelectionPdf(products: Product[]): Promise<{
  blob: Blob;
  base64: string;
  pageCount: number;
}> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [1280, 720],
  });

  for (let i = 0; i < products.length; i += 1) {
    if (i > 0) doc.addPage([1280, 720], 'landscape');
    await drawSlide(doc, products[i]);
  }

  const blob = doc.output('blob');
  const dataUri = doc.output('datauristring');
  const base64 = dataUri.split(',')[1] ?? '';
  return { blob, base64, pageCount: products.length };
}

async function drawSlide(doc: jsPDF, product: Product) {
  const W = 1280;
  const H = 720;

  doc.setFillColor(10, 21, 24);
  doc.rect(0, 0, W, H, 'F');

  try {
    const img = await loadImage(product.slideImage);
    const canvas = document.createElement('canvas');
    const usableW = W - 70;
    const scale = Math.max(usableW / img.width, H / img.height);
    const dw = Math.round(img.width * scale);
    const dh = Math.round(img.height * scale);
    canvas.width = usableW;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0a1518';
      ctx.fillRect(0, 0, usableW, H);
      ctx.drawImage(img, (usableW - dw) / 2, (H - dh) / 2, dw, dh);
      const data = canvas.toDataURL('image/jpeg', 0.92);
      doc.addImage(data, 'JPEG', 0, 0, usableW, H);
    }
  } catch {
    doc.setFillColor(251, 248, 242);
    doc.rect(0, 0, W - 70, H, 'F');
    doc.setTextColor(18, 40, 49);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(42);
    doc.text(product.name, 64, H / 2);
  }

  doc.setFillColor(10, 21, 24);
  doc.rect(W - 70, 0, 70, H, 'F');
  doc.setFillColor(26, 51, 56);
  doc.roundedRect(W - 58, H / 2 - 28, 46, 56, 8, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(product.shortCode, W - 35, H / 2 + 4, { align: 'center' });

  doc.setFillColor(21, 23, 26);
  doc.roundedRect(24, H - 56, 220, 32, 8, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(product.name, 36, H - 35);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function openPdfBase64(base64: string) {
  const byteChars = atob(base64);
  const bytes = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i += 1) bytes[i] = byteChars.charCodeAt(i);
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
