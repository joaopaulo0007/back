import express from "express";
import configApp from "./src/config/index.js";
import initScheduler from "./src/jobs/procuraConsultas.js";
import { timeout } from './src/middlewares/timeout.js';
import http from "http"
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Adicionar tratamento de erro
process.on('uncaughtException', (error) => {
    console.error('Erro não tratado:', error);
    // Tentar fechar o servidor graciosamente
    server.close(() => {
        process.exit(1);
    });
});

// Adicionar tratamento para SIGTERM
process.on('SIGTERM', () => {
    console.info('SIGTERM recebido');
    server.close(() => {
        process.exit(0);
    });
});

configApp(app)
initScheduler();
app.use(timeout(30000)); // 30 segundos de timeout

const PORT = process.env.PORT || 3000;
let attempts = 0;
const MAX_ATTEMPTS = 5;

function startServer(port) {
    const server = http.createServer(app);
    
    server.listen(port)
        .on('listening', () => {
            console.log(`Servidor rodando na porta ${port}`);
        })
        .on('error', (error) => {
            if (error.code === 'EADDRINUSE' && attempts < MAX_ATTEMPTS) {
                attempts++;
                console.log(`Porta ${port} em uso, tentando porta ${port + 1}...`);
                startServer(port + 1);
            } else {
                console.error('Erro fatal ao iniciar servidor:', error);
                process.exit(1);
            }
        });
}

startServer(PORT);