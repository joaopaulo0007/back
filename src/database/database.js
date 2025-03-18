import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({
    connectionString: process.env.CONECTION_STRING,
    max: 20, // número máximo de conexões
    idleTimeoutMillis: 30000, // tempo máximo que uma conexão pode ficar ociosa
    connectionTimeoutMillis: 2000, // tempo máximo para estabelecer conexão
    maxUses: 7500, // número máximo de reutilizações de uma conexão antes de ser fechada
    
    // Adicionar retry em caso de falha
    retry: {
        retries: 3,
        minTimeout: 1000,
        maxTimeout: 5000
    }
});

// Adicionar listeners para monitoramento
pool.on('error', (err, client) => {
    console.error('Erro inesperado no pool:', err);
});

pool.on('connect', (client) => {
    console.log('Nova conexão estabelecida com o banco');
}); 