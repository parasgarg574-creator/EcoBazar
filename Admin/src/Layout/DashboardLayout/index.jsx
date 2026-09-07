import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../../Pages/sideBar/index"
import Header from"../../Pages/TopBar/index"
const DashboardLayout = () => {
  const [collapsed, setcollapsed] = useState(false);
  const getadmin = localStorage.getItem("response");
  const Admin = getadmin ? JSON.parse(getadmin) : null;
  console.log(Admin)
  return (
    <div className="flex min-h-screen w-full bg-[#f5f4f2]">
      <SideBar
        collapsed={collapsed}
        setcollapsed={setcollapsed}
      />
      <div
        className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${
          collapsed ? "ml-[80px]" : "ml-[315px]"
        }`}
      >
        <Header admin={Admin} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
