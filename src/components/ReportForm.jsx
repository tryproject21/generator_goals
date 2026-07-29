import React, { useCallback, useState, useEffect } from 'react';
import { UploadCloud, X, Calendar, Type, BookOpen, MapPin } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

export default function ReportForm({ reportData, setReportData }) {
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData(prev => ({ ...prev, [name]: value }));
  };

  const handleDragOverFile = (e) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeaveFile = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const processFiles = useCallback(async (files) => {
    const newImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        try {
          const compressedBase64 = await compressImage(file);
          newImages.push({
            id: Date.now() + i + Math.random().toString(36).substr(2, 5),
            src: compressedBase64,
            caption: ''
          });
        } catch (error) {
          console.error("Error compressing image", error);
        }
      }
    }
    if (newImages.length > 0) {
      setReportData(prev => ({
        ...prev,
        dokumentasi: [...prev.dokumentasi, ...newImages]
      }));
    }
  }, [setReportData]);

  useEffect(() => {
    const handleGlobalPaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          imageFiles.push(items[i].getAsFile());
        }
      }

      if (imageFiles.length > 0) {
        // Prevent default to avoid pasting image path as text in inputs
        if (e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
           e.preventDefault();
        }
        processFiles(imageFiles);
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [processFiles]);

  const handleDropFile = useCallback((e) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [setReportData]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeImage = (indexToRemove) => {
    setReportData(prev => ({
      ...prev,
      dokumentasi: prev.dokumentasi.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleCaptionChange = (index, value) => {
    setReportData(prev => {
      const newDocs = [...prev.dokumentasi];
      newDocs[index].caption = value;
      return { ...prev, dokumentasi: newDocs };
    });
  };

  // Drag and Drop reordering logic
  const handleDragStartItem = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires setting data
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOverItem = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    // If we want real-time swapping, we can do it here, but onDrop is safer for performance
  };

  const handleDropItem = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === dropIndex) return;

    setReportData(prev => {
      const newDocs = [...prev.dokumentasi];
      const draggedItem = newDocs[draggedItemIndex];
      // Remove item from old position
      newDocs.splice(draggedItemIndex, 1);
      // Insert item at new position
      newDocs.splice(dropIndex, 0, draggedItem);
      return { ...prev, dokumentasi: newDocs };
    });
    setDraggedItemIndex(null);
  };

  return (
    <div className="glass-panel" style={{ padding: '32px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <h1 className="form-title">Generator Laporan</h1>
      <p className="form-subtitle">Lengkapi data di bawah ini untuk membuat laporan kegiatan.</p>

      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Type size={16} /> Perihal
        </label>
        <input
          type="text"
          name="perihal"
          className="form-input"
          placeholder="Misal: Rapat Evaluasi Program Kerja"
          value={reportData.perihal}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={16} /> Tanggal Kegiatan
        </label>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="date"
            name="tanggal"
            className="form-input"
            style={{ flex: 1 }}
            value={reportData.tanggal}
            onChange={handleInputChange}
          />
          <span style={{ color: 'var(--text-secondary)' }}>s/d</span>
          <input
            type="date"
            name="tanggalAkhir"
            className="form-input"
            style={{ flex: 1 }}
            value={reportData.tanggalAkhir}
            onChange={handleInputChange}
            title="Opsional: Kosongkan jika hanya 1 hari"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={16} /> Lokasi Kegiatan
        </label>
        <input
          type="text"
          name="lokasi"
          className="form-input"
          placeholder="Misal: Ruang Rapat Utama"
          value={reportData.lokasi}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={16} /> Keterangan (Opsional)
        </label>
        <textarea
          name="notulensi"
          className="form-textarea"
          placeholder="Tuliskan keterangan tambahan di sini..."
          value={reportData.notulensi}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Dokumentasi (Unggah & Geser Foto)</label>
        <div 
          className={`file-upload-area ${isDraggingFile ? 'drag-active' : ''}`}
          onDragOver={handleDragOverFile}
          onDragLeave={handleDragLeaveFile}
          onDrop={handleDropFile}
        >
          <UploadCloud className="file-upload-icon" size={36} />
          <p style={{ color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 500 }}>
            Tarik & Lepas foto ke sini
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            atau klik untuk memilih file (Bisa juga tekan Ctrl+V/Paste langsung)
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            className="file-upload-input"
            onChange={handleFileSelect}
          />
        </div>

        {reportData.dokumentasi.length > 0 && (
          <div className="image-preview-list">
            {reportData.dokumentasi.map((doc, index) => (
              <div 
                key={doc.id} 
                className={`image-preview-item ${draggedItemIndex === index ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStartItem(e, index)}
                onDragOver={(e) => handleDragOverItem(e, index)}
                onDrop={(e) => handleDropItem(e, index)}
                onDragEnd={() => setDraggedItemIndex(null)}
              >
                <div className="image-preview-img-wrapper">
                  <img src={doc.src} alt={`Dokumentasi ${index + 1}`} />
                  <button 
                    type="button"
                    className="remove-image-btn" 
                    onClick={() => removeImage(index)}
                    title="Hapus gambar"
                  >
                    <X size={14} />
                  </button>
                </div>
                <input 
                  type="text" 
                  className="caption-input" 
                  placeholder="Keterangan foto (opsional)..."
                  value={doc.caption}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
