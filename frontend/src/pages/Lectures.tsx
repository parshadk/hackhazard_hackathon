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
  const [progress, setProgress] = useState<Progress[]>([]);

  const params = useParams<{ id: string }>(); 
  const navigate = useNavigate();

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
    e.preventDefault(); 
    const myForm = new FormData(); 
    myForm.append("title", title); 
    myForm.append("description", description); 
    if (video) myForm.append("file", video);

    try { 
      const { data } = await axios.post(`${server}/api/course/${params.id}`, myForm, { 
        headers: { token: localStorage.getItem("token") }, 
      });

      toast.success(data.message); 
      setBtnLoading(false); 
      setShow(false); 
      fetchLectures(); 
      setTitle(""); 
      setDescription(""); 
      setVideo(null); 
      setVideoPrev(""); 
    } catch (error: any) { 
      toast.error(error.response.data.message); 
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
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="lecture-page">
          <div className="left">
            {lecLoading ? (
              <Loading />
            ) : (
              <>
                {lecture?.video ? (
                  <>
                    <video
                      src={`${server}/${lecture.video}`}
                      width="100%"
                      controls
                      controlsList="nodownload noremoteplayback"
                      disablePictureInPicture
                      disableRemotePlayback
                      autoPlay
                      onEnded={() => addProgress(lecture._id)}
                    ></video>
                    <h1 className="text-3xl font-semibold mt-4 text-gray-800">{lecture.title}</h1>
                    <h3 className="text-xl mt-2 text-gray-600">{lecture.description}</h3>
                  </>
                ) : (
                  <h1 className="text-4xl text-center font-bold text-blue-600 mb-6">Please Select a Lecture</h1>
                )}
              </>
            )}
          </div>
          <div className="right">
            {user && user.role === "admin" && (
              <button className="common-btn" onClick={() => setShow(!show)}>
                {show ? "Close" : "Add Lecture +"}
              </button>
            )}

            {show && (
              <div className="lecture-form p-4 border rounded-lg shadow-md mt-6">
                <h2 className="text-2xl font-semibold mb-4">Add Lecture</h2>
                <form onSubmit={submitHandler}>
                  <label htmlFor="text" className="block text-lg font-semibold">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-3 mt-2 mb-4 border rounded-lg"
                  />

                  <label htmlFor="text" className="block text-lg font-semibold">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full p-3 mt-2 mb-4 border rounded-lg"
                  />

                  <input
                    type="file"
                    placeholder="choose video"
                    onChange={changeVideoHandler}
                    required
                    className="p-3 mt-2 mb-4 border rounded-lg"
                  />

                  {videoPrev && (
                    <video
                      src={videoPrev as string}
                      width={300}
                      controls
                      className="mb-4"
                    ></video>
                  )}

                  <button
                    disabled={btnLoading}
                    type="submit"
                    className="common-btn mt-4"
                  >
                    {btnLoading ? "Please Wait..." : "Add"}
                  </button>
                </form>
              </div>
            )}

            {lectures.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {lectures.map((e, i) => (
                  <div
                    onClick={() => fetchLecture(e._id)}
                    key={i}
                    className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-gray-100 hover:border-indigo-500 p-4 ${
                      lecture?._id === e._id ? "ring-2 ring-indigo-500" : ""
                    }`}
                  >
                    <video
                      src={`${server}/${e.video}`}
                      className="w-full h-48 object-cover mb-4"
                      muted
                      preload="metadata"
                    ></video>
                    <div className="font-semibold text-lg">{i + 1}. {e.title}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No Lectures Yet!</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Lecture;
