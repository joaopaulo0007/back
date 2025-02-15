import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
export function ValidToken(req, res, next) {
    const [, token] = req.headers.authorization?.split(' ') || [' ', ' ']
    if (!token) {
        return res.status(401).send("acesso negado")
    }
    try {
        const payload = jwt.verify(token, process.env.PRIVATE_KEY)
        const userIdFromToken = typeof payload !== 'string' && payload.user
        if (!userIdFromToken) {
            return res.status(401).json({ message: "token invalido" });
        }
        req.headers['user'] = payload.user
        return next()
    } catch (error) {
        return res.status(401).json({ error: "token invalido" })
    }
}