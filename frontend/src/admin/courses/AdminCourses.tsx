import React, { useState, ChangeEvent, FormEvent } from "react";
import Layout from "../utils/layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/lessons/LessonCard";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";

const categories = [
  "Stocks",
  "Mutual Funds",
  "Cryptocurrency",
  "Forex",
  "trading",
  "Options",
  "intraday",
  "Futures",
  "Bonds",
  "Other",
];

type AdminCoursesProps = {
  user: {
    role: string;
  } | null;
};

const AdminCourses: React.FC<AdminCoursesProps> = ({ user }) => {
  const navigate = useNavigate();
  const { courses, fetchCourses } = CourseData();

  if (user && user.role !== "admin") {
    navigate("/");
  }

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState<File | "">("");
  const [imagePrev, setImagePrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePrev(reader.result as string);
      setImage(file);
    };
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("category", category);
    myForm.append("price", price);
    myForm.append("createdBy", createdBy);
    myForm.append("duration", duration);
    if (image) myForm.append("file", image);

    try {
      const { data } = await axios.post(`${server}/api/course/new`, myForm, {
        headers: {
          token: localStorage.getItem("token") || "",
        },
      });

      toast.success(data.message);
      await fetchCourses();

      setTitle("");
      setDescription("");
      setCategory("");
      setPrice("");
      setCreatedBy("");
      setDuration("");
      setImage("");
      setImagePrev("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto my-10 min-h-[80vh]">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600">
            <h1 className="text-2xl font-bold text-white">Add a New Course</h1>
            <p className="text-purple-100 mt-1">
              Fill in the details to publish a course
            </p>
          </div>

          <div className="p-6">
            <form
              onSubmit={submitHandler}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Created By
                </label>
                <input
                  type="text"
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option value={cat} key={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Duration (in hours)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Price (in ₹)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Course Image
                </label>
                <input
                  type="file"
                  required
                  onChange={changeImageHandler}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                />
              </div>

              {imagePrev && (
                <div className="col-span-full flex justify-center">
                  <img
                    src={imagePrev}
                    alt="Preview"
                    className="rounded-lg shadow-md max-w-[300px]"
                  />
                </div>
              )}

              <div className="col-span-full">
                <button
                  type="submit"
                  disabled={btnLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-2 px-4 rounded-md shadow-sm transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  {btnLoading ? "Please Wait..." : "Add Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCourses;
