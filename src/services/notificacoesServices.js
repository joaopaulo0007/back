import { pool } from "../database/database";
const users = new Map();

class notificacaoService{
     async salvarNotificacao(userId, mensagem)  {
        const client = await pool.connect();
        try {
            await client.query(
                "INSERT INTO notificacoes (id_usuario, mensagem) VALUES ($1, $2)",
                [userId, mensagem]
            );
    
            // Se o usuário estiver online, enviar via WebSocket
            const socketId = users.get(userId);
            if (socketId) {
                io.to(socketId).emit("alertaConsulta", mensagem);
            }
        } catch (err) {
            console.error("Erro ao salvar notificação:", err);
        } finally {
            client.release();
        }
    };
    async getNotificacao(id_usuario){
        const client=await pool.connect()
        try {
            const result = await client.query(
                "SELECT id, mensagem FROM notificacoes WHERE id_usuario = $1 AND lida = FALSE",
                [id_usuario]
            );
            return result.rows;
        } catch (err) {
            console.error("falha ao obter notificações",err)
        }finally{
             client.release();
        }
    }
    async updateNotificacao(id){
        const client=await  pool.connect()
        try {
            const result=await client.query("UPDATE notificacoes SET lida = TRUE WHERE id = $1", [id]);
        } catch (error) {
            console.error("erro ao atualizar notificação", error)
        }finally{
            client.release();
        }
    }
}
export default new notificacaoService()