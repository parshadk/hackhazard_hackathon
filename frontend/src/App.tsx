import React, { Suspense, lazy, useEffect } from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useAuth } from "./context/AuthContext"
import Layout from "./components/layout/Layout"
import LoadingSpinner from "./components/ui/LoadingSpinner"
import CourseStudy from "./pages/CoursesStudy";
import Lectures from "./pages/Lectures";
import AdminDashbord from "./admin/dashboard/AdminDashboard";
import AdminCourses from "./admin/courses/AdminCourses";
import AdminUsers from "./admin/users/AdminUser";
import Courses from "./pages/Courses";
import CourseDescription from "./pages/CourseDescription"
import PaymentSuccess from "./pages/PaymentSuccess"
// Lazy-loaded pages
const Landing = lazy(() => import("./pages/Landing"))
const Login = lazy(() => import("./pages/Login"))
const Register = lazy(() => import("./pages/Register"))
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"))
const ResetPassword = lazy(() => import("./pages/ResetPassword"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
//const Courses = lazy(() => import("./pages/Courses"))
const LessonDetail = lazy(() => import("./pages/CourseDescription"))
const Quiz = lazy(() => import("./pages/Quiz"))
const FinanceChat = lazy(() => import("./pages/FinanceChat")) 
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
  const {user} = useAuth()
  

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
                {/* <Layout>
                  <Courses />
                </Layout> */}
                <Layout>
                  <Courses />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/lesson/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  {user?.role === 'admin' ? <Lectures user={user} /> : <CourseDescription user={user} />}
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-success/:id"
            element={
              <ProtectedRoute>
                {/* <Layout> */}
                  <PaymentSuccess user={user} />
                {/* </Layout> */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/study/:id"
            element={
              <ProtectedRoute>
                {/* <Layout> */}
                  <CourseStudy user={user} />
                {/* </Layout> */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/lectures/:id"
            element={
              <ProtectedRoute>
                {/* <Layout> */}
                  <Lectures user={user} />
                {/* </Layout> */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                {/* <Layout> */}
                  <AdminDashbord user={user} />
                {/* </Layout> */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/course"
            element={
              <ProtectedRoute>
                {/* <Layout> */}
                  <AdminCourses user={user} />
                {/* </Layout> */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                {/* <Layout> */}
                  <AdminUsers user={user} />
                {/* </Layout> */}
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
            path="/explain"
            element={
              <ProtectedRoute>
                <Layout>
                  <FinanceChat />
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