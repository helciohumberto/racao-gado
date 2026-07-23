import { Router } from "express"
import { AnimalService } from "../services/AnimalService"

const router = Router()
const animalService = new AnimalService()

// Por agora usamos usuarioId fixo = 1 (depois adicionamos auth)
const USUARIO_ID = 1

router.get("/", async (req, res) => {
    try {
        const { loteId, sexo, estado } = req.query
        const animais = await animalService.listar(USUARIO_ID, {
            loteId: loteId ? Number(loteId) : undefined,
            sexo: sexo as string,
            estado: estado as string,
        })
        res.json(animais)
    } catch (error) {
        res.status(500).json({ erro: "Erro ao listar animais" })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const animal = await animalService.buscarPorId(Number(req.params.id), USUARIO_ID)
        if (!animal) return res.status(404).json({ erro: "Animal não encontrado" })
        res.json(animal)
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar animal" })
    }
})

router.post("/", async (req, res) => {
    try {
        const { nome, raca, sexo, pesoInicial, loteId, dataNascimento } = req.body
        const animal = await animalService.criar({
            nome, raca, sexo, pesoInicial, loteId,
            usuarioId: USUARIO_ID,
            dataNascimento: dataNascimento ? new Date(dataNascimento) : undefined
        })
        res.status(201).json(animal)
    } catch (error) {
        res.status(500).json({ erro: "Erro ao criar animal" })
    }
})

router.put("/:id", async (req, res) => {
    try {
        await animalService.atualizar(Number(req.params.id), USUARIO_ID, req.body)
        res.json({ mensagem: "Animal atualizado com sucesso" })
    } catch (error) {
        res.status(500).json({ erro: "Erro ao atualizar animal" })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        await animalService.deletar(Number(req.params.id), USUARIO_ID)
        res.json({ mensagem: "Animal deletado com sucesso" })
    } catch (error) {
        res.status(500).json({ erro: "Erro ao deletar animal" })
    }
})

export default router