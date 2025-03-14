import { Server } from "socket.io";
import http from "http"
import notificacoesServices from "../services/notificacoesServices";
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Modifique para o domínio correto do frontend
        methods: ["GET", "POST"]
    }
});

const users = new Map();

io.on("connection", async (socket) => {
    console.log(`Usuário conectado: ${socket.id}`);

    socket.on("registerUser", async (userId) => {
        users.set(userId, socket.id);

        // Quando o usuário se reconectar, buscar notificações pendentes
        const client = await pool.connect();
        try {
            const result = await notificacoesServices.getNotificacao(userId)
            for (const notificacao of result) {
                io.to(socket.id).emit("alertaConsulta", notificacao.mensagem);
                
                // Marcar a notificação como lida
                await notificacoesServices.updateNotificacao(notificacao.id)
            }
        } catch (err) {
            console.error("Erro ao buscar notificações pendentes:", err);
        } finally {
            client.release();
        }
    });

    socket.on("disconnect", () => {
        console.log(`Usuário desconectado: ${socket.id}`);
        for (const [key, value] of users.entries()) {
            if (value === socket.id) {
                users.delete(key);
                break;
            }
        }
    });
});