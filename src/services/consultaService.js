import { pool } from "../database/database.js";


class consultaService{
     async getAllConsultasAgendadasByMedico(id_medico){
        const client= await pool.connect()
        try{
            const result= await client.query(`SELECT * FROM consultas_agendadas WHERE id_medico=$1`,[id_medico])
            return result.rows;
        }catch(err){
            console.log(err);
            return [];
        }finally{
            client.release();
        }
     }
      async getConsultasEntre(inicio,fim){
        const client= await pool.connect()
        try{
          const result=   await client.query(
            "SELECT * FROM consultas_agendadas WHERE horario_inicio BETWEEN $1 AND $2",
            [inicio, fim]
        );
        return result.rows;
        }catch(err){
          return [];
          console.log(err);
          
        }finally{
          client.release();
        }
      }
      async createConsultaAgendada(id_paciente,id_medico,horario_inicio,horario_fim){
        const client =await pool.connect()
        try {
            const result = await client.query(`INSERT INTO consultas_agendadas(id_usuario, id_medico,horario_inicio,horario_fim) VALUES ($1,$2,$3,$4) RETURNING*`,[id_paciente,id_medico,horario_inicio,horario_fim])
            return result.rows[0];
    
        } catch(err){
            console.log("❌ Erro ao criar consulta agendada", err);
            throw err;
        }finally{
            client.release();
        }
      }
  
      async getConsultaAgendadaById(id) {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT 
                    c.id,
                    c.id_medico,
                    c.id_usuario,
                    c.horario_inicio,
                    c.horario_fim,
                    c.rtc_token,
                    c.rtm_token,
                    c.notificado,
                    u.nome AS nome_usuario,
                    um.nome AS nome_medico,
                    m.imagem AS foto_medico
                FROM consultas_agendadas c
                JOIN usuario u ON u.id = c.id_usuario
                JOIN medico m ON m.id = c.id_medico
                JOIN usuario um ON um.id = m.id_usuario
                WHERE c.id = $1
            `, [id]);
            return result.rows[0];
        } catch (err) {
            console.error("❌ Erro ao buscar consulta agendada", err);
            throw err;
        } finally {
            client.release();
        }
    }
    
    
 

      async updateConsultaAgendada(id , id_paciente , id_medico , horario_inicio, horario_fim ) {
        const client = await pool.connect();
        try {
          const fields= [];
          const values= [];
    
          if (id_paciente) {
            fields.push(`id_usuario= $${fields.length + 1}`);
            values.push(id_paciente);
          }
          if (id_medico) {
            fields.push(`id_medico = $${fields.length + 1}`);
            values.push(id_medico);
          }
          if (horario_inicio) {
            fields.push(`data = $${fields.length + 1}`);
            values.push(horario_inicio.toISO());
          }
          if(horario_fim){
            fields.push(`data = $${fields.length + 1}`);
            values.push(horario_fim.toISO());
          }
    
          if (fields.length === 0) {
            throw new Error("Nenhum campo para atualizar.");
          }
    
          const query = `UPDATE consultas_agendadas SET ${fields.join(", ")} WHERE id = $${fields.length + 1} RETURNING *`;
          values.push(id);
    
          const result = await client.query(query, values);
          return result.rows[0];
        } catch (err) {
          console.error("❌ Erro ao atualizar consulta agendada", err);
          throw err;
        } finally {
          client.release();
        }
      }
 
      async deleteConsultaAgendada(id ) {
        const client = await pool.connect();
        try {
          await client.query(`DELETE FROM consultas_agendadas WHERE id = $1`, [id]);
          return { message: "consulta agendada deletada com sucesso!" };
        } catch (err) {
          console.error("❌ Erro ao deletar consulta agendada", err);
          throw err;
        } finally {
          client.release();
        }
      }
      async getConsultasAgendadasByMedico(id_medico){
        const client= await pool.connect();
        try {
          const result= await client.query(`SELECT  consultas_agendadas.*, usuario.nome, usuario.cpf FROM consultas_agendadas JOIN usuario ON consultas_agendadas.id_usuario = usuario.id WHERE consultas_agendadas.id_medico= $1 order by horario_inicio `,[id_medico])
          return result.rows;
        } catch (error) {
           return error
        }
      }
      async updateConsultaTokens(id, rtcToken) {
        const client = await pool.connect();
        try {
          await client.query(
            "UPDATE consultas_agendadas SET rtc_token = $1WHERE id = $3",
            [rtcToken, id]
          );
        } catch (err) {
          console.error("Erro ao atualizar tokens da consulta:", err);
        } finally {
          client.release();
        }
      }
      async marcarComoNotificado(id) {
        const client = await pool.connect();
        try {
          await client.query(
            "UPDATE consultas_agendadas SET notificado = TRUE WHERE id = $1",
            [id]
          );
        } catch (err) {
          console.error("Erro ao marcar consulta como notificada:", err);
        } finally {
          client.release();
        }
      }
}
export default new consultaService();