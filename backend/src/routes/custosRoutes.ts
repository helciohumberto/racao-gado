import { Router } from "express"
import { CustoService } from "../services/CustoService"
import { AuthRequest } from "../middleware/auth"

const router = Router()
const custoService = new CustoService()

router.post("/fornecimento", async (req: AuthRequest, res) => {
    try {
        const { loteId, racaoId, quantidade, data, custo } = req.body
        const fornecimento = await custoService.registrarFornecimento({
            loteId, racaoId, quantidade,
            data: new Date(data),
            custo
        })
        res.status(201).json(fornecimento)
    } catch (error) {
        res.status(500).json({ erro: "Erro ao registrar fornecimento" })
    }
})

router.get("/lote/:loteId", async (req: AuthRequest, res) => {
    try {
        const { dataInicio, dataFim } = req.query
        const resultado = await custoService.custoPorLote(
            Number(req.params.loteId),
            dataInicio ? new Date(dataInicio as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            dataFim ? new Date(dataFim as string) : new Date()
        )
        res.json(resultado)
    } catch (error) {
        res.status(500).json({ erro: "Erro ao calcular custos" })
    }
})

router.get("/dashboard", async (req: AuthRequest, res) => {
    try {
        const dados = await custoService.dashboard(req.usuarioId!)
        res.json(dados)
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar dashboard" })
    }
})

export default router