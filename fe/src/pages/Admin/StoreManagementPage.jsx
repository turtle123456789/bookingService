import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopsThunk } from "../../redux/shopSlice";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

export default function StoreManagementPage() {
  const dispatch = useDispatch();
  const { shopList, loading, error } = useSelector(state => state.shops);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchShopsThunk());
  }, [dispatch]);

  const filtered = shopList.filter((s) =>
    s?.username?.toLowerCase().includes(search.toLowerCase())
  );

  const paged = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const toggleStatus = async (id) => {
    try {
      const res = await axios.patch(`/api/stores/${id}/toggle-status`);
      const updatedStore = res.data;

      // Cập nhật tạm trong local state (hoặc dispatch thêm một thunk nếu cần đồng bộ hóa Redux)
      const updated = shopList.map((s) =>
        s.id === id ? { ...s, status: updatedStore.status } : s
      );

      // Có thể dispatch lên Redux nếu cần: dispatch(updateShop(updated));
      // Ở đây dùng tạm setState để phản hồi nhanh
    } catch (error) {
      alert("Không thể cập nhật trạng thái cửa hàng.");
    }
  };

  const viewDetail = (store) => {
    alert(`Chi tiết cửa hàng: ${store?.username}`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Quản lý cửa hàng</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Thêm cửa hàng
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm tên cửa hàng..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-4 py-2 rounded w-96"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        {loading ? (
          <div className="p-6 text-center">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Tên cửa hàng</th>
                <th className="px-4 py-2">Số điện thoại</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Hình ảnh</th>
                <th className="px-4 py-2">Chứng chỉ</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((store) => (
                <tr key={store.id} className="border-b">
                  <td className="px-4 py-3">{store?.username}</td>
                  <td className="px-4 py-3">{store.phonenumber}</td>
                  <td className="px-4 py-3">{store.email}</td>
                  <td className="px-4 py-3">
                    <img
                      src={store.image}
                      alt="img"
                      className="w-12 h-12 rounded object-cover"
                    />
                  </td>
                   <td className="px-4 py-3">
                    <img
                      src={store.businessLicenseFile}
                      alt="img"
                      className="w-12 h-12 rounded object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">{store.status}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => viewDetail(store)}
                    >
                      Xem chi tiết
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => toggleStatus(store.id)}
                    >
                      {store.status === "Đang hoạt động" ? "Khóa" : "Mở khóa"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && (
        <div className="flex justify-end mt-4 items-center space-x-3">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
