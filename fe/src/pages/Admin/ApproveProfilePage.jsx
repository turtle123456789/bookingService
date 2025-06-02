import { useState } from "react";

const mockProfiles = Array.from({ length: 23 }).map((_, i) => ({
  id: i + 1,
  name: `Người dùng ${i + 1}`,
  email: `user${i + 1}@gmail.com`,
  phone: `0900${i + 1}567`,
  role: i % 2 === 0 ? "Chủ cửa hàng" : "Nhân viên",
  license: "https://via.placeholder.com/100x80.png?text=GPLX",
  status:
    i % 3 === 0 ? "Đang chờ duyệt" : i % 3 === 1 ? "Đã duyệt" : "Từ chối",
}));

const ITEMS_PER_PAGE = 5;

export default function ApproveProfilePage() {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(profiles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = profiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleApprove = (id) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Đã duyệt" } : p))
    );
  };

  const handleReject = (id) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Từ chối" } : p))
    );
  };

  const handleView = (profile) => {
    alert(`Chi tiết hồ sơ: ${profile.name}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Duyệt hồ sơ người dùng</h2>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-[900px] w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Tên người dùng</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Số điện thoại</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3">Giấy phép KD</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.email}</td>
                <td className="px-4 py-3">{p.phone}</td>
                <td className="px-4 py-3">{p.role}</td>
                <td className="px-4 py-3">
                  <a
                    href={p.license}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Xem ảnh
                  </a>
                </td>
                <td className="px-4 py-3 font-medium">{p.status}</td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleView(p)}
                  >
                    Xem chi tiết
                  </button>
                  {p.status === "Đang chờ duyệt" && (
                    <>
                      <button
                        className="text-green-600 hover:underline"
                        onClick={() => handleApprove(p.id)}
                      >
                        Duyệt
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleReject(p.id)}
                      >
                        Từ chối
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Trước
        </button>
        <span className="px-4 py-1">{currentPage} / {totalPages}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Sau
        </button>
      </div>
    </div>
  );
}
