import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../main";
import Loading from "../components/ui/LoadingSpinner";
import toast from "react-hot-toast";

interface User {
  role: string;
  subscription: string[];
}

interface Lecture {
  _id: string;
  title: string;
  description: string;
  video: string;
}

interface Progress {
  completedLectures: string[];
}

interface LectureProps {
  user: User;
}

const Lecture: React.FC<LectureProps> = ({ user }) => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lecLoading, setLecLoading] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [video, setVideo] = useState<File | null>(null);
  const [videoPrev, setVideoPrev] = useState<string | ArrayBuffer | null>("");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [progress, setProgress] = useState<Progress[]>([]);

  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Function to check if URL is from Cloudinary
  const isCloudinaryUrl = (url: string) => {
    return url?.includes('res.cloudinary.com');
  };

  // Function to get proper video URL
  const getVideoUrl = (videoPath: string) => {
    if (!videoPath) return '';
    return isCloudinaryUrl(videoPath) ? videoPath : `${server}/${videoPath}`;
  };

  if (user && user.role !== "admin" && !user.subscription.includes(params.id)) {
    return navigate("/lesson/:id");
  }

  async function fetchLectures() {
    try {
      const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setLectures(data.lectures);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function fetchLecture(id: string) {
    setLecLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setLecture(data.lecture);
      setLecLoading(false);
    } catch (error) {
      console.log(error);
      setLecLoading(false);
    }
  }

  const changeVideoHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setVideoPrev(reader.result);
        setVideo(file);
      };
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    setBtnLoading(true);
    setUploadProgress(0);
    e.preventDefault();
    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    if (video) myForm.append("file", video);

    try {
      const { data } = await axios.post(`${server}/api/course/${params.id}`, myForm, {
        headers: { token: localStorage.getItem("token") },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        },
      });

      toast.success(data.message);
      setBtnLoading(false);
      setShow(false);
      fetchLectures();
      setTitle("");
      setDescription("");
      setVideo(null);
      setVideoPrev("");
      setUploadProgress(0);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upload failed");
      setBtnLoading(false);
    }
  };

  const deleteHandler = async (id: string) => {
    if (confirm("Are you sure you want to delete this lecture")) {
      try {
        const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
          headers: { token: localStorage.getItem("token") },
        });

        toast.success(data.message);
        fetchLectures();
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    }
  };

  const addProgress = async (id: string) => {
    try {
      await axios.post(
        `${server}/api/user/progress?course=${params.id}&lectureId=${id}`,
        {},
        { headers: { token: localStorage.getItem("token") } }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loading />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Section - Video Player */}
            <div className="lg:flex-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-4">
                {lecLoading ? (
                  <div className="flex items-center justify-center h-96">
                    <Loading />
                  </div>
                ) : (
                  <>
                    {lecture?.video ? (
                      <>
                        <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                          <video
                            src={getVideoUrl(lecture.video)}
                            controls
                            controlsList="nodownload noremoteplayback"
                            disablePictureInPicture
                            disableRemotePlayback
                            autoPlay
                            onEnded={() => addProgress(lecture._id)}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="mt-4 p-4">
                          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">{lecture.title}</h1>
                          <p className="mt-2 text-gray-600">{lecture.description}</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-96 text-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4">Select a Lecture</h1>
                        <p className="text-gray-500">Choose a lecture from the list to start watching</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Right Section - Lectures List */}
            <div className="lg:w-96 xl:w-[28rem]">
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                {user && user.role === "admin" && (
                  <div className="mb-6">
                    <button
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                      onClick={() => setShow(!show)}
                    >
                      {show ? "Close Form" : "Add New Lecture +"}
                    </button>
                  </div>
                )}

                {show && (
                  <div className="mb-8 bg-blue-50 rounded-lg p-4">
                    <h2 className="text-xl font-bold text-blue-800 mb-4">Add New Lecture</h2>
                    <form onSubmit={submitHandler} className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          id="title"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          id="description"
                          type="text"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Video File
                        </label>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={changeVideoHandler}
                          required
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>

                      {videoPrev && (
                        <div className="mt-2">
                          <video
                            src={videoPrev as string}
                            controls
                            className="w-full rounded-md"
                          />
                        </div>
                      )}

                      {btnLoading && (
                        <div className="w-full mb-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-center mt-1 text-gray-600">
                            Uploading: {uploadProgress}%
                          </p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={btnLoading}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {btnLoading ? "Uploading..." : "Add Lecture"}
                      </button>
                    </form>
                  </div>
                )}

                <h3 className="text-lg font-semibold text-gray-800 mb-4">Lectures</h3>
                {lectures.length > 0 ? (
                  <div className="space-y-3 max-h-[32rem] overflow-y-auto pr-2">
                    {lectures.map((lec, index) => (
                      <div
                        key={lec._id}
                        onClick={() => fetchLecture(lec._id)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                          lecture?._id === lec._id
                            ? "bg-blue-100 border border-blue-200"
                            : "hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{lec.title}</h4>
                            <p className="text-sm text-gray-500 line-clamp-1">{lec.description}</p>
                          </div>
                          {user?.role === "admin" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteHandler(lec._id);
                              }}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No lectures available yet</p>
                    {user?.role === "admin" && (
                      <button
                        onClick={() => setShow(true)}
                        className="mt-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Add your first lecture
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lecture;