import routermedico from "../routes/medicoRoutes.js";
import routerconsultas from "../routes/consultasRoutes.js";
import routeruser from "../routes/userRouter.js";
import bodyParser from "body-parser";
import cors from "cors"
import path from "path";
import express from "express"
import { fileURLToPath } from "url";
import fs from "fs"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function configApp(app) {
    const uploadPath = path.join(__dirname, '../../uploads');

    if (!fs.existsSync(uploadPath)) {
        console.error(`❌ Diretório não encontrado: ${uploadPath}`);
    } else {
        //console.log(`✅ Diretório encontrado: ${uploadPath}`);
        //console.log('📂 Subpastas:', fs.readdirSync(uploadPath));
        //console.log('📄 Arquivos em historico-exames:', fs.readdirSync(path.join(uploadPath, 'historico-exames')));
    }
    console.log('Servindo arquivos estáticos de:', path.join(__dirname, '../uploads'));
    app.use('/uploads', express.static(uploadPath));
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(routeruser);
    app.use(routermedico);
    app.use(routerconsultas);
}