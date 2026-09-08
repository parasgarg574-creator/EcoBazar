import { FaChevronDown } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
const Header = ({ admin, onMenuClick }) => {
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
      <div className="flex cursor-pointer items-center gap-2 text-white sm:gap-3 ml-auto">
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
        <FaChevronDown
          size={14}
          className="shrink-0 sm:h-4 sm:w-4"
        />
      </div>
    </header>
  );
};
export default Header;
