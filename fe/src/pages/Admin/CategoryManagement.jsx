import React, { useEffect, useState } from "react";
import CreateCategoryForm from "./CreateCategoryForm";
import EditCategoryForm from "./EditCategoryForm";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, deleteCategoryThunk, deleteSubCategoryThunk } from "../../redux/categorySlice";
import { useNavigate } from "react-router-dom";

export default function CategoryManagement() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expandedIds, setExpandedIds] = useState([]);
  const pageSize = 10;
  const [showPopup, setShowPopup] = useState(false);

  // Thêm state confirm xóa
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null, isSub: false });
  const [editItem, setEditItem] = useState({ show: false, data: null, isSub: false });

  const dispatch = useDispatch();
  const { list, loading, error } = useSelector(state => state.category);
  const navigate = useNavigate()
  const { userInfo } = useSelector((state) => state.user);
  useEffect(()=>{
    if(userInfo?.role === 'customer'){
      navigate('/admin/profile')
    }
  },[userInfo,navigate])
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const filteredCategories = list.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const paginatedCategories = filteredCategories.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreated = () => {
    dispatch(getCategories());
    setShowPopup(false);
  };

  const handleUpdated = () => {
    dispatch(getCategories());
    setEditItem({ show: false, data: null, isSub: false });
  };

  // Xử lý mở popup confirm xóa
  const handleDeleteClick = (id, isSub = false) => {
    setConfirmDelete({ show: true, id, isSub });
  };

  const handleEditClick = (item, isSub = false) => {
    setEditItem({ show: true, data: item, isSub });
  };

  // Xác nhận xóa
  const confirmDeleteCategory = () => {
    if (confirmDelete.isSub) {
      dispatch(deleteSubCategoryThunk(confirmDelete.id)).then(() => {
        dispatch(getCategories());
      });
    } else {
      dispatch(deleteCategoryThunk(confirmDelete.id)).then(() => {
        dispatch(getCategories());
      });
    }
    setConfirmDelete({ show: false, id: null, isSub: false });
  };

  // Hủy xóa
  const cancelDelete = () => {
    setConfirmDelete({ show: false, id: null, isSub: false });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Quản lý danh mục</h2>
      {userInfo?.role === 'shop' && (
        <div className="flex items-center mb-4 gap-3">
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            className="flex-grow p-3 border rounded shadow-sm max-w-md"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <button
            onClick={() => setShowPopup(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Thêm danh mục
          </button>
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-[600px] w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">Tên danh mục</th>
              <th className="px-6 py-3">Hình ảnh</th>
              <th className="px-6 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  Không có danh mục phù hợp
                </td>
              </tr>
            )}

            {paginatedCategories?.map((cat) => (
              <React.Fragment key={cat.id}>
                <tr className="border-b">
                  <td className="px-6 py-3 flex items-center gap-2">
                    {cat.subCategories && cat.subCategories.length > 0 && (
                      <button
                        onClick={() => toggleExpand(cat.id)}
                        className="w-5 h-5 flex items-center justify-center border rounded text-sm select-none"
                        aria-label={expandedIds.includes(cat.id) ? "Thu gọn" : "Mở rộng"}
                      >
                        {expandedIds.includes(cat.id) ? "−" : "+"}
                      </button>
                    )}
                    <span>{cat.name}</span>
                  </td>
                  <td className="px-6 py-3">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-20 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-3 space-x-3">
                    <button onClick={() => handleEditClick(cat, false)} className="text-blue-600 hover:underline">Sửa</button>
                    <button
                      onClick={() => handleDeleteClick(cat.id, false)}
                      className="text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>

                {/* Danh mục cấp 2 nếu có và được mở */}
                {expandedIds.includes(cat.id) &&
                  cat?.subCategories?.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-b bg-gray-50 text-gray-700"
                    >
                      <td className="px-6 py-3 pl-12 flex items-center gap-2">
                        <span className="inline-block w-3 h-3 bg-gray-400 rounded-full"></span>
                        <span>{sub.name}</span>
                      </td>
                      <td className="px-6 py-3">
                        <img
                          src={sub.subImages}
                          alt={sub.name}
                          className="w-20 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-3 space-x-3">
                        <button onClick={() => handleEditClick(sub, true)} className="text-blue-600 hover:underline">Sửa</button>
                        <button
                          onClick={() => handleDeleteClick(sub.id, true)}
                          className="text-red-600 hover:underline"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
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

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg max-w-2xl w-full p-6 relative">
            <CreateCategoryForm
              onClose={() => setShowPopup(false)}
              onCreated={handleCreated}
            />
          </div>
        </div>
      )}

      {editItem.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg max-w-2xl w-full p-6 relative">
            <EditCategoryForm
              data={editItem.data}
              isSub={editItem.isSub}
              onClose={() => setEditItem({ show: false, data: null, isSub: false })}
              onUpdated={handleUpdated}
            />
          </div>
        </div>
      )}


      {/* Popup confirm xóa */}
      {confirmDelete.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <p className="mb-4">
              Bạn có chắc muốn xóa{" "}
              {confirmDelete.isSub ? "danh mục con" : "danh mục"} này không?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDeleteCategory}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Xóa
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
