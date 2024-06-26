
import PDFDocument from "pdfkit";
import fs from 'fs';
import path from "path";

export function generatePDF() {

  return new Promise((resolve, reject) => {
    // Crear un nuevo documento PDF
    const doc = new PDFDocument();

    // Escribir el contenido del PDF
    doc.fontSize(18).text('¡Hola, mundo!', 100, 100);
    doc.fontSize(12).text('Este es un ejemplo de generación de PDF con PDFKit.', 100, 150);

    // Establecer el nombre del archivo de salida
    const fileName = path.join(__dirname, 'output.pdf');

    // Pipe the PDF to a writable stream
    const writeStream = fs.createWriteStream(fileName);
    doc.pipe(writeStream);

    // Finalizar el documento PDF
    doc.end();

    // Escuchar el evento 'finish' del documento PDF
    writeStream.on('finish', () => {
      // Resolver la promesa con el nombre del archivo
      resolve(fileName);
    });

    // Escuchar el evento 'error' del documento PDF
    doc.on('error', (err) => {
      // Rechazar la promesa con el error
      reject(err);
    });
  });

}



export function deletePDF() {

  const fileName = path.join(__dirname, 'output.pdf');
  fs.unlink(fileName, (err) => {
    if (err) {
      console.error('Error al eliminar el archivo:', err);
      return;
    }
    console.log('Archivo eliminado exitosamente.');
  });

}