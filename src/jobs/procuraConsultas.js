import cron from "node-cron";
import consultaService from "../services/consultaService.js";
import userService from "../services/userService.js";
import { enviarEmail } from "../utils/emailService.js";
import medicoService from "../services/medicoService.js";
import notificacoesServices from "../services/notificacoesServices.js";
const verificarConsultas = async () => {
    const agora = new Date();
    const limite = new Date(agora.getTime() + 60 * 60 * 1000); // 1 hora antes

    try {
        const consultas = await consultaService.getConsultasEntre(agora, limite);
        
        for (const consulta of consultas) {
            const usuario = await userService.getUserById(consulta.id_usuario);
            if (usuario && usuario.email) {
                const medico= await medicoService.getMedicorById(consulta.id_medico);
                const userMedico=await userService.getUserById(medico.id_usuario);
                const mensagem=`Olá ${usuario.nome}, sua consulta com o médico ID ${userMedico.nome} é às ${consulta.horario_inicio}.`
                await enviarEmail(
                    usuario.email,"Lembrete de Consulta",mensagem
                    
                );
                await notificacoesServices.salvarNotificacao(usuario.id,mensagem);
            }
        }
    } catch (error) {
        console.error("Erro ao verificar consultas:", error);
    }
};

// Executa a cada 5 minutos
const initScheduler=()=>{
    if (global.schedulerStarted) {
        return;
    }
    global.schedulerStarted = true;
    cron.schedule("*/5 * * * *", () => {
    console.log("🔄 Verificando consultas próximas...");
    verificarConsultas();
});
}
export default initScheduler;
