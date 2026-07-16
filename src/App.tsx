import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { PublicLayout } from '@/components/public/PublicLayout'
import { AuthPage } from '@/components/auth/AuthPage'
import { RegisterPage } from '@/components/auth/RegisterPage'
import { AgentRegisterPage } from '@/components/auth/AgentRegisterPage'
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
import { ShieldHerPage } from '@/components/public/ShieldHerPage'
import { PrivacyPolicy } from '@/components/public/PrivacyPolicy'
import { TermsOfService } from '@/components/public/TermsOfService'

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground text-sm">Loading ShieldNet…</p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!profile) return <Navigate to="/auth" replace />
  // Wrong role — send to /auth so user can sign in with the correct account
  if (profile.role !== 'admin' && profile.role !== 'agent') return <Navigate to="/auth" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!profile) return <Navigate to="/auth" replace />
  if (profile.role !== 'admin') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { profile } = useAuth()
  return (
    <Routes>
      <Route path="/auth" element={(profile?.role === 'admin' || profile?.role === 'agent') ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/agent-register" element={<AgentRegisterPage />} />

      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/properties" element={<PublicProperties />} />
        <Route path="/farms" element={<PublicFarms />} />
        <Route path="/ai-tools" element={<PublicAITools />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/shieldher" element={<ShieldHerPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
      </Route>

      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Overview />} />
        <Route path="farms" element={<ShieldFarm />} />
        <Route path="properties" element={<Properties />} />
        <Route path="ai-tools" element={<AITools />} />
        <Route path="admin" element={<AdminRoute><AdminQueue /></AdminRoute>} />
      </Route>

      <Route path="/admin" element={<AdminRoute><Navigate to="/dashboard/admin" replace /></AdminRoute>} />
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
