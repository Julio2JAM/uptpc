
import PDFDocument from "pdfkit-table";
import fs from 'fs';
import path from "path";

export function generatePDF(data:any) {

  return new Promise((resolve, reject) => {

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();

    const options = {
      title: 'Tabla de Usuarios',
      subtitle: 'Información de los usuarios',
      headers: ['ID', 'Nombre', 'Estado'],
      // datas: data,
      rows: data.map((item:any) => [item.id, item.name, item.description]),
    };

    // const billing = {
    //     name: "Santa Claus",
    //     address: "1 Elf Street",
    //     city: "Arctic City",
    //     state: "Arctic Circle",
    //     postalCode: "H0H 0H0",
    //     country: "North Pole"
    // }

    // Generar la tabla
    doc.table(options, { 
      columnsSize: [ 50, 100, 100 ],
    });
    
//     doc.text(`Billing Address:\n${billing.name}`, {align: "right"})
//           .text(`${billing.address}\n${billing.city}`, {align: "right"})
//           .text(`${billing.state} ${billing.postalCode}`, {align: "right"})
//           .text(`${billing.country}`, {align: "right"});
//     const _kPAGE_BEGIN = 25;
//     const _kPAGE_END = 580;
// //  [COMMENT] Draw a horizontal line.
//     doc.moveTo(_kPAGE_BEGIN, 200)
//           .lineTo(_kPAGE_END, 200)
//           .stroke();
//       doc.text(`Memo: `, 50, 210);
//       doc.moveTo(_kPAGE_BEGIN, 250)
//           .lineTo(_kPAGE_END, 250)
//           .stroke();

    // Escribir el contenido del PDF
    // doc.fontSize(18).text('¡Hola, mundo!', 100, 100);
    // doc.fontSize(12).text('Este es un ejemplo de generación de PDF con PDFKit.', 100, 150);

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
    doc.on('error', (err:any) => {
      // Rechazar la promesa con el error
      reject(err);
    });

  });

}


export function deletePDF() {

  const fileName = path.join(__dirname, 'output.pdf');
  fs.unlink(fileName, (err) => {
    if (err) {return;}
  });

}