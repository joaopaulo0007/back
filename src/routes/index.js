import { Router } from "express";
import configurar from "../controllers/index.js";

const router = Router();
const config = configurar;

// Rotas para Usuário
router.post("/login",config.Login)

router.post("/usuarios", config.addUser);
router.get("/usuarios/:id", config.getUser);
router.put("/usuarios/:id",config.updateUser);
router.delete("/usuarios/:id",config.deleteUser);

// Rotas para Médico
router.post("/medicos", config.addUser);
router.get("/medicos/:id", config.getMedico);
router.put("/medicos/:id", config.updateMedico);
router.delete("/medicos/:id", config.deleteMedico);

// Rotas para Consulta
router.post("/consultas", config.addConsulta);
router.get("/consultas/:id", config.getConsulta);
router.get("/consultas/usuario/:id",config.getAllConsultas)
router.put("/consultas/:id", config.updateConsulta);
router.delete("/consultas/:id", config.deleteConsulta);

// Rotas para Consulta Agendada
router.post("/consultas-agendadas", config.addConsultaAgendada);
router.get("/consultas-agendadas/:id", config.getConsultaAgendada);
router.put("/consultas-agendadas/:id", config.updateConsultaAgendada);
router.delete("/consultas-agendadas/:id", config.deleteConsultaAgendada);

// Rotas para Histórico de Exames
router.post("/historico-exames", config.addHistoricoExames);
router.get("/historico-exames/:id", config.getHistoricoExames);
router.get("historico-exames/usuario/:id",config.getAllHistoricoExames)
router.put("/historico-exames/:id", config.updateHistoricoExames);
router.delete("/historico-exames/:id", config.deleteHistoricoExames);

// Rotas para Horário Médico
router.post("/horarios-medicos", config.addHorarioMedico);
router.get("/horarios-medicos/:id", config.getHorario);
router.put("/horarios-medicos/:id", config.updateHorarioMedico);
router.delete("/horarios-medicos/:id", config.deleteHorarioMedico);

export default router;
