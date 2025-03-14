import userService from "../services/userService.js";
import medicoService from "../services/medicoService.js";
import consultaService from "../services/consultaService.js";
import  { horarioDia } from "../middlewares/horarios.js";
import { hashSenha, verificarSenha } from "../auth/index.js";
import { sendVerificationEmail } from "../utils/emailService.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
class UserController {
    async Login(request,response){
        try{
            const{email,senha}=request.body
            const user= await userService.getuserByEmail(email)
            if(!user){
                return response.status(404).json({ message: "Usuário não encontrado" });
            }
            if(!user.verificado){
                return response.status(401).json({message:"usuário não verificado"})
            }
            const senhaValida= await verificarSenha(String(senha), String(user.senha))
            if (!senhaValida) {
                return response.status(401).json({message:"senha incorreta"})
            }
            return response.status(200).json({ message:"logim bem sucedido"})
        }catch(error){
          console.log(error)
          return response.status(500).json({error:" erro ao realizar o login"})
        }
    }

    async addUser(request, response) {
        try {
            const { 
                nome, 
                email, 
                cpf, 
                senha, 
                data_aniversario, 
                especializacao, 
                telefone, 
                crm 
            } = request.body;
            
            // Pega a foto se existir
            const fotoMedico = request.file ? request.file.path : null;
            
            const hash = await hashSenha(String(senha));
            const codigo_verificacao = crypto.randomBytes(3).toString('hex');
            
            const result = await userService.createUser(
                nome,
                hash,
                email,
                cpf,
                data_aniversario,
                telefone,
                especializacao,
                crm,
                false,
                codigo_verificacao,
                fotoMedico // Passa a foto (ou null) para o service
            );

            if (!result || !result.id) {
                return response.status(500).json({ error: "Erro ao criar usuário no banco de dados" });
            }

            const token = jwt.sign({ userID: result.id }, process.env.PRIVATE_KEY, { expiresIn: '2h' });
            await sendVerificationEmail(email, codigo_verificacao);

            return response.status(201).json({ 
                user: result, 
                message: "Usuário criado. Verifique seu e-mail." 
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: "Erro ao adicionar usuário" });
        }
    }
    async addHistoricoExames(request, response) {
        try {
            const { id_usuario } = request.body;
            const imagemFile = request.file;

            if (!imagemFile) {
                return response.status(400).json({ error: "Nenhuma imagem foi enviada" });
            }

            const imagemPath = imagemFile.path.replace(/\\/g, '/');
            const result = await userService.saveHistoricoExame(id_usuario, imagemPath);
            return response.status(201).json(result);
        } catch (error) {
            console.error("Erro ao adicionar histórico:", error);
            return response.status(500).json({ error: "Erro ao adicionar histórico de exames" });
        }
    }
    async getUser(request, response) {
        try {
            const id = Number(request.params.id)
        const result =await userService.getUserById(id)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"usuario não encontrado"})
        }
        
    }
    async getUserByEmail(request,response){
        try {
            const {email}=request.body
            const result= await userService.getuserByEmail(email)
            if (result.rows.lenght=0) {
                return response.status(404).json(result)
            }
            return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"usuario não encontrado"})
        }
    }
    async updateUser(request, response) {
        try {
            const id = Number(request.params.id)
        const { nome, senha, email, cpf, data_aniversario} = request.body
        const result =await userService.updateUser(id, nome, senha, email, cpf,data_aniversario)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao atualizar usuario"})
        }
        
    }
    async updateHistoricoExames(request, response) {
        try {
            const id = Number(request.params.id)
        const { id_usuario, imagem } = request.body
        const result =await userService.updateHistorico(id, id_usuario, imagem)
        return response.status(200).json(result)
        } catch (error) {
            return response.status(500).json({error:"erro ao atualizar historico de exames"})
        }
        
    }
    async deleteUser(request, response) {
        try {
            const id = Number(request.params.id)
        const result =await userService.deleteUser(id)
        return response.status(204).json(result)
        } catch (error) {
            return response.status(500).json({error:" erro ao deletar usuario"})
        }
        
    }
    async getAllHistoricoExames(request, response) {
        try {
            const id_usuario = Number(request.params.id);
            const result = await userService.getAllHistoricoExames(id_usuario);
            return response.status(200).json(result);
        } catch (error) {
            console.error("Erro ao buscar históricos:", error);
            return response.status(500).json({ error: "Erro ao buscar históricos de exames" });
        }
    }
    async getHistoricoExames(request, response) {
        try {
            const id = Number(request.params.id);
            const result = await userService.getHistoricoExame(id);
            
            if (!result) {
                return response.status(404).json({ error: "Histórico não encontrado" });
            }

            // Construir a URL completa para a imagem
            const baseUrl = `${request.protocol}://${request.get('host')}`;
            const imageUrl = `${baseUrl}/${result.imagem.replace(/\\/g, '/')}`;

            return response.status(200).json({
                ...result,
                imagemUrl: imageUrl // Retorna a URL completa da imagem
            });
        } catch (error) {
            console.error("Erro ao buscar histórico:", error);
            return response.status(500).json({ error: "Erro ao buscar histórico de exames" });
        }
    }
 
    async verifyEmail(request, response) {
        try {
          const { email, token } = request.body;
          const user = await userService.getuserByEmail(email);
    
          if (!user) {
            return response.status(404).json({ message: "Usuário não encontrado" });
          }

          if (user.token_verificacao !== token) {
            console.log(token)
            console.log(user.token_verificacao)
            return response.status(400).json({ message: "Token inválido" });
          }
    
          user.verificado = true;
          console.log(user)
          await userService.updateUser(user.id,user.nome,user.senha,user.email,user.cpf,user.data_aniversario,user.telefone,user.verificado);
    
          return response.status(200).json({ message: "Email verificado com sucesso!" });
        } catch (error) {
          console.log(error);
          return response.status(500).json({ error: "Erro ao verificar email" });
        }
      }


}

export default new UserController(); 