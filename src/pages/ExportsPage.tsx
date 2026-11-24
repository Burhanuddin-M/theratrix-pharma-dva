import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { ExportRecord } from '../types';
import { downloadBlob, openPdfBase64 } from '../utils/pdf';

interface Props {
  exports: ExportRecord[];
  onDelete: (id: string) => void;
}

function toBlob(base64: string) {
  const byteChars = atob(base64);
  const bytes = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i += 1) bytes[i] = byteChars.charCodeAt(i);
  return new Blob([bytes], { type: 'application/pdf' });
}

const ease = [0.22, 1, 0.36, 1] as const;

export function ExportsPage({ exports, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="page-title">Past exports</h1>
      <p className="page-sub">Local PDF history stored on this device. Open, download, or delete.</p>
      <div className="toolbar">
        <button type="button" className="btn btn-dark" onClick={() => navigate('/')}>
          Home
        </button>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/selection')}>
          New showcase
        </button>
      </div>

      {exports.length === 0 ? (
        <div className="empty">No exports yet. Run a showcase and tap Export PDF.</div>
      ) : (
        <div className="product-list">
          {exports.map((item, i) => (
            <motion.div
              key={item.id}
              className="export-item"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, ease, delay: Math.min(i * 0.05, 0.35) }}
            >
              <div>
                <h3>{item.title}</h3>
                <p>
                  {new Date(item.createdAt).toLocaleString()} · {item.pageCount} pages ·{' '}
                  {item.productNames.join(', ')}
                </p>
              </div>
              <div className="toolbar" style={{ margin: 0 }}>
                <button type="button" className="btn btn-dark" onClick={() => openPdfBase64(item.pdfBase64)}>
                  Open
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    downloadBlob(toBlob(item.pdfBase64), `${item.title.replace(/\s+/g, '-')}.pdf`)
                  }
                >
                  Download
                </button>
                <button type="button" className="btn btn-danger" onClick={() => onDelete(item.id)}>
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
