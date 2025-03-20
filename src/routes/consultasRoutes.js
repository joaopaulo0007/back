import { Router } from "express";
import consultasController from "../controllers/consultasController.js";
import { generateTokenForConsulta } from "../controllers/tokenController.js";
const router = new Router();
router.post("/consultas", consultasController.addConsulta);
router.get("/consultas/:id", consultasController.getConsulta);
router.get("/consultas/usuario/:id",consultasController.getAllConsultas)
router.put("/consultas/:id", consultasController.updateConsulta);

// Rotas para Consulta Agendada
router.post("/consultas-agendadas", consultasController.addConsultaAgendada);
router.get("/consultas-agendadas/:id", consultasController.getConsultaAgendada);
router.put("/consultas-agendadas/:id", consultasController.updateConsultaAgendada);
router.post("/token",generateTokenForConsulta);
export default router;