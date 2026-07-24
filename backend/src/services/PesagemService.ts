import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export class PesagemService {
    async registrar(animalId: number, peso: number, data: Date) {
        return prisma.pesagem.create({
            data: { animalId, peso, data }
        })
    }

    async historico(animalId: number) {
        return prisma.pesagem.findMany({
            where: { animalId },
            orderBy: { data: "asc" }
        })
    }

    async calcularGMD(animalId: number): Promise<number | null> {
        const pesagens = await this.historico(animalId)
        
        if (pesagens.length < 2) return null

        const primeira = pesagens[0]
        const ultima = pesagens[pesagens.length - 1]

        const diasDecorridos = Math.floor(
            (ultima.data.getTime() - primeira.data.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (diasDecorridos === 0) return null

        const ganhoPeso = ultima.peso - primeira.peso
        return ganhoPeso / diasDecorridos
    }

    async calcularProducao(animalId: number, pesoAlvo: number) {
        const pesagens = await this.historico(animalId)
        const gmd = await this.calcularGMD(animalId)

        if (!pesagens.length || !gmd) return null

        const pesoAtual = pesagens[pesagens.length - 1].peso
        const pesoFaltando = pesoAlvo - pesoAtual
        const diasParaAbate = gmd > 0 ? Math.ceil(pesoFaltando / gmd) : null

        return {
            pesoAtual,
            gmd: gmd.toFixed(3),
            diasParaAbate,
            dataEstimadaAbate: diasParaAbate 
                ? new Date(Date.now() + diasParaAbate * 24 * 60 * 60 * 1000)
                : null
        }
    }
}