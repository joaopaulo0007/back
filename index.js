import express from "express";
import configApp from "./src/config/index.js";
import initScheduler from "./src/jobs/procuraConsultas.js";
const app = express();
import http from "http"
import { Server } from "socket.io";
configApp(app)
initScheduler();
app.listen(3000,()=>console.log("rodando na porta 3000"))