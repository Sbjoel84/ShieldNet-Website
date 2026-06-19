import {
  collection, doc,
  getDocs, getDoc, getCountFromServer,
  setDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit,
} from 'firebase/firestore'
import { db } from './firebase'
import type {
  Property, Farm, MarketPrice, CropDiagnosis,
  FarmDiaryEntry, AdminQueueItem, Application, Profile,
} from './types'

// ── helpers ───────────────────────────────────────────────────────────────────

function col(name: string) { return collection(db, name) }

function snap<T>(s: { docs: Array<{ id: string; data(): object }> }): T[] {
  return s.docs.map(d => ({ id: d.id, ...d.data() })) as T[]
}

function newId(): string {
  return crypto.randomUUID()
}

// ── PROFILES ──────────────────────────────────────────────────────────────────

export async function getProfile(uid: string): Promise<Profile | null> {
  const snap = await getDoc(doc(db, 'profiles', uid))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Profile
}

export async function createAgentProfile(uid: string, data: {
  email: string
  full_name: string
  phone: string
  city: string
  agency_name?: string
  bio?: string
}): Promise<Profile> {
  const raw: Record<string, unknown> = {
    id:           uid,
    email:        data.email.toLowerCase().trim(),
    full_name:    data.full_name.trim(),
    phone:        data.phone.trim(),
    role:         'agent',
    city:         data.city,
    shield_score: 0,
    verified:     false,
    created_at:   new Date().toISOString(),
  }
  if (data.agency_name?.trim()) raw.agency_name = data.agency_name.trim()
  if (data.bio?.trim())         raw.bio          = data.bio.trim()
  // Firestore rejects undefined values — only write defined fields
  await setDoc(doc(db, 'profiles', uid), raw)

  // Queue the agent for admin approval
  const qid = newId()
  await setDoc(doc(db, 'admin_queue_items', qid), {
    id:           qid,
    type:         'agent_approval',
    ref_id:       uid,
    title:        `New Agent: ${data.full_name}`,
    submitted_by: data.email,
    status:       'pending',
    priority:     'high',
    created_at:   raw.created_at,
    agent_city:   data.city,
    agency_name:  data.agency_name?.trim() || '',
    agent_phone:  data.phone,
  })

  return raw as unknown as Profile
}

export async function approveAgent(profileId: string): Promise<void> {
  await updateDoc(doc(db, 'profiles', profileId), { verified: true })
}

export async function rejectAgent(profileId: string): Promise<void> {
  await updateDoc(doc(db, 'profiles', profileId), { verified: false, role: 'public' })
}

export async function getAgents(): Promise<Profile[]> {
  const s = await getDocs(query(col('profiles'), where('role', '==', 'agent')))
  return snap<Profile>(s)
}

// ── READS ─────────────────────────────────────────────────────────────────────

export async function getProperties(): Promise<Property[]> {
  const s = await getDocs(query(col('properties'), orderBy('created_at', 'desc')))
  return snap<Property>(s)
}

export async function getFarms(): Promise<Farm[]> {
  const s = await getDocs(query(col('farms'), orderBy('created_at', 'desc')))
  return snap<Farm>(s)
}

export async function getMarketPrices(): Promise<MarketPrice[]> {
  const s = await getDocs(query(col('market_prices'), orderBy('city'), orderBy('crop_name')))
  return snap<MarketPrice>(s)
}

export async function getDiagnoses(): Promise<CropDiagnosis[]> {
  const s = await getDocs(query(col('crop_diagnoses'), orderBy('created_at', 'desc')))
  return snap<CropDiagnosis>(s)
}

export async function getDiaryEntries(): Promise<FarmDiaryEntry[]> {
  const s = await getDocs(query(col('farm_diary_entries'), orderBy('date', 'desc')))
  return snap<FarmDiaryEntry>(s)
}

export async function getAdminQueue(): Promise<AdminQueueItem[]> {
  const s = await getDocs(query(col('admin_queue_items'), orderBy('created_at', 'desc')))
  return snap<AdminQueueItem>(s)
}

export async function getApplications(): Promise<Application[]> {
  const s = await getDocs(query(col('applications'), orderBy('created_at', 'desc')))
  return snap<Application>(s)
}

export interface Stats {
  properties: number
  farms: number
  agents: number
  fraud: number
  pendingQueue: number
  recentProperties: Property[]
}

export async function getStats(): Promise<Stats> {
  const [propCount, farmCount, agentCount, fraudCount, pendingCount, recentSnap] =
    await Promise.all([
      getCountFromServer(col('properties')),
      getCountFromServer(col('farms')),
      getCountFromServer(query(col('profiles'), where('role', '==', 'agent'))),
      getCountFromServer(query(col('admin_queue_items'), where('type', '==', 'fraud_report'), where('status', '==', 'pending'))),
      getCountFromServer(query(col('admin_queue_items'), where('status', '==', 'pending'))),
      getDocs(query(col('properties'), orderBy('created_at', 'desc'), limit(4))),
    ])
  return {
    properties:       propCount.data().count,
    farms:            farmCount.data().count,
    agents:           agentCount.data().count,
    fraud:            fraudCount.data().count,
    pendingQueue:     pendingCount.data().count,
    recentProperties: snap<Property>(recentSnap),
  }
}

// ── PROPERTIES ────────────────────────────────────────────────────────────────

export async function addProperty(data: Partial<Property> & { agent_id: string; agent_name: string }): Promise<Property> {
  const id = newId()
  const property: Property = {
    id,
    title:              data.title ?? '',
    description:        data.description ?? '',
    price:              Number(data.price ?? 0),
    property_type:      data.property_type ?? 'house',
    city:               data.city ?? 'Abuja',
    address:            data.address ?? '',
    lat:                Number(data.lat ?? 0),
    lng:                Number(data.lng ?? 0),
    photos:             (data.photos as string[]) ?? [],
    title_doc_url:      data.title_doc_url ?? undefined,
    status:             'pending',
    shield_verified:    false,
    fraud_report_count: 0,
    agent_id:           data.agent_id,
    agent_name:         data.agent_name,
    bedrooms:           data.bedrooms ? Number(data.bedrooms) : undefined,
    bathrooms:          data.bathrooms ? Number(data.bathrooms) : undefined,
    area_sqm:           data.area_sqm ? Number(data.area_sqm) : undefined,
    created_at:         new Date().toISOString(),
  }
  await setDoc(doc(db, 'properties', id), property)
  return property
}

export async function updateProperty(id: string, data: Partial<Property>): Promise<Property> {
  const ref = doc(db, 'properties', id)
  const update: Record<string, unknown> = {}
  const fields = ['title','description','price','property_type','city','address','status','shield_verified','bedrooms','bathrooms','area_sqm'] as const
  for (const k of fields) {
    if (data[k] !== undefined) update[k] = data[k]
  }
  await updateDoc(ref, update)
  const s = await getDocs(query(col('properties'), where('__name__', '==', id)))
  return snap<Property>(s)[0]
}

export async function deleteProperty(id: string): Promise<void> {
  await deleteDoc(doc(db, 'properties', id))
}

// ── DIAGNOSES ─────────────────────────────────────────────────────────────────

export async function addDiagnosis(data: {
  farm_id: string | null
  image_url: string | null
  crop_type: string
  diagnosis: string
  confidence: number
  severity: 'low' | 'medium' | 'high'
  recommendation: string
}): Promise<CropDiagnosis> {
  const id = newId()
  const diag: CropDiagnosis = {
    id,
    farm_id:        data.farm_id ?? '',
    image_url:      data.image_url ?? '',
    crop_type:      data.crop_type,
    diagnosis:      data.diagnosis,
    confidence:     data.confidence,
    severity:       data.severity,
    recommendation: data.recommendation,
    status:         'pending',
    created_at:     new Date().toISOString(),
  }
  await setDoc(doc(db, 'crop_diagnoses', id), diag)

  // add to admin queue for review
  const qid = newId()
  await setDoc(doc(db, 'admin_queue_items', qid), {
    id: qid, type: 'ai_scan_review', ref_id: id,
    title: `AI Scan: ${data.crop_type}`, submitted_by: 'System',
    status: 'pending', priority: 'low', created_at: new Date().toISOString(),
  })
  return diag
}

// ── FARM DIARY ────────────────────────────────────────────────────────────────

export async function addDiaryEntry(data: {
  farm_id: string
  date: string
  activity: string
  notes: string
  weather?: string
}): Promise<FarmDiaryEntry> {
  const id = newId()
  const entry: FarmDiaryEntry = {
    id,
    farm_id:    data.farm_id,
    date:       data.date,
    activity:   data.activity,
    notes:      data.notes,
    weather:    data.weather,
    created_at: new Date().toISOString(),
  }
  await setDoc(doc(db, 'farm_diary_entries', id), entry)
  return entry
}

// ── ADMIN QUEUE ───────────────────────────────────────────────────────────────

export async function updateQueueItem(id: string, status: AdminQueueItem['status']): Promise<AdminQueueItem> {
  const ref = doc(db, 'admin_queue_items', id)
  await updateDoc(ref, { status })
  const s = await getDocs(query(col('admin_queue_items'), where('__name__', '==', id)))
  return snap<AdminQueueItem>(s)[0]
}

// ── APPLICATIONS ──────────────────────────────────────────────────────────────

export async function addApplication(data: Partial<Application> & { full_name: string; email: string; phone: string; message: string }): Promise<Application> {
  const id = newId()
  const app: Application = {
    id,
    type:           data.type ?? 'general_contact',
    full_name:      data.full_name.trim(),
    email:          data.email.toLowerCase().trim(),
    phone:          data.phone.trim(),
    city:           data.city,
    message:        data.message.trim(),
    status:         'new',
    priority:       data.priority ?? 'medium',
    created_at:     new Date().toISOString(),
    property_id:    data.property_id,
    property_title: data.property_title,
    interest_type:  data.interest_type,
    budget:         data.budget ? Number(data.budget) : undefined,
    crop_type:      data.crop_type,
    farm_size_ha:   data.farm_size_ha ? Number(data.farm_size_ha) : undefined,
    challenge:      data.challenge,
    subject:        data.subject,
    admin_notes:    undefined,
  }
  await setDoc(doc(db, 'applications', id), app)
  return app
}

export async function updateApplication(
  id: string,
  updates: { status?: Application['status']; admin_notes?: string },
): Promise<Application> {
  const ref = doc(db, 'applications', id)
  const patch: Record<string, unknown> = {}
  if (updates.status      !== undefined) patch.status      = updates.status
  if (updates.admin_notes !== undefined) patch.admin_notes = updates.admin_notes
  await updateDoc(ref, patch)
  const s = await getDocs(query(col('applications'), where('__name__', '==', id)))
  return snap<Application>(s)[0]
}
