import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Font.register({
//   family: 'Inter',
//   src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
// });

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
    color: '#000',
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: 150,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 4,
  },
  notulensiText: {
    marginBottom: 4,
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  docGrid: {
    marginTop: 10,
  },
  docItem: {
    marginBottom: 20,
    alignItems: 'center',
  },
  docImage: {
    maxWidth: '100%',
    maxHeight: 300,
    objectFit: 'contain',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  docCaption: {
    marginTop: 5,
    fontSize: 10,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#333',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    color: 'gray',
    fontStyle: 'italic',
  }
});

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const displayDate = (tanggal, tanggalAkhir) => {
  if (!tanggal) return '-';
  const startDate = formatDate(tanggal);
  if (tanggalAkhir) {
    return `${startDate} s/d ${formatDate(tanggalAkhir)}`;
  }
  return startDate;
};

const ReportPDF = ({ reportData }) => {
  let periodText = '';
  if (reportData.tanggal) {
    const dateObj = new Date(reportData.tanggal);
    const monthYear = dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    periodText = `Dokumen Kinerja Bulan ${monthYear}.`;
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Info Section */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Nama Kegiatan</Text>
            <Text style={styles.value}>: {reportData.perihal || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tanggal Kegiatan</Text>
            <Text style={styles.value}>: {displayDate(reportData.tanggal, reportData.tanggalAkhir)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Lokasi</Text>
            <Text style={styles.value}>: {reportData.lokasi || '-'}</Text>
          </View>
        </View>

        {/* Notulensi/Keterangan Section */}
        {reportData.notulensi && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Keterangan</Text>
            {reportData.notulensi.split('\n').map((line, i) => (
              <Text key={i} style={styles.notulensiText}>{line}</Text>
            ))}
          </View>
        )}

        {/* Dokumentasi Section */}
        {reportData.dokumentasi && reportData.dokumentasi.length > 0 && (
          <Text style={styles.sectionTitle}>Dokumentasi Kegiatan</Text>
        )}
        {reportData.dokumentasi && reportData.dokumentasi.map((doc, index) => (
          <View key={index} style={styles.docItem} wrap={false}>
            <Image src={doc.src} style={styles.docImage} />
            {doc.caption ? (
              <Text style={styles.docCaption}>{doc.caption}</Text>
            ) : null}
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>{periodText}</Text>
          <Text render={({ pageNumber, totalPages }) => `Halaman ${pageNumber} dari ${totalPages}`} />
        </View>

      </Page>
    </Document>
  );
};

export default ReportPDF;
