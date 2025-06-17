import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../redux/userSlice";
import { useEffect } from "react";

const fullMenuItems = [
  { name: "Trang chủ", path: "/", roles: ["admin", "shop", "customer", "guest"] }, // thêm guest cho phòng ngừa
  { name: "Thống kê", path: "report", roles: ["admin"] },
  { name: "Đặt lịch", path: "booking", roles: ["admin", "shop", "customer"] },
  { name: "Danh mục", path: "categories", roles: ["admin", "shop"] },
  { name: "Dịch vụ", path: "services", roles: ["admin", "shop"] },
  { name: "Duyệt hồ sơ", path: "approvals", roles: ["admin"] },
  { name: "Người dùng", path: "users", roles: ["admin"] },
  { name: "Quản lý cửa hàng", path: "stores", roles: ["admin"] },
  { name: "Hồ sơ", path: "profile", roles: ["admin", "shop", "customer"] },
];

export default function AdminPage() {
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = userInfo?.role || "";
   useEffect(()=>{
      if(userInfo?.role === null){
        navigate('/')
      }
    },[userInfo,navigate])
  // Lọc menu phù hợp với role
  const menuItems = fullMenuItems.filter((item) =>
    item.roles.includes(role)
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 text-white flex flex-col">
        <div className="text-2xl font-bold p-6 border-b border-green-600">
          AdminPanel
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded transition ${
                  isActive
                    ? "bg-green-600 font-semibold"
                    : "hover:bg-green-600"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Đăng xuất
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}
