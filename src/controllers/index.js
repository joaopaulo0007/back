import userService from "../database/index.js"
import { hashSenha,verificarSenha } from "../auth/index.js";
import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import horarios from "../middlewares/horarios.js";
import crypto from 'crypto';
dotenv.config();
const servicos = userService

async function sendVerificationEmail(email, token) {
    let transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.EMAIL_USER, 
          pass: process.env.MAILTRAP_PASS 
        }
      });
  
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Código de Verificação',
      text: `Seu código de verificação é: ${token}`
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`E-mail de verificação enviado para ${email}`);
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
    }
  }

class config {
    async Login(request,response){
        try{
            const{email,senha}=request.body
            const user= await userService.getuserByEmail(email)
            if(!user){
                return response.status(404).json({ message: "Usuário não encontrado" });
            }
            if(!user.verificado){
                return response.status(401).json({message:"usuário não verificado"})
            }
            const senhaValida= await verificarSenha(String(senha), String(user.senha))
            if (!senhaValida) {
                return response.status(401).json({message:"senha incorreta"})
            }
            return response.status(200).json({ message:"logim bem sucedido"})
        }catch(error){
          console.log(error)
          return response.status(500).json({error:" erro ao realizar o login"})
        }
    }
    async addUser(request, response) {
        try {
            const { nome, email, cpf, senha, data_aniversario, especializacao, telefone, crm } = request.body;
            const hash = await hashSenha(String(senha));
            const codigo_verificacao = crypto.randomBytes(3).toString('hex');
            
            const result = await servicos.createUser(
                nome,
                hash,
                email,
                cpf,
                data_aniversario,
                telefone,
                especializacao,
                crm,
                false,
                codigo_verificacao
            );

            if (!result || !result.id) {
                return response.status(500).json({ error: "Erro ao criar usuário no banco de dados" });
            }

            const token = jwt.sign({ userID: result.id }, process.env.PRIVATE_KEY, { expiresIn: '2h' });
            await sendVerificationEmail(email, codigo_verificacao);

            return response.status(201).json({ 
                user: result, 
                message: "Usuário criado. Verifique seu e-mail." 
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Erro ao adicionar usuário" });
        }
    }
    
    async addMedico(request, response) {
        try {
            const { id_usuario, especializacao,crm } = request.body
            const result = await servicos.createMedico(id_usuario, especializacao)
            return response.status(201).json(result)
        } catch (err) {
            return response.status(500).json({ err: "erro ao adicionar medico" })
        }


    }
    async getMedicobyEspecializacao(request,response){
        try {
            const especializacao=request.params.especializacao
            const result=await servicos.getMedicoByEspecializacao(especializacao)
            return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"medico não encontrado"})
        }
    }
   
    async addConsulta(request, response) {
        try {
            const { id_usuario, id_medico, data, link_chamada, ocorreu } = request.body
        const result = await  servicos.createConsulta(id_usuario, id_medico, data, ocorreu, link_chamada)
        return response.status(201).json(result)
        } catch (error) {
            return response.status(500).json({error:" erro ao adicionar consulta"})
        }
        

    }
    async addConsultaAgendada(request, response) {
        try {
            const { id_usuario, id_medico, horario_inicio,horario_fim } = request.body
        const result = await servicos.createConsultaAgendada(id_usuario, id_medico, horario_inicio,horario_fim)
        return response.status(201).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao adicionar consulta agendada"})
        }
        

    }
    async addHorarioMedico(request, response) {
        try {
            const { id_medico, dia_semana, horario_inicio, horario_fim } = request.body
        const result =await servicos.createHorariomedico(id_medico, dia_semana, horario_inicio, horario_fim)
        return response.status(201).json(result)

        } catch (error) {
            return response.status(500).json({error:"erro ao adicionar horario do medico"})
        }
        
    }
    async addHistoricoExames(request, response) {
        try {
            const { id_paciente, imagem } = request.body
        const result =await servicos.createHistorico(id_paciente, imagem)
        return response.status(201).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao adicionar histórico"})
        }
        

    }
    async getUser(request, response) {
        try {
            const id = Number(request.params.id)
        const result =await servicos.getUserById(id)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"usuario não encontrado"})
        }
        
    }
    async getUserByEmail(request,response){
        try {
            const {email}=request.body
            const result= await servicos.getuserByEmail(email)
            if (result.rows.lenght=0) {
                return response.status(404).json(result)
            }
            return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"usuario não encontrado"})
        }
    }
    async getMedico(request, response) {
        try {
            const id = Number(request.params.id)
        const result =await servicos.getMedicorById(id)
        return response.status(200).json(result) 
        } catch (error) {
            return response.status(500).json({error:"medico não encontrado"})
        }
       

    }
 
    async getConsulta(request, response) {
        try {
            const id = Number(request.params.id)
        const result =await servicos.getConsultaById(id)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"consulta não encontrada"})
        }
        
    }
    async getAllMedicos(request,response){
        try {
            const result=await servicos.getAllMedicos()
            return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"medicos não encontrados"})
        }
    }
    async getAllConsultas(request,response){
        try {
            const id=Number(request.params)
            const result=await servicos.getHistoricoConsultasById(id)
            return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:" consultas não encontradas"})
        }
    }
    async getConsultaAgendada(request, response) {
        try {
            const id = Number(request.params.id)
        const result = await servicos.getConsultaAgendadaById(id)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"consulta agendada não encontrada"})
        }
        
    }
    async getHistoricoExames(request, response) {
        try {
            const id = Number(request.params.id)
        const result =await servicos.getHistoricoById(id)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"historico de exames não encontrado"})
        }
        
    }
    async getHorario(request, response) {
        try {
            const id = Number(request.params.id)
        const result =await servicos.getHorarioByMedico(id)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"horario não encontrado"})
        }
        
    }
    async getConsultaAgendadaByMedico(request,response){
        try {
            const id_medico=Number(request.params.id)
            const result=await servicos.getConsultasAgendadasByMedico(id_medico)
            console.log(result)
            return response.status(200).json(result) 
        } catch (error) {
            console.log(error)
            return response.status(500).json({error:"erro ao buscar consultas do medico"})
        }
    }
    async getAllHistoricoExames(request,response){
        try {
            const id=Number(request.params)
            const result=await servicos.getHistoricoConsultasById(id)
            return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:" historico de exames não encontrado"})
        }
    }
    async updateUser(request, response) {
        try {
            const id = Number(request.params.id)
        const { nome, senha, email, cpf, data_aniversario} = request.body
        const result =await servicos.updateUser(id, nome, senha, email, cpf)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao atualizar usuario"})
        }
        
    }
    async updateMedico(request, response) {
        try {
             const id = Number(request.params.id)
        const { id_usuario, especializacao } = request.body
        const result =await servicos.updateMedico(id, id_usuario, especializacao)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao atualizar medico"})
        }
       
    }
  
    async updateConsulta(request, response) {
        try {
            const id = Number(request.params.id)
        const { id_usuario, id_medico, data, ocorreu, link_chamada } = request.body
        const result =await servicos.updateConsulta(id, id_usuario, id_medico, data, ocorreu, link_chamada)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao atualizar consulta"})
        }
        
    }
    async updateConsultaAgendada(request, response) {
        try {
        const id = Number(request.params.id)
        const { id_usuario, id_medico, horario_inicio, horario_fim } = request.body
        const result =await servicos.updateConsultaAgendada(id, id_usuario, id_medico, data)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:" erro ao adicionar consulta agendada"})
        }

    }
    async updateHorarioMedico(request, response) {
        try {
            const id = Number(request.params.id)
        const { id_medico, dia_semana, data_inicio, data_fim } = request.body
        const result =await servicos.updateHorarioMedico(id, id_medico, dia_semana, data_inicio, data_fim)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:" erro ao atualizar horario do medico"})
        }
        
    }
    async updateHistoricoExames(request, response) {
        try {
            const id = Number(request.params.id)
        const { id_usuario, imagem } = request.body
        const result =await servicos.updateHistorico(id, id_usuario, imagem)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao atualizar historico de exames"})
        }
        
    }
    async deleteUser(request, response) {
        try {
            const id = Number(request.params.id)
        const result =await servicos.deleteUser(id)
        return response.status(204).json(result)
        } catch (error) {
            return response.status(500).json({error:" erro ao deletar usuario"})
        }
        
    }
    async deleteMedico(request, response) {
        try {
        const id = Number(request.params.id)
        const result =await servicos.deleteMedico(id)
        return response.status(204).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao deletar medico"})
        }

    }
  
    async deleteConsulta(request, response) {
        try {
             const id = Number(request.params.id)
        const result =await servicos.deleteConsulta(id)
        return response.status(204).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao deletar consulta"})
        }
       
    }
    async deleteConsultaAgendada(request, response) {
        try {
            const id = Number(request.params.id)
        const result =await servicos.deleteconsultaAgendada(id)
        return response.status(204).json(result) 
        } catch (error) {
           return response.status(500).json({error:"erro ao deletar consulta agendada"}) 
        }
       
    }
    async deleteHistoricoExames(request, response) {
        try {
           const id = Number(request.params.id)
        const result =await servicos.deleteHistorico(id)
        return response.status(204).json(result) 
        } catch (error) {
            return response.status(500).json({error:" error ao deletar historico de exames"})
        }
        
    }
    async deleteHorarioMedico(request, response) {
        try {
             const id = Number(request.params.id)
        const result =await servicos.deleteHorarioMedico(id)
        return response.status(204).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao deletar horario medico"})
        }
       
    }
    async verifyEmail(request, response) {
        try {
          const { email, token } = request.body;
          const user = await servicos.getuserByEmail(email);
    
          if (!user) {
            return response.status(404).json({ message: "Usuário não encontrado" });
          }

          if (user.token_verificacao !== token) {
            console.log(token)
            console.log(user.token_verificacao)
            return response.status(400).json({ message: "Token inválido" });
          }
    
          user.verificado = true;
          console.log(user)
          await servicos.updateUser(user.id,user.nome,user.senha,user.email,user.cpf,user.data_aniversario,user.telefone,user.verificado);
    
          return response.status(200).json({ message: "Email verificado com sucesso!" });
        } catch (error) {
          console.log(error);
          return response.status(500).json({ error: "Erro ao verificar email" });
        }
      }

      async getConsultasBymedico(req,res){
        try {
            const id_medico=req.params
            const result = await servicos.getConsultasAgendadasByMedico(id_medico)
            return res.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao buscar consultas do medico"})
        }
      }
      async getHorariosDisponiveis(req,res){
        try{
            const data_inicial=req.body.data_inicial
            const id_medico=Number(req.params.id)
             if (!data_inicial) {
               data_inicial= new Date();
            }
            console.log(data_inicial)
            const horariosMedico= await servicos.getHorarioByMedico(id_medico)
            //console.log(horariosMedico)
            const consultas_agendadas= await servicos.getConsultasAgendadasByMedico(id_medico)
            //console.log("consultas agendadas: ",consultas_agendadas)
            const horariosDisponiveis=  horarios(data_inicial,horariosMedico,consultas_agendadas)
            return res.status(200).json(horariosDisponiveis)
        }catch(error){
            console.log(req.body)
            console.log(error)

            return res.status(500).json({error:"erro ao buscar horarios disponiveis"})
        }
      }
    
}

export default new config();
