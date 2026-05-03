// ======================================================
// viewer.js — Versi Final (GitHub Pages Compatible)
// Absolute Path + Robust Error Handling
// ======================================================

// Inisialisasi PDF.js
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Ambil parameter URL (?file=...)
const params = new URLSearchParams(window.location.search);
let fileParam = params.get("file");

// Default file
const DEFAULT_FILE = "default.pdf";
if (!fileParam) fileParam = DEFAULT_FILE;

// Ambil base URL GitHub Pages
const REPO_NAME = "Kuliah"; // ⚠️ Sesuaikan jika nama repo berubah
const BASE_URL = `${window.location.origin}/${REPO_NAME}/`;

// Decode & bentuk full path (ABSOLUTE PATH)
const decodedPath = decodeURIComponent(fileParam);
const pdfPath = BASE_URL + decodedPath;

// Ambil container
const viewerContainer = document.getElementById('pdfViewer');

// ======================================================
// Render satu halaman PDF
// ======================================================
function renderPage(pdf, pageNumber) {
  pdf.getPage(pageNumber).then(page => {
    const scale = 1.25;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    viewerContainer.appendChild(canvas);

    page.render({
      canvasContext: ctx,
      viewport: viewport
    });
  });
}

// ======================================================
// Load PDF
// ======================================================
function loadPDF(url) {

  console.log("📂 Loading PDF:", url);

  viewerContainer.innerHTML = `
    <div style="text-align:center;padding:20px;">
      📄 Memuat dokumen...<br>
      <small>${url}</small>
    </div>
  `;

  pdfjsLib.getDocument(url).promise
    .then(pdfDoc => {
      console.log(`✅ PDF loaded (${pdfDoc.numPages} pages)`);

      viewerContainer.innerHTML = "";

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        renderPage(pdfDoc, pageNum);
      }
    })
    .catch(err => {

      console.error("❌ ERROR:", err);

      viewerContainer.innerHTML = `
        <div style="
          text-align:center;
          color:red;
          padding:30px;
          font-family:Arial;
        ">
          <h3>❌ Gagal memuat PDF</h3>
          <p><b>${url}</b></p>
          
          <p style="color:#555;">
            Kemungkinan penyebab:
          </p>
          <ul style="text-align:left; display:inline-block;">
            <li>File tidak ada di repository</li>
            <li>Path tidak sesuai (case-sensitive)</li>
            <li>Belum di-push ke branch GitHub Pages</li>
          </ul>

          <hr style="margin:20px 0;">
          <small>${err.message}</small>
        </div>
      `;
    });
}

// ======================================================
// Validasi sebelum load
// ======================================================
if (!decodedPath.endsWith(".pdf")) {
  console.warn("⚠️ File bukan PDF, fallback ke default");
  loadPDF(BASE_URL + DEFAULT_FILE);
} else {
  loadPDF(pdfPath);
}
