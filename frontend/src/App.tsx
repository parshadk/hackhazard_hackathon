import React, { Suspense, lazy } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useAuth } from "./context/AuthContext"
import Layout from "./components/layout/Layout"
import LoadingSpinner from "./components/ui/LoadingSpinner"

// Lazy-loaded pages
const Landing = lazy(() => import("./pages/Landing"))
const Login = lazy(() => import("./pages/Login"))
const Register = lazy(() => import("./pages/Register"))
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"))
const ResetPassword = lazy(() => import("./pages/ResetPassword"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const Lessons = lazy(() => import("./pages/Lessons"))
const LessonDetail = lazy(() => import("./pages/LessonDetails"))
const Quiz = lazy(() => import("./pages/Quiz"))
const Wallet = lazy(() => import("./pages/Wallet"))
const Profile = lazy(() => import("./pages/Profile"))
const LiveUpdates = lazy(() => import("./pages/LiveUpdates"))
const StockHistory = lazy(() => import("./pages/StockHistory"))

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return <>{children}</>
}

const App: React.FC = () => {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/lessons"
            element={
              <ProtectedRoute>
                <Layout>
                  <Lessons />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/lesson/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <LessonDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <Layout>
                  <Quiz />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <Layout>
                  <Wallet />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/live-updates"
            element={
              <ProtectedRoute>
                <Layout>
                  <LiveUpdates />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock-history"
            element={
              <ProtectedRoute>
                <Layout>
                  <StockHistory />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </>
  )
}

export default App
