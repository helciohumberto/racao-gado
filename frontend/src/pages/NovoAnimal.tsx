import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useEffect } from "react"
import api from "../services/api"
import type { Lote } from "../types"

const animalSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    raca: z.string().optional(),
    sexo: z.enum(["M", "F"], { message: "Seleciona o sexo" }),
    pesoInicial: z.coerce.number().min(1, "Peso deve ser maior que 0"),
    loteId: z.coerce.number().min(1, "Seleciona um lote"),
    dataNascimento: z.string().optional()
})

type AnimalForm = z.infer<typeof animalSchema>

function NovoAnimal() {
    const navigate = useNavigate()
    const [lotes, setLotes] = useState<Lote[]>([])
    const [salvando, setSalvando] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<AnimalForm>({
        resolver: zodResolver(animalSchema)
    })

    useEffect(() => {
        api.get("/lotes").then(r => setLotes(r.data)).catch(() => {})
    }, [])

    async function onSubmit(dados: AnimalForm) {
        setSalvando(true)
        try {
            await api.post("/animais", dados)
            navigate("/animais")
        } catch {
            alert("Erro ao criar animal")
        } finally {
            setSalvando(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-lg mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">➕ Novo Animal</h1>
                    <button onClick={() => navigate("/animais")} className="text-gray-400 hover:text-white text-sm">
                        ← Voltar
                    </button>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg flex flex-col gap-4">
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Nome *</label>
                        <input
                            {...register("nome")}
                            placeholder="Ex: Boi Marrom"
                            className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-green-500"
                        />
                        {errors.nome && <p className="text-red-400 text-sm mt-1">{errors.nome.message}</p>}
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Raça</label>
                        <input
                            {...register("raca")}
                            placeholder="Ex: Nelore"
                            className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-green-500"
                        />
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Sexo *</label>
                        <select
                            {...register("sexo")}
                            className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none"
                        >
                            <option value="">Seleciona...</option>
                            <option value="M">Macho</option>
                            <option value="F">Fêmea</option>
                        </select>
                        {errors.sexo && <p className="text-red-400 text-sm mt-1">{errors.sexo.message}</p>}
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Peso Inicial (kg) *</label>
                        <input
                            {...register("pesoInicial")}
                            type="number"
                            step="0.1"
                            placeholder="Ex: 250"
                            className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-green-500"
                        />
                        {errors.pesoInicial && <p className="text-red-400 text-sm mt-1">{errors.pesoInicial.message}</p>}
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Lote *</label>
                        <select
                            {...register("loteId")}
                            className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none"
                        >
                            <option value="">Seleciona...</option>
                            {lotes.map(l => (
                                <option key={l.id} value={l.id}>{l.nome}</option>
                            ))}
                        </select>
                        {errors.loteId && <p className="text-red-400 text-sm mt-1">{errors.loteId.message}</p>}
                    </div>

                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Data de Nascimento</label>
                        <input
                            {...register("dataNascimento")}
                            type="date"
                            className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-green-500"
                        />
                    </div>

                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={salvando}
                        className="w-full py-3 bg-green-600 rounded font-semibold hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {salvando ? "Salvando..." : "Criar Animal"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NovoAnimal