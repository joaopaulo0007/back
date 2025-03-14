import { Router } from "express";
import medicoController from "../controllers/medicoController.js"
import userController from "../controllers/userController.js"
import consultasController from "../controllers/consultasController.js";
import { uploadFotoMedico } from "../services/medicoService.js";
const router = Router();

router.post("/medicos", uploadFotoMedico.single('foto'), userController.addUser);
router.get("/medicos/:id", medicoController.getMedico);
router.put("/medicos/:id", medicoController.updateMedico);
router.get("/medicos", medicoController.getAllMedicos);
router.get("/medicos/especializacao/:especializacao", medicoController.getMedicobyEspecializacao);
router.get("/medicos/horarios/:id", medicoController.getHorariosDisponiveis);
router.get("/medicos/consultas/:id", consultasController.getConsultaAgendadaByMedico);
router.post("/horarios-medicos", medicoController.addHorarioMedico);
router.get("/horarios-medicos/:id", medicoController.getHorario);
router.put("/horarios-medicos/:id", medicoController.updateHorarioMedico);
export default router; 