import { Router } from "express"
import { PesagemService } from "../services/PesagemService"

const router = Router()
const pesagemService = new PesagemService()

router.post("/:animalId", async (req, res) => {
    try {
        const { peso, data } = req.body
        const pesagem = await pesagemService.registrar(
            Number(req.params.animalId),
            peso,
            new Date(data)
        )
        res.status(201).json(pesagem)
    } catch (error) {
        res.status(500).json({ erro: "Erro ao registrar pesagem" })
    }
})

router.get("/:animalId", async (req, res) => {
    try {
        const historico = await pesagemService.historico(Number(req.params.animalId))
        res.json(historico)
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar histórico" })
    }
})

router.get("/:animalId/producao", async (req, res) => {
    try {
        const pesoAlvo = Number(req.query.pesoAlvo) || 450
        const producao = await pesagemService.calcularProducao(
            Number(req.params.animalId),
            pesoAlvo
        )
        if (!producao) return res.status(400).json({ erro: "Pesagens insuficientes para calcular GMD" })
        res.json(producao)
    } catch (error) {
        res.status(500).json({ erro: "Erro ao calcular produção" })
    }
})

export default router