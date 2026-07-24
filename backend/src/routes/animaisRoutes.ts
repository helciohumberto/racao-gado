import { Router } from "express"
import { AnimalService } from "../services/AnimalService"
import { AuthRequest } from "../middleware/auth"

const router = Router()
const animalService = new AnimalService()

router.get("/", async (req: AuthRequest, res) => {
    try {
        const { loteId, sexo, estado } = req.query
        const animais = await animalService.listar(req.usuarioId!, {
            loteId: loteId ? Number(loteId) : undefined,
            sexo: sexo as string,
            estado: estado as string,
        })
        res.json(animais)
    } catch (error) {
        res.status(500).json({ erro: "Erro ao listar animais" })
    }
})

router.get("/:id", async (req: AuthRequest, res) => {
    try {
        const animal = await animalService.buscarPorId(Number(req.params.id), req.usuarioId!)
        if (!animal) return res.status(404).json({ erro: "Animal não encontrado" })
        res.json(animal)
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar animal" })
    }
})

router.post("/", async (req: AuthRequest, res) => {
    try {
        const { nome, raca, sexo, pesoInicial, loteId, dataNascimento } = req.body
        const animal = await animalService.criar({
            nome, raca, sexo, pesoInicial, loteId,
            usuarioId: req.usuarioId!,
            dataNascimento: dataNascimento ? new Date(dataNascimento) : undefined
        })
        res.status(201).json(animal)
    } catch (error) {
        res.status(500).json({ erro: "Erro ao criar animal" })
    }
})

router.put("/:id", async (req: AuthRequest, res) => {
    try {
        await animalService.atualizar(Number(req.params.id), req.usuarioId!, req.body)
        res.json({ mensagem: "Animal atualizado com sucesso" })
    } catch (error) {
        res.status(500).json({ erro: "Erro ao atualizar animal" })
    }
})

router.delete("/:id", async (req: AuthRequest, res) => {
    try {
        await animalService.deletar(Number(req.params.id), req.usuarioId!)
        res.json({ mensagem: "Animal deletado com sucesso" })
    } catch (error) {
        res.status(500).json({ erro: "Erro ao deletar animal" })
    }
})

export default router