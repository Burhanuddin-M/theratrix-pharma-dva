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
          {exports.map((item) => (
            <div key={item.id} className="export-item">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
