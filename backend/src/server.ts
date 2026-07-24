import express from "express"
import cors from "cors"
import "dotenv/config"
import authRoutes from "./routes/authRoutes"
import animaisRoutes from "./routes/animaisRoutes"
import pesagensRoutes from "./routes/pesagensRoutes"
import custosRoutes from "./routes/custosRoutes"
import { autenticar } from "./middleware/auth"
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import lotesRoutes from "./routes/lotesRoutes"

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "racao-gado API",
            version: "1.0.0",
            description: "Sistema de gestão de pecuária — API REST"
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: ["./src/routes/*.ts"]
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)
const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get("/health", (req, res) => res.json({ status: "ok" }))

app.use("/auth", authRoutes)
app.use("/animais", autenticar, animaisRoutes)
app.use("/pesagens", autenticar, pesagensRoutes)
app.use("/custos", autenticar, custosRoutes)
app.use("/lotes", autenticar, lotesRoutes)

app.listen(3001, () => {
    console.log("racao-gado backend rodando na porta 3001")
})