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

export default router