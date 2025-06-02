import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const menuItems = [
  { name: "Trang chủ", path: "" },
  { name: "Đặt lịch", path: "booking" },
  { name: "Danh mục", path: "categories" },
  { name: "Dịch vụ", path: "services" },
  { name: "Duyệt hồ sơ", path: "approvals" },
  { name: "Người dùng", path: "users" },
  { name: "Quản lý cửa hàng", path: "stores" },
  { name: "Hồ sơ", path: "profile" },
];

export default function AdminPage() {
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
                  isActive ? "bg-green-600 font-semibold" : "hover:bg-green-600"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}
