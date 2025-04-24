import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../utils/layout";
import axios from "axios";
import { server } from "../../main";
import { Button }from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

interface StatsType {
  totalCoures?: number;
  totalLectures?: number;
  totalUsers?: number;
}

interface AdminDashboardProps {
  user: {
    role: string;
  } | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const [stats, setStats] = useState<StatsType>({});

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: localStorage.getItem("token") || "",
        },
      });
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Welcome to your dashboard. Here you can manage all controls such as courses and users.
          </p>
        </div>

        <div className="flex justify-center gap-8 flex-wrap">
          <Card className="w-72 bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-300/20 rounded-xl">
            <CardContent className="text-center p-8">
              <div className="flex flex-col items-center">
                <div className="p-3 bg-purple-500/20 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-lg font-medium">Total Courses</p>
                <p className="text-4xl font-bold mt-2 drop-shadow-md">{stats.totalCoures ?? 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="w-72 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-300/20 rounded-xl">
            <CardContent className="text-center p-8">
              <div className="flex flex-col items-center">
                <div className="p-3 bg-blue-500/20 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-lg font-medium">Total Lectures</p>
                <p className="text-4xl font-bold mt-2 drop-shadow-md">{stats.totalLectures ?? 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="w-72 bg-gradient-to-br from-pink-600 to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-pink-300/20 rounded-xl">
            <CardContent className="text-center p-8">
              <div className="flex flex-col items-center">
                <div className="p-3 bg-pink-500/20 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-lg font-medium">Total Users</p>
                <p className="text-4xl font-bold mt-2 drop-shadow-md">{stats.totalUsers ?? 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-8 mt-12 flex-wrap">
          <Button
            className="relative overflow-hidden group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-emerald-400/30 hover:border-emerald-400/50"
            onClick={() => navigate("/admin/course")}
          >
            <span className="relative z-10 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Course
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>

          <Button
            className="relative overflow-hidden group bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-indigo-400/30 hover:border-indigo-400/50"
            onClick={() => navigate("/admin/users/")}
          >
            <span className="relative z-10 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              User Details
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;