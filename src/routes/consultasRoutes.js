import { Router } from "express";
import consultasController from "../controllers/consultasController.js";
import { generateTokenForConsulta } from "../controllers/tokenController.js";
const router = new Router();


// Rotas para Consulta Agendada
router.post("/consultas-agendadas", consultasController.addConsultaAgendada);
router.get("/consultas-agendadas/:id", consultasController.getConsultaAgendada);
router.put("/consultas-agendadas/:id", consultasController.updateConsultaAgendada);
router.post("/token",generateTokenForConsulta);
router.get("/consultas-agendadas/medico/:id", consultasController.getConsultaAgendadaByMedico);
router.get("/consultas-agendadas/medico/antes-hoje/:id", consultasController.getConsultaAgendadaAntesHojeBYMedico);
router.post("/cancelamento-consulta/:id",consultasController.sendNotificacaoCancelamentoConsulta)
export default router;