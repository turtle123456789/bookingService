import { useState, useMemo } from "react";

const mockCategories = [
  { id: 1, name: "Làm đẹp" },
  { id: 2, name: "Spa & Massage" },
  { id: 3, name: "Cắt tóc" },
];

const mockStores = [
  { id: 1, name: "Cửa hàng A" },
  { id: 2, name: "Cửa hàng B" },
  { id: 3, name: "Cửa hàng C" },
];

const mockServices = [
  {
    id: 1,
    name: "Dịch vụ chăm sóc da mặt",
    image: "https://via.placeholder.com/80x50?text=Da+mặt",
    price: 200000,
    shortDesc: "Chăm sóc da mặt chuyên nghiệp",
    categoryId: 1,
    storeId: 1,
    bookingStatus: "Mở đặt lịch",
    activeStatus: "Hoạt động",
  },
  {
    id: 2,
    name: "Massage Thái",
    image: "https://via.placeholder.com/80x50?text=Massage+Thái",
    price: 300000,
    shortDesc: "Massage Thái giúp thư giãn",
    categoryId: 2,
    storeId: 2,
    bookingStatus: "Đóng đặt lịch",
    activeStatus: "Ngưng hoạt động",
  },
  {
    id: 3,
    name: "Cắt tóc nam",
    image: "https://via.placeholder.com/80x50?text=Cắt+tóc+nam",
    price: 150000,
    shortDesc: "Cắt tóc nam thời thượng",
    categoryId: 3,
    storeId: 3,
    bookingStatus: "Mở đặt lịch",
    activeStatus: "Hoạt động",
  },
  // ... thêm nhiều dịch vụ để demo phân trang
];

const PAGE_SIZE = 10;

export default function ServiceManagement() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [page, setPage] = useState(1);

  // Lọc theo tìm kiếm và bộ lọc
  const filteredServices = useMemo(() => {
    return mockServices.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.shortDesc.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory
        ? s.categoryId === Number(selectedCategory)
        : true;
      const matchStore = selectedStore
        ? s.storeId === Number(selectedStore)
        : true;
      return matchSearch && matchCategory && matchStore;
    });
  }, [search, selectedCategory, selectedStore]);

  const totalPages = Math.ceil(filteredServices.length / PAGE_SIZE);
  const paginatedServices = filteredServices.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleEdit = (id) => {
    alert("Chỉnh sửa dịch vụ id: " + id);
  };

  const handleDelete = (id) => {
    alert("Xóa dịch vụ id: " + id);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Quản lý dịch vụ</h2>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên dịch vụ hoặc mô tả..."
          className="p-3 border rounded flex-grow max-w-md"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="p-3 border rounded max-w-xs"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">-- Chọn danh mục --</option>
          {mockCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          className="p-3 border rounded max-w-xs"
          value={selectedStore}
          onChange={(e) => {
            setSelectedStore(e.target.value);
            setPage(1);
          }}
        >
          <option value="">-- Chọn cửa hàng --</option>
          {mockStores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-[900px] w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">Tên dịch vụ</th>
              <th className="px-6 py-3">Hình ảnh</th>
              <th className="px-6 py-3">Giá cơ bản</th>
              <th className="px-6 py-3">Mô tả ngắn</th>
              <th className="px-6 py-3">Danh mục</th>
              <th className="px-6 py-3">Cửa hàng</th>
              <th className="px-6 py-3">Trạng thái đặt lịch</th>
              <th className="px-6 py-3">Trạng thái hoạt động</th>
              <th className="px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedServices.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  Không có dịch vụ phù hợp
                </td>
              </tr>
            )}

            {paginatedServices.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="px-6 py-3">{s.name}</td>
                <td className="px-6 py-3">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-20 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-3">{s.price.toLocaleString()}₫</td>
                <td className="px-6 py-3 max-w-xs truncate" title={s.shortDesc}>
                  {s.shortDesc}
                </td>
                <td className="px-6 py-3">
                  {mockCategories.find((c) => c.id === s.categoryId)?.name ||
                    "N/A"}
                </td>
                <td className="px-6 py-3">
                  {mockStores.find((st) => st.id === s.storeId)?.name || "N/A"}
                </td>
                <td className="px-6 py-3">{s.bookingStatus}</td>
                <td className="px-6 py-3">{s.activeStatus}</td>
                <td className="px-6 py-3 space-x-3">
                  <button
                    onClick={() => handleEdit(s.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
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
