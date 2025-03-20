
import { Server } from "socket.io";

// Armazenar conexões de usuários
const userConnections = new Map();

let io;

/**
 * Inicializa o serviço de Socket.IO
 * @param {Object} server - Servidor HTTP
 */
export const initSocketService = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Em produção, especifique as origens permitidas
      methods: ["GET", "POST"]
    }
  });

  // Gerenciar conexões de socket
  io.on("connection", (socket) => {
    console.log("Novo cliente conectado:", socket.id);
    
    // Autenticar usuário e associar socket ao ID do usuário
    socket.on("authenticate", (userId) => {
      console.log(`Usuário ${userId} autenticado no socket ${socket.id}`);
      
      // Armazenar conexão do usuário
      if (!userConnections.has(userId)) {
        userConnections.set(userId, new Set());
      }
      userConnections.get(userId).add(socket.id);
      
      // Associar ID do usuário ao socket
      socket.userId = userId;
      
      // Entrar em sala específica do usuário para facilitar comunicação direta
      socket.join(`user:${userId}`);
    });
    
    // Limpar quando usuário desconectar
    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
      if (socket.userId && userConnections.has(socket.userId)) {
        userConnections.get(socket.userId).delete(socket.id);
        if (userConnections.get(socket.userId).size === 0) {
          userConnections.delete(socket.userId);
        }
      }
    });
  });

  console.log("Socket.IO configurado e pronto para conexões");
  return io;
};

/**
 * Envia uma notificação para um usuário específico via Socket.IO
 * @param {string} userId - ID do usuário que receberá a notificação
 * @param {object} dados - Dados da notificação
 */
export const enviarNotificacaoSocket = (userId, dados) => {
  if (!io) {
    console.error("Socket.IO não foi inicializado");
    return;
  }
  
  io.to(`user:${userId}`).emit('notificacao', dados);
  console.log(`Notificação enviada para usuário ${userId} via Socket.IO`);
};

/**
 * Envia uma notificação para todos os clientes conectados
 * @param {object} dados - Dados da notificação
 */
export const enviarNotificacaoGlobal = (dados) => {
  if (!io) {
    console.error("Socket.IO não foi inicializado");
    return;
  }
  
  io.emit('notificacao', dados);
  console.log('Notificação global enviada via Socket.IO');
};

/**
 * Retorna a instância do Socket.IO
 * @returns {Object} Instância do Socket.IO
 */
export const getSocketIO = () => {
  return io;
};