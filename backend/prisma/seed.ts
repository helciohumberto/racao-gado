import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    // Criar usuário
    const senha = await bcrypt.hash("123456", 10)
    const usuario = await prisma.usuario.create({
        data: {
            email: "helcio@racao-gado.com",
            password: senha,
        }
    })

    // Criar lotes
    const lote1 = await prisma.lote.create({
        data: { nome: "Lote A", descricao: "Bezerros", usuarioId: usuario.id }
    })
    const lote2 = await prisma.lote.create({
        data: { nome: "Lote B", descricao: "Novilhos", usuarioId: usuario.id }
    })

    // Criar 20 animais
    const racas = ["Nelore", "Angus", "Brahman", "Girolando"]
    for (let i = 1; i <= 20; i++) {
        await prisma.animal.create({
            data: {
                nome: `Animal ${i}`,
                raca: racas[i % 4],
                sexo: i % 2 === 0 ? "M" : "F",
                pesoInicial: 200 + Math.random() * 150,
                loteId: i <= 10 ? lote1.id : lote2.id,
                usuarioId: usuario.id,
            }
        })
    }

    // Criar rações
    await prisma.racao.createMany({
        data: [
            { nome: "Ração Premium", tipo: "Concentrado", precoPorKg: 2.50 },
            { nome: "Ração Standard", tipo: "Volumoso", precoPorKg: 1.80 },
            { nome: "Ração Econômica", tipo: "Pastagem", precoPorKg: 1.20 },
        ]
    })

    console.log("Seed concluído com sucesso!")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())