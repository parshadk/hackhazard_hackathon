import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { User, Mail, Key, Award, BookOpen, Coins } from "lucide-react"
import toast from "react-hot-toast"

export default function Profile() {
  const { user, logout, changePassword, updateProfile } = useAuth() // Add updateProfile here
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      toast.error("Name is required")
      return
    }

    setLoading(true)

    try {
      await updateProfile(name) // Call updateProfile instead of changePassword
      toast.success("Profile updated successfully")
      setName(name) // Update local state if needed
    } catch (error) {
      console.error("Failed to update profile", error)
      toast.error(

        "Failed to update profile"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      toast.error("New Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      await changePassword(currentPassword, newPassword)
      setTimeout(() => {
        toast.success("Password changed successfully")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Failed to change password", error)
      toast.error("Failed to change password")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile info card */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium">Profile Information</h2>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    disabled
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Email address cannot be changed</p>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-70"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>

          {/* Change password card */}
          <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium">Change Password</h2>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-70"
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="space-y-6">
          {/* User stats card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium">Your Stats</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Level</div>
                  <div className="font-medium">{user?.level || "Beginner"}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">XP</div>
                  <div className="font-medium">{user?.xp || 0}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Coins className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Coins</div>
                  <div className="font-medium">250</div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="mb-2">
                  <div className="text-sm text-gray-500 mb-1">Progress to Next Level</div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${Math.min(100, (user?.xp || 0) % 100)}%` }} />
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-right">{100 - ((user?.xp || 0) % 100)} XP needed</div>
              </div>
            </div>
          </div>

          {/* Account actions */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium">Account Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              <button
                onClick={logout}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
