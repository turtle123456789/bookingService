import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopsThunk } from "../../redux/shopSlice";
import { getCategories } from "../../redux/categorySlice";
import CreateServiceModal from "./CreateServiceModal";
import { createServiceThunk, fetchServicesThunk } from "../../redux/serviceSlice";

const PAGE_SIZE = 10;

export default function ServiceManagement() {
  const [search, setSearch] = useState("");
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [page, setPage] = useState(1);
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const { shopList } = useSelector((state) => state.shops);
  const { list } = useSelector((state) => state.category);
  const allSubCategories = list.flatMap((cat) => cat.subCategories || []);

  const { createdService, loading, error, services: servicesFromStore } = useSelector((state) => state.service);
  console.log('services :>> ', services);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShopsThunk({ isActivated: true }));
    dispatch(getCategories());
    dispatch(fetchServicesThunk()); // <-- Gọi lấy dịch vụ lúc mount
  }, [dispatch]);

  // Cập nhật lại services local khi services trong Redux store thay đổi
  useEffect(() => {
    if (servicesFromStore) {
      setServices(servicesFromStore);
    }
  }, [servicesFromStore]);

  // Thêm dịch vụ mới tạo vào danh sách
  useEffect(() => {
    if (createdService) {
      setServices((prev) => [createdService, ...prev]);
      setPage(1);
      setIsModalOpen(false);
      dispatch(fetchServicesThunk());
    }
  }, [createdService, dispatch]);

const filteredServices = useMemo(() => {
  if (!services) return [];

  return services.filter((s) => {
    console.log('s :>> ', s);
    if (userInfo?.role === "shop" && s?.creator?.id !== userInfo?.id) {
      return false;
    }

    // Áp dụng điều kiện lọc chung
    const matchSearch =
      s?.name?.toLowerCase().includes(search?.toLowerCase()) ||
      s?.description?.toLowerCase().includes(search?.toLowerCase());

    const matchShop = selectedShop ? s?.creator?.id === Number(selectedShop) : true;
    const matchSubCategory = selectedSubCategory
      ? s?.subCategoryId === Number(selectedSubCategory)
      : true;

    return matchSearch && matchShop && matchSubCategory;
  });
}, [search, selectedShop, selectedSubCategory, services, userInfo]);

  const totalPages = Math.ceil(filteredServices?.length / PAGE_SIZE);
  const paginatedServices = filteredServices?.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleEdit = (id) => {
    alert("Chỉnh sửa dịch vụ id: " + id);
  };

  const handleDelete = (id) => {
    setServices((prev) => prev.filter((s) => s?.id !== id));
  };

  const handleCreate = (newService) => {
    dispatch(createServiceThunk(newService));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Quản lý dịch vụ</h2>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên ..."
          className="p-3 border rounded flex-grow max-w-md"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

      
         {userInfo?.role === "admin" &&(
          <>
              <select
          className="p-3 border rounded max-w-xs"
          value={selectedShop}
          onChange={(e) => {
            setSelectedShop(e.target.value);
            setPage(1);
          }}
        >
          <option value="">-- Chọn cửa hàng --</option>
          {shopList.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.username}
            </option>
          ))}
        </select>

        <select
          className="p-3 border rounded max-w-xs"
          value={selectedSubCategory}
          onChange={(e) => {
            setSelectedSubCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">-- Chọn danh mục con --</option>
          {allSubCategories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
          </>
       )
       }
       {userInfo?.role === "shop" &&(
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Thêm dịch vụ
        </button>
       )
       }
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-[800px] w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">Tên dịch vụ</th>
              <th className="px-6 py-3">Hình ảnh</th>
              <th className="px-6 py-3">Cửa hàng</th>
              <th className="px-6 py-3">Danh mục</th>
              <th className="px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedServices?.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Không có dịch vụ phù hợp
                </td>
              </tr>
            )}

            {paginatedServices?.map((s) => (
              <tr key={s?.id} className="border-b">
                <td className="px-6 py-3">{s?.name}</td>
                <td className="px-6 py-3">
                  {s?.image ? (
                    <img
                      src={s?.image}
                      alt={s?.name}
                      className="w-20 h-12 object-cover rounded"
                    />
                  ) : (
                    <span>Không có ảnh</span>
                  )}
                </td>
                <td className="px-6 py-3">
                   {s?.creator?.username}
                </td>
                <td className="px-6 py-3">
                  {allSubCategories?.find((cat) => cat.id === s?.subCategoryId)?.name || "N/A"}
                </td>
                <td className="px-6 py-3 space-x-3">
                  <button
                    onClick={() => handleEdit(s?.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(s?.id)}
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

      <CreateServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
        subCategoryOptions={allSubCategories}
        loading={loading}
        error={error}
      />
    </div>
  );
}
