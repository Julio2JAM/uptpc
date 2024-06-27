import PDFDocument from "pdfkit-table";
import fs from "fs";
import path from "path";

export function generatePDF(
  headers: string[],
  title: string,
  subtitle: string,
  dataTable: any
) {
  return new Promise((resolve, reject) => {
    // Crear un nuevo documento PDF
    const doc = new PDFDocument();

    const imgRute = path.join(__dirname, "../files/", "logo.jpg");

    // const invoiceData = {
    //   invoiceNumber: "9900001",
    //   dueDate: "March 31, 2021",
    //   subtotal: 8000,
    //   paid: 500,
    //   memo: "Delivery expected in 7 days",
    // };
    doc
      .image(imgRute, 25, 25, { width: 120 })
      .fillColor("#000")
      .moveUp(3).text(`Republica Bolivariana de Venezuela `, { align: "center"})
      .text(`Ministerio Del Poder Popular Para La Educacion `, { align: "center"})
      .text(`Unidad Educativa Henry Pitter `, { align: "center"})
      .text(`Carabobo, Puerto Cabello `, { align: "center"})
      // .fontSize(20)
      // .text("INVOICE", 400, 25, { align: "right" })
      // .fontSize(10)
      // .text(`Invoice Number: ${invoiceData.invoiceNumber}`, { align: "right" })
      // .text(`Due Date: ${invoiceData.dueDate}`, { align: "right" })
      // .text(`Balance Due: €${invoiceData.subtotal - invoiceData.paid}`, {
      //   align: "right",
      // });

    doc.moveDown();

    const billing = {
      Asunto: title,
      Documento: "1",
    };
    
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = String(currentDate.getFullYear()).slice(-2);

    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    doc
    .text(`Documento Nº: ${billing.Documento}`, { align: "right" })
    .text(`Fecha: ${day}/${month}/${year}`, { align: "right" })
    .text(`Hora: ${hours}:${minutes}:${seconds}`, { align: "right" })
    // .text(`Asunto: ${billing.Asunto}`, { align: "right" })

    // const _kPAGE_BEGIN = 25;
    // const _kPAGE_END = 580;
    // doc.moveTo(_kPAGE_BEGIN, 200).lineTo(_kPAGE_END, 200).stroke();
    
    doc.text("\n\n\n", { align: "left" });

    // Escribir el contenido del PDF
    // doc.fontSize(18).text('¡Hola, mundo!', 100, 100);
    // doc.fontSize(12).text('Este es un ejemplo de generación de PDF con PDFKit.', 100, 150);

    const newArray = headers.map(item => ({
      label: item,
      headerOpacity: 0,
      columnColor: "#FFFFFF",
		  headerColor: "#FFFFFF",
      align: "center",
    }));
    
    const options = {
      title: title,
      subtitle: subtitle,
      headers: newArray,
      // datas: data,
      rows: dataTable.map((item: any) => [
        item.id,
        item.name,
        item.id_status,
      ]),
    };

    // Generar la tabla
    doc.table(options, {
      // columnsSize: [50, 100, 100],
      width:doc.page.width - (doc.page.margins.left + doc.page.margins.right),
    });

    // Establecer el nombre del archivo de salida
    const fileName = path.join(__dirname, "output.pdf");

    // Pipe the PDF to a writable stream
    const writeStream = fs.createWriteStream(fileName);
    doc.pipe(writeStream);

    // Finalizar el documento PDF
    doc.end();

    // Escuchar el evento 'finish' del documento PDF
    writeStream.on("finish", () => {
      // Resolver la promesa con el nombre del archivo
      resolve(fileName);
    });

    // Escuchar el evento 'error' del documento PDF
    doc.on("error", (err: any) => {
      // Rechazar la promesa con el error
      reject(err);
    });
  });
}

export function deletePDF() {
  const fileName = path.join(__dirname, "output.pdf");
  fs.unlink(fileName, (err) => {
    if (err) {
      return;
    }
  });
}
