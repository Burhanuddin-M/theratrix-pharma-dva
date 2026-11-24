import { jsPDF } from 'jspdf';
import type { Product } from '../types';
import { loadImage } from './image';

function splitName(product: Product): { lead: string; accent: string } {
  if (product.nameAccent && product.name.endsWith(product.nameAccent)) {
    return {
      lead: product.name.slice(0, -product.nameAccent.length),
      accent: product.nameAccent,
    };
  }
  const parts = product.name.split(/[\s-]/);
  if (parts.length > 1) {
    return { lead: parts[0] + (product.name.includes('-') ? '-' : ' '), accent: parts.slice(1).join(product.name.includes('-') ? '-' : ' ') };
  }
  return { lead: product.name, accent: '' };
}

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
    const p = products[i];
    await drawSlide(doc, p);
  }

  const blob = doc.output('blob');
  const dataUri = doc.output('datauristring');
  const base64 = dataUri.split(',')[1] ?? '';
  return { blob, base64, pageCount: products.length };
}

async function drawSlide(doc: jsPDF, product: Product) {
  const W = 1280;
  const H = 720;

  doc.setFillColor(247, 243, 232);
  doc.rect(0, 0, W, H, 'F');

  doc.setFillColor(61, 36, 99);
  doc.rect(0, 0, W, H * 0.48, 'F');

  // Soft wave approximation
  doc.setFillColor(247, 243, 232);
  doc.ellipse(W * 0.35, H * 0.52, W * 0.7, H * 0.18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'italic');
  doc.setFontSize(28);
  const indication = doc.splitTextToSize(product.indication, 680);
  doc.text(indication, 360, 110);

  try {
    const img = await loadImage(product.mainImage);
    const canvas = document.createElement('canvas');
    const size = 420;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      const scale = Math.max(size / img.width, size / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (size - dw) / 2, (size - dh) / 2, dw, dh);
      const round = canvas.toDataURL('image/jpeg', 0.9);
      doc.addImage(round, 'JPEG', 70, 130, 280, 280);
    }
  } catch {
    doc.setFillColor(200, 170, 170);
    doc.circle(210, 270, 140, 'F');
  }

  const { lead, accent } = splitName(product);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(64);
  doc.setTextColor(30, 42, 90);
  doc.text(lead, 380, 450, { baseline: 'alphabetic' });
  const leadW = doc.getTextWidth(lead);
  if (accent) {
    doc.setTextColor(194, 24, 91);
    doc.text(accent, 380 + leadW, 450);
  }

  doc.setTextColor(26, 22, 48);
  doc.setFontSize(22);
  doc.text(product.formLabel, 380 + leadW + doc.getTextWidth(accent) + 14, 450);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(58, 53, 80);
  const composition = doc.splitTextToSize(product.composition, 700);
  doc.text(composition, 380, 485);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(26, 22, 48);
  const tagline = doc.splitTextToSize(product.tagline, 700);
  doc.text(tagline, 380, 540);

  // Right tabs strip
  doc.setFillColor(26, 18, 48);
  doc.rect(W - 70, 0, 70, H, 'F');
  doc.setFillColor(58, 42, 85);
  doc.roundedRect(W - 58, H / 2 - 28, 46, 56, 8, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(product.shortCode, W - 35, H / 2 + 4, { align: 'center' });
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
