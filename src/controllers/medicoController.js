import medicoService from "../services/medicoService.js";

class medicoController{
    async addMedico(request, response) {
        upload.single('imagem')(request, response, async (err) => {
            if (err) {
                return response.status(500).json({ error: "Erro ao fazer upload da imagem" });
            }
            try {
                const { id_usuario, especializacao, crm } = request.body;
                const imagem = request.file.buffer; // A imagem é armazenada como um buffer

                const result = await medicoService.createMedico(id_usuario, especializacao, crm, imagem);
                return response.status(201).json(result);
            } catch (err) {
                return response.status(500).json({ error: "Erro ao adicionar médico" });
            }
        });
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
        const result =await medicoService.getMedicorById(id)
        if(result.imagem){
            const imagemBase64=result.imagem.toString('base64')
            result.imagem=`data:image/jpeg;base64,${imagemBase64}`
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
                    const imagemBase64=medico.imagem.toString('base64')
                    medico.imagem=`data:image/jpeg;base64,${imagemBase64}`
                }
                return medico
            })
            return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"medicos não encontrados"})
        }
    }
    async getHorario(request, response) {
        try {
            const id = Number(request.params.id)
        const result =await medicoService.getHorarioByMedico(id)
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
}
export default new medicoController();