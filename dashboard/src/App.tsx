import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { PublicLayout } from '@/components/public/PublicLayout'
import { AuthPage } from '@/components/auth/AuthPage'
import { Overview } from '@/components/dashboard/Overview'
import { ShieldFarm } from '@/components/shield-farm/ShieldFarm'
import { Properties } from '@/components/properties/Properties'
import { AITools } from '@/components/ai-tools/AITools'
import { AdminQueue } from '@/components/admin/AdminQueue'
import { LandingPage } from '@/components/public/LandingPage'
import { PublicProperties } from '@/components/public/PublicProperties'
import { PublicFarms } from '@/components/public/PublicFarms'
import { PublicAITools } from '@/components/public/PublicAITools'
import { AboutPage } from '@/components/public/AboutPage'
import { ContactPage } from '@/components/public/ContactPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground text-sm">Loading ShieldNet…</p>
      </div>
    </div>
  )
  return profile ? <>{children}</> : <Navigate to="/auth" replace />
}

function AppRoutes() {
  const { profile } = useAuth()
  return (
    <Routes>
      <Route path="/auth" element={profile ? <Navigate to="/dashboard" replace /> : <AuthPage />} />

      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/properties" element={<PublicProperties />} />
        <Route path="/farms" element={<PublicFarms />} />
        <Route path="/ai-tools" element={<PublicAITools />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      <Route
        path="/dashboard"
        element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
      >
        <Route index element={<Overview />} />
        <Route path="farms" element={<ShieldFarm />} />
        <Route path="properties" element={<Properties />} />
        <Route path="ai-tools" element={<AITools />} />
        <Route path="admin" element={<AdminQueue />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
