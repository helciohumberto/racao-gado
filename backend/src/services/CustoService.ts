import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export class CustoService {
    async registrarFornecimento(dados: {
        loteId: number
        racaoId: number
        quantidade: number
        data: Date
        custo: number
    }) {
        return prisma.fornecimento.create({ data: dados })
    }

    async custoPorLote(loteId: number, dataInicio: Date, dataFim: Date) {
        const fornecimentos = await prisma.fornecimento.findMany({
            where: {
                loteId,
                data: { gte: dataInicio, lte: dataFim }
            },
            include: { racao: true }
        })

        const totalCusto = fornecimentos.reduce((acc, f) => acc + f.custo, 0)
        const totalQuantidade = fornecimentos.reduce((acc, f) => acc + f.quantidade, 0)

        const animaisNoLote = await prisma.animal.count({
            where: { loteId, estado: "ATIVO" }
        })

        const diasPeriodo = Math.ceil(
            (dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24)
        )

        return {
            totalCusto: totalCusto.toFixed(2),
            totalQuantidadeKg: totalQuantidade.toFixed(2),
            animaisNoLote,
            custoPorCabecaPorDia: animaisNoLote > 0 && diasPeriodo > 0
                ? (totalCusto / animaisNoLote / diasPeriodo).toFixed(2)
                : "0.00",
            fornecimentos
        }
    }

    async dashboard(usuarioId: number) {
        const totalAnimais = await prisma.animal.count({
            where: { usuarioId, estado: "ATIVO" }
        })

        const totalLotes = await prisma.lote.count({
            where: { usuarioId }
        })

        const ultimasPesagens = await prisma.pesagem.findMany({
            where: { animal: { usuarioId } },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { animal: { select: { nome: true } } }
        })

        const dataInicio = new Date()
        dataInicio.setDate(dataInicio.getDate() - 30)

        const custoMes = await prisma.fornecimento.aggregate({
            where: {
                data: { gte: dataInicio }
            },
            _sum: { custo: true }
        })

        return {
            totalAnimais,
            totalLotes,
            custoUltimos30Dias: custoMes._sum.custo?.toFixed(2) || "0.00",
            ultimasPesagens
        }
    }
}