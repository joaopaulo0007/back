import userService from "../database/index.js"
import { hashSenha,verificarSenha } from "../auth/index.js";
import jwt from "jsonwebtoken"
const servicos = userService
class config {
    async Login(request,response){
        try{
            const{email,senha}=request.body
            const user= await userService.getuserByEmail(email)
            if(!user){
                return response.status(404).json({ message: "Usuário não encontrado" });
            }
            const senhaValida= await verificarSenha(String(senha), String(user.senha))
            if (!senhaValida) {
                return response.status(401).json({message:"senha incorreta"})
            }
            const token=jwt.sign({userID:user.id},process.env.PRIVATE_KEY,{expiresIn: '2h'})
            return response.status(200).json({token, message:"logim bem sucedido"})
        }catch(error){
          console.log(error)
          return response.status(500).json({error:" erro ao realizar o login"})
        }
    }
    async addUser(request, response) {
        try {
            const { nome, email, cpf, senha, username, data_aniversario,especializacao} = request.body;
            const hash=await hashSenha(String(senha))
            const result = await servicos.createUser(nome, hash, email, username, cpf,data_aniversario,especializacao);
            return response.status(201).send(result);
        } catch (error) {
            console.log(error)
            return response.status(500).json({ error: "Erro ao adicionar usuário" });
        }
    }
    async addMedico(request, response) {
        try {
            const { id_usuario, especializacao } = request.body
            const result = await servicos.createMedico(id_usuario, especializacao)
            return response.status(201).json(result)
        } catch (err) {
            return response.status(500).json({ err: "erro ao adicionar medico" })
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
            const { id_usuario, id_medico, data } = request.body
        const result = await servicos.createConsultaAgendada(id_usuario, id_medico, data)
        return response.status(201).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao adicionar consulta agendada"})
        }
        

    }
    async addHorarioMedico(request, response) {
        try {
            const { id_medico, dia_semana, data_inicio, data_fim } = request.body
        const result =await servicos.createHorariomedico(id_medico, dia_semana, data_inicio, data_fim)
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
        const result =await servicos.getHorarioById(id)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"horario não encontrado"})
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
        const { nome, senha, email, username, cpf, data_aniversario} = request.body
        const result =await servicos.updateUser(id, nome, senha, email, username, cpf)
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
        const { id_usuario, id_medico, data } = request.body
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
}
export const  deleteHorarioMedico=async (request, response) =>{
    try {
         const id = Number(request.params.id)
    const result =await servicos.deleteHorarioMedico(id)
    return response.status(204).json(result)
    } catch (error) {
        return response.status(500).json({error:"erro ao deletar horario medico"})
    }
   
}
export default new config();
