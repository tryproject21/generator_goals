import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download, Loader2, Trash2 } from 'lucide-react';
import ReportForm from './components/ReportForm';
import ReportPreview from './components/ReportPreview';

function App() {
  const [reportData, setReportData] = useState(() => {
    // Try to load saved data from localStorage on initial render
    const savedData = localStorage.getItem('laporanKegiatanData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error('Gagal memuat data tersimpan', e);
      }
    }
    // Default initial state
    return {
      perihal: '',
      tanggal: '',
      tanggalAkhir: '',
      lokasi: '',
      notulensi: '',
      dokumentasi: []
    };
  });

  // Auto-save whenever reportData changes
  useEffect(() => {
    try {
      localStorage.setItem('laporanKegiatanData', JSON.stringify(reportData));
    } catch (e) {
      console.warn('Penyimpanan lokal penuh, tidak dapat menyimpan draft secara otomatis.');
    }
  }, [reportData]);

  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef(null);

  // Format filename: "Goals - Tanggal Kegiatan (20260618) - Judul Kegiatan"
  const formattedDateForFile = reportData.tanggal ? reportData.tanggal.replace(/-/g, '') : '';
  const safePerihal = reportData.perihal ? reportData.perihal.replace(/[/\\?%*:|"<>]/g, '-') : 'Laporan';
  const pdfFileName = `Goals - ${formattedDateForFile} - ${safePerihal}.pdf`;

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: pdfFileName,
    onBeforeGetContent: () => {
      setIsGenerating(true);
      return Promise.resolve();
    },
    onAfterPrint: () => setIsGenerating(false),
    onPrintError: (error) => {
      console.error('Print error:', error);
      setIsGenerating(false);
    }
  });

  const generatePDF = () => {
    if (!reportRef.current) return;
    handlePrint();
  };


  const handleReset = () => {
    if (window.confirm("Apakah Anda yakin ingin mereset formulir? Semua data yang belum diunduh akan hilang.")) {
      setReportData({
        perihal: '',
        tanggal: '',
        tanggalAkhir: '',
        lokasi: '',
        notulensi: '',
        dokumentasi: []
      });
    }
  };

  const isFormValid = reportData.perihal && reportData.tanggal && reportData.lokasi;

  return (
    <div className="app-container">
      {/* Left Panel: Form Input */}
      <div className="left-panel">
        <ReportForm reportData={reportData} setReportData={setReportData} />
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button 
            onClick={generatePDF} 
            className="btn-primary" 
            style={{ flex: 2, marginTop: 0 }}
            disabled={!isFormValid || isGenerating}
          >
            {isGenerating ? (
              <><Loader2 className="animate-spin" size={20} /> Memproses PDF...</>
            ) : (
              <><Download size={20} /> Unduh PDF</>
            )}
          </button>

          <button 
            onClick={handleReset} 
            className="btn-primary" 
            style={{ flex: 1, marginTop: 0, background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.5)' }}
            title="Mulai Baru"
          >
            <Trash2 size={20} /> Reset
          </button>
        </div>

        {!isFormValid && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '12px', textAlign: 'center' }}>
            * Mohon lengkapi Nama Kegiatan, Tanggal, dan Lokasi untuk mengunduh PDF.
          </p>
        )}
      </div>

      {/* Right Panel: Live Preview */}
      <div className="right-panel">
        <ReportPreview reportData={reportData} ref={reportRef} />
      </div>
    </div>
  );
}

export default App;
