import express from "express";
import configApp from "./src/config/index.js";
const app = express();
configApp(app)
app.listen(3000,()=>console.log("rodando na porta 3000"))