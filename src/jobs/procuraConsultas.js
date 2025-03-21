import cron from "node-cron"; 
import consultaService from "../services/consultaService.js"; 
import userService from "../services/userService.js"; 
import { enviarEmail } from "../utils/emailService.js"; 
import medicoService from "../services/medicoService.js"; 
import notificacoesService from "../services/notificacoesServices.js"; 
import pkg from "agora-access-token"
const { RtcRole } = pkg;
import { enviarNotificacaoSocket } from "../services/socketService.js";
import tokenService from "../services/tokenService.js";
const verificarConsultas = async () => { 
    const agora = new Date(); 
    const limite = new Date(agora.getTime() + 60 * 60 * 1000); // 1 hora antes 
 
    try { 
        const consultas = await consultaService.getConsultasEntre(agora, limite); 
         
        for (const consulta of consultas) { 
            if (!consulta.notificado) { 
                const usuario = await userService.getUserById(consulta.id_usuario); 
                if (usuario && usuario.email) { 
                    const medico = await medicoService.getMedicorById(consulta.id_medico); 
                    const userMedico = await userService.getUserById(medico.id_usuario); 
                    const mensagem = `Olá ${usuario.nome}, sua consulta com o médico ${userMedico.nome} é às ${consulta.horario_inicio}.`; 
                    
                    // Enviar email
                    await enviarEmail(usuario.email, "Lembrete de Consulta", mensagem); 
 
                    const channelName = `consulta_${consulta.id}`; 
                    const role = "medico"; 
                    
 
                    // Verificar se os tokens já existem 
                    let tokens = consulta.rtc_token; 
                     
 
                    if (!tokens) { 
                        // Gerar tokens para médico e paciente 
                        tokens = generateTokensForConsulta(channelName, consulta.id_medico, role,3600); 
 
                        // Atualizar a consulta com os novos tokens 
                        await consultaService.updateConsultaTokens(consulta.id, tokensMedico.rtcToken, tokensPaciente.rtmToken); 
                    } 
 
                    // Notificar o médico
                    
                    const notificacaoMedico = `Você tem uma consulta com ${usuario.nome} às ${consulta.horario_inicio}.`;
                    const payloadMedico = {
                        tipo: 'consulta_proxima',
                        mensagem: notificacaoMedico,
                        token: tokensMedico.rtcToken,
                        consulta: {
                            id: consulta.id,
                            horario: consulta.horario_inicio,
                            paciente: usuario.nome
                        }
                    };
                    await notificacoesService.salvarNotificacao(consulta.id_medico, notificacaoMedico, payloadMedico);
                    tokenService.sendNotificacao(userMedico.id,payloadMedico)
                    // Notificar o paciente
                    const notificacaoPaciente = mensagem;
                    const payloadUser= {
                        tipo: 'consulta_proxima',
                        mensagem: notificacaoPaciente,
                        token: tokensPaciente.rtcToken,
                        consulta: {
                            id: consulta.id,
                            horario: consulta.horario_inicio,
                            medico: userMedico.nome
                        }
                    }
                    await notificacoesService.salvarNotificacao(consulta.id_usuario, notificacaoPaciente,payloadUser);
                    await tokenService.sendNotificacao(usuario.id,payloadUser)
                    // Marcar como notificado 
                    await consultaService.marcarComoNotificado(consulta.id); 
                } 
            } 
        } 
    } catch (error) { 
        console.error("Erro ao verificar consultas:", error); 
    } 
}; 
 
// Executa a cada 5 minutos 
const initScheduler = () => { 
    if (global.schedulerStarted) { 
        return; 
    } 
    global.schedulerStarted = true; 
    cron.schedule("*/5 * * * *", () => { 
        console.log("🔄 Verificando consultas próximas..."); 
        verificarConsultas(); 
    }); 
}; 
 
export default initScheduler;