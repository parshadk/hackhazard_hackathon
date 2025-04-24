import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"

const Register: React.FC = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activationToken, setActivationToken] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState(1)

  const { register, verifyOTP } = useAuth()
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) return toast.error("Please fill in all fields")
    if (password.length < 6) return toast.error("Password must be at least 6 characters")

    setLoading(true)
    try {
      const token = await register(name, email, password)
      setActivationToken(token)
      setStep(2)
      toast.success("OTP sent to your email")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp) return toast.error("Please enter the OTP")

    setLoading(true)
    try {
      await verifyOTP(otp, activationToken)
      toast.success("Account verified successfully")
      navigate("/login")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  const formVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-indigo-100 m-4 p-8 rounded-lg shadow-lg">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center">
            <img src="/black.png" alt="EduFinance Logo" className="h-12 w-13" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
            {step === 1 ? "Create your account" : "Verify your email"}
          </h2>
          {step === 1 && (
            <p className="mt-2 text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          )}
        </div>

        <motion.form
          key={step === 1 ? "register" : "verify"}
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          onSubmit={step === 1 ? handleRegister : handleVerify}
          className="mt-8 space-y-6"
        >
          {step === 1 ? (
            <>
              <div className="rounded-md shadow-sm -space-y-px bg-indigo-50">
                <div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-md shadow-sm -space-y-px bg-indigo-50">
                <div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter the OTP"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </>
          )}
        </motion.form>
      </div>
    </div>
  )
}

export default Register
