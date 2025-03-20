import { pool } from './database.js';

export async function checkDatabaseConnection() {
    const client = await pool.connect();
    try {
        await client.query('SELECT 1');
        return true;
    } catch (error) {
        console.error('Erro na verificação de conexão:', error);
        return false;
    } finally {
        client.release();
    }
}

// Verificar conexão a cada 30 segundos
setInterval(async () => {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
        console.error('Conexão com banco de dados está instável');
        // Implementar lógica de notificação/alerta
    }
}, 30000); 