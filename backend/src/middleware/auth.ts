import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import "dotenv/config"

export interface AuthRequest extends Request {
    usuarioId?: number
}

export function autenticar(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({ erro: "Token não fornecido" })
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number }
        req.usuarioId = payload.id
        next()
    } catch {
        res.status(401).json({ erro: "Token inválido" })
    }
}