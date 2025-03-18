import medicoService from "../services/medicoService.js";
import consultaService from "../services/consultaService.js";
import { horarioDia,horarios } from "../middlewares/horarios.js";
class medicoController{
    async addMedico(request, response) {
        
           
            try {
                const { id_usuario, especializacao, crm } = request.body;
                const imagem = request.file; // A imagem é armazenada como um buffer
                console.log(imagem)
                if(!imagem){
                    const result= await medicoService.createMedico(id_usuario,especializacao,crm)
                    return response.status(201).json(result);

                }
                const result = await medicoService.createMedico(id_usuario, especializacao, crm, imagem);
                return response.status(201).json(result);
            } catch (err) {
                return response.status(500).json({ error: "Erro ao adicionar médico" });
            }
        
    }
    async getMedicobyEspecializacao(request,response){
        try {
            const especializacao=request.params.especializacao
            const result=await medicoService.getMedicoByEspecializacao(especializacao)
            return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"medico não encontrado"})
        }
    }
    async addHorarioMedico(request, response) {
        try {
            const { id_medico, dia_semana, horario_inicio, horario_fim } = request.body
        const result =await medicoService.createHorariomedico(id_medico, dia_semana, horario_inicio, horario_fim)
        return response.status(201).json(result)

        } catch (error) {
            return response.status(500).json({error:"erro ao adicionar horario do medico"})
        }
        
    }
    async getMedico(request, response) {
        try {
            const id = Number(request.params.id)
            console.log(id)
        const result =await medicoService.getMedicorById(id)
        console.log(result)
        if(result.imagem){
            const baseUrl = `${request.protocol}://${request.get('host')}`;
            const imageUrl = `${baseUrl}/${result.imagem.replace(/\\/g, '/')}`;
             return response.status(200).json({
            ...result, imageUrl
        }) 
        }
        return response.status(200).json(result)
       
        } catch (error) {
            return response.status(500).json({error:"medico não encontrado"})
        }
       

    }
    async getAllMedicos(request,response){
        try {
            const result=await medicoService.getAllMedicos()
            const medicos=result.map(medico=>{
                if(medico.imagem){
                    const baseUrl = `${request.protocol}://${request.get('host')}`;
                    const imageUrl = `${baseUrl}/${medico.imagem.replace(/\\/g, '/')}`;
                    return ({
                        ...medico,imageUrl:imageUrl
                    })
                }
                return medico
            })
            console.log( "status 200")
            return response.status(200).json(medicos)
        } catch (error) {
            return response.status(500).json({error:"medicos não encontrados"})
        }
    }
    async getHorario(request, response) {
        try {
            const id = Number(request.params.id)
        const result =await medicoService.getHorarioByMedico(id)
        console.log(result)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"horario não encontrado"})
        }
        
    }
    async updateMedico(request, response) {
        try {
             const id = Number(request.params.id)
        const { id_usuario, especializacao } = request.body
        const result =await medicoService.updateMedico(id, id_usuario, especializacao)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao atualizar medico"})
        }
       
    }
    async updateHorarioMedico(request, response) {
        try {
            const id = Number(request.params.id)
        const { id_medico, dia_semana, data_inicio, data_fim } = request.body
        const result =await medicoService.updateHorarioMedico(id, id_medico, dia_semana, data_inicio, data_fim)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:" erro ao atualizar horario do medico"})
        }
        
    }
    async deleteMedico(request, response) {
        try {
        const id = Number(request.params.id)
        const result =await medicoService.deleteMedico(id)
        return response.status(204).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao deletar medico"})
        }

    }
    async deleteHorarioMedico(request, response) {
        try {
             const id = Number(request.params.id)
        const result =await medicoService.deleteHorarioMedico(id)
        return response.status(204).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao deletar horario medico"})
        }
       
    }
    async getMedicoUserID(req,res){
        try{
            const id = Number(req.params.id);
            const result = await medicoService.getMedicoByIdUser(id);
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json({error:"erro ao buscar medico"})
        }
    }
    async getHorariosDisponiveis(req, res) {
        try {
            let data_inicial = req.query.data_inicial; // agora vem da query string
            const id_medico = Number(req.params.id);
    
            if (!data_inicial) {
                data_inicial = new Date();
            } else {
                data_inicial = new Date(data_inicial); // converte string para Date se necessário
            }
    
            console.log("Data recebida: ", data_inicial);
    
            const horariosMedico = await medicoService.getHorarioByMedico(id_medico);
            const consultas_agendadas = await consultaService.getConsultasAgendadasByMedico(id_medico);
    
            const horariosDisponiveis = horarioDia(data_inicial, horariosMedico, consultas_agendadas);
            if (!horariosDisponiveis || horariosDisponiveis.length === 0) {
                return res.status(200).json({ message: "não há horários disponíveis nesse dia" });
            }
           
            return res.status(200).json(horariosDisponiveis);
        } catch (error) {
            console.log(req.query);
            console.log(error);
            return res.status(500).json({ error: "erro ao buscar horarios disponiveis" });
        }
    }
    
}
export default new medicoController();