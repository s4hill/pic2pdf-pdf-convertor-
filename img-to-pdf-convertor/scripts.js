document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });

    if (document.getElementById('convertButton')) {
        document.getElementById('convertButton').addEventListener('click', convertToPDF);
    }

    if (document.getElementById('pdfToImgButton')) {
        document.getElementById('pdfToImgButton').addEventListener('click', convertPDFToImage);
    }

    if (document.getElementById('compressButton')) {
        document.getElementById('compressButton').addEventListener('click', compressPDF);
    }

    if (document.getElementById('editButton')) {
        document.getElementById('editButton').addEventListener('click', editPDF);
    }
});

function showLoading() {
    const loadingBar = document.getElementById('loadingBar');
    loadingBar.classList.remove('hidden');
}

function hideLoading() {
    const loadingBar = document.getElementById('loadingBar');
    loadingBar.classList.add('hidden');
}

function convertToPDF() {
    showLoading();
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const files = document.getElementById('imageInput').files;

    if (files.length === 0) {
        alert('Please select images to convert');
        hideLoading();
        return;
    }

    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                pdf.addImage(img, 'JPEG', 10, 10, 190, 280);
                if (index < files.length - 1) pdf.addPage();
                if (index === files.length - 1) {
                    hideLoading();
                    const pdfOutput = pdf.output('blob');
                    const url = URL.createObjectURL(pdfOutput);
                    document.getElementById('downloadLink').href = url;
                    document.getElementById('result').classList.remove('hidden');
                }
            };
        };
        reader.readAsDataURL(file);
    });
}

function convertPDFToImage() {
    showLoading();
    const pdfInput = document.getElementById('pdfInput').files[0];
    if (!pdfInput) {
        alert('Please select a PDF to convert');
        hideLoading();
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = function() {
        const typedarray = new Uint8Array(this.result);
        pdfjsLib.getDocument(typedarray).promise.then(pdf => {
            const numPages = pdf.numPages;
            const imageContainer = document.getElementById('imageContainer');
            imageContainer.innerHTML = '';
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                pdf.getPage(pageNum).then(page => {
                    const viewport = page.getViewport({ scale: 1.5 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
                        const img = new Image();
                        img.src = canvas.toDataURL();
                        imageContainer.appendChild(img);
                        if (pageNum === numPages) {
                            hideLoading();
                            document.getElementById('imgResult').classList.remove('hidden');
                        }
                    });
                });
            }
        });
    };
    fileReader.readAsArrayBuffer(pdfInput);
}

function compressPDF() {
    showLoading();
    const pdfInput = document.getElementById('pdfCompressInput').files[0];
    if (!pdfInput) {
        alert('Please select a PDF to compress');
        hideLoading();
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const pdfData = new Uint8Array(e.target.result);
        pdfjsLib.getDocument({ data: pdfData }).promise.then(pdf => {
            const numPages = pdf.numPages;
            const { jsPDF } = window.jspdf;
            const compressedPDF = new jsPDF();
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                pdf.getPage(pageNum).then(page => {
                    const viewport = page.getViewport({ scale: 0.75 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
                        compressedPDF.addImage(canvas.toDataURL(), 'JPEG', 10, 10, 190, 280);
                        if (pageNum < numPages) compressedPDF.addPage();
                        if (pageNum === numPages) {
                            hideLoading();
                            const pdfOutput = compressedPDF.output('blob');
                            const url = URL.createObjectURL(pdfOutput);
                            document.getElementById('compressedDownloadLink').href = url;
                            document.getElementById('compressResult').classList.remove('hidden');
                        }
                    });
                });
            }
        });
    };
    reader.readAsArrayBuffer(pdfInput);
}

function editPDF() {
    showLoading();
    const pdfInput = document.getElementById('pdfEditInput').files[0];
    if (!pdfInput) {
        alert('Please select a PDF to edit');
        hideLoading();
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const pdfData = new Uint8Array(e.target.result);
        pdfjsLib.getDocument({ data: pdfData }).promise.then(pdf => {
            const numPages = pdf.numPages;
            const { jsPDF } = window.jspdf;
            const editedPDF = new jsPDF();
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                pdf.getPage(pageNum).then(page => {
                    const viewport = page.getViewport({ scale: 1 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
                        editedPDF.addImage(canvas.toDataURL(), 'JPEG', 10, 10, 190, 280);
                        if (pageNum < numPages) editedPDF.addPage();
                        if (pageNum === numPages) {
                            hideLoading();
                            const pdfOutput = editedPDF.output('blob');
                            const url = URL.createObjectURL(pdfOutput);
                            document.getElementById('editedDownloadLink').href = url;
                            document.getElementById('editResult').classList.remove('hidden');
                        }
                    });
                });
            }
        });
    };
    reader.readAsArrayBuffer(pdfInput);
}
