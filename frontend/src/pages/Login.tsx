import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import api from "../services/api"

const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Mínimo 6 caracteres")
})

type LoginForm = z.infer<typeof loginSchema>

function Login() {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    })

    async function onSubmit(dados: LoginForm) {
        try {
            const resposta = await api.post("/auth/login", {
                email: dados.email,
                password: dados.senha
            })
            localStorage.setItem("token", resposta.data.token)
            navigate("/dashboard")
        } catch {
            alert("Email ou senha incorretos")
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-900">
            <h1 className="text-3xl font-bold text-white">🐄 racao-gado</h1>
            <p className="text-gray-400 text-sm">Sistema de gestão de pecuária</p>
            <div className="bg-gray-800 p-8 rounded-lg w-80 flex flex-col gap-4">
                <input
                    {...register("email")}
                    type="email"
                    placeholder="Email"
                    className="px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-green-500"
                />
                {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
                <input
                    {...register("senha")}
                    type="password"
                    placeholder="Senha"
                    className="px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-green-500"
                />
                {errors.senha && <p className="text-red-400 text-sm">{errors.senha.message}</p>}
                <button
                    onClick={handleSubmit(onSubmit)}
                    className="px-4 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition"
                >
                    Entrar
                </button>
            </div>
        </div>
    )
}

export default Login