import routeruser from "../routes/userRoutes.js";
import routermedico from "../routes/medicoRoutes.js";
import routerconsultas from "../routes/consultasRoutes.js";
import bodyParser from "body-parser";
import cors from "cors"
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function configApp(app){
    app.use(cors());
    app.use(bodyParser.urlencoded({extended:false}))
    app.use(bodyParser.json())
    app.use(routeruser);
    app.use(routermedico);
    app.use(routerconsultas);
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
}