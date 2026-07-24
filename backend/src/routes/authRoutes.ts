import { Router } from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import "dotenv/config"

const router = Router()
const prisma = new PrismaClient()

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registar novo utilizador
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilizador criado
 *       400:
 *         description: Email já existe
 */

router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body
        const hash = await bcrypt.hash(password, 10)
        const usuario = await prisma.usuario.create({
            data: { email, password: hash }
        })
        res.status(201).json({ id: usuario.id, email: usuario.email })
    } catch (error) {
        res.status(400).json({ erro: "Email já existe" })
    }
})

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT
 *       401:
 *         description: Credenciais inválidas
 */

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const usuario = await prisma.usuario.findUnique({ where: { email } })
        if (!usuario) return res.status(401).json({ erro: "Credenciais inválidas" })

        const valida = await bcrypt.compare(password, usuario.password)
        if (!valida) return res.status(401).json({ erro: "Credenciais inválidas" })

        const token = jwt.sign({ id: usuario.id, email }, process.env.JWT_SECRET!, { expiresIn: "1h" })
        res.json({ token })
    } catch (error) {
        res.status(500).json({ erro: "Erro no login" })
    }
})

export default router