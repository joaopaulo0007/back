import argon2 from "argon2"

async function hashSenha(senha) {
    return await argon2.hash(senha);
}

async function verificarSenha(senha, hash) {
    return await argon2.verify(hash, senha);
}
export {hashSenha,verificarSenha}