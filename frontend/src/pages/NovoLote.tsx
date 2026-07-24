import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import api from "../services/api"

const loteSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    descricao: z.string().optional()
})

type LoteForm = z.infer<typeof loteSchema>

function NovoLote() {
    const navigate = useNavigate()
    const [salvando, setSalvando] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<LoteForm>({
        resolver: zodResolver(loteSchema)
    })

    async function onSubmit(dados: LoteForm) {
        setSalvando(true)
        try {
            await api.post("/lotes", dados)
            navigate("/novoanimal")
        } catch {
            alert("Erro ao criar lote")
        } finally {
            setSalvando(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-lg mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">📦 Novo Lote</h1>
                    <button onClick={() => navigate("/animais")} className="text-gray-400 hover:text-white text-sm">
                        ← Voltar
                    </button>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg flex flex-col gap-4">
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Nome *</label>
                        <input
                            {...register("nome")}
                            placeholder="Ex: Lote 1 - Pasto Norte"
                            className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-green-500"
                        />
                        {errors.nome && <p className="text-red-400 text-sm mt-1">{errors.nome.message}</p>}
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Descrição</label>
                        <input
                            {...register("descricao")}
                            placeholder="Ex: Lote de engorda, pasto norte"
                            className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-green-500"
                        />
                    </div>

                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={salvando}
                        className="w-full py-3 bg-green-600 rounded font-semibold hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {salvando ? "Salvando..." : "Criar Lote"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NovoLote
