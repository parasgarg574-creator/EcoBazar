import { RxDashboard } from "react-icons/rx";
import { FaChevronLeft } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import permissions from "../../Methods/Permissions/script";

const SideBar = ({ collapsed, setcollapsed, mobileOpen, setMobileOpen }) => {
  const menuitems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      key: "readDashboard",
      end: true,
    },
    {
      name: "Staff",
      path: "/dashboard/staff",
      key: "readStaff",
    },
    {
      name: "Customers",
      path: "/dashboard/customers",
      key: "readCustomers",
    },
     {
      name: "Categories",
      path: "/dashboard/categories",
      key: "readCategories",
    },
    {
      name: "Products",
      path: "/dashboard/products",
      key: "readProducts",
    },
    {
      name: "Orders",
      path: "/dashboard/orders",
      key: "readOrders",
    },
    {
      name: "Content-Management",
      path: "/dashboard/content-management",
      key: "readContent",
    },
    {
      name:"Coupon",
      path:"/dashboard/coupon",
      key:"createCoupon"
    },
    {
      name: "FAQs",
      path: "/dashboard/faqs",
      key: "readFaqs",
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      key: "readSettings",
    },
  ];
  const filteredMenuItems = menuitems.filter((item) =>
    permissions.isAllowed(item.key)
  );
  const closeMobile = () => setMobileOpen?.(false);
  return (
    <>
      {mobileOpen && (
        <div
          onClick={closeMobile}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}  
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[280px] border-r border-gray-200 bg-white transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 ${collapsed ? "lg:w-[80px]" : "lg:w-[315px]"}`}
      >
        <div
          className={`flex h-[80px] items-center justify-between border-b border-gray-100 lg:h-[120px] ${
            collapsed ? "px-4 lg:justify-center" : "px-6 lg:px-8"
          }`}
        >
          <img src="/Logo.svg" alt="Logo" width={34} height={34} className="h-[34px] w-auto object-contain"/>
          <button type="button" onClick={closeMobile} aria-label="Close menu" className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <FiX size={20} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setcollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-4 top-15 hidden h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:bg-gray-50 lg:flex"
        >
          <FaChevronLeft
            size={15}
            className={`transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
        <nav className="space-y-2 overflow-y-auto p-4 sm:p-5">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              onClick={closeMobile}
              title={collapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex w-full items-center rounded-lg px-4 py-3.5 transition justify-start gap-4 ${
                  collapsed ? "lg:justify-center" : ""
                } ${
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <RxDashboard size={20} className="shrink-0" />
              <span className={`font-medium ${collapsed ? "lg:hidden" : ""}`}>
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
