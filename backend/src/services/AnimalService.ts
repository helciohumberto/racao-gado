import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export class AnimalService {
    async listar(usuarioId: number, filtros?: { loteId?: number; sexo?: string; estado?: string }) {
        return prisma.animal.findMany({
            where: {
                usuarioId,
                ...(filtros?.loteId && { loteId: filtros.loteId }),
                ...(filtros?.sexo && { sexo: filtros.sexo }),
                ...(filtros?.estado && { estado: filtros.estado }),
            },
            include: {
                lote: true,
                pesagens: {
                    orderBy: { data: "desc" },
                    take: 1,
                }
            },
            orderBy: { createdAt: "desc" }
        })
    }

    async buscarPorId(id: number, usuarioId: number) {
        return prisma.animal.findFirst({
            where: { id, usuarioId },
            include: { lote: true, pesagens: true }
        })
    }

    async criar(dados: {
        nome: string
        raca?: string
        sexo: string
        pesoInicial: number
        loteId: number
        usuarioId: number
        dataNascimento?: Date
    }) {
        return prisma.animal.create({ data: dados })
    }

    async atualizar(id: number, usuarioId: number, dados: Partial<{
        nome: string
        raca: string
        sexo: string
        estado: string
        loteId: number
    }>) {
        return prisma.animal.updateMany({
            where: { id, usuarioId },
            data: dados
        })
    }

    async deletar(id: number, usuarioId: number) {
        return prisma.animal.deleteMany({
            where: { id, usuarioId }
        })
    }
}