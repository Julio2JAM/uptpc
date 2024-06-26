import { Request, Response } from "express";
import { handleError } from "../Base/errors";
import { Router } from "express";
// import { HTTP_STATUS } from "./statusHttp";
// import PDF from "pdfkit-table";
import { generatePDF } from "../libs/pdfCreator";
import fs from 'fs';

export class Controller {
  async getPdf(_req: Request, res: Response): Promise<any> {
    try {

      const pdf = await generatePDF({});
      if (typeof pdf != "string") {
        throw new Error("");
      }

      // Cargar el PDF en memoria
      const pdfBuffer = fs.readFileSync(pdf);

      // Eliminar el archivo PDF
      fs.unlinkSync(pdf);

      return res.set({
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=document.pdf",
        }).send(pdfBuffer);

    } catch (error) {
      return handleError(error, res);
    }
  }
}

const controller = new Controller();
const router = Router();
router.get("/", controller.getPdf);
export default router;
