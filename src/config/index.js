import router from "../routes/index.js";
import bodyParser from "body-parser";
import cors from "cors"
export default function configApp(app){
    app.use(cors());
    app.use(bodyParser.urlencoded({extended:false}))
    app.use(bodyParser.json())
    app.use(router);
}