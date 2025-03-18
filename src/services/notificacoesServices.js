import { pool } from "../database/database.js";
import { enviarNotificacaoSocket } from "./socketService.js";

class NotificacaoService {
    async salvarNotificacao(userId, mensagem, dados = null) {
        const client = await pool.connect();
        try {
            await client.query(
                "INSERT INTO notificacoes (id_usuario, mensagem) VALUES ($1, $2)",
                [userId, mensagem]
            );
    
            // Preparar dados para envio via Socket.IO
            const notificacaoDados = dados || {
                tipo: 'notificacao_geral',
                mensagem: mensagem,
                timestamp: new Date()
            };
            
            // Enviar notificação via Socket.IO
            enviarNotificacaoSocket(userId, notificacaoDados);
            
            return true;
        } catch (err) {
            console.error("Erro ao salvar notificação:", err);
            return false;
        } finally {
            client.release();
        }
    }
    
    async getNotificacoes(id_usuario) {
        const client = await pool.connect();
        try {
            const result = await client.query(
                "SELECT id, mensagem, created_at FROM notificacoes WHERE id_usuario = $1 AND lida = FALSE ORDER BY created_at DESC",
                [id_usuario]
            );
            return result.rows;
        } catch (err) {
            console.error("Falha ao obter notificações", err);
            return [];
        } finally {
            client.release();
        }
    }
    
    async marcarComoLida(id) {
        const client = await pool.connect();
        try {
            await client.query(
                "UPDATE notificacoes SET lida = TRUE WHERE id = $1", 
                [id]
            );
            return true;
        } catch (error) {
            console.error("Erro ao atualizar notificação", error);
            return false;
        } finally {
            client.release();
        }
    }
    
    async marcarTodasComoLidas(id_usuario) {
        const client = await pool.connect();
        try {
            await client.query(
                "UPDATE notificacoes SET lida = TRUE WHERE id_usuario = $1 AND lida = FALSE", 
                [id_usuario]
            );
            return true;
        } catch (error) {
            console.error("Erro ao atualizar notificações", error);
            return false;
        } finally {
            client.release();
        }
    }
}

export default new NotificacaoService();