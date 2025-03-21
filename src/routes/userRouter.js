import { Router } from "express";
import { uploadHistorico } from "../services/userService.js";
import userController from "../controllers/userController.js";
import { salvarToken_FCM } from "../controllers/tokenController.js";
const router =new Router();
const config = userController;
router.post("/login",config.Login)

router.post("/cadastro", config.addUser);
router.get("/usuarios/:id", config.getUser);
router.put("/usuarios/:id",config.updateUser);
router.post("/historico-exames", uploadHistorico.single('imagem'), config.addHistoricoExames);
router.get("/historico-exames/:id", config.getHistoricoExames);
router.get("/historico-exames/usuario/:id",config.getAllHistoricoExames)
router.put("/historico-exames/:id", config.updateHistoricoExames);
router.post("/verificar-token",config.verifyEmail)
router.post("/tokenFCM",salvarToken_FCM)

export default router;