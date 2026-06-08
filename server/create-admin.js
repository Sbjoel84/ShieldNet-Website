import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { neon } from '@neondatabase/serverless'

const EMAIL     = 'shieldnetcore@gmail.com'
const PASSWORD  = 'Admin@shieldnet'
const FULL_NAME = 'ShieldNet Admin'
const ROLE      = 'admin'

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL is not set. Add it to server/.env')
    process.exit(1)
  }

  const sql          = neon(process.env.DATABASE_URL)
  const password_hash = await bcrypt.hash(PASSWORD, 10)
  const id           = crypto.randomUUID()

  try {
    const existing = await sql`SELECT id, role FROM profiles WHERE email = ${EMAIL}`
    if (existing.length > 0) {
      console.log(`Account already exists (role: ${existing[0].role}). Updating password and setting role to admin…`)
      await sql`
        UPDATE profiles
        SET password_hash = ${password_hash}, role = 'admin'
        WHERE email = ${EMAIL}
      `
      console.log('Done. Password updated and role set to admin.')
      return
    }

    await sql`
      INSERT INTO profiles (id, email, full_name, role, password_hash, verified)
      VALUES (${id}, ${EMAIL}, ${FULL_NAME}, ${ROLE}, ${password_hash}, true)
    `
    console.log('Admin account created successfully.')
    console.log(`  Email: ${EMAIL}`)
    console.log(`  Role:  admin`)
  } catch (err) {
    console.error('Failed:', err.message)
    process.exit(1)
  }
}

main()
