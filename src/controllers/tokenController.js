import tokenService from "../services/tokenService.js";

export const generateTokenForConsulta= async (req,res)=>{
    try{
        const {channelName,uid,role,expireTime}=req.body;
    const token=await tokenService.generateTokensForConsulta(channelName,uid,role,expireTime);
    res.send(token);
    }catch(err){
        console.error("Erro ao gerar token",err);
        res.status(500).send("Erro ao gerar token");
    }
    
}
export const salvarToken_FCM=async(req,res)=>{
    try {
        const{id_usuario,token}=req.body;
        const result=await tokenService.salvarToken_FCM(id_usuario,token);
        res.status(201).send(result);
    } catch (error) {
        console.error("erro ao salvar tokenFCM ",error)
    }
}