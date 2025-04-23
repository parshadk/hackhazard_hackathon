import React from "react";
import { Link } from "react-router-dom";
import { AiFillHome, AiOutlineLogout } from "react-icons/ai";
import { FaBook, FaUserAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="w-[200px] h-full text-white border-r border-gray-400 md:w-[30px]">
      <ul className="list-none p-0">
        <li className="mb-2 cursor-pointer p-3 md:p-2 hover:bg-gray-500">
          <Link to="/admin/dashboard" className="flex items-center no-underline text-inherit">
            <div className="text-lg">
              <AiFillHome />
            </div>
            <span className="ml-4 md:hidden">Home</span>
          </Link>
        </li>

        <li className="mb-2 cursor-pointer p-3 md:p-2 hover:bg-gray-500">
          <Link to="/admin/course" className="flex items-center no-underline text-inherit">
            <div className="text-lg">
              <FaBook />
            </div>
            <span className="ml-4 md:hidden">Courses</span>
          </Link>
        </li>

        {user?.mainrole === "superadmin" && (
          <li className="mb-2 cursor-pointer p-3 md:p-2 hover:bg-gray-500">
            <Link to="/admin/users" className="flex items-center no-underline text-inherit">
              <div className="text-lg">
                <FaUserAlt />
              </div>
              <span className="ml-4 md:hidden">Users</span>
            </Link>
          </li>
        )}

        <li className="mb-2 cursor-pointer p-3 md:p-2 hover:bg-gray-500">
          <Link to="/account" className="flex items-center no-underline text-inherit">
            <div className="text-lg">
              <AiOutlineLogout />
            </div>
            <span className="ml-4 md:hidden">Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;