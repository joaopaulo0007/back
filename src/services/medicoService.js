import { pool } from "../database/database.js";
import multer from "multer";
import fileFilter from "../utils/image.js";
// Configuração do multer para armazenamento de fotos dos médicos
const storageMedico = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/fotos-medicos/') 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

// Upload específico para fotos de médicos
export const uploadFotoMedico = multer({ 
    storage: storageMedico,
    fileFilter: fileFilter, // Usando o mesmo filtro de imagens
    limits: {
        fileSize: 5 * 1024 * 1024 
    }
});

class medicoService{
    async getMedicoByEspecializacao(especializacao){
        const client = await pool.connect();
        try {
          const result= await client.query(`SELECT * FROM medico WHERE especializacao=$1`,[especializacao])
          return result.rows;
        } catch (error) {
          console.error("❌ Erro ao buscar médico por especialização:", error);
          throw error;
        } finally {
          client.release();
        }
      }
      async createMedico(id, especializacao, crm, imagem = null) {
        const client = await pool.connect();
      
        try {
          console.log(imagem);
          // Normaliza barras invertidas para barras normais
          if (imagem) {
            imagem = imagem.replace(/\\/g, '/');
          }
      
          // Verifica se o caminho começa corretamente
          if (imagem && !imagem.startsWith('uploads/fotos-medicos/')) {
            console.log('Caminho da imagem inválido:', imagem);
            throw new Error('Caminho da imagem inválido');
          }
      
          const result = await client.query(
            `INSERT INTO medico (id_usuario, especializacao, crm, imagem) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`, 
            [id, especializacao, crm, imagem]
          );
          return result.rows[0];
        } catch (err) {
          console.log("❌ Erro ao criar médico", err);
          throw err;
        } finally {
          client.release();
        }
      }
      
      async createHorariomedico(id_medico,dia_semana,horario_inicio,horario_fim){
        const client =await pool.connect()
        try {
            const result=await client.query(`INSERT INTO horario_medico(id_medico,dia_semana,horario_inicio,horario_fim) VALUES($1,$2,$3,$4) RETURNING*`,[id_medico,dia_semana,horario_inicio,horario_fim])
            return result.rows[0];
    
        } catch(err){
            console.log("❌ Erro ao criar horario do médico", err);
            
            throw err;
        }finally{
            client.release();
        }
      }
      async getMedicorById(id) {
        const client = await pool.connect();
        try {
          const result = await client.query(
            `SELECT medico.*, usuario.nome 
             FROM medico 
             JOIN usuario ON medico.id_usuario = usuario.id 
             WHERE medico.id = $1`,
            [id]
          );
          return result.rows[0];
        } catch (err) {
          console.error("❌ Erro ao buscar médico", err);
          throw err;
        } finally {
          client.release();
        }
      }
      async getMedicoByIdUser(id){
        const client= await pool.connect()
        try {
          const result= await client.query(`SELECT * FROM medico WHERE id_usuario=$1`,[id])
          return result.rows[0]
        } catch (error) {
          console.error("❌ Erro ao buscar médico", error);
        }finally{
          client.release()
        }
      }

      async getAllMedicos() {
        const client = await pool.connect();
        try {
          const result = await client.query(
            `SELECT medico.*, usuario.nome 
             FROM medico 
             JOIN usuario ON medico.id_usuario = usuario.id`
          );
          return result.rows;
        } catch (error) {
          console.log("❌ Erro ao buscar médicos", error);
        } finally {
          client.release();
        }
      }
      
      async getHorarioByMedico(id_medico ) {
        const client = await pool.connect();
        try {
          const result = await client.query(`SELECT * FROM horario_medico WHERE id_medico = $1`, [id_medico]);
          return result.rows;
        } catch (err) {
          console.error("❌ Erro ao buscar horario", err);
          throw err;
        } finally {
          client.release();
        }
      }
      async updateMedico(id , id_usuario, especializacao,imagem) {
        const client = await pool.connect();
        try {
          const fields = [];
          const values = [];
    
          if (id_usuario) {
            fields.push(`id_usuario = $${fields.length + 1}`);
            values.push(id_usuario);
          }
          if (especializacao) {
            fields.push(`especializacao = $${fields.length + 1}`);
            values.push(especializacao);
          }
          if (imagem) {
            fields.push(`imagem = $${fields.length + 1}`);
            values.push(imagem);
          }
    
          if (fields.length === 0) {
            throw new Error("Nenhum campo para atualizar.");
          }
    
          const query = `UPDATE medico SET ${fields.join(", ")} WHERE id = $${fields.length + 1} RETURNING *`;
          values.push(id);
    
          const result = await client.query(query, values);
          return result.rows[0];
        } catch (err) {
          console.error("❌ Erro ao atualizar médico", err);
          throw err;
        } finally {
          client.release();
        }
      }
      async updateHorarioMedico(id, id_medico, dia_semana, horario_inicio, horario_fim) {
        const client = await pool.connect();
        try {
          const fields = [];
          const values  = [];
    
          if (id_medico) {
            fields.push(`id_medico = $${fields.length + 1}`);
            values.push(id_medico);
          }
          if (dia_semana !== undefined) {
            fields.push(`dia_semana = $${fields.length + 1}`);
            values.push(dia_semana);
          }
          if (horario_inicio) {
            fields.push(`horario_inicio = $${fields.length + 1}`);
            console.log(horario_inicio)
            values.push(data_inicio.toISO());
          }
          if (horario_fim) {
            fields.push(`horario_fim = $${fields.length + 1}`);
            console.log(horario_fim)
            values.push(data_fim.toISO());
          }
    
          if (fields.length === 0) {
            throw new Error("Nenhum campo para atualizar.");
          }
    
          const query = `UPDATE horario_medico SET ${fields.join(", ")} WHERE id = $${fields.length + 1} RETURNING *`;
          values.push(id);
    
          const result = await client.query(query, values);
          return result.rows[0];
        } catch (err) {
          console.log(horario_inicio)
          console.log(horario_fim)
          console.error("❌ Erro ao atualizar horário médico", err);
          throw err;
        } finally {
          client.release();
        }
      }
      async deleteMedico(id ) {
        const client = await pool.connect();
        try {
          await client.query(`DELETE FROM medico WHERE id = $1`, [id]);
          return { message: "médico deletado com sucesso!" };
        } catch (err) {
          console.error("❌ Erro ao deletar médico", err);
          throw err;
        } finally {
          client.release();
        }
      }
      async deleteHorarioMedico(id ) {
        const client = await pool.connect();
        try {
          await client.query(`DELETE FROM horario_medico WHERE id = $1`, [id]);
          return { message: "horário do médico deletado com sucesso!" };
        } catch (err) {
          console.error("❌ Erro ao deletar horário do médico", err);
          throw err;
        } finally {
          client.release();
        }
      }
}
export default new medicoService(); 