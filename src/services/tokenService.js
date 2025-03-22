
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
   
    const token= await axios.get(`https://telesaude-token-server.onrender.com/rtc/${channelName}/${role}/uid/${uid}/?${expireTime}=`)
    return token.data;
}; 
// salva o token do firebase no banco de dados, ele será usado para enviar notificações
    async salvarToken_FCM(id_usuario, token) {
        const client = await pool.connect();
        try {
            console.log(token)
            // Inserir o token diretamente, pois sabemos que o usuário não tem token
            await client.query(
                "INSERT INTO tokens_firebase (id_usuario, token) VALUES ($1, $2)", 
                [id_usuario, token]
            );
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
        } catch (error) {
            console.error("Erro ao buscar token FCM:", error);
            return null;
            
        }finally{
            client.release();
        }
    }
    //função para enviar notificações para um usuario
    async sendNotificacao(userId, mensagem)  {
        const token = await this.getTokenByUserId(userId);
        if (token) {
            const message = {
                notification: {
                    title: "Nova Notificação",
                    body: mensagem,
                },
                token: token,  // Token FCM do usuário
            };
    
            try {
                await admin.messaging().send(message);
                console.log("Notificação enviada com sucesso");
            } catch (error) {
                console.error("Erro ao enviar a notificação:", error);
            }
        }
        else{
            console.error("tokenFCM não encontrado para este usuario")
        }
    };
    

}
export default new tokenService();

