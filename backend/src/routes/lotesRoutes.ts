import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import { AuthRequest } from "../middleware/auth"
const router = Router()
const prisma = new PrismaClient()

router.get("/", async (req: AuthRequest, res) => {
    try {
        const lotes = await prisma.lote.findMany({
            where: { usuarioId: req.usuarioId! }
        })
        res.json(lotes)
    } catch {
        res.status(500).json({ erro: "Erro ao listar lotes" })
    }
})

router.post("/", async (req: AuthRequest, res) => {
    try {
        const { nome, descricao } = req.body
        const lote = await prisma.lote.create({
            data: {
                nome,
                descricao,
                usuarioId: req.usuarioId!
            }
        })
        res.status(201).json(lote)
    } catch {
        res.status(500).json({ erro: "Erro ao criar lote" })
    }
})

export default router