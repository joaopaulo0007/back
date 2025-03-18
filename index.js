import express from "express";
import configApp from "./src/config/index.js";
import initScheduler from "./src/jobs/procuraConsultas.js";
import { timeout } from './src/middlewares/timeout.js';
const app = express();
import http from "http"
import { Server } from "socket.io";
configApp(app)
initScheduler();
app.use(timeout(30000)); // 30 segundos de timeout
app.listen(3000,()=>console.log("rodando na porta 3000"))