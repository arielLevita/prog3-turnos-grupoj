import puppeteer from "puppeteer";
import Handlebars from "handlebars";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class InformesServicio {

    generarReportePdf = async (datos, titulo) => {
        // Leemos la plantilla HTML de Handlebars
        const plantillaPath = path.join(__dirname, '../utiles/handlebars/reporte_estadisticas.hbs');
        const plantillaHtml = fs.readFileSync(plantillaPath, 'utf-8');
        
        // Compilamos la plantilla e inyectamos los datos dinámicos
        const template = Handlebars.compile(plantillaHtml);
        const html = template({
            titulo: titulo,
            estadisticas: datos
        });
        
        // Iniciamos Puppeteer (Navegador invisible)
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Importante para evitar problemas de permisos
        });

        const pagina = await browser.newPage();
        
        // Cargamos el HTML en la página
        await pagina.setContent(html, { waitUntil: 'networkidle0' });

        // Imprimimos el PDF
        const pdf = await pagina.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
        });

        await browser.close();
        
        return pdf;
    }

}
