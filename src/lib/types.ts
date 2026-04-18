export type UserRole = 'admin' | 'agent' | 'farmer' | 'public'
export type City = 'Abuja' | 'Lagos'

export interface Profile {
  id: string
  email: string
  full_name: string
  phone?: string
  role: UserRole
  shield_score: number
  avatar_url?: string
  city?: City
  verified: boolean
  created_at: string
}

export type PropertyType = 'land' | 'house' | 'apartment' | 'commercial'
export type PropertyStatus = 'pending' | 'approved' | 'rejected' | 'flagged' | 'sold'

export interface Property {
  id: string
  title: string
  description: string
  price: number
  property_type: PropertyType
  city: City
  address: string
  lat: number
  lng: number
  photos: string[]
  title_doc_url?: string
  status: PropertyStatus
  shield_verified: boolean
  fraud_report_count: number
  agent_id: string
  agent_name: string
  bedrooms?: number
  bathrooms?: number
  area_sqm?: number
  created_at: string
}

export interface Farm {
  id: string
  owner_id: string
  owner_name: string
  name: string
  location: string
  city: City
  lat: number
  lng: number
  crop_type: string
  area_hectares: number
  created_at: string
}

export interface FarmDiaryEntry {
  id: string
  farm_id: string
  date: string
  activity: string
  notes: string
  weather?: string
  created_at: string
}

export interface CropDiagnosis {
  id: string
  farm_id: string
  image_url: string
  crop_type: string
  diagnosis: string
  confidence: number
  severity: 'low' | 'medium' | 'high'
  recommendation: string
  status: 'pending' | 'reviewed'
  created_at: string
}

export interface MarketPrice {
  id: string
  crop_name: string
  price_per_kg: number
  market: string
  city: City
  updated_at: string
  trend: 'up' | 'down' | 'stable'
  change_percent: number
}

export interface AdminQueueItem {
  id: string
  type: 'property_approval' | 'ai_scan_review' | 'fraud_report'
  ref_id: string
  title: string
  submitted_by: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  priority: 'low' | 'medium' | 'high'
}

export interface FraudReport {
  id: string
  property_id: string
  reporter_id: string
  reason: string
  details: string
  status: 'open' | 'investigating' | 'resolved'
  created_at: string
}

export type ApplicationType = 'property_inquiry' | 'farm_consultation' | 'general_contact'
export type ApplicationStatus = 'new' | 'contacted' | 'processing' | 'completed' | 'rejected'

export interface Application {
  id: string
  type: ApplicationType
  full_name: string
  email: string
  phone: string
  city?: City
  message: string
  status: ApplicationStatus
  priority: 'low' | 'medium' | 'high'
  created_at: string
  // property inquiry
  property_id?: string
  property_title?: string
  interest_type?: 'buy' | 'rent' | 'invest'
  budget?: number
  // farm consultation
  crop_type?: string
  farm_size_ha?: number
  challenge?: string
  // general
  subject?: string
  // admin notes
  admin_notes?: string
}
