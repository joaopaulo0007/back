import consultaService from "../services/consultaService.js"
import tokenService from "../services/tokenService.js"
import notificacoesServices from "../services/notificacoesServices.js"
class consultaController{

    async addConsultaAgendada(request, response) {
        try {
            const { id_usuario, id_medico, horario_inicio,horario_fim } = request.body
        const result = await consultaService.createConsultaAgendada(id_usuario, id_medico, horario_inicio,horario_fim)
        return response.status(201).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao adicionar consulta agendada"})
        }
        

    }
    async getAllConsultasAgendadasByUser(request,response){
        try {
            const id_usuario=Number(request.params.id)
            const result=await consultaService.getAllConsultasAgendadasByUser(id_usuario)
            return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao buscar consultas do usuario"})  
        }
    }
    async getAllConsultasMedico(request,response){
        try {
            const id_medico=Number(request.params.id)
            const result=consultaService.getAllConsultasAgendadasByMedico(id_medico)
            return response.status(200).json(result)
        } catch (error) {
          return response.status(500).json({error:"erro ao buscar consultas do medico"})  
        }
    }
 
    async getConsultaAgendada(request, response) {
        try {
            const id = Number(request.params.id)
        const result = await consultaService.getConsultaAgendadaById(id)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"consulta agendada não encontrada"})
        }
        
    }
    async getConsultaAgendadaByMedico(request,response){
        try {
            const id_medico=Number(request.params.id)
            const result=await consultaService.getConsultasAgendadasByMedico(id_medico)
            console.log(result)
            return response.status(200).json(result) 
        } catch (error) {
            console.log(error)
            return response.status(500).json({error:"erro ao buscar consultas do medico"})
        }
    }
    async getConsultaAgendadaAntesHojeBYMedico(request,response){
        try {
            const id_medico=Number(request.params.id)
            const result=await consultaService.getConsultaAgendadasAntesHojeByMedico(id_medico)
            console.log(result)
            return response.status(200).json(result)
        } catch (error) {
           console.log(error)
           return response.status(500).json({error:"erro ao buscar consultas do medico"}) 
        }
    }

    async updateConsultaAgendada(request, response) {
        try {
        const id = Number(request.params.id)
        const { id_usuario, id_medico, horario_inicio, horario_fim } = request.body
        const result =await consultaService.updateConsultaAgendada(id, id_usuario, id_medico, horario_inicio,horario_fim)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:" erro ao adicionar consulta agendada"})
        }

    }

    async deleteConsultaAgendada(request, response) {
        try {
            const id = Number(request.params.id)
        const result =await consultaService.deleteConsultaAgendada(id)
        return response.status(204).json(result) 
        } catch (error) {
           return response.status(500).json({error:"erro ao deletar consulta agendada"}) 
        }
       
    }
    async getConsultasBymedico(req,res){
        try {
            const id_medico=req.params
            const result = await consultaService.getConsultasAgendadasByMedico(id_medico)
            return res.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao buscar consultas do medico"})
        }
      }
      async sendNotificacaoCancelamentoConsulta(request, response){
        try {
            const{nome_medico,nome_usuario,horario_inicio,mensagem,id_usuario}=request.body
            const notificacaoMedico = `Sua consulta com ${usuario.nome} às ${consulta.horario_inicio} foi cancelada.`;
            const payload={
                tipo:'consulta_cancelada',
                mensagem:mensagem? mensagem:notificacaoMedico,
                consulta:{
                    horario:horario_inicio,
                    paciente:nome_usuario,
                    medico:nome_medico
                }
            }
            tokenService.sendNotificacao(id_usuario,payload)
            notificacoesServices.salvarNotificacao(id_usuario,mensagem,payload)
            return response.status(200).json({message:"notificação enviada"})
        } catch (error) {
            console.log(error)
            return response.status(500).json({error:"erro ao enviar notificação"})
        }
      }
}

export default new consultaController();