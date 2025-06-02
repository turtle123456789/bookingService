import React, { useState } from "react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Hồ sơ cá nhân</h2>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("info")}
          className={`px-4 py-2 mr-4 font-medium ${
            activeTab === "info"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Hồ sơ
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2 font-medium ${
            activeTab === "password"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Đổi mật khẩu
        </button>
      </div>

      {/* Tab Hồ sơ */}
      {activeTab === "info" && (
        <div className="grid grid-cols-3 gap-6 items-start">
          {/* Avatar */}
          <div className="col-span-1 flex flex-col items-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Avatar"
              className="w-32 h-32 rounded-full border-2 border-gray-300 object-cover"
            />
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Đổi ảnh
            </button>
          </div>

          {/* Info */}
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600">Họ và tên</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value="Nguyễn Văn A"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                className="w-full mt-1 p-2 border rounded"
                value="nguyenvana@gmail.com"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-600">Số điện thoại</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value="0123456789"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-600">Vai trò</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                value="Quản trị viên"
                readOnly
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab Đổi mật khẩu */}
      {activeTab === "password" && (
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-gray-600">Mật khẩu cũ</label>
            <input
              type="password"
              className="w-full mt-1 p-2 border rounded"
              placeholder="Nhập mật khẩu cũ"
            />
          </div>
          <div>
            <label className="block text-gray-600">Mật khẩu mới</label>
            <input
              type="password"
              className="w-full mt-1 p-2 border rounded"
              placeholder="Nhập mật khẩu mới"
            />
          </div>
          <div>
            <label className="block text-gray-600">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              className="w-full mt-1 p-2 border rounded"
              placeholder="Xác nhận mật khẩu mới"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Đổi mật khẩu
          </button>
        </div>
      )}
    </div>
  );
}
