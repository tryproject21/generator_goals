import React, { forwardRef } from 'react';

const ReportPreview = forwardRef(({ reportData }, ref) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const displayDate = () => {
    if (!reportData.tanggal) return '-';
    const startDate = formatDate(reportData.tanggal);
    if (reportData.tanggalAkhir) {
      return `${startDate} s/d ${formatDate(reportData.tanggalAkhir)}`;
    }
    return startDate;
  };

  return (
    <div className="pdf-preview-wrapper">
      {/* This ref is what html2pdf targets */}
      <div ref={ref} className="pdf-document">
        
        {/* Visual page break indicator for preview only (ignored by PDF) */}
        <div className="page-separator-overlay" data-html2canvas-ignore="true"></div>

        {/* Header Section */}
        <div className="pdf-header">
          <h1 className="pdf-title">LAPORAN KEGIATAN</h1>
        </div>

        {/* Info Section */}
        <div className="pdf-content-section">
          <div className="pdf-row">
            <div className="pdf-label">Perihal</div>
            <div className="pdf-value">: {reportData.perihal || '-'}</div>
          </div>
          <div className="pdf-row">
            <div className="pdf-label">Tanggal Kegiatan</div>
            <div className="pdf-value">: {displayDate()}</div>
          </div>
          <div className="pdf-row">
            <div className="pdf-label">Lokasi</div>
            <div className="pdf-value">: {reportData.lokasi || '-'}</div>
          </div>
        </div>

        {/* Notulensi Section */}
        {reportData.notulensi && (
          <div className="pdf-content-section" style={{ pageBreakInside: 'avoid' }}>
            <h2 className="pdf-section-title">Notulensi</h2>
            <div className="pdf-value" style={{ textAlign: 'justify' }}>
              {reportData.notulensi}
            </div>
          </div>
        )}

        {/* Dokumentasi Section */}
        {reportData.dokumentasi.length > 0 && (
          <div className="pdf-content-section">
            <h2 className="pdf-section-title" style={{ marginTop: '20px' }}>Dokumentasi Kegiatan</h2>
            <div className="pdf-doc-grid">
              {reportData.dokumentasi.map((doc, index) => (
                <div key={doc.id || index} className="pdf-doc-item">
                  <img src={doc.src || doc} alt={`Dokumentasi ${index + 1}`} />
                  {doc.caption && (
                    <div className="pdf-doc-caption">
                      {doc.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ReportPreview;
