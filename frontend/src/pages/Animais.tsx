import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import type { Animal } from "../types"

function Animais() {
    const navigate = useNavigate()
    const [animais, setAnimais] = useState<Animal[]>([])
    const [busca, setBusca] = useState("")
    const [filtroSexo, setFiltroSexo] = useState("")
    const [carregando, setCarregando] = useState(true)
    const [animalSelecionado, setAnimalSelecionado] = useState<Animal | null>(null)

    useEffect(() => {
        buscarAnimais()
    }, [filtroSexo])

    async function buscarAnimais() {
        try {
            setCarregando(true)
            const params = new URLSearchParams()
            if (filtroSexo) params.append("sexo", filtroSexo)
            const resposta = await api.get(`/animais?${params}`)
            setAnimais(resposta.data)
        } catch {
            navigate("/login")
        } finally {
            setCarregando(false)
        }
    }

    const animaisFiltrados = animais.filter(a =>
        a.nome.toLowerCase().includes(busca.toLowerCase()) ||
        a.raca?.toLowerCase().includes(busca.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">🐄 Animais</h1>
                    <button onClick={() => navigate("/dashboard")} className="text-gray-400 hover:text-white text-sm">
                        ← Dashboard
                    </button>
                </div>

                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por nome ou raça..."
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:border-green-500"
                    />
                    <select
                        value={filtroSexo}
                        onChange={e => setFiltroSexo(e.target.value)}
                        className="px-4 py-2 bg-gray-800 rounded border border-gray-700 focus:outline-none"
                    >
                        <option value="">Todos os sexos</option>
                        <option value="M">Machos</option>
                        <option value="F">Fêmeas</option>
                    </select>
                </div>

                {carregando ? (
                    <p className="text-gray-400">Carregando...</p>
                ) : (
                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="text-left p-4 text-gray-300 font-medium">Nome</th>
                                    <th className="text-left p-4 text-gray-300 font-medium">Raça</th>
                                    <th className="text-left p-4 text-gray-300 font-medium">Sexo</th>
                                    <th className="text-left p-4 text-gray-300 font-medium">Lote</th>
                                    <th className="text-left p-4 text-gray-300 font-medium">Peso Inicial</th>
                                    <th className="text-left p-4 text-gray-300 font-medium">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {animaisFiltrados.map(animal => (
                                    <tr
                                        key={animal.id}
                                        onClick={() => setAnimalSelecionado(animal)}
                                        className="border-t border-gray-700 hover:bg-gray-700 cursor-pointer transition"
                                    >
                                        <td className="p-4">{animal.nome}</td>
                                        <td className="p-4 text-gray-400">{animal.raca || "—"}</td>
                                        <td className="p-4">{animal.sexo === "M" ? "♂ Macho" : "♀ Fêmea"}</td>
                                        <td className="p-4 text-blue-400">{animal.lote?.nome}</td>
                                        <td className="p-4 text-green-400">{animal.pesoInicial.toFixed(1)} kg</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${animal.estado === "ATIVO" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
                                                {animal.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-gray-400 text-sm p-4">{animaisFiltrados.length} animais</p>
                    </div>
                )}

                {/* Modal de detalhes */}
                {animalSelecionado && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={() => setAnimalSelecionado(null)}>
                        <div className="bg-gray-800 rounded-lg p-6 w-96" onClick={e => e.stopPropagation()}>
                            <h2 className="text-xl font-bold mb-4">{animalSelecionado.nome}</h2>
                            <div className="space-y-2 text-sm">
                                <p><span className="text-gray-400">Raça:</span> {animalSelecionado.raca || "—"}</p>
                                <p><span className="text-gray-400">Sexo:</span> {animalSelecionado.sexo === "M" ? "Macho" : "Fêmea"}</p>
                                <p><span className="text-gray-400">Lote:</span> {animalSelecionado.lote?.nome}</p>
                                <p><span className="text-gray-400">Peso inicial:</span> {animalSelecionado.pesoInicial.toFixed(1)} kg</p>
                                <p><span className="text-gray-400">Estado:</span> {animalSelecionado.estado}</p>
                            </div>
                            <button
                                onClick={() => setAnimalSelecionado(null)}
                                className="mt-6 w-full py-2 bg-gray-700 rounded hover:bg-gray-600 transition text-sm"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Animais