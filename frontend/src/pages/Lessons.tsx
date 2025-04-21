import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../utils/api"
import { BookOpen, Search } from "lucide-react"
import LoadingSpinner from "../components/ui/LoadingSpinner"

interface Course {
  _id: string
  title: string
  slug: string
  level: string
  topic: string
  thumbnail?: string
  description?: string
}

export default function Lessons() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState({
    level: "",
    topic: "",
  })
  const [topics, setTopics] = useState<string[]>([])
  const [levels, setLevels] = useState<string[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/course/all`)
        setCourses(data.courses)
        setFilteredCourses(data.courses)

        const uniqueTopics = Array.from(
          new Set(data.courses.map((course: Course) => course.topic.trim().toLowerCase()))
        ) as string[]
        
        const uniqueLevels = Array.from(
          new Set(data.courses.map((course: Course) => course.level.trim().toLowerCase()))
        ) as string[]
        
        setTopics(uniqueTopics)
        setLevels(uniqueLevels)
      } catch (error) {
        console.error("Failed to fetch courses", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  useEffect(() => {
    let result = courses

    if (searchTerm) {
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (filter.level) {
      result = result.filter((course) => course.level === filter.level)
    }

    if (filter.topic) {
      result = result.filter((course) => course.topic === filter.topic)
    }

    setFilteredCourses(result)
  }, [searchTerm, filter, courses])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-indigo-100 via-indigo-100 to-pink-100 p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-indigo-700">All Courses</h1>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-800"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-indigo-400" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="level-filter" className="block text-sm font-medium text-indigo-600 mb-1">
              Filter by Level
            </label>
            <select
              id="level-filter"
              value={filter.level}
              onChange={(e) => setFilter({ ...filter, level: e.target.value })}
              className="w-full border border-indigo-200 rounded-md focus:ring-indigo-400 focus:border-indigo-400 bg-indigo-50 text-gray-800"
            >
              <option value="">All Levels</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="topic-filter" className="block text-sm font-medium text-indigo-600 mb-1">
              Filter by Topic
            </label>
            <select
              id="topic-filter"
              value={filter.topic}
              onChange={(e) => setFilter({ ...filter, topic: e.target.value })}
              className="w-full border border-indigo-200 rounded-md focus:ring-indigo-400 focus:border-indigo-400 bg-indigo-50 text-gray-800"
            >
              <option value="">All Topics</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* No Courses Message */}
      {filteredCourses.length === 0 ? (
        <div className="bg-pink-50 rounded-lg shadow p-6 text-center border border-pink-200">
          <BookOpen className="h-12 w-12 mx-auto text-pink-400 mb-4" />
          <h3 className="text-lg font-medium text-pink-700 mb-2">No courses found</h3>
          <p className="text-pink-500">Try adjusting your search or filters to find what you're looking for</p>
        </div>
      ) : (
        // Course Cards Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link
              key={course._id}
              to={`/lesson/${course._id}`}
              className="bg-white border border-indigo-100 hover:shadow-md transition-shadow duration-300 rounded-lg overflow-hidden"
            >
              <div className="h-40 bg-indigo-50 relative">
                {course.thumbnail ? (
                  <img
                    src={`${API_URL}/${course.thumbnail}`}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-100">
                    <BookOpen className="h-12 w-12 text-indigo-500" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white border border-indigo-200 px-2 py-1 rounded text-xs font-medium text-indigo-600 shadow-sm">
                  {course.level}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-indigo-700 mb-1">{course.title}</h3>
                <div className="text-sm text-indigo-500 mb-2">{course.topic}</div>
                {course.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
