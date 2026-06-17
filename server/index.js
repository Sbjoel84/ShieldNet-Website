import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { neon } from '@neondatabase/serverless'

const REQUIRED_VARS = ['DATABASE_URL', 'JWT_SECRET']
const missing = REQUIRED_VARS.filter(k => !process.env[k])
if (missing.length) {
  console.error('\n❌  Missing required environment variables:', missing.join(', '))
  console.error('    Set them in your Render dashboard → Environment tab.\n')
  process.exit(1)
}

const app = express()
const sql = neon(process.env.DATABASE_URL)
const JWT_SECRET = process.env.JWT_SECRET

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:4173',
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(null, false)
  },
}))
app.use(express.json())

const ADMIN_EMAIL        = 'shieldnetcore@gmail.com'
const FIREBASE_WEB_KEY   = process.env.FIREBASE_WEB_API_KEY ?? ''

async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  // 1. Try legacy custom JWT
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    return next()
  } catch {}

  // 2. Verify as Firebase ID token
  try {
    const r = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_WEB_KEY}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ idToken: token }),
      }
    )
    if (r.ok) {
      const d = await r.json()
      const u = d.users?.[0]
      if (u) {
        req.user = {
          id:    u.localId,
          email: u.email,
          role:  u.email?.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'public',
        }
        return next()
      }
    }
  } catch {}

  res.status(401).json({ error: 'Unauthorized' })
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

// ── GET /api/admin/users ──────────────────────────────────────────────────────
app.get('/api/admin/users', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only.' })
    const rows = await sql`
      SELECT id, email, full_name, phone, role, city, verified, created_at
      FROM profiles ORDER BY created_at DESC
    `
    res.json({ users: rows })
  } catch (err) {
    console.error('admin users error:', err)
    res.status(500).json({ error: 'Server error.' })
  }
})

// ── PATCH /api/admin/users/:id/password ───────────────────────────────────────
app.patch('/api/admin/users/:id/password', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only.' })
    const { new_password } = req.body
    if (!new_password || new_password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' })
    }
    const password_hash = await bcrypt.hash(new_password, 10)
    const rows = await sql`
      UPDATE profiles SET password_hash = ${password_hash}
      WHERE id = ${req.params.id}
      RETURNING id, email, full_name, role
    `
    if (!rows[0]) return res.status(404).json({ error: 'User not found.' })
    res.json({ ok: true, user: rows[0] })
  } catch (err) {
    console.error('reset password error:', err)
    res.status(500).json({ error: 'Server error.' })
  }
})

// ── Email transporter ─────────────────────────────────────────────────────────
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

async function sendMail({ to, subject, html }) {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) return
  try {
    await mailer.sendMail({ from: `"ShieldNet" <${process.env.MAIL_USER}>`, to, subject, html })
  } catch (err) {
    console.error('Email error:', err.message)
  }
}

// ── POST /api/listings/submit ─────────────────────────────────────────────────
app.post('/api/listings/submit', async (req, res) => {
  try {
    const {
      agent_name, agent_email, agent_phone, agency_name,
      title, description, property_type, city, address, price,
      bedrooms, bathrooms, area_sqm, has_title_doc, extra_notes,
    } = req.body

    if (!agent_name || !agent_email || !agent_phone || !title || !description || !city || !address || !price) {
      return res.status(400).json({ error: 'Please fill in all required fields.' })
    }

    const id = crypto.randomUUID()
    const rows = await sql`
      INSERT INTO listing_submissions
        (id, agent_name, agent_email, agent_phone, agency_name, title, description,
         property_type, city, address, price, bedrooms, bathrooms, area_sqm, has_title_doc, extra_notes)
      VALUES
        (${id}, ${agent_name.trim()}, ${agent_email.toLowerCase().trim()}, ${agent_phone.trim()},
         ${agency_name?.trim() || null}, ${title.trim()}, ${description.trim()},
         ${property_type || 'house'}, ${city}, ${address.trim()}, ${Number(price)},
         ${bedrooms ? Number(bedrooms) : null}, ${bathrooms ? Number(bathrooms) : null},
         ${area_sqm ? Number(area_sqm) : null}, ${!!has_title_doc}, ${extra_notes?.trim() || null})
      RETURNING *
    `

    await sendMail({
      to: agent_email,
      subject: 'ShieldNet — Listing Received',
      html: `<p>Hi ${agent_name},</p>
             <p>We've received your listing <strong>${title}</strong> and it is now under review.</p>
             <p>You'll get another email once it has been approved or rejected. This usually takes 1–2 business days.</p>
             <p>— ShieldNet Core Technologies</p>`,
    })

    res.status(201).json({ listing: rows[0] })
  } catch (err) {
    console.error('listing submit error:', err)
    res.status(500).json({ error: 'Server error. Please try again.' })
  }
})

// ── GET /api/listings ─────────────────────────────────────────────────────────
app.get('/api/listings', requireAuth, async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM listing_submissions ORDER BY created_at DESC`
    res.json({ listings: rows })
  } catch (err) {
    console.error('listings fetch error:', err)
    res.status(500).json({ error: 'Server error.' })
  }
})

// ── PATCH /api/listings/:id ───────────────────────────────────────────────────
app.patch('/api/listings/:id', requireAuth, async (req, res) => {
  try {
    const { status, admin_notes } = req.body
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or rejected.' })
    }

    const rows = await sql`
      UPDATE listing_submissions
      SET status = ${status}, admin_notes = ${admin_notes ?? null}
      WHERE id = ${req.params.id}
      RETURNING *
    `
    if (!rows[0]) return res.status(404).json({ error: 'Listing not found.' })

    const listing = rows[0]

    if (status === 'approved') {
      await sendMail({
        to: listing.agent_email,
        subject: 'ShieldNet — Your Listing Has Been Approved! 🎉',
        html: `<p>Hi ${listing.agent_name},</p>
               <p>Great news! Your listing <strong>${listing.title}</strong> has been <span style="color:#16a34a">approved</span> by our team and is now live on ShieldNet.</p>
               ${admin_notes ? `<p><strong>Admin notes:</strong> ${admin_notes}</p>` : ''}
               <p>Thank you for using ShieldNet Core Technologies.</p>`,
      })
    } else {
      await sendMail({
        to: listing.agent_email,
        subject: 'ShieldNet — Listing Update',
        html: `<p>Hi ${listing.agent_name},</p>
               <p>Unfortunately your listing <strong>${listing.title}</strong> could not be approved at this time.</p>
               ${admin_notes ? `<p><strong>Reason:</strong> ${admin_notes}</p>` : ''}
               <p>Please contact us if you have any questions.</p>
               <p>— ShieldNet Core Technologies</p>`,
      })
    }

    res.json({ listing })
  } catch (err) {
    console.error('listing update error:', err)
    res.status(500).json({ error: 'Server error.' })
  }
})

// ══════════════════════════════════════════════════════════════════════════════
// PROPERTIES
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/properties', async (req, res) => {
  try {
    const { city, type, verified, search } = req.query
    let rows = await sql`SELECT * FROM properties ORDER BY created_at DESC`
    if (city && city !== 'All')     rows = rows.filter(p => p.city === city)
    if (type && type !== 'All')     rows = rows.filter(p => p.property_type === type)
    if (verified === 'true')        rows = rows.filter(p => p.shield_verified)
    if (search)                     rows = rows.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase()))
    res.json({ properties: rows })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

app.post('/api/properties', requireAuth, async (req, res) => {
  try {
    const { title, description, price, property_type, city, address, lat, lng, photos, title_doc_url, bedrooms, bathrooms, area_sqm } = req.body
    if (!title || !description || !price || !city || !address) return res.status(400).json({ error: 'Required fields missing.' })
    const id = crypto.randomUUID()
    const profile = (await sql`SELECT full_name FROM profiles WHERE id = ${req.user.id}`)[0]
    const rows = await sql`
      INSERT INTO properties (id, title, description, price, property_type, city, address, lat, lng, photos, title_doc_url, agent_id, agent_name, bedrooms, bathrooms, area_sqm)
      VALUES (${id}, ${title}, ${description}, ${Number(price)}, ${property_type||'house'}, ${city}, ${address},
              ${lat||null}, ${lng||null}, ${photos||[]}, ${title_doc_url||null},
              ${req.user.id}, ${profile?.full_name||'Admin'}, ${bedrooms||null}, ${bathrooms||null}, ${area_sqm||null})
      RETURNING *`
    res.status(201).json({ property: rows[0] })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

app.patch('/api/properties/:id', requireAuth, async (req, res) => {
  try {
    const { title, description, price, property_type, city, address, status, shield_verified, bedrooms, bathrooms, area_sqm } = req.body
    const rows = await sql`
      UPDATE properties SET
        title = COALESCE(${title||null}, title),
        description = COALESCE(${description||null}, description),
        price = COALESCE(${price ? Number(price) : null}, price),
        property_type = COALESCE(${property_type||null}, property_type),
        city = COALESCE(${city||null}, city),
        address = COALESCE(${address||null}, address),
        status = COALESCE(${status||null}, status),
        shield_verified = COALESCE(${shield_verified != null ? shield_verified : null}, shield_verified),
        bedrooms = COALESCE(${bedrooms||null}, bedrooms),
        bathrooms = COALESCE(${bathrooms||null}, bathrooms),
        area_sqm = COALESCE(${area_sqm||null}, area_sqm)
      WHERE id = ${req.params.id} RETURNING *`
    if (!rows[0]) return res.status(404).json({ error: 'Not found.' })
    res.json({ property: rows[0] })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

app.delete('/api/properties/:id', requireAuth, async (req, res) => {
  try {
    await sql`DELETE FROM properties WHERE id = ${req.params.id}`
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

// ══════════════════════════════════════════════════════════════════════════════
// FARMS
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/farms', async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM farms ORDER BY created_at DESC`
    res.json({ farms: rows })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

app.post('/api/farms', requireAuth, async (req, res) => {
  try {
    const { name, location, city, lat, lng, crop_type, area_hectares } = req.body
    if (!name || !location || !city || !crop_type) return res.status(400).json({ error: 'Required fields missing.' })
    const profile = (await sql`SELECT full_name FROM profiles WHERE id = ${req.user.id}`)[0]
    const id = crypto.randomUUID()
    const rows = await sql`
      INSERT INTO farms (id, owner_id, owner_name, name, location, city, lat, lng, crop_type, area_hectares)
      VALUES (${id}, ${req.user.id}, ${profile?.full_name||'Admin'}, ${name}, ${location}, ${city}, ${lat||null}, ${lng||null}, ${crop_type}, ${Number(area_hectares)||0})
      RETURNING *`
    res.status(201).json({ farm: rows[0] })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

app.delete('/api/farms/:id', requireAuth, async (req, res) => {
  try {
    await sql`DELETE FROM farms WHERE id = ${req.params.id}`
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

// ══════════════════════════════════════════════════════════════════════════════
// MARKET PRICES
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/market-prices', async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM market_prices ORDER BY city, crop_name`
    res.json({ prices: rows })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

app.post('/api/market-prices', requireAuth, async (req, res) => {
  try {
    const { crop_name, price_per_kg, market, city, trend, change_percent } = req.body
    if (!crop_name || !price_per_kg || !market || !city) return res.status(400).json({ error: 'Required fields missing.' })
    const id = crypto.randomUUID()
    const rows = await sql`
      INSERT INTO market_prices (id, crop_name, price_per_kg, market, city, trend, change_percent)
      VALUES (${id}, ${crop_name}, ${Number(price_per_kg)}, ${market}, ${city}, ${trend||'stable'}, ${Number(change_percent)||0})
      RETURNING *`
    res.status(201).json({ price: rows[0] })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

app.patch('/api/market-prices/:id', requireAuth, async (req, res) => {
  try {
    const { price_per_kg, trend, change_percent } = req.body
    const rows = await sql`
      UPDATE market_prices SET
        price_per_kg = COALESCE(${price_per_kg ? Number(price_per_kg) : null}, price_per_kg),
        trend = COALESCE(${trend||null}, trend),
        change_percent = COALESCE(${change_percent != null ? Number(change_percent) : null}, change_percent),
        updated_at = NOW()
      WHERE id = ${req.params.id} RETURNING *`
    res.json({ price: rows[0] })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

app.delete('/api/market-prices/:id', requireAuth, async (req, res) => {
  try {
    await sql`DELETE FROM market_prices WHERE id = ${req.params.id}`
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

// ══════════════════════════════════════════════════════════════════════════════
// CROP DIAGNOSES
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/diagnoses', requireAuth, async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM crop_diagnoses ORDER BY created_at DESC`
    res.json({ diagnoses: rows })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

app.post('/api/diagnoses', requireAuth, async (req, res) => {
  try {
    const { farm_id, image_url, crop_type, diagnosis, confidence, severity, recommendation } = req.body
    if (!crop_type || !diagnosis) return res.status(400).json({ error: 'Required fields missing.' })
    const id = crypto.randomUUID()
    const rows = await sql`
      INSERT INTO crop_diagnoses (id, farm_id, image_url, crop_type, diagnosis, confidence, severity, recommendation)
      VALUES (${id}, ${farm_id||null}, ${image_url||null}, ${crop_type}, ${diagnosis}, ${Number(confidence)||0}, ${severity||'low'}, ${recommendation||''})
      RETURNING *`

    // Add to admin queue for review
    const qid = crypto.randomUUID()
    await sql`
      INSERT INTO admin_queue_items (id, type, ref_id, title, submitted_by, priority)
      VALUES (${qid}, 'ai_scan_review', ${id}, ${'AI Scan: ' + crop_type}, ${'System'}, 'low')`

    res.status(201).json({ diagnosis: rows[0] })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

// ══════════════════════════════════════════════════════════════════════════════
// FARM DIARY
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/diary', requireAuth, async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM farm_diary_entries ORDER BY date DESC, created_at DESC`
    res.json({ entries: rows })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

app.post('/api/diary', requireAuth, async (req, res) => {
  try {
    const { farm_id, date, activity, notes, weather } = req.body
    if (!date || !activity || !notes) return res.status(400).json({ error: 'Required fields missing.' })
    const id = crypto.randomUUID()
    const rows = await sql`
      INSERT INTO farm_diary_entries (id, farm_id, date, activity, notes, weather)
      VALUES (${id}, ${farm_id||null}, ${date}, ${activity}, ${notes}, ${weather||null})
      RETURNING *`
    res.status(201).json({ entry: rows[0] })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

app.delete('/api/diary/:id', requireAuth, async (req, res) => {
  try {
    await sql`DELETE FROM farm_diary_entries WHERE id = ${req.params.id}`
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

// ══════════════════════════════════════════════════════════════════════════════
// APPLICATIONS (contact / inquiries)
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/applications', requireAuth, async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM applications ORDER BY created_at DESC`
    res.json({ applications: rows })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

app.post('/api/applications', async (req, res) => {
  try {
    const { type, full_name, email, phone, city, message, subject, property_id, property_title, interest_type, budget, crop_type, farm_size_ha, challenge } = req.body
    if (!full_name || !email || !phone || !message) return res.status(400).json({ error: 'Required fields missing.' })
    const id = crypto.randomUUID()
    const rows = await sql`
      INSERT INTO applications (id, type, full_name, email, phone, city, message, subject, property_id, property_title, interest_type, budget, crop_type, farm_size_ha, challenge)
      VALUES (${id}, ${type||'general_contact'}, ${full_name.trim()}, ${email.toLowerCase().trim()}, ${phone.trim()},
              ${city||null}, ${message.trim()}, ${subject||null}, ${property_id||null}, ${property_title||null},
              ${interest_type||null}, ${budget ? Number(budget) : null}, ${crop_type||null},
              ${farm_size_ha ? Number(farm_size_ha) : null}, ${challenge||null})
      RETURNING *`
    res.status(201).json({ application: rows[0] })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

app.patch('/api/applications/:id', requireAuth, async (req, res) => {
  try {
    const { status, admin_notes } = req.body
    const rows = await sql`
      UPDATE applications SET
        status = COALESCE(${status||null}, status),
        admin_notes = COALESCE(${admin_notes||null}, admin_notes)
      WHERE id = ${req.params.id} RETURNING *`
    if (!rows[0]) return res.status(404).json({ error: 'Not found.' })
    res.json({ application: rows[0] })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN QUEUE
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/admin/queue', requireAuth, async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM admin_queue_items ORDER BY created_at DESC`
    res.json({ items: rows })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

app.patch('/api/admin/queue/:id', requireAuth, async (req, res) => {
  try {
    const { status } = req.body
    const rows = await sql`
      UPDATE admin_queue_items SET status = ${status} WHERE id = ${req.params.id} RETURNING *`
    if (!rows[0]) return res.status(404).json({ error: 'Not found.' })
    res.json({ item: rows[0] })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

// ══════════════════════════════════════════════════════════════════════════════
// OVERVIEW STATS
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/stats', requireAuth, async (req, res) => {
  try {
    const [propCount] = await sql`SELECT COUNT(*) FROM properties`
    const [farmCount] = await sql`SELECT COUNT(*) FROM farms`
    const [agentCount] = await sql`SELECT COUNT(*) FROM profiles WHERE role = 'agent'`
    const [fraudCount] = await sql`SELECT COUNT(*) FROM admin_queue_items WHERE type = 'fraud_report' AND status = 'pending'`
    const [pendingQueue] = await sql`SELECT COUNT(*) FROM admin_queue_items WHERE status = 'pending'`
    const recent = await sql`SELECT * FROM properties ORDER BY created_at DESC LIMIT 4`
    res.json({
      properties: Number(propCount.count),
      farms:      Number(farmCount.count),
      agents:     Number(agentCount.count),
      fraud:      Number(fraudCount.count),
      pendingQueue: Number(pendingQueue.count),
      recentProperties: recent,
    })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error.' }) }
})

app.get('/health', (_, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`ShieldNet API running on port ${PORT}`))
