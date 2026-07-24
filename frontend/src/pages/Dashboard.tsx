import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import api from "../services/api"

interface DashboardData {
    totalAnimais: number
    totalLotes: number
    custoUltimos30Dias: string
    ultimasPesagens: {
        id: number
        peso: number
        data: string
        animal: { nome: string }
    }[]
}

function Dashboard() {
    const navigate = useNavigate()
    const [dados, setDados] = useState<DashboardData | null>(null)

    useEffect(() => {
        api.get("/custos/dashboard")
            .then(r => setDados(r.data))
            .catch(() => navigate("/login"))
    }, [])

    function sair() {
        localStorage.removeItem("token")
        navigate("/login")
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">🐄 racao-gado</h1>
                    <button onClick={sair} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition text-sm">
                        Sair
                    </button>
                </div>

                {dados ? (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <p className="text-gray-400 text-sm">Total de Animais</p>
                            <p className="text-3xl font-bold text-green-400">{dados.totalAnimais}</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <p className="text-gray-400 text-sm">Total de Lotes</p>
                            <p className="text-3xl font-bold text-blue-400">{dados.totalLotes}</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <p className="text-gray-400 text-sm">Custo (30 dias)</p>
                            <p className="text-3xl font-bold text-yellow-400">R${dados.custoUltimos30Dias}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400">Carregando...</p>
                )}

                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Últimas Pesagens</h2>
                    {dados?.ultimasPesagens.length === 0 ? (
                        <p className="text-gray-400 text-sm">Nenhuma pesagem registrada ainda.</p>
                    ) : (
                        dados?.ultimasPesagens.map(p => (
                            <div key={p.id} className="flex justify-between py-2 border-b border-gray-700">
                                <span>{p.animal.nome}</span>
                                <span className="text-green-400">{p.peso} kg</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard