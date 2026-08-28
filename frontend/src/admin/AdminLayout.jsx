import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="min-h-screen lg:ml-[270px] flex flex-col">

        <Header
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="flex-1 pt-[106px] lg:pt-0 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;