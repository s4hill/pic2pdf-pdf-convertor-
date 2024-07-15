// Navbar toggle for mobile view
document.querySelector('.burger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('nav-active');
});

const { jsPDF } = window.jspdf;

// Function to handle image to PDF conversion
document.getElementById('convertButton').addEventListener('click', () => {
    const imageInput = document.getElementById('imageInput');
    if (imageInput.files.length === 0) return;

    document.getElementById('loadingBar').classList.remove('hidden');

    const pdf = new jsPDF();
    const files = imageInput.files;
    let count = 0;

    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                if (index > 0) pdf.addPage();
                pdf.addImage(img, 'JPEG', 10, 10, 180, 160);
                count++;
                if (count === files.length) {
                    document.getElementById('loadingBar').classList.add('hidden');
                    const pdfOutput = pdf.output('blob');
                    const url = URL.createObjectURL(pdfOutput);
                    document.getElementById('downloadLink').href = url;
                    document.getElementById('result').classList.remove('hidden');
                }
            };
        };
        reader.readAsDataURL(file);
    });
});

// Function to handle PDF to image conversion
document.getElementById('pdfToImgButton').addEventListener('click', () => {
    const pdfInput = document.getElementById('pdfInput');
    if (pdfInput.files.length === 0) return;

    document.getElementById('loadingBar').classList.remove('hidden');

    const file = pdfInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const typedArray = new Uint8Array(reader.result);
        pdfjsLib.getDocument(typedArray).promise.then(pdf => {
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
                        const img = document.createElement('img');
                        img.src = canvas.toDataURL();
                        imageContainer.appendChild(img);
                        if (pageNum === numPages) {
                            document.getElementById('loadingBar').classList.add('hidden');
                            document.getElementById('imgResult').classList.remove('hidden');
                        }
                    });
                });
            }
        });
    };
    reader.readAsArrayBuffer(file);
});

// Function to handle PDF compression
document.getElementById('compressButton').addEventListener('click', () => {
    const pdfCompressInput = document.getElementById('pdfCompressInput');
    if (pdfCompressInput.files.length === 0) return;

    document.getElementById('loadingBar').classList.remove('hidden');

    const file = pdfCompressInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const typedArray = new Uint8Array(reader.result);
        pdfjsLib.getDocument(typedArray).promise.then(pdf => {
            const editedPDF = new jsPDF();
            const numPages = pdf.numPages;

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                pdf.getPage(pageNum).then(page => {
                    const viewport = page.getViewport({ scale: 0.8 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
                        editedPDF.addImage(canvas.toDataURL(), 'JPEG', 10, 10, 190, 280);
                        if (pageNum < numPages) editedPDF.addPage();
                        if (pageNum === numPages) {
                            document.getElementById('loadingBar').classList.add('hidden');
                            const pdfOutput = editedPDF.output('blob');
                            const url = URL.createObjectURL(pdfOutput);
                            document.getElementById('compressedDownloadLink').href = url;
                            document.getElementById('compressResult').classList.remove('hidden');
                        }
                    });
                });
            }
        });
    };
    reader.readAsArrayBuffer(file);
});

// Function to handle PDF editing
document.getElementById('editButton').addEventListener('click', () => {
    const pdfEditInput = document.getElementById('pdfEditInput');
    if (pdfEditInput.files.length === 0) return;

    document.getElementById('loadingBar').classList.remove('hidden');

    const file = pdfEditInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const typedArray = new Uint8Array(reader.result);
        pdfjsLib.getDocument(typedArray).promise.then(pdf => {
            const editedPDF = new jsPDF();
            const numPages = pdf.numPages;

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                pdf.getPage(pageNum).then(page => {
                    const viewport = page.getViewport({ scale: 1.0 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
                        editedPDF.addImage(canvas.toDataURL(), 'JPEG', 10, 10, 190, 280);
                        if (pageNum < numPages) editedPDF.addPage();
                        if (pageNum === numPages) {
                            document.getElementById('loadingBar').classList.add('hidden');
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
    reader.readAsArrayBuffer(file);
});
