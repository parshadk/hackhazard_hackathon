import React, { ReactNode } from "react";
import Sidebar from "../../components/layout/Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-[80vh] mt-5">
      <Sidebar />
      <div className="flex-grow p-4">{children}</div>
    </div>
  );
};

export default AdminLayout;
