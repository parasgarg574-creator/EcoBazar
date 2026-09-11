import React from "react";
import { useState } from "react";
import { useGeolocation } from "@uidotdev/usehooks";
import { FiMapPin, FiChevronDown, FiSearch, FiHeart, FiShoppingBag, FiMenu, FiX, FiUser,} from "react-icons/fi";
const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
    const geolocation = useGeolocation();
  const [location,setLocation] = useState({
    latitude:null,
    longitude:null,
    address:""
  });
  const getAddress = async(latitude,longitude)=>{
    try{
      const response = await fetch( `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
      const data = await response.json();
      console.log("dull",data)
      console.log("address",data.display_name)
      return data
    }catch(err){
      console.log(err)
    }
  }
  React.useEffect(() => {
    if (geolocation.latitude!==null && geolocation.longitude!==null) {
      setLocation({
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
      });
      getAddress(
        geolocation.latitude,geolocation.longitude
      ).then((data)=>{
        setLocation((previous)=>({
          ...previous,
          address:data.display_name
        })) 
      })
    }
  }, [geolocation.latitude, geolocation.longitude]);

  return (
    <header className="w-full bg-white">
      <div className="hidden border-b border-gray-100 sm:block">
        <div className="mx-auto flex h-9 max-w-[1200px] items-center justify-between px-4 lg:px-6">
          <button className="flex items-center gap-2 text-[11px] text-gray-500 hover:text-gray-800">
            <FiMapPin size={14} />
            <span>Store Location: {location.address}</span>
          </button>
          <button className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-800">
            USD
            <FiChevronDown size={12} />
          </button>
        </div>
      </div>
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-[1200px] px-4 lg:px-6">
          <div className="flex min-h-[80px] items-center justify-between gap-4 py-4">
            <a href="#" className="flex shrink-0 items-center gap-2" >
              <img src="/Logo (1).png" alt="Ecbazar logo" className="h-10 w-auto object-contain"
              />
            </a>
            <div className="hidden flex-1 sm:block md:max-w-[450px] lg:max-w-[500px]">
              <div className="flex h-10 w-full overflow-hidden rounded-md border border-gray-200">
                <div className="flex flex-1 items-center gap-2 px-3">
                  <FiSearch size={19} className="shrink-0 text-gray-400"
                  />
                  <input type="text" placeholder="Search products..." className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                </div>
                <button type="button" className="w-20 bg-[#00b207] text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Search
                </button>
              </div>
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <button type="button" aria-label="Wishlist" className="relative text-gray-700 transition hover:text-[#00b207]"
              >
                <FiHeart size={27} strokeWidth={1.5}
                />

                <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#00b207] px-1 text-[10px] font-bold text-white">
                  0
                </span>
              </button>

              <div className="h-8 w-px bg-gray-200" />
              <button type="button" className="flex items-center gap-2"
              >
                <div className="relative">
                  <FiShoppingBag size={29} strokeWidth={1.5} className="text-gray-700"
                  />

                  <span className="absolute -right-1 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#00b207] px-1 text-[10px] font-bold text-white">
                    2
                  </span>
                </div>

                <div className="hidden text-left md:block">
                  <p className="text-[10px] text-gray-500">
                    Shopping Cart
                  </p>

                  <p className="text-sm font-medium text-gray-800">
                    $10.00
                  </p>
                </div>
              </button>
            </div>
            <div className="flex items-center gap-3 sm:hidden">
              <button type="button" aria-label="Search" className="text-gray-700"
              >
                <FiSearch size={23} />
              </button>
              <button  type="button"  aria-label="Shopping cart"  className="relative text-gray-700"
              >
                <FiShoppingBag size={25} />
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#00b207] px-1 text-[9px] font-bold text-white">
                  2
                </span>
              </button>

              <button type="button" aria-label="Open menu" onClick={() => setMobileMenu(!mobileMenu)} className="text-gray-700"
              >
                {mobileMenu ? (
                  <FiX size={25} />
                ) : (
                  <FiMenu size={25} />
                )}
              </button>
            </div>
          </div>
          <div className="pb-4 sm:hidden">
            <div className="flex h-10 w-full overflow-hidden rounded-md border border-gray-200">
              <div className="flex flex-1 items-center gap-2 px-3">
                <FiSearch
                  size={18}
                  className="shrink-0 text-gray-400"
                />
                <input type="text" placeholder="Search products..." className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>

              <button
                type="button"
                className="w-20 bg-[#00b207] text-sm font-semibold text-white"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <nav className="hidden h-12 bg-[#333333] sm:block">
        <div className="mx-auto flex h-full max-w-[1200px] items-center px-4 lg:px-6">
          <div className="flex h-full items-center gap-8">
            <a href="#" className="flex h-full items-center text-sm font-medium text-white transition hover:text-[#00b207]">
              Home
            </a>
            <a href="#" className="flex h-full items-center text-sm font-medium text-gray-300 transition hover:text-[#00b207]"
            >
              About Us
            </a>
            <a href="#" className="flex h-full items-center text-sm font-medium text-gray-300 transition hover:text-[#00b207]"
            >
              Shop
            </a>
            <a href="#" className="flex h-full items-center text-sm font-medium text-gray-300 transition hover:text-[#00b207]"
            >
              Categories
            </a>

            <a
              href="#"
              className="flex h-full items-center text-sm font-medium text-gray-300 transition hover:text-[#00b207]"
            >
              Blog
            </a>

            <a
              href="#"
              className="flex h-full items-center text-sm font-medium text-gray-300 transition hover:text-[#00b207]"
            >
              Contact
            </a>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-gray-300">
            <FiUser size={17} />
            <span>Account</span>
          </div>
        </div>
      </nav>
      {mobileMenu && (
        <div className="border-b border-gray-200 bg-white sm:hidden">
          <nav className="mx-auto flex max-w-[1200px] flex-col px-4 py-3">
            <a
              href="#"
              onClick={() => setMobileMenu(false)}
              className="border-b border-gray-100 py-3 text-sm font-medium text-gray-800 hover:text-[#00b207]"
            >
              Home
            </a>

            <a
              href="#"
              onClick={() => setMobileMenu(false)}
              className="border-b border-gray-100 py-3 text-sm font-medium text-gray-800 hover:text-[#00b207]"
            >
              About Us
            </a>
            <a
              href="#"
              onClick={() => setMobileMenu(false)}
              className="border-b border-gray-100 py-3 text-sm font-medium text-gray-800 hover:text-[#00b207]"
            >
              Shop
            </a>
            <a
              href="#"
              onClick={() => setMobileMenu(false)}
              className="border-b border-gray-100 py-3 text-sm font-medium text-gray-800 hover:text-[#00b207]"
            >
              Categories
            </a>
            <a
              href="#"
              onClick={() => setMobileMenu(false)}
              className="border-b border-gray-100 py-3 text-sm font-medium text-gray-800 hover:text-[#00b207]"
            >
              Blog
            </a>
            <a
              href="#"
              onClick={() => setMobileMenu(false)}
              className="py-3 text-sm font-medium text-gray-800 hover:text-[#00b207]"
            >
              Contact
            </a>
            <div className="mt-2 flex items-center gap-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
              <FiUser size={17} />
              <span>My Account</span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
export default Navbar;
