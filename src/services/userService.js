import { pool } from "../database/database.js";
import medicoService from "./medicoService.js"
import multer from 'multer';
import fileFilter from "../utils/image.js";
// Configuração do multer para armazenamento de imagens de histórico
const storageHistorico = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/historico-exames/') 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});



// Upload específico para histórico de exames
export const uploadHistorico = multer({ 
    storage: storageHistorico,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite de 5MB
    }
});

class UserService {
    async createUser(nome, senha, email, cpf, data_aniversario, telefone, especializacao, crm, verificado, token_verificacao,imagem) {
       console.log(senha)
       console.log( typeof senha)
        const client = await pool.connect();
        try {
          const result = await client.query(
            `INSERT INTO usuario (nome, senha, email, cpf, data_aniversario, telefone, verificado, token_verificacao) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [nome, senha, email, cpf, data_aniversario, telefone, verificado, token_verificacao]
          );
    
          if (!result.rows || result.rows.length === 0) {
            throw new Error("Erro ao criar usuário: Nenhum dado retornado do banco.");
          }
    
          const id = result.rows[0].id;
          console.log("Usuário criado com ID:", id);
    
          if (especializacao) {
            
            const resultado = await medicoService.createMedico(id, especializacao, crm,imagem);
            return resultado;
          }
    
          return result.rows[0];
        } catch (err) {
          console.error("❌ Erro ao criar usuário:", err);
          throw err;
        } finally {
          client.release();
        }
      }
      async getUserById(id ) {
        const client = await pool.connect();
        try {
          const result = await client.query(`SELECT * FROM usuario WHERE id = $1`, [id]);
          return result.rows[0];
        } catch (err) {
          console.error("❌ Erro ao buscar usuário", err);
          throw err;
        } finally {
          client.release();
        }
      }
      async getuserByEmail(email){
        const client=await pool.connect()
        try {
            const result= await client.query(`SELECT u.*, t.token
            FROM usuario u
            LEFT JOIN tokens_firebase t ON u.id = t.id_usuario
            WHERE u.email = $1`,[email])
            return result.rows[0]
        } catch (error) {
            console.log("erro ao buscar usuario")
        }finally{
            client.release()
        }
      }
      async createHistorico(id_usuario,imagem){
        const client= await pool.connect()
        try {
            const result = await client.query(`INSERT INTO historico_exames (id_usuario,imagem) VALUES ($1,$2) RETURNING*`,[id_usuario,imagem])
            return result.rows[0];
    
        }catch(err){
            console.log("❌ Erro ao criar historico", err);
            
            throw err;
        }finally{
            client.release();
        }
      }
      async getHistoricoById(id ) {
        const client = await pool.connect();
        try {
          const result = await client.query(`SELECT * FROM historico_exames WHERE id = $1`, [id]);
          return result.rows[0];
        } catch (err) {
          console.error("❌ Erro ao buscar historico", err);
          throw err;
        } finally {
          client.release();
        }
      }
      async getHistoricoExamesById(id ) {
        const client = await pool.connect();
        try {
          const result = await client.query(`SELECT * FROM historico_exames WHERE id_usuario = $1`, [id]);
          return result.rows;
        } catch (err) {
          console.error("❌ Erro ao buscar usuário", err);
          throw err;
        } finally {
          client.release();
        }
      }
      async updateUser(id, nome, senha, email, cpf, data_aniversario, telefone, verificado, token_verificacao) {
        const client = await pool.connect();
        try {
            const fields = [];
            const values = [];
    
            if (nome) {
                fields.push(`nome = $${fields.length + 1}`);
                values.push(nome);
            }
            if (senha) {
                fields.push(`senha = $${fields.length + 1}`);
                values.push(senha);
            }
            if (email) {
                fields.push(`email = $${fields.length + 1}`);
                values.push(email);
            }
            if (cpf) {
                fields.push(`cpf = $${fields.length + 1}`);
                values.push(cpf);
            }
            if (data_aniversario) {
                fields.push(`data_aniversario = $${fields.length + 1}`);
                values.push(data_aniversario);
            }
            if (telefone) {
                fields.push(`telefone = $${fields.length + 1}`);
                values.push(telefone);
            }
            if (verificado !== undefined) {
                fields.push(`verificado = $${fields.length + 1}`);
                values.push(verificado);
            }
            if (token_verificacao) {
                fields.push(`token_verificacao = $${fields.length + 1}`);
                values.push(token_verificacao);
            }
    
            if (fields.length === 0) {
                throw new Error("Nenhum campo para atualizar.");
            }
    
            const query = `UPDATE usuario SET ${fields.join(", ")} WHERE id = $${fields.length + 1} RETURNING *`;
            values.push(id);
    
            const result = await client.query(query, values);
            return result.rows[0];
        } catch (err) {
            console.error("❌ Erro ao atualizar usuário", err);
            throw err;
        } finally {
            client.release();
        }
    }
    async updateVericationToken(id , token_verificacao) {
        const client = await pool.connect();
        try {
          const result = await client.query(`UPDATE usuario SET token_verificacao = $1 WHERE id = $2 RETURNING *`, [token_verificacao, id]);
          console.log(token_verificacao)
          return result.rows[0];
        } catch (error) {
          console.error("❌ Erro ao atualizar token de verificação", error);
          throw error;
        }finally{
          client.release();
        }
      }
    async updateHistorico(id , id_paciente , imagem) {
        const client = await pool.connect();
        try {
          const fields = [];
          const values  = [];
    
          if (id_paciente) {
            fields.push(`id_usuario = $${fields.length + 1}`);
            values.push(id_paciente);
          }
          if (imagem) {
            fields.push(`imagem = $${fields.length + 1}`);
            values.push(imagem);
          }
    
          if (fields.length === 0) {
            throw new Error("Nenhum campo para atualizar.");
          }
    
          const query = `UPDATE historico_exames SET ${fields.join(", ")} WHERE id = $${fields.length + 1} RETURNING *`;
          values.push(id);
    
          const result = await client.query(query, values);
          return result.rows[0];
        } catch (err) {
          console.error("❌ Erro ao atualizar histórico", err);
          throw err;
        } finally {
          client.release();
        }
      }
      async deleteUser(id ) {
        const client = await pool.connect();
        try {
          await client.query(`DELETE FROM usuario WHERE id = $1`, [id]);
          return { message:"Usuário deletado com sucesso!" };
        } catch (err) {
          console.error("❌ Erro ao deletar usuário", err);
          throw err;
        } finally {
          client.release();
        }
      }
      async deleteHistorico(id ) {
        const client = await pool.connect();
        try {
          await client.query(`DELETE FROM historico WHERE id = $1`, [id]);
          return { message: "histórico deletado com sucesso!" };
        } catch (err) {
          console.error("❌ Erro ao deletar histórico", err);
          throw err;
        } finally {
          client.release();
        }
      }
      async saveHistoricoExame(id_paciente, imagemFile) {
        const client = await pool.connect();
        try {
            // Salva o caminho da imagem no banco de dados
            //const imagemPath = imagemFile.path;
            console.log(imagemFile)
            const result = await client.query(
                `INSERT INTO historico_exames (id_usuario, imagem) 
                 VALUES ($1, $2) 
                 RETURNING *`,
                [id_paciente, imagemFile]
            );

            return result.rows[0];
        } catch (err) {
            console.error("❌ Erro ao salvar histórico de exame:", err);
            throw err;
        } finally {
            client.release();
        }
    }

    async getHistoricoExame(id) {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT * FROM historico_exames WHERE id = $1`,
                [id]
            );
            return result.rows[0];
        } catch (err) {
            console.error("❌ Erro ao buscar histórico de exame:", err);
            throw err;
        } finally {
            client.release();
        }
    }

    async getAllHistoricoExames(id_usuario) {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT * FROM historico_exames WHERE id_usuario = $1 ORDER BY created_at DESC`,
                [id_usuario]
            );
            return result.rows;
        } catch (err) {
            console.error("❌ Erro ao buscar históricos de exame:", err);
            throw err;
        } finally {
            client.release();
        }
    }
}

export default new UserService(); 