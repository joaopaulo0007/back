import consultaService from "../services/consultaService.js"

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
        const result =await consultaService.updateConsultaAgendada(id, id_usuario, id_medico, data)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:" erro ao adicionar consulta agendada"})
        }

    }

    async deleteConsultaAgendada(request, response) {
        try {
            const id = Number(request.params.id)
        const result =await consultaService.deleteconsultaAgendada(id)
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
}

export default new consultaController();