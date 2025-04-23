import axios from "axios";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { server } from "../main";

interface Course {
  _id: string;
  title: string;
  description: string;
  // Add other fields here based on your Course model
}

interface CourseContextType {
  courses: Course[];
  course: Course | null;
  mycourse: Course[];
  fetchCourses: () => Promise<void>;
  fetchCourse: (id: string) => Promise<void>;
  fetchMyCourse: () => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseContextProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [mycourse, setMyCourse] = useState<Course[]>([]);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get<{ courses: Course[] }>(`${server}/api/course/all`);
      setCourses(data.courses);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCourse = async (id: string) => {
    try {
      const { data } = await axios.get<{ course: Course }>(`${server}/api/course/${id}`);
      setCourse(data.course);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyCourse = async () => {
    try {
      const { data } = await axios.get<{ courses: Course[] }>(`${server}/api/mycourse`, {
        headers: {
          token: localStorage.getItem("token") || "",
        },
      });
      setMyCourse(data.courses);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchMyCourse();
  }, []);

  return (
    <CourseContext.Provider
      value={{
        courses,
        fetchCourses,
        fetchCourse,
        course,
        mycourse,
        fetchMyCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const CourseData = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("CourseData must be used within a CourseContextProvider");
  }
  return context;
};
