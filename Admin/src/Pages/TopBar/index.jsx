import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { LogOut } from "lucide-react";
const Header = ({ admin, onMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("response");
    localStorage.removeItem("userPermissions");
    setIsDropdownOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex h-[70px] items-center justify-between gap-3 bg-gradient-to-r from-green-600 to-green-900 px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white transition hover:bg-white/10 lg:hidden"
      >
        <FiMenu size={22} />
      </button>
      <div className="relative ml-auto">
        <button
          type="button"
          onClick={() => setIsDropdownOpen((open) => !open)}
          aria-expanded={isDropdownOpen}
          aria-haspopup="menu"
          className="flex items-center gap-2 rounded-lg p-1 text-left text-white transition hover:bg-white/10 sm:gap-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-green-800 sm:h-10 sm:w-10">
            {admin?.data?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="hidden min-w-0 leading-tight sm:block">
            <p className="truncate text-sm font-semibold sm:text-base">
              {admin?.data?.name || "ADMIN"}
            </p>
            <p className="truncate text-[10px] text-green-100 sm:text-xs">
              {admin?.data?.role || "Administrator"}
            </p>
          </div>
          <FaChevronDown size={14} className="shrink-0 sm:h-4 sm:w-4" />
        </button>

        {isDropdownOpen && (
          <div
            role="menu"
            className="absolute right-0 top-12 z-20 min-w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
