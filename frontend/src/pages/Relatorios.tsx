import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import api from "../services/api"

interface CustoLote {
    totalCusto: string
    totalQuantidadeKg: string
    animaisNoLote: number
    custoPorCabecaPorDia: string
}

const CORES = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"]

function Relatorios() {
    const navigate = useNavigate()
    const [periodo, setPeriodo] = useState("30")
    const [custoLote1, setCustoLote1] = useState<CustoLote | null>(null)
    const [custoLote2, setCustoLote2] = useState<CustoLote | null>(null)
    const [carregando, setCarregando] = useState(false)

    async function buscarRelatorio() {
        setCarregando(true)
        try {
            const dataFim = new Date()
            const dataInicio = new Date()
            dataInicio.setDate(dataInicio.getDate() - Number(periodo))

            const [r1, r2] = await Promise.all([
                api.get(`/custos/lote/1?dataInicio=${dataInicio.toISOString()}&dataFim=${dataFim.toISOString()}`),
                api.get(`/custos/lote/2?dataInicio=${dataInicio.toISOString()}&dataFim=${dataFim.toISOString()}`)
            ])

            setCustoLote1(r1.data)
            setCustoLote2(r2.data)
        } catch (e) {
            console.error(e)
        } finally {
            setCarregando(false)
        }
    }

    const dadosBarras = custoLote1 && custoLote2 ? [
        { lote: "Lote A", custo: parseFloat(custoLote1.totalCusto), animais: custoLote1.animaisNoLote },
        { lote: "Lote B", custo: parseFloat(custoLote2.totalCusto), animais: custoLote2.animaisNoLote },
    ] : []

    const dadosPizza = custoLote1 && custoLote2 ? [
        { name: "Lote A", value: custoLote1.animaisNoLote },
        { name: "Lote B", value: custoLote2.animaisNoLote },
    ] : []

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Relatórios</h1>
                    <button onClick={() => navigate("/dashboard")} className="text-gray-400 hover:text-white text-sm">
                        ← Dashboard
                    </button>
                </div>

                <div className="flex gap-4 mb-6">
                    <select
                        value={periodo}
                        onChange={e => setPeriodo(e.target.value)}
                        className="px-4 py-2 bg-gray-800 rounded border border-gray-700"
                    >
                        <option value="7">Últimos 7 dias</option>
                        <option value="30">Últimos 30 dias</option>
                        <option value="90">Últimos 90 dias</option>
                    </select>
                    <button
                        onClick={buscarRelatorio}
                        className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
                    >
                        {carregando ? "Carregando..." : "Gerar Relatório"}
                    </button>
                </div>

                {custoLote1 && custoLote2 && (
                    <>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-gray-400 text-sm mb-2">Lote A — Custo/Cabeça/Dia</h3>
                                <p className="text-2xl font-bold text-green-400">R${custoLote1.custoPorCabecaPorDia}</p>
                                <p className="text-gray-400 text-sm mt-1">{custoLote1.animaisNoLote} animais</p>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-gray-400 text-sm mb-2">Lote B — Custo/Cabeça/Dia</h3>
                                <p className="text-2xl font-bold text-blue-400">R${custoLote2.custoPorCabecaPorDia}</p>
                                <p className="text-gray-400 text-sm mt-1">{custoLote2.animaisNoLote} animais</p>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-lg mb-6">
                            <h2 className="text-lg font-semibold mb-4">Custo por Lote</h2>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={dadosBarras}>
                                    <XAxis dataKey="lote" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }} />
                                    <Bar dataKey="custo" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Distribuição de Animais por Lote</h2>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={dadosPizza} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                                        {dadosPizza.map((_, index) => (
                                            <Cell key={index} fill={CORES[index % CORES.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}

                {!custoLote1 && !carregando && (
                    <div className="bg-gray-800 p-8 rounded-lg text-center">
                        <p className="text-gray-400">Seleciona um período e clica em "Gerar Relatório"</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Relatorios