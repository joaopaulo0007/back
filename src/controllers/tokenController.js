import { generateTokensForConsulta } from "../services/tokenService.js";

export const generateTokenForConsulta= async (req,res)=>{
    try{
        const {channelName,uid,role,expireTime}=req.body;
    const token=await generateTokensForConsulta(channelName,uid,role,expireTime);
    res.send(token);
    }catch(err){
        console.error("Erro ao gerar token",err);
        res.status(500).send("Erro ao gerar token");
    }
    
}