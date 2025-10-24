// ======================================================
// viewer.js — Kompatibel untuk Struktur Folder Bersarang di GitHub Pages
// ======================================================

// Inisialisasi PDF.js dari CDN
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Ambil parameter file (?file=...)
const params = new URLSearchParams(window.location.search);
let fileParam = params.get("file");

// Tentukan file default jika tidak ada parameter
const defaultFile = "default.pdf";
if (!fileParam) fileParam = defaultFile;

// Decode agar bisa membaca spasi (%20) dan karakter khusus
const pdfPath = decodeURIComponent(fileParam);

// Ambil elemen kontainer viewer
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

// Fungsi memuat PDF
function loadPDF(url) {
  console.log("📂 Mencoba memuat:", url);
  viewerContainer.innerHTML = `<p style="text-align:center;">📄 Memuat dokumen...<br><b>${url}</b></p>`;

  pdfjsLib.getDocument(url).promise.then(pdfDoc => {
    viewerContainer.innerHTML = "";
    console.log(`📚 File ditemukan (${pdfDoc.numPages} halaman)`);
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      renderPage(pdfDoc, pageNum);
    }
  }).catch(err => {
    console.error("❌ Gagal memuat PDF:", err);
    viewerContainer.innerHTML = `
      <div style="text-align:center;color:red;padding:30px;">
        ❌ Gagal memuat file: <b>${url}</b><br>
        Pastikan file berada di lokasi dan branch yang sama dengan index.html.
        <br><br><small>${err.message}</small>
      </div>`;
  });
}

// Jalankan viewer
loadPDF(pdfPath);
