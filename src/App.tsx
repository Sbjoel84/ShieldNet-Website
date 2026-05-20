import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { PublicLayout } from '@/components/public/PublicLayout'
import { AuthPage } from '@/components/auth/AuthPage'
import { RegisterPage } from '@/components/auth/RegisterPage'
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

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!profile) return <Navigate to="/auth" replace />
  if (profile.role !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { profile, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return (
    <Routes>
      <Route path="/auth" element={profile ? <Navigate to={profile.role === 'admin' ? '/dashboard' : '/'} replace /> : <AuthPage />} />
      <Route path="/register" element={
        profile?.role === 'admin' ? <Navigate to="/dashboard" replace /> : <RegisterPage />
      } />

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

      <Route
        path="/dashboard"
        element={<AdminRoute><DashboardLayout /></AdminRoute>}
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
