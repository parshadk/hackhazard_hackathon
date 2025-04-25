import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import CourseStudy from "./pages/CoursesStudy";
import Lectures from "./pages/Lectures";
import AdminDashbord from "./admin/dashboard/AdminDashboard";
import AdminCourses from "./admin/courses/AdminCourses";
import AdminUsers from "./admin/users/AdminUser";
import Courses from "./pages/Courses";
import CourseDescription from "./pages/CourseDescription";
import PaymentSuccess from "./pages/PaymentSuccess";

// Lazy-loaded pages
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Quiz = lazy(() => import("./pages/Quiz"));
const FinanceChat = lazy(() => import("./pages/FinanceChat")); 
const Wallet = lazy(() => import("./pages/Wallet"));
const Profile = lazy(() => import("./pages/Profile"));
const LiveUpdates = lazy(() => import("./pages/LiveUpdates"));
const StockHistory = lazy(() => import("./pages/StockHistory"));
const AboutUs = lazy(() => import("./pages/AboutUs")); // Added AboutUs import

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

const App: React.FC = () => {
  const { user } = useAuth();
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<AboutUs />} /> {/* Added AboutUs route */}
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
                <PaymentSuccess user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/study/:id"
            element={
              <ProtectedRoute>
                <CourseStudy user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lectures/:id"
            element={
              <ProtectedRoute>
                <Lectures user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashbord user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/course"
            element={
              <ProtectedRoute>
                <AdminCourses user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsers user={user} />
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
  );
};

export default App;