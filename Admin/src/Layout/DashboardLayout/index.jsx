import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../../Pages/sideBar/index";
import Header from "../../Pages/TopBar/index";

const getStoredAdmin = () => {
  try {
    const raw = localStorage.getItem("response");
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Invalid stored admin data:", error);
    return null;
  }
};

const DashboardLayout = () => {
  const [collapsed, setcollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const admin = getStoredAdmin();

  return (
    <div className="flex min-h-screen w-full bg-[#f5f4f2]">
      <SideBar
        collapsed={collapsed}
        setcollapsed={setcollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div
        className={`flex min-h-screen w-full flex-1 flex-col transition-all duration-300 ${
          collapsed ? "lg:ml-[80px]" : "lg:ml-[315px]"
        }`}
      >
        <Header admin={admin} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
