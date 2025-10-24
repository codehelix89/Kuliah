// ======================================================
// viewer.js — Auto PDF Loader tanpa dropdown
// ======================================================

// Inisialisasi PDF.js
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Ambil parameter dari URL (?file=...)
const params = new URLSearchParams(window.location.search);
const fileParam = params.get("file") || "AKUNTANSI KEUANGAN MENENGAH 1 - EU101 [UTS].pdf"; // default ujian1.pdf

// Dapatkan container untuk viewer
const viewerContainer = document.getElementById('pdfViewer');

// Fungsi render satu halaman
function renderPage(pdf, pageNumber) {
  pdf.getPage(pageNumber).then(page => {
    const scale = 1.25;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    viewerContainer.appendChild(canvas);
    page.render({ canvasContext: ctx, viewport });
  });
}

// Muat dan render PDF
function loadPDF(url) {
  viewerContainer.innerHTML = "<p style='text-align:center;'>📄 Memuat dokumen...</p>";
  pdfjsLib.getDocument(url).promise.then(pdfDoc => {
    viewerContainer.innerHTML = "";
    console.log(`📚 Memuat ${pdfDoc.numPages} halaman dari ${url}`);
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      renderPage(pdfDoc, pageNum);
    }
  }).catch(err => {
    viewerContainer.innerHTML = `
      <p style="color:red;text-align:center;padding:20px;">
        ❌ Gagal memuat file: <b>${url}</b><br>${err.message}
      </p>`;
    console.error("PDF Load Error:", err);
  });
}

// Jalankan
loadPDF(fileParam);
