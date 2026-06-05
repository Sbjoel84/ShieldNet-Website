import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { neon } from '@neondatabase/serverless'

const app = express()
const sql = neon(process.env.DATABASE_URL)
const JWT_SECRET = process.env.JWT_SECRET

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required')
if (!JWT_SECRET)               throw new Error('JWT_SECRET is required')

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// ── POST /api/auth/login ──────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required.' })

    const rows = await sql`SELECT * FROM profiles WHERE email = ${email.toLowerCase().trim()}`
    const user = rows[0]
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).json({ error: 'Invalid email or password.' })

    const { password_hash, ...profile } = user
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

    res.json({ token, profile })
  } catch (err) {
    console.error('login error:', err)
    res.status(500).json({ error: 'Server error. Please try again.' })
  }
})

// ── POST /api/auth/register ───────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, full_name, phone, role, city } = req.body
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password and full name are required.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' })
    }

    const existing = await sql`SELECT id FROM profiles WHERE email = ${email.toLowerCase().trim()}`
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' })
    }

    const password_hash = await bcrypt.hash(password, 10)
    const id = crypto.randomUUID()
    const safeRole = ['agent', 'farmer'].includes(role) ? role : 'public'

    const rows = await sql`
      INSERT INTO profiles (id, email, full_name, phone, role, city, password_hash)
      VALUES (
        ${id},
        ${email.toLowerCase().trim()},
        ${full_name.trim()},
        ${phone?.trim() || null},
        ${safeRole},
        ${city || null},
        ${password_hash}
      )
      RETURNING id, email, full_name, phone, role, city, shield_score, avatar_url, verified, created_at
    `
    const profile = rows[0]
    const token = jwt.sign({ id: profile.id, role: profile.role }, JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({ token, profile })
  } catch (err) {
    console.error('register error:', err)
    res.status(500).json({ error: 'Server error. Please try again.' })
  }
})

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const rows = await sql`
      SELECT id, email, full_name, phone, role, city, shield_score, avatar_url, verified, created_at
      FROM profiles WHERE id = ${req.user.id}
    `
    if (!rows[0]) return res.status(404).json({ error: 'Profile not found.' })
    res.json({ profile: rows[0] })
  } catch (err) {
    console.error('me error:', err)
    res.status(500).json({ error: 'Server error.' })
  }
})

app.get('/health', (_, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`ShieldNet API running on port ${PORT}`))
