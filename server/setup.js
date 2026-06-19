import 'dotenv/config'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

// ── Schema ────────────────────────────────────────────────────────────────────

async function createTables() {
  console.log('Creating tables…')

  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      id            TEXT PRIMARY KEY,
      email         TEXT UNIQUE NOT NULL,
      full_name     TEXT NOT NULL,
      phone         TEXT,
      role          TEXT NOT NULL DEFAULT 'public',
      city          TEXT,
      shield_score  INTEGER DEFAULT 0,
      avatar_url    TEXT,
      verified      BOOLEAN DEFAULT false,
      password_hash TEXT,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )`

  await sql`
    CREATE TABLE IF NOT EXISTS properties (
      id                  TEXT PRIMARY KEY,
      title               TEXT NOT NULL,
      description         TEXT,
      price               NUMERIC NOT NULL,
      property_type       TEXT DEFAULT 'house',
      city                TEXT,
      address             TEXT,
      lat                 NUMERIC,
      lng                 NUMERIC,
      photos              TEXT[] DEFAULT '{}',
      title_doc_url       TEXT,
      status              TEXT DEFAULT 'pending',
      shield_verified     BOOLEAN DEFAULT false,
      fraud_report_count  INTEGER DEFAULT 0,
      agent_id            TEXT,
      agent_name          TEXT,
      bedrooms            INTEGER,
      bathrooms           INTEGER,
      area_sqm            NUMERIC,
      created_at          TIMESTAMPTZ DEFAULT NOW()
    )`

  await sql`
    CREATE TABLE IF NOT EXISTS farms (
      id             TEXT PRIMARY KEY,
      owner_id       TEXT,
      owner_name     TEXT,
      name           TEXT NOT NULL,
      location       TEXT,
      city           TEXT,
      lat            NUMERIC,
      lng            NUMERIC,
      crop_type      TEXT,
      area_hectares  NUMERIC DEFAULT 0,
      created_at     TIMESTAMPTZ DEFAULT NOW()
    )`

  await sql`
    CREATE TABLE IF NOT EXISTS market_prices (
      id              TEXT PRIMARY KEY,
      crop_name       TEXT NOT NULL,
      price_per_kg    NUMERIC NOT NULL,
      market          TEXT,
      city            TEXT,
      trend           TEXT DEFAULT 'stable',
      change_percent  NUMERIC DEFAULT 0,
      updated_at      TIMESTAMPTZ DEFAULT NOW()
    )`

  await sql`
    CREATE TABLE IF NOT EXISTS crop_diagnoses (
      id              TEXT PRIMARY KEY,
      farm_id         TEXT,
      image_url       TEXT,
      crop_type       TEXT NOT NULL,
      diagnosis       TEXT NOT NULL,
      confidence      NUMERIC DEFAULT 0,
      severity        TEXT DEFAULT 'low',
      recommendation  TEXT,
      status          TEXT DEFAULT 'pending',
      created_at      TIMESTAMPTZ DEFAULT NOW()
    )`

  await sql`
    CREATE TABLE IF NOT EXISTS farm_diary_entries (
      id          TEXT PRIMARY KEY,
      farm_id     TEXT,
      date        TEXT NOT NULL,
      activity    TEXT NOT NULL,
      notes       TEXT NOT NULL,
      weather     TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )`

  await sql`
    CREATE TABLE IF NOT EXISTS admin_queue_items (
      id            TEXT PRIMARY KEY,
      type          TEXT NOT NULL,
      ref_id        TEXT,
      title         TEXT,
      submitted_by  TEXT,
      status        TEXT DEFAULT 'pending',
      priority      TEXT DEFAULT 'medium',
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )`

  await sql`
    CREATE TABLE IF NOT EXISTS applications (
      id              TEXT PRIMARY KEY,
      type            TEXT DEFAULT 'general_contact',
      full_name       TEXT NOT NULL,
      email           TEXT NOT NULL,
      phone           TEXT NOT NULL,
      city            TEXT,
      message         TEXT NOT NULL,
      subject         TEXT,
      status          TEXT DEFAULT 'new',
      priority        TEXT DEFAULT 'medium',
      property_id     TEXT,
      property_title  TEXT,
      interest_type   TEXT,
      budget          NUMERIC,
      crop_type       TEXT,
      farm_size_ha    NUMERIC,
      challenge       TEXT,
      admin_notes     TEXT,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    )`

  await sql`
    CREATE TABLE IF NOT EXISTS listing_submissions (
      id              TEXT PRIMARY KEY,
      agent_name      TEXT NOT NULL,
      agent_email     TEXT NOT NULL,
      agent_phone     TEXT NOT NULL,
      agency_name     TEXT,
      title           TEXT NOT NULL,
      description     TEXT NOT NULL,
      property_type   TEXT DEFAULT 'house',
      city            TEXT,
      address         TEXT NOT NULL,
      price           NUMERIC NOT NULL,
      bedrooms        INTEGER,
      bathrooms       INTEGER,
      area_sqm        NUMERIC,
      has_title_doc   BOOLEAN DEFAULT false,
      extra_notes     TEXT,
      status          TEXT DEFAULT 'pending',
      admin_notes     TEXT,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    )`

  console.log('Tables ready.')
}

// ── Seed data ─────────────────────────────────────────────────────────────────

async function seedAgentProfiles() {
  const profiles = [
    { id: 'agent-001',  email: 'emeka.okafor@shieldnet.ng',       full_name: 'Emeka Okafor',       phone: '+234 803 100 0001', role: 'agent',  city: 'Abuja' },
    { id: 'agent-002',  email: 'fatima.abdullahi@shieldnet.ng',   full_name: 'Fatima Abdullahi',   phone: '+234 803 100 0002', role: 'agent',  city: 'Abuja' },
    { id: 'agent-003',  email: 'oluwaseun.adeyemi@shieldnet.ng',  full_name: 'Oluwaseun Adeyemi',  phone: '+234 803 100 0003', role: 'agent',  city: 'Abuja' },
    { id: 'agent-004',  email: 'chidinma.eze@shieldnet.ng',       full_name: 'Chidinma Eze',       phone: '+234 803 100 0004', role: 'agent',  city: 'Lagos' },
    { id: 'agent-005',  email: 'babatunde.ogundimu@shieldnet.ng', full_name: 'Babatunde Ogundimu', phone: '+234 803 100 0005', role: 'agent',  city: 'Lagos' },
    { id: 'farmer-001', email: 'musa.ibrahim@shieldnet.ng',       full_name: 'Musa Ibrahim',       phone: '+234 803 200 0001', role: 'farmer', city: 'Abuja' },
    { id: 'farmer-002', email: 'ngozi.obi@shieldnet.ng',          full_name: 'Ngozi Obi',          phone: '+234 803 200 0002', role: 'farmer', city: 'Abuja' },
    { id: 'farmer-003', email: 'adebayo.ola@shieldnet.ng',        full_name: 'Adebayo Ola',        phone: '+234 803 200 0003', role: 'farmer', city: 'Lagos' },
    { id: 'farmer-004', email: 'hauwa.garba@shieldnet.ng',        full_name: 'Hauwa Garba',        phone: '+234 803 200 0004', role: 'farmer', city: 'Abuja' },
    { id: 'farmer-005', email: 'chukwuemeka.nwosu@shieldnet.ng',  full_name: 'Chukwuemeka Nwosu',  phone: '+234 803 200 0005', role: 'farmer', city: 'Lagos' },
  ]
  for (const p of profiles) {
    await sql`
      INSERT INTO profiles (id, email, full_name, phone, role, city, password_hash)
      VALUES (${p.id}, ${p.email}, ${p.full_name}, ${p.phone}, ${p.role}, ${p.city}, 'seed-no-login')
      ON CONFLICT (id) DO NOTHING`
  }
  console.log(`Seeded ${profiles.length} agent/farmer profiles.`)
}

async function seedProperties() {
  const rows = [
    { id:'prop-001', title:'4-Bedroom Duplex in Maitama',        description:'Luxury fully-detached duplex in the heart of Maitama. Recently renovated with modern finishes, 24/7 power supply and BQ quarters.',              price:180000000, property_type:'house',      city:'Abuja', address:'12 Aguiyi Ironsi Street, Maitama, Abuja',          lat:9.082,  lng:7.4891, photos:['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format'], title_doc_url:'#', status:'approved', shield_verified:true,  fraud_report_count:0, agent_id:'agent-001', agent_name:'Emeka Okafor',       bedrooms:4, bathrooms:4, area_sqm:450,  created_at:'2025-12-01T10:00:00Z' },
    { id:'prop-002', title:'Prime 1,000 sqm Land in Jabi',       description:'1,000 sqm bare land with C of O. Perfect for residential or commercial development in fast-growing Jabi District.',                              price:75000000,  property_type:'land',       city:'Abuja', address:'Plot 45, Jabi District, Abuja',                    lat:9.0647, lng:7.4333, photos:['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format'], title_doc_url:'#', status:'approved', shield_verified:true,  fraud_report_count:0, agent_id:'agent-002', agent_name:'Fatima Abdullahi',   bedrooms:null, bathrooms:null, area_sqm:1000, created_at:'2025-12-05T14:00:00Z' },
    { id:'prop-003', title:'3-Bedroom Apartment, Wuse II',       description:'Well-maintained 3rd-floor apartment in an estate with gym, swimming pool, and 24/7 estate security.',                                            price:45000000,  property_type:'apartment',  city:'Abuja', address:'Block C, Zenith Estate, Wuse II, Abuja',           lat:9.0705, lng:7.4883, photos:['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format'], title_doc_url:null, status:'approved', shield_verified:true, fraud_report_count:1, agent_id:'agent-001', agent_name:'Emeka Okafor',       bedrooms:3, bathrooms:2, area_sqm:180,  created_at:'2025-12-10T09:00:00Z' },
    { id:'prop-004', title:'Commercial Plaza — Garki',           description:'5-storey commercial building generating ₦2.5M monthly rental income. All title documents intact.',                                              price:650000000, property_type:'commercial', city:'Abuja', address:'7 Ibrahim Babangida Way, Garki, Abuja',            lat:9.0574, lng:7.4801, photos:['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&auto=format'], title_doc_url:'#', status:'pending',  shield_verified:false, fraud_report_count:0, agent_id:'agent-003', agent_name:'Oluwaseun Adeyemi',  bedrooms:null, bathrooms:null, area_sqm:2400, created_at:'2026-01-03T11:00:00Z' },
    { id:'prop-005', title:'5-Bedroom Waterfront Mansion, Lekki',description:'Stunning waterfront property with private jetty, smart-home automation, cinema room, and infinity pool.',                                        price:850000000, property_type:'house',      city:'Lagos', address:'3 Admiralty Way, Lekki Phase 1, Lagos',            lat:6.4282, lng:3.539,  photos:['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format'], title_doc_url:'#', status:'approved', shield_verified:true,  fraud_report_count:0, agent_id:'agent-004', agent_name:'Chidinma Eze',       bedrooms:5, bathrooms:6, area_sqm:950,  created_at:'2025-11-20T08:00:00Z' },
    { id:'prop-006', title:'2-Bedroom Serviced Flat, Victoria Island', description:'Fully serviced apartment in the heart of VI. 24/7 concierge, backup generator, covered parking.',                                         price:35000000,  property_type:'apartment',  city:'Lagos', address:'15 Akin Adesola Street, Victoria Island, Lagos',   lat:6.4281, lng:3.4219, photos:['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format'], title_doc_url:null, status:'approved', shield_verified:true, fraud_report_count:0, agent_id:'agent-004', agent_name:'Chidinma Eze',       bedrooms:2, bathrooms:2, area_sqm:120,  created_at:'2025-11-25T13:00:00Z' },
    { id:'prop-007', title:'Industrial Land — Ikeja',            description:'2,500 sqm fenced land inside Ikeja Industrial Estate. Ideal for warehouse, logistics, or manufacturing.',                                        price:120000000, property_type:'land',       city:'Lagos', address:'Plot 88, Ikeja Industrial Estate, Lagos',          lat:6.5944, lng:3.3322, photos:['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format'], title_doc_url:null, status:'approved', shield_verified:false, fraud_report_count:2, agent_id:'agent-005', agent_name:'Babatunde Ogundimu', bedrooms:null, bathrooms:null, area_sqm:2500, created_at:'2025-12-15T10:00:00Z' },
    { id:'prop-008', title:'3-Bedroom Terrace, Ikoyi',           description:'Modern terrace house in serene Ikoyi. Two covered parking spaces, BQ and manicured garden.',                                                    price:280000000, property_type:'house',      city:'Lagos', address:'22 Norman Williams Street, Ikoyi, Lagos',          lat:6.453,  lng:3.4419, photos:['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format'], title_doc_url:'#', status:'approved', shield_verified:true,  fraud_report_count:0, agent_id:'agent-005', agent_name:'Babatunde Ogundimu', bedrooms:3, bathrooms:3, area_sqm:320,  created_at:'2026-01-10T09:00:00Z' },
  ]

  for (const p of rows) {
    await sql`
      INSERT INTO properties
        (id,title,description,price,property_type,city,address,lat,lng,photos,title_doc_url,status,shield_verified,fraud_report_count,agent_id,agent_name,bedrooms,bathrooms,area_sqm,created_at)
      VALUES
        (${p.id},${p.title},${p.description},${p.price},${p.property_type},${p.city},${p.address},${p.lat},${p.lng},${p.photos},${p.title_doc_url},${p.status},${p.shield_verified},${p.fraud_report_count},${p.agent_id},${p.agent_name},${p.bedrooms},${p.bathrooms},${p.area_sqm},${p.created_at})
      ON CONFLICT (id) DO NOTHING`
  }
  console.log(`Seeded ${rows.length} properties.`)
}

async function seedFarms() {
  const rows = [
    { id:'farm-001', owner_id:'farmer-001', owner_name:'Musa Ibrahim',       name:'Ibrahim Family Farm',  location:'Kubwa, Abuja',       city:'Abuja', lat:9.1619, lng:7.3246, crop_type:'Maize',              area_hectares:5.2,  created_at:'2025-08-01T10:00:00Z' },
    { id:'farm-002', owner_id:'farmer-002', owner_name:'Ngozi Obi',          name:'Obi Vegetable Farm',   location:'Bwari, Abuja',        city:'Abuja', lat:9.1572, lng:7.3896, crop_type:'Tomatoes & Peppers', area_hectares:2.8,  created_at:'2025-09-15T08:00:00Z' },
    { id:'farm-003', owner_id:'farmer-003', owner_name:'Adebayo Ola',        name:'Ola Rice Fields',      location:'Badagry, Lagos',      city:'Lagos', lat:6.4176, lng:2.8898, crop_type:'Rice',               area_hectares:12.5, created_at:'2025-07-20T11:00:00Z' },
    { id:'farm-004', owner_id:'farmer-004', owner_name:'Hauwa Garba',        name:'Garba Cassava Farm',   location:'Gwagwalada, Abuja',   city:'Abuja', lat:8.9432, lng:7.0786, crop_type:'Cassava',            area_hectares:8.0,  created_at:'2025-08-30T14:00:00Z' },
    { id:'farm-005', owner_id:'farmer-005', owner_name:'Chukwuemeka Nwosu',  name:'Nwosu Plantain Grove', location:'Ibeju-Lekki, Lagos',  city:'Lagos', lat:6.445,  lng:3.8734, crop_type:'Plantain & Banana',  area_hectares:6.3,  created_at:'2025-10-10T09:00:00Z' },
  ]

  for (const f of rows) {
    await sql`
      INSERT INTO farms (id,owner_id,owner_name,name,location,city,lat,lng,crop_type,area_hectares,created_at)
      VALUES (${f.id},${f.owner_id},${f.owner_name},${f.name},${f.location},${f.city},${f.lat},${f.lng},${f.crop_type},${f.area_hectares},${f.created_at})
      ON CONFLICT (id) DO NOTHING`
  }
  console.log(`Seeded ${rows.length} farms.`)
}

async function seedMarketPrices() {
  const rows = [
    { id:'mp-001', crop_name:'Maize',        price_per_kg:450,  market:'Garki Market',   city:'Abuja', trend:'up',     change_percent:3.2,   updated_at:'2026-04-17T06:00:00Z' },
    { id:'mp-002', crop_name:'Rice (Local)', price_per_kg:980,  market:'Wuse Market',    city:'Abuja', trend:'stable', change_percent:0.5,   updated_at:'2026-04-17T06:00:00Z' },
    { id:'mp-003', crop_name:'Yam',          price_per_kg:750,  market:'Dei-Dei Market', city:'Abuja', trend:'stable', change_percent:1.1,   updated_at:'2026-04-17T06:00:00Z' },
    { id:'mp-004', crop_name:'Groundnut',    price_per_kg:680,  market:'Garki Market',   city:'Abuja', trend:'down',   change_percent:-1.5,  updated_at:'2026-04-17T06:00:00Z' },
    { id:'mp-005', crop_name:'Tomatoes',     price_per_kg:1200, market:'Mile 12 Market', city:'Lagos', trend:'up',     change_percent:8.5,   updated_at:'2026-04-17T06:00:00Z' },
    { id:'mp-006', crop_name:'Cassava',      price_per_kg:180,  market:'Mushin Market',  city:'Lagos', trend:'down',   change_percent:-2.1,  updated_at:'2026-04-17T06:00:00Z' },
    { id:'mp-007', crop_name:'Plantain',     price_per_kg:320,  market:'Oshodi Market',  city:'Lagos', trend:'up',     change_percent:5.7,   updated_at:'2026-04-17T06:00:00Z' },
    { id:'mp-008', crop_name:'Peppers',      price_per_kg:2100, market:'Mile 12 Market', city:'Lagos', trend:'up',     change_percent:12.3,  updated_at:'2026-04-17T06:00:00Z' },
  ]

  for (const m of rows) {
    await sql`
      INSERT INTO market_prices (id,crop_name,price_per_kg,market,city,trend,change_percent,updated_at)
      VALUES (${m.id},${m.crop_name},${m.price_per_kg},${m.market},${m.city},${m.trend},${m.change_percent},${m.updated_at})
      ON CONFLICT (id) DO NOTHING`
  }
  console.log(`Seeded ${rows.length} market prices.`)
}

async function seedDiagnoses() {
  const rows = [
    { id:'diag-001', farm_id:'farm-001', image_url:'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format', crop_type:'Maize',    diagnosis:'Northern Leaf Blight',             confidence:87, severity:'medium', recommendation:'Apply Mancozeb 80% WP at 2.5 kg/ha. Improve plant spacing for better air circulation. Re-inspect in 7 days.',              status:'reviewed', created_at:'2026-04-10T08:00:00Z' },
    { id:'diag-002', farm_id:'farm-002', image_url:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format', crop_type:'Tomatoes', diagnosis:'Early Blight (Alternaria solani)', confidence:91, severity:'high',   recommendation:'Remove and destroy infected leaves immediately. Apply Chlorothalonil fungicide every 7 days for 3 weeks.',                      status:'pending',  created_at:'2026-04-15T10:00:00Z' },
  ]

  for (const d of rows) {
    await sql`
      INSERT INTO crop_diagnoses (id,farm_id,image_url,crop_type,diagnosis,confidence,severity,recommendation,status,created_at)
      VALUES (${d.id},${d.farm_id},${d.image_url},${d.crop_type},${d.diagnosis},${d.confidence},${d.severity},${d.recommendation},${d.status},${d.created_at})
      ON CONFLICT (id) DO NOTHING`
  }
  console.log(`Seeded ${rows.length} diagnoses.`)
}

async function seedDiary() {
  const rows = [
    { id:'d-001', farm_id:'farm-001', date:'2026-04-15', activity:'Weeding',               notes:'Completed weeding of north field using manual tools.',            weather:'Sunny, 32°C',    created_at:'2026-04-15T16:00:00Z' },
    { id:'d-002', farm_id:'farm-001', date:'2026-04-12', activity:'Fertilizer Application', notes:'Applied NPK 15:15:15 at 200 kg/ha — top-dressed maize.',          weather:'Cloudy, 28°C',   created_at:'2026-04-12T14:00:00Z' },
    { id:'d-003', farm_id:'farm-001', date:'2026-04-08', activity:'Irrigation',             notes:'Drip irrigation for 4 hours. Soil moisture looks good.',           weather:'Hot, 35°C',      created_at:'2026-04-08T11:00:00Z' },
    { id:'d-004', farm_id:'farm-001', date:'2026-04-03', activity:'Pest Scouting',          notes:'Spotted fall armyworm on 3 rows. Will monitor closely.',           weather:'Partly cloudy',  created_at:'2026-04-03T09:00:00Z' },
    { id:'d-005', farm_id:'farm-002', date:'2026-04-14', activity:'Planting',               notes:'Transplanted 800 tomato seedlings from nursery to main field.',    weather:'Overcast, 26°C', created_at:'2026-04-14T07:30:00Z' },
  ]

  for (const e of rows) {
    await sql`
      INSERT INTO farm_diary_entries (id,farm_id,date,activity,notes,weather,created_at)
      VALUES (${e.id},${e.farm_id},${e.date},${e.activity},${e.notes},${e.weather},${e.created_at})
      ON CONFLICT (id) DO NOTHING`
  }
  console.log(`Seeded ${rows.length} diary entries.`)
}

async function seedAdminQueue() {
  const rows = [
    { id:'q-001', type:'property_approval', ref_id:'prop-004', title:'Commercial Plaza — Garki', submitted_by:'Oluwaseun Adeyemi', status:'pending', priority:'high',   created_at:'2026-01-03T11:00:00Z' },
    { id:'q-002', type:'ai_scan_review',    ref_id:'diag-002', title:'Tomato Early Blight Scan', submitted_by:'Ngozi Obi',         status:'pending', priority:'medium', created_at:'2026-04-15T10:00:00Z' },
    { id:'q-003', type:'fraud_report',      ref_id:'prop-007', title:'Ikeja Industrial Land',    submitted_by:'Anonymous',         status:'pending', priority:'high',   created_at:'2026-03-20T14:00:00Z' },
  ]

  for (const q of rows) {
    await sql`
      INSERT INTO admin_queue_items (id,type,ref_id,title,submitted_by,status,priority,created_at)
      VALUES (${q.id},${q.type},${q.ref_id},${q.title},${q.submitted_by},${q.status},${q.priority},${q.created_at})
      ON CONFLICT (id) DO NOTHING`
  }
  console.log(`Seeded ${rows.length} admin queue items.`)
}

async function seedApplications() {
  const rows = [
    { id:'app-001', type:'property_inquiry',  full_name:'Tunde Bakare',     email:'tunde.bakare@gmail.com', phone:'+234 803 111 2222', city:'Lagos', message:'I am interested in purchasing this property. Please contact me to arrange a viewing.', subject:null,                         status:'new',        priority:'high',   property_id:'prop-005', property_title:'5-Bedroom Waterfront Mansion, Lekki', interest_type:'buy',  budget:900000000, crop_type:null, farm_size_ha:null, challenge:null, admin_notes:null, created_at:'2026-04-16T09:15:00Z' },
    { id:'app-002', type:'property_inquiry',  full_name:'Amina Suleiman',   email:'amina.s@outlook.com',    phone:'+234 706 543 9870', city:'Abuja', message:'Looking to rent a 3-bedroom flat in Wuse or Maitama area. Budget is flexible.',       subject:null,                         status:'contacted',  priority:'medium', property_id:'prop-003', property_title:'3-Bedroom Apartment, Wuse II',         interest_type:'rent', budget:5000000,  crop_type:null, farm_size_ha:null, challenge:null, admin_notes:'Called on 15 Apr. She wants to inspect on Saturday.', created_at:'2026-04-14T14:30:00Z' },
    { id:'app-003', type:'farm_consultation', full_name:'Emmanuel Okeke',   email:'emma.okeke@yahoo.com',   phone:'+234 812 765 4321', city:'Abuja', message:'My maize farm has been hit by a disease I cannot identify. I need expert help urgently.', subject:null,                        status:'processing', priority:'high',   property_id:null, property_title:null, interest_type:null, budget:null, crop_type:'Maize', farm_size_ha:4.5, challenge:'Unknown disease causing leaf discolouration', admin_notes:'Sent AI diagnosis request. Awaiting agronomist review.', created_at:'2026-04-15T08:00:00Z' },
    { id:'app-004', type:'general_contact',   full_name:'Grace Nwosu',      email:'grace.n@company.ng',     phone:'+234 901 234 5678', city:'Lagos', message:'We are a cooperative society looking to list 12 properties across Lagos.',              subject:'Bulk Property Listing Partnership', status:'new', priority:'high',   property_id:null, property_title:null, interest_type:null, budget:null, crop_type:null, farm_size_ha:null, challenge:null, admin_notes:null, created_at:'2026-04-17T07:45:00Z' },
    { id:'app-005', type:'farm_consultation', full_name:'Ibrahim Danladi',  email:'ibrahim.d@gmail.com',    phone:'+234 805 678 9012', city:'Abuja', message:'I want to start a 10-hectare cassava farm and need guidance on best practices.',        subject:null,                         status:'new',        priority:'medium', property_id:null, property_title:null, interest_type:null, budget:null, crop_type:'Cassava', farm_size_ha:10, challenge:'New farmer — needs end-to-end guidance', admin_notes:null, created_at:'2026-04-17T10:00:00Z' },
  ]

  for (const a of rows) {
    await sql`
      INSERT INTO applications
        (id,type,full_name,email,phone,city,message,subject,status,priority,property_id,property_title,interest_type,budget,crop_type,farm_size_ha,challenge,admin_notes,created_at)
      VALUES
        (${a.id},${a.type},${a.full_name},${a.email},${a.phone},${a.city},${a.message},${a.subject},${a.status},${a.priority},${a.property_id},${a.property_title},${a.interest_type},${a.budget},${a.crop_type},${a.farm_size_ha},${a.challenge},${a.admin_notes},${a.created_at})
      ON CONFLICT (id) DO NOTHING`
  }
  console.log(`Seeded ${rows.length} applications.`)
}

// ── Run ───────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL not set. Add it to server/.env')
    process.exit(1)
  }

  try {
    await createTables()
    await seedAgentProfiles()
    await seedProperties()
    await seedFarms()
    await seedMarketPrices()
    await seedDiagnoses()
    await seedDiary()
    await seedAdminQueue()
    await seedApplications()
    console.log('\n✅  Database setup complete! All tables created and data seeded.')
  } catch (err) {
    console.error('Setup failed:', err.message)
    process.exit(1)
  }
}

main()
