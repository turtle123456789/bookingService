import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUserCheck } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/userSlice";
import { getCategories } from "../../redux/categorySlice";

const services = [
  "Tư vấn thiết kế",
  "Lắp đặt",
  "Bảo trì",
  "Hỗ trợ kỹ thuật",
];

const mainMenu = [
  { name: "Trang chủ", href: "/" },
  { name: "Dịch vụ", href: "/service" },
  { name: "Cửa hàng", href: "/store" },
  { name: "Đặt lịch", href: "/choice-service" },
];

const HeaderComponent = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoverDropdown, setHoverDropdown] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); 
  const { list } = useSelector(state => state.category);

  const handleLogout = () => {
    dispatch(logout());

    navigate("/");
    setUserDropdownOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
     dispatch(getCategories());
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="bg-green-700 sticky top-0 z-10">
      <header className="font-sans container m-auto transition-all">
        <div className="text-white px-6 py-2 flex justify-between items-center">
          <div className="sm:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>

          <div className="text-xl font-bold tracking-wide cursor-pointer">
            <Link to="/" className="hover:text-green-400 transition-colors">
              DVSG
            </Link>
          </div>

        <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
            <UserCircleIcon className="h-8 w-8 text-green-400 cursor-pointer" 
              onClick={() => setUserDropdownOpen(!userDropdownOpen)} />

            {userInfo ? (
              <>
                <span
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="font-semibold text-white cursor-pointer select-none"
                >
                  Xin chào, {userInfo.username || "Người dùng"}
                  <ChevronDownIcon
                    className="inline-block ml-1 h-5 w-5 text-white"
                  />
                </span>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-2 right-0 mt-10 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div className="py-1 text-gray-700">
                        <Link
                          to="/admin/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-green-100"
                        >
                          Trang quản lý
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-red-100 text-red-600"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-green-400 font-semibold"
                >
                  Đăng nhập
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  to="/register"
                  className="hover:text-green-400 font-semibold"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="text-white px-6 py-3 hidden sm:flex justify-between items-center">
          <div
            className="relative"
            onMouseEnter={() => setHoverDropdown(true)}
            onMouseLeave={() => setHoverDropdown(false)}
          >
            <div className="inline-flex items-center py-2 font-medium text-white cursor-pointer hover:bg-green-800 select-none">
              Danh sách dịch vụ
              <ChevronDownIcon className="ml-2 h-5 w-5 text-white" />
            </div>

            <AnimatePresence>
              {hoverDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-full w-56 mt-0 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div className="py-1">
                     {list.map((category) => (
                        <div key={category.id} className="group px-4 py-2 hover:bg-green-100">
                           <div className="flex items-center space-x-2 mb-1">
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-6 h-6 object-cover rounded"
                            />
                            <span className="font-semibold text-gray-800">{category.name}</span>
                          </div>
                          {category.subCategories?.length > 0 && (
                            <ul className="ml-3 space-y-1">
                              {category.subCategories.map((sub) => (
                                <li key={sub.id} className="flex items-center space-x-2 hover:bg-slate-300 cursor-pointer p-2 mb-1">
                                  <img
                                    src={sub.subImages}
                                    alt={sub.name}
                                    className="w-6 h-6 object-cover rounded"
                                  />
                                  <span className="text-sm text-gray-700">{sub.name}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <nav className="hidden sm:flex space-x-6 font-semibold text-white">
            {mainMenu.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="hover:text-green-300 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden sm:block">
            <Link
              to="/partner"
              className="text-white font-semibold px-4 py-2 rounded-md transition-colors flex gap-2 items-center"
            >
              <FiUserCheck />
              Trở thành đối tác
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden px-6 py-2 space-y-2"
            >
              {mainMenu.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-white font-medium hover:text-green-300"
                >
                  {item.name}
                </Link>
              ))}

              <Link
                to="/partner"
                className="block text-white font-medium hover:text-green-300"
              >
                Trở thành đối tác
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setHoverDropdown(true)}
                onMouseLeave={() => setHoverDropdown(false)}
              >
                <div className="inline-flex items-center font-medium text-white cursor-pointer hover:bg-green-800 select-none">
                  Danh sách dịch vụ
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-white" />
                </div>

                <AnimatePresence>
                  {hoverDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-full w-56 mt-0 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div className="py-1">
                        {services.map((service) => (
                          <Link
                            key={service}
                            to="/"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-green-900"
                          >
                            {service}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
};

export default HeaderComponent;
