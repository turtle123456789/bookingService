import { useState } from "react";

const mockData = [
  {
    id: 1,
    customer: "Nguyễn Văn A",
    service: "Cắt tóc nam",
    store: "Salon ABC",
    time: "2025-05-26 10:00",
    status: "Đã xác nhận",
  },
  {
    id: 2,
    customer: "Trần Thị B",
    service: "Gội đầu dưỡng sinh",
    store: "Spa Relax",
    time: "2025-05-27 15:00",
    status: "Chờ xác nhận",
  },
  {
    id: 3,
    customer: "Lê Văn C",
    service: "Massage",
    store: "Happy Spa",
    time: "2025-05-28 11:00",
    status: "Đã huỷ",
  },
  {
    id: 4,
    customer: "Đặng Thị D",
    service: "Nail",
    store: "Nail House",
    time: "2025-05-29 13:30",
    status: "Đã xác nhận",
  },
  {
    id: 5,
    customer: "Phạm Văn E",
    service: "Cắt tóc nữ",
    store: "Salon ABC",
    time: "2025-05-30 09:00",
    status: "Chờ xác nhận",
  },
  {
    id: 6,
    customer: "Trịnh Văn F",
    service: "Massage đá nóng",
    store: "Relax Zone",
    time: "2025-06-01 14:00",
    status: "Đã xác nhận",
  },
  // Thêm dữ liệu mẫu cho đủ >10 bản ghi
  {
    id: 7,
    customer: "Hoàng Thị G",
    service: "Tẩy da chết",
    store: "Spa ABC",
    time: "2025-06-02 10:00",
    status: "Đã xác nhận",
  },
  {
    id: 8,
    customer: "Vũ Văn H",
    service: "Xông hơi",
    store: "Spa Relax",
    time: "2025-06-03 14:00",
    status: "Chờ xác nhận",
  },
  {
    id: 9,
    customer: "Phan Thị I",
    service: "Làm móng gel",
    store: "Nail House",
    time: "2025-06-04 09:30",
    status: "Đã huỷ",
  },
  {
    id: 10,
    customer: "Trần Văn J",
    service: "Cắt tóc nam",
    store: "Salon ABC",
    time: "2025-06-05 11:00",
    status: "Đã xác nhận",
  },
  {
    id: 11,
    customer: "Nguyễn Thị K",
    service: "Massage đá nóng",
    store: "Relax Zone",
    time: "2025-06-06 15:00",
    status: "Chờ xác nhận",
  },
];

export default function BookingList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10; // Cập nhật phân trang 10 hàng mỗi trang

  const filteredData = mockData.filter(
    (item) =>
      item.customer.toLowerCase().includes(search.toLowerCase()) ||
      item.service.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Đặt lịch</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên dịch vụ hoặc khách hàng..."
          className="w-full max-w-md p-3 border rounded shadow-sm"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-[900px] text-sm text-left w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">Khách hàng</th>
              <th className="px-6 py-3">Dịch vụ</th>
              <th className="px-6 py-3">Cửa hàng</th>
              <th className="px-6 py-3">Thời gian đặt lịch</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-6 py-3">{item.customer}</td>
                <td className="px-6 py-3">{item.service}</td>
                <td className="px-6 py-3">{item.store}</td>
                <td className="px-6 py-3">{item.time}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded text-white text-xs ${
                      item.status === "Đã xác nhận"
                        ? "bg-green-500"
                        : item.status === "Chờ xác nhận"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
               <td className="px-6 py-3 space-x-3">
                {item.status === "Đã xác nhận" || item.status === "Đã huỷ" ? (
                    <button className="text-blue-600 hover:underline">Xem chi tiết</button>
                ) : (
                    <>
                    <button className="text-green-600 hover:underline">Xác nhận</button>
                    <button className="text-red-600 hover:underline">Từ chối</button>
                    <button className="text-blue-600 hover:underline">Xem chi tiết</button>
                    </>
                )}
                </td>

              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Không có dữ liệu phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="flex justify-end mt-4 gap-3">
        <button
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Trước
        </button>
        <span className="px-3 py-1">
          Trang {page}/{totalPages}
        </span>
        <button
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Sau
        </button>
      </div>
    </div>
  );
}
