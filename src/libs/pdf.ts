import PDFDocumentWithTables from "pdfkit-table";
import PDFDocument from "pdfkit-table";
import fs from "fs";
import path from "path";

export class PDF{

    private routeImg: string;
    private static documentN:number = 0;

    constructor(){
        this.routeImg = path.join(__dirname, "../files/", "logo.jpg");
        PDF.documentN++;
    }

    private getDocumentNumber(): number {
        return PDF.documentN;
    }

    private fileRoute(name:string): string {
        return path.join(__dirname, `${name}.pdf`);
    }

    private getData() {
        // Obtener la fecha actual
        const date = new Date();
    
        // Obtener los componentes de la fecha
        const year = String(date.getFullYear()).slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
    
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        return {
            date: `${day}/${month}/${year}`,
            hours: `${hours}:${minutes}:${seconds}`,
        };
    }

    public async newPDF(fileName: string, tableOptions?:Object):Promise<any>{

        const doc = new PDFDocument();
        this.loadImg(doc);
        this.loadLetterhead(doc);
        this.loadDate(doc);
        this.buildTable(doc, tableOptions);

        const response = new Promise((resolve, reject) => {

            const rute = this.fileRoute(fileName);
            console.log(rute);
            const writeStream = fs.createWriteStream(rute);
            doc.pipe(writeStream);
            doc.end();

            writeStream.on("finish", () => {
                resolve(rute);
            });

            doc.on("error", (err: any) => {
                reject(err);
            });

        });

        return response;
    }

    private loadLetterhead(doc:PDFDocument):PDFDocument|null{
        try {

            doc.moveUp(3).fontSize(12)
                .text(`Republica Bolivariana de Venezuela `, { align: "center" })
                .text(`Ministerio Del Poder Popular Para La Educacion `, { align: "center" })
                .text(`Unidad Educativa Henry Pitter `, { align: "center" })
                .text(`Carabobo, Puerto Cabello `, { align: "center" });
            return doc;

        } catch (error) {
            return null;
        }
    }

    private loadImg(doc:PDFDocument):PDFDocument|null{
        try {

            const imgRute = this.routeImg;
            doc.image(imgRute, 25, 25, { width: 100 })
              .fillColor("#000")
            return doc;

        } catch (error) {
            return null;
        }
    }

    private loadDate(doc:PDFDocument):PDFDocument|null{
        try {

            const {date, hours} = this.getData();
            const documentN = this.getDocumentNumber();

            doc.fontSize(12).moveDown(0.5)
                .text(`Documento Nº: ${documentN}`, { align: "right" })
                .text(`Fecha: ${date}`, { align: "right" })
                .text(`Hora: ${hours}`, { align: "right" });

            return doc;

        } catch (error) {
            return null;
        }
    }

    private buildTable(doc:PDFDocumentWithTables, tableOptions:any){

        const headers = tableOptions.header.map((item:string) => ({
            label: item,
            headerOpacity: 0,
            columnColor: "#FFFFFF",
            headerColor: "#FFFFFF",
            align: "center",
        }));
    
        const table:Table = {
            title: tableOptions.title,
            subtitle: tableOptions.subtitle,
            headers: headers,
            // datas: data,
            rows: tableOptions.rows.map((item: any) => [
                item.id,
                item.name,
                item.id_status,
            ]),
            
        };

        const options:Options = {
            width: doc.page.width - (doc.page.margins.left + doc.page.margins.right),
            // padding: [10,10],
            // divider: {
            //     horizontal: {
            //         disabled: true,
            //     },
            //     header: {
            //         disabled: true,
            //     }
            // }
        }
    
        doc.moveDown(3).table(table, options);

    }

    //! IN DEV
    public deletePDF() {
        const fileName = path.join(__dirname, "output.pdf");
        fs.unlink(fileName, (err) => {
            if (err) {return;}
        })
    };
}

interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Header {
    label?: string;
    property?: string;
    width?: number;
    align?: string; //default 'left'
    valign?: string;
    headerColor?: string; //default '#BEBEBE'
    headerOpacity?: number; //default '0.5'
    headerAlign?: string; //default 'left'
    columnColor?: string;
    columnOpacity?: number;
    renderer?: (
        value: any,
        indexColumn?: number,
        indexRow?: number,
        row?: number,
        rectRow?: Rect,
        rectCell?: Rect
    ) => string;
}

interface DataOptions {
    fontSize: number;
    fontFamily: string;
    separation: boolean;
}

interface Data {
    [key: string]: string | { label: string; options?: DataOptions };
}

interface Table {
    title?: string;
    subtitle?: string;
    headers?: (string | Header)[];
    datas?: Data[];
    rows?: string[][];
}

interface DividerOptions {
    disabled?: boolean;
    width?: number;
    opacity?: number;
}

interface Divider {
    header?: DividerOptions;
    horizontal?: DividerOptions;
}

interface Title 
{
    label: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string; 
}

interface Options {
    title?: string | Title ;
    subtitle?: string | Title;
    width?: number;
    x?: number; //default doc.x
    y?: number; //default doc.y
    divider?: Divider;
    columnsSize?: number[];
    columnSpacing?: number; //default 5
    padding?: number[]; 
    addPage?: boolean; //default false
    hideHeader?: boolean;
    minRowHeight?: number;
    prepareHeader?: () => PDFDocumentWithTables;
    prepareRow?: (
        row?: any,
        indexColumn?: number,
        indexRow?: number,
        rectRow?: Rect,
        rectCell?: Rect
    ) => PDFDocumentWithTables;
}
