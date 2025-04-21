import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../utils/api"
import { BookOpen, ChevronLeft, ChevronRight, Play } from "lucide-react"
import LoadingSpinner from "./../components/ui/LoadingSpinner"
import toast from "react-hot-toast"

interface Course {
  _id: string
  title: string
  slug: string
  level: string
  topic: string
  thumbnail?: string
  description?: string
}

interface Lecture {
  _id: string
  title: string
  description?: string
  content?: {
    text?: string
    video?: string
  }
  course: string
}

interface Progress {
  courseProgressPercentage: number
  completedLectures: string[]
  allLectures: number
}

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [course, setCourse] = useState<Course | null>(null)
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolled, setEnrolled] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: courseData } = await axios.get(`${API_URL}/course/${id}`)
        setCourse(courseData.course)

        try {
          const { data: lecturesData } = await axios.get(`${API_URL}/lectures/${id}`)
          setLectures(lecturesData.lectures)
          setEnrolled(true)

          if (lecturesData.lectures.length > 0 && !currentLecture) {
            setCurrentLecture(lecturesData.lectures[0])
          }

          try {
            const { data: progressData } = await axios.get(`${API_URL}/user/progress?course=${id}`)
            setProgress(progressData)
          } catch (error) {
            console.error("Failed to fetch progress", error)
          }
        } catch (error: any) {
          if (error.response?.status === 403) {
            setEnrolled(false)
          } else {
            console.error("Failed to fetch lectures", error)
          }
        }
      } catch (error) {
        console.error("Failed to fetch course details", error)
        toast.error("Failed to load course")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, currentLecture])

  const handleLectureSelect = async (lecture: Lecture) => {
    setCurrentLecture(lecture)
    try {
      if (progress && !progress.completedLectures.includes(lecture._id)) {
        await axios.post(`${API_URL}/user/progress?course=${id}&lectureId=${lecture._id}`)
      }
    } catch (error) {
      console.error("Failed to update progress", error)
    }
  }

  const handleEnroll = async () => {
    setCheckoutLoading(true)
    try {
      const { data } = await axios.post(`${API_URL}/course/checkout/${id}`)
      await axios.post(`${API_URL}/verification/${id}`, {
        razorpay_order_id: data.order.id,
        razorpay_payment_id: "test_payment_id",
        razorpay_signature: "test_signature",
      })
      toast.success("Successfully enrolled in course")
      window.location.reload()
    } catch (error) {
      console.error("Failed to enroll in course", error)
      toast.error("Failed to enroll in course")
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handleNextLecture = () => {
    if (!currentLecture || !lectures.length) return
    const currentIndex = lectures.findIndex((lecture) => lecture._id === currentLecture._id)
    if (currentIndex < lectures.length - 1) {
      handleLectureSelect(lectures[currentIndex + 1])
    }
  }

  const handlePrevLecture = () => {
    if (!currentLecture || !lectures.length) return
    const currentIndex = lectures.findIndex((lecture) => lecture._id === currentLecture._id)
    if (currentIndex > 0) {
      handleLectureSelect(lectures[currentIndex - 1])
    }
  }

  const startQuiz = () => {
    if (course) {
      navigate(`/quiz/${course._id}`)
    }
  }

  if (loading) return <LoadingSpinner />

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Course not found</h2>
        <Link to="/lessons" className="text-indigo-600 hover:underline">
          Back to courses
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link to="/lessons" className="text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
      </div>

      {!enrolled ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="h-48 bg-gray-100 relative">
            {course.thumbnail ? (
              <img src={`${API_URL}/${course.thumbnail}`} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-100">
                <BookOpen className="h-16 w-16 text-indigo-600" />
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 text-sm font-medium">
                {course.level}
              </div>
              <div className="text-sm text-gray-500">{course.topic}</div>
            </div>

            {course.description && <p className="text-gray-700 mb-6">{course.description}</p>}

            <button
              onClick={handleEnroll}
              disabled={checkoutLoading}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-70"
            >
              {checkoutLoading ? "Processing..." : "Enroll in Course"}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-medium text-gray-800">Course Content</h2>
              {progress && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress.courseProgressPercentage)}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 w-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full transition-all duration-300"
                      style={{ width: `${progress.courseProgressPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto">
              {lectures.map((lecture) => (
                <button
                  key={lecture._id}
                  onClick={() => handleLectureSelect(lecture)}
                  className={`w-full text-left p-4 hover:bg-indigo-50 transition-colors ${
                    currentLecture?._id === lecture._id ? "bg-indigo-50 border-l-4 border-indigo-600" : ""
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      {progress?.completedLectures.includes(lecture._id) ? (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-gray-300" />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-800">{lecture.title}</div>
                      {lecture.description && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">{lecture.description}</div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={startQuiz}
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Take Quiz
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-lg shadow overflow-hidden">
            {currentLecture ? (
              <div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">{currentLecture.title}</h2>

                  {currentLecture.content?.video ? (
                    <div className="aspect-video bg-black mb-6 rounded overflow-hidden">
                      <video src={`${API_URL}/${currentLecture.content.video}`} controls className="w-full h-full" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 mb-6 rounded flex items-center justify-center">
                      <div className="text-center">
                        <Play className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No video available</p>
                      </div>
                    </div>
                  )}

                  {currentLecture.content?.text && (
                    <div className="prose max-w-none text-gray-700">
                      <p>{currentLecture.content.text}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between p-4 border-t border-gray-200">
                  <button
                    onClick={handlePrevLecture}
                    disabled={lectures.indexOf(currentLecture) === 0}
                    className="flex items-center text-gray-700 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Previous
                  </button>
                  <button
                    onClick={handleNextLecture}
                    disabled={lectures.indexOf(currentLecture) === lectures.length - 1}
                    className="flex items-center text-gray-700 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No lecture selected</h3>
                <p className="text-gray-500">Select a lecture from the sidebar to start learning</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
