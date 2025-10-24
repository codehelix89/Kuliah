// ======================================================
// viewer.js — Multi-folder PDF Viewer untuk GitHub Pages
// ======================================================

const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Ambil parameter dari URL (?file=folder/nama.pdf)
const params = new URLSearchParams(window.location.search);
const fileParam = params.get("file");

// Tentukan file default jika parameter tidak ada
const defaultFile = "ujian/ujian1.pdf";
const fileToLoad = fileParam ? decodeURIComponent(fileParam) : defaultFile;

// Ambil elemen viewer
const viewerContainer = document.getElementById('pdfViewer');

// Fungsi render halaman
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

// Fungsi utama memuat PDF
function loadPDF(url) {
  viewerContainer.innerHTML = `<p style='text-align:center;'>📄 Memuat dokumen dari <b>${url}</b>...</p>`;
  
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
loadPDF(fileToLoad);
