
import axios from 'axios';
import dotenv from 'dotenv';
import admin from '../middlewares/firebase.js';
import { pool } from '../database/database.js';

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
dotenv.config();
class tokenService{
    //geração de token da API agora.io para video chamada
    async generateTokensForConsulta (channelName, uid, role, expireTime = 3600) {
   
    const token= await axios.get(`https://telesaude-token-server.onrender.com/rtc/${channelName}/${role}/uid/0/?${expireTime}=`)
    console.log(`https://telesaude-token-server.onrender.com/rtc/${channelName}/${role}/uid/${uid}/?${expireTime}`)
    console.log(token.data)
    return token.data;
}; 
// salva o token do firebase no banco de dados, ele será usado para enviar notificações
    async salvarToken_FCM(id_usuario, token) {
        const client = await pool.connect();
        try {
            console.log(token)
            const result=await client.query('SELECT * FROM tokens_firebase WHERE id_usuario = $1', [id_usuario]);
            // Inserir o token diretamente, pois sabemos que o usuário não tem token
            if(result.rows.length===0){
                await client.query(
                "INSERT INTO tokens_firebase (id_usuario, token) VALUES ($1, $2)", 
                [id_usuario, token]
            );
            }
            
            return true;
        } catch (error) {
            console.error("Erro ao salvar o token FCM:", error);
            return false;
        } finally {
            client.release();
        }
    }
    //função para obter o token de um usuario, assim poderemos enviar notificações para ele
    async getTokenByUserId(id_usuario){
        const client= await pool.connect();
        try {
            const result = await client.query(
                "SELECT token FROM tokens_firebase WHERE id_usuario = $1",
                [id_usuario]
            );
            return result.rows.length > 0 ? result.rows[0].token : null;
        } catch (error) {
            console.error("Erro ao buscar token FCM:", error);
            return null;
            
        }finally{
            client.release();
        }
    }
    //função para enviar notificações para um usuario
    async sendNotificacao(userId, payload) {
        const token = await this.getTokenByUserId(userId);
        if (token) {
            const message = {
                notification: {
                    title: "Nova Notificação",
                    body: typeof payload === 'string' ? payload : payload.mensagem,
                },
                data: typeof payload === 'object' ? 
                      Object.fromEntries(
                        Object.entries(payload).map(([key, value]) => 
                          [key, typeof value === 'object' ? JSON.stringify(value) : String(value)]
                        )
                      ) : {},
                token: token,
            };
    
            try {
                await admin.messaging().send(message);
                console.log("Notificação enviada com sucesso");
            } catch (error) {
                console.error("Erro ao enviar a notificação:", error);
            }
        } else {
            console.error("tokenFCM não encontrado para este usuário");
        }
    }
    

}
export default new tokenService();

