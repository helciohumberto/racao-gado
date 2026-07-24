import express from "express"
import cors from "cors"
import "dotenv/config"
import authRoutes from "./routes/authRoutes"
import animaisRoutes from "./routes/animaisRoutes"
import pesagensRoutes from "./routes/pesagensRoutes"
import custosRoutes from "./routes/custosRoutes"
import { autenticar } from "./middleware/auth"

const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})

app.get("/health", (req, res) => res.json({ status: "ok" }))

app.use("/auth", authRoutes)
app.use("/animais", autenticar, animaisRoutes)
app.use("/pesagens", autenticar, pesagensRoutes)
app.use("/custos", autenticar, custosRoutes)

app.listen(3001, () => {
    console.log("racao-gado backend rodando na porta 3001")
})