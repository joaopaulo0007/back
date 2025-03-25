import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({
    user: process.env.PG_USER,           // Usuário do banco de dados
    host: process.env.PG_HOST,           // Host do banco de dados
    database: process.env.PG_DATABASE,   // Nome do banco de dados
    password: process.env.PG_PASSWORD,   // Senha do banco de dados
    port: process.env.PG_PORT,           // Porta do banco de dados
    ssl: {
        rejectUnauthorized: false        // Aceita o certificado SSL
    },
    max: 20,                             // Número máximo de conexões
    idleTimeoutMillis: 30000,            // Tempo máximo que uma conexão pode ficar ociosa
    connectionTimeoutMillis: 5000,       // Tempo máximo para estabelecer conexão
    maxUses: 7500,                       // Número máximo de reutilizações de uma conexão antes de ser fechada
    
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
