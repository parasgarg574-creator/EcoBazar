import { FaChevronDown } from "react-icons/fa";
const Header = ({ admin }) => {
  return (
    <header className="flex h-[70px] items-center justify-end bg-gradient-to-r from-green-600 to-green-900 px-4 sm:px-6 lg:px-8">
      <div className="flex cursor-pointer items-center gap-2 text-white sm:gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-green-800 sm:h-10 sm:w-10">
          {admin.data.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold sm:text-base">
            {admin.data.name || "ADMIN"}
          </p>
          <p className="truncate text-[10px] text-green-100 sm:text-xs">
            {admin.data.role || "Administrator"}
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
