import pkg from 'pg';
const { Pool } = pkg;
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.CONECTION_STRING
});

class UserService {
  async createUser(nome, senha, email, cpf, data_aniversario, telefone, especializacao, crm, verificado, token_verificacao) {
    console.log("data de aniversario ",data_aniversario)
    console.log(token_verificacao)
    console.log("telefone ",telefone)
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
        const resultado = await this.createMedico(id, especializacao, crm);
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
  async getMedicoByEspecializacao(especializacao){
    const client = await pool.connect();
    try {
      const result= await client.query(`SELECT * FROM medico WHERE especializacao=$1`,[especializacao])
      return result.rows;
    } catch (error) {
      return error
    }
  }

  async createMedico(id, especializacao,crm) {
    const client = await pool.connect();
    try {
      const result = await client.query(`INSERT INTO medico (id_usuario, especializacao,crm) VALUES ($1, $2,$3) RETURNING *`, [id, especializacao,crm]);
      return result.rows[0];
    } catch (err) {
      console.log("❌ Erro ao criar médico", err);
      throw err;
    } finally {
      client.release();
    }
  }

  async createConsulta(id_usuario,id_medico,data,ocorreu,link_chamada){
    const client =await pool.connect()
    
    try {
        const result = await client.query(`INSERT INTO consulta (id_usuario, id_medico,data,ocorreu, link_chamada) VALUES ($1,$2,$3,$4,$5) RETURNING *`,[id_usuario,id_medico,data,ocorreu,link_chamada])
        return result.rows[0];
    } catch(err){
        console.log("❌ Erro ao criar consulta", err);
        throw err;
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
  async createHistorico(id_paciente,imagem){
    const client= await pool.connect()
    try {
        const result = await client.query(`INSERT INTO historico_exames (id_usuario,imagem) VALUES ($1,$2) RETURNING*`,[id_paciente,imagem])
        return result.rows[0];

    }catch(err){
        console.log("❌ Erro ao criar historico", err);
        
        throw err;
    }finally{
        client.release();
    }
  }
  async createHorariomedico(id_medico,dia_semana,data_inicio,data_fim){
    const client =await pool.connect()
    try {
        const result=await client.query(`INSERT INTO horario_medico(id_medico,dia_semana,horario_inicio,horario_fim) VALUES($1,$2,$3,$4) RETURNING*`,[id_medico,dia_semana,data_inicio,data_fim])
        return result.rows[0];

    } catch(err){
        console.log("❌ Erro ao criar horario do médico", err);
        
        throw err;
    }finally{
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
        const result= await client.query(`SELECT * FROM usuario where email=$1`,[email])
        return result.rows[0]
    } catch (error) {
        console.log("erro ao buscar usuario")
    }finally{
        client.release()
    }
  }
  async getMedicorById(id ) {
    const client = await pool.connect();
    try {
      const result = await client.query(`SELECT * FROM medico WHERE id = $1`, [id]);
      return result.rows[0];
    } catch (err) {
      console.error("❌ Erro ao buscar médico", err);
      throw err;
    } finally {
      client.release();
    }
  }
  async getAllMedicos(){
    const client = await pool.connect();
    try {
      const result = await client.query(`SELECT * FROM medico`);
      return result.rows;
    } catch (error) {
      console.log("erro ao buscar medicos")
    }finally{
      client.release();
    }
  }

  async getConsultaById(id ) {
    const client = await pool.connect();
    try {
      const result = await client.query(`SELECT * FROM consulta WHERE id = $1`, [id]);
      return result.rows[0];
    } catch (err) {
      console.error("❌ Erro ao buscar consulta", err);
      throw err;
    } finally {
      client.release();
    }
  }
  async getConsultaAgendadaById(id ) {
    const client = await pool.connect();
    try {
      const result = await client.query(`SELECT * FROM consultas_agendadas WHERE id = $1`, [id]);
      return result.rows[0];
    } catch (err) {
      console.error("❌ Erro ao buscar consulta agendada", err);
      throw err;
    } finally {
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
  async getHistoricoConsultasById(id ) {
    const client = await pool.connect();
    try {
      const result = await client.query(`SELECT * FROM consultas WHERE id_usuario = $1`, [id]);
      return result.rows;
    } catch (err) {
      console.error("❌ Erro ao buscar historico de consultas", err);
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
  async updateMedico(id , id_usuario, especializacao) {
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

  async updateConsulta(id , id_paciente , id_medico , data , ocorreu , link_chamada) {
    const client = await pool.connect();
    try {
      const fields = [];
      const values = [];

      if (id_paciente) {
        fields.push(`id_usuario= $${fields.length + 1}`);
        values.push(id_paciente);
      }
      if (id_medico) {
        fields.push(`id_medico = $${fields.length + 1}`);
        values.push(id_medico);
      }
      if (data) {
        fields.push(`data = $${fields.length + 1}`);
        values.push(data.toISO());
      }
      if (ocorreu !== undefined) {
        fields.push(`ocorreu = $${fields.length + 1}`);
        values.push(ocorreu ? 'true':  'false');
      }
      
      if (link_chamada) {
        fields.push(`link_chamada = $${fields.length + 1}`);
        values.push(link_chamada);
      }

      if (fields.length === 0) {
        throw new Error("Nenhum campo para atualizar.");
      }

      const query = `UPDATE consulta SET ${fields.join(", ")} WHERE id = $${fields.length + 1} RETURNING *`;
      values.push(id);

      const result = await client.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("❌ Erro ao atualizar consulta", err);
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
  async updateHorarioMedico(id , id_medico , dia_semana, data_inicio, data_fim) {
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
      if (data_inicio) {
        fields.push(`data_inicio = $${fields.length + 1}`);
        values.push(data_inicio.toISO());
      }
      if (data_fim) {
        fields.push(`data_fim = $${fields.length + 1}`);
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
      console.error("❌ Erro ao atualizar horário médico", err);
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

  async deleteConsulta(id ) {
    const client = await pool.connect();
    try {
      await client.query(`DELETE FROM consulta WHERE id = $1`, [id]);
      return { message :"consulta deletada com sucesso!" };
    } catch (err) {
      console.error("❌ Erro ao deletar consulta", err);
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
 
  async getConsultasAgendadasByMedico(id_medico){
    const client= await pool.connect();
    try {
      const result= await client.query(`SELECT * FROM consultas_agendadas WHERE id_medico= $1 order by horario_inicio `,[id_medico])
      return result.rows;
    } catch (error) {
       return error
    }
  }
}

export default new UserService();