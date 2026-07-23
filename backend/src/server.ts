import express from "express"
import cors from "cors"
import "dotenv/config"
import animaisRoutes from "./routes/animaisRoutes"

const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})
app.use("/animais", animaisRoutes)

app.get("/health", (req, res) => {
    res.json({ status: "ok" })
})

app.listen(3001, () => {
    console.log("racao-gado backend rodando na porta 3001")
})