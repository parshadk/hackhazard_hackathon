import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../utils/api"
import { BookOpen, Award, TrendingUp } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import LoadingSpinner from "../components/ui/LoadingSpinner"

interface Course {
  _id: string
  title: string
  slug: string
  level: string
  topic: string
  thumbnail?: string
}

interface Progress {
  courseProgressPercentage: number
  completedLectures: number
  allLectures: number
}

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [myCourses, setMyCourses] = useState<Course[]>([])
  const [progress, setProgress] = useState<Record<string, Progress>>({})
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, myCoursesRes] = await Promise.all([
          axios.get(`${API_URL}/course/all`),
          axios.get(`${API_URL}/mycourse`),
        ])
        setCourses(coursesRes.data.courses)
        setMyCourses(myCoursesRes.data.courses)

        const progressData: Record<string, Progress> = {}
        for (const course of myCoursesRes.data.courses) {
          try {
            const progressRes = await axios.get(`${API_URL}/user/progress?course=${course._id}`)
            progressData[course._id] = progressRes.data
          } catch (error) {
            console.error(`Failed to fetch progress for course ${course._id}`, error)
          }
        }

        setProgress(progressData)
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  const getThumbnailUrl = (thumbnail?: string) => {
    if (!thumbnail) return "https://via.placeholder.com/300x200?text=Course+Image"
    
    // If it's already a full URL (Cloudinary or other)
    if (thumbnail.startsWith('http')) {
      return thumbnail
    }
    
    // If it's a Cloudinary public ID without URL
    if (thumbnail.includes('/') && !thumbnail.includes('res.cloudinary.com')) {
      return `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/${thumbnail}`
    }
    
    // Default case - assume it's a local file path
    return `${API_URL}/${thumbnail}`
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Welcome back, {user?.name}!</h1>
        <div className="flex items-center space-x-4">
          <span className="bg-indigo-100 px-3 py-1 rounded-full text-indigo-600 text-sm font-medium">{user?.level}</span>
          <span className="text-sm text-gray-500">XP: {user?.xp}</span>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, (user?.xp || 0) % 100)}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-gray-500 text-right">
            {100 - ((user?.xp || 0) % 100)} XP until next level
          </div>
        </div>
      </div>

      {/* My Courses */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">My Courses</h2>
          <Link to="/lessons" className="text-indigo-600 text-sm hover:underline">
            View all
          </Link>
        </div>

        {myCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="text-lg font-medium mb-2 text-gray-700">No courses yet</h3>
            <p className="text-gray-500 mb-4">Enroll in a course to start your financial education journey</p>
            <Link
              to="/lessons"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCourses.map((course) => (
              <Link
                key={course._id}
                to={`/lesson/${course._id}`}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="h-40 bg-gray-200 relative">
<img
                    src={course.image?.includes("res.cloudinary.com") ? course.image : `${server}/${course.image}`}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Course+Image';
                    }}
                  />
                  <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium text-indigo-600">
                    {course.level}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1 text-gray-800">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{course.topic}</p>

                  {progress[course._id] && (
                    <div>
                      <div className="flex justify-between text-xs mb-1 text-gray-600">
                        <span>Progress</span>
                        <span>{Math.round(progress[course._id].courseProgressPercentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress[course._id].courseProgressPercentage}%` }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {progress[course._id].completedLectures} of {progress[course._id].allLectures} lectures
                        completed
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recommended */}
      {myCourses.length > 0 && courses.length > myCourses.length && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Recommended Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses
              .filter((course) => !myCourses.some((myCourse) => myCourse._id === course._id))
              .slice(0, 3)
              .map((course) => (
                <Link
                  key={course._id}
                  to={`/lesson/${course._id}`}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                >
                  <div className="h-40 bg-gray-200 relative">
<img
                    src={course.image?.includes("res.cloudinary.com") ? course.image : `${server}/${course.image}`}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Course+Image';
                    }}
                  />
                    <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium text-indigo-600">
                      {course.level}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1 text-gray-800">{course.title}</h3>
                    <p className="text-sm text-gray-500">{course.topic}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={<BookOpen className="h-5 w-5 text-indigo-600" />} label="Courses Enrolled" value={myCourses.length} />
        <StatCard icon={<Award className="h-5 w-5 text-indigo-600" />} label="Current Level" value={user?.level} />
        <StatCard icon={<TrendingUp className="h-5 w-5 text-indigo-600" />} label="Total XP" value={user?.xp} />
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value?: any }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center space-x-3">
      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value ?? "-"}</p>
      </div>
    </div>
  )
}