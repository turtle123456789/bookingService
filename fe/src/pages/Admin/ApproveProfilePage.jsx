import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopsThunk } from "../../redux/shopSlice";
import { updateUserStatusThunk } from "../../redux/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

export default function ApproveProfilePage() {
  const dispatch = useDispatch();
  const { shopList, loading, error } = useSelector((state) => state.shops);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null); // 🌟 Popup image
  const navigate = useNavigate()
  const { userInfo } = useSelector((state) => state.user);
  useEffect(()=>{
    if(userInfo?.role !== 'admin'){
      navigate('/admin/profile')
    }
  },[userInfo,navigate])
  useEffect(() => {
    dispatch(fetchShopsThunk({ isActivated: false }));
  }, [dispatch]);

  const totalPages = Math.ceil(shopList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = shopList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

const handleApprove = async (userId) => {
  try {
    await dispatch(updateUserStatusThunk({userId, isActive: true })).unwrap();
    dispatch(fetchShopsThunk({ isActivated: false }));
    toast.success("Đã duyệt thành công");
  } catch (err) {
    toast.error("Có lỗi xảy ra khi cập nhật trạng thái.");
  }
};

  const handleView = (profile) => {
    alert(`Chi tiết hồ sơ: ${profile.username}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Duyệt hồ sơ người dùng</h2>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500">Lỗi: {error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-[900px] w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3">Tên cửa hàng</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Số điện thoại</th>
                  <th className="px-4 py-3">Giấy phép KD</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="px-4 py-3">{p.username}</td>
                    <td className="px-4 py-3">{p.email}</td>
                    <td className="px-4 py-3">{p.phonenumber}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedImage(p.businessLicenseFile)}
                        className="text-blue-600 underline"
                      >
                        Xem ảnh
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      <span className={`px-3 py-1 rounded text-white text-xs ${p.isPayment ? "bg-green-500" : "bg-yellow-500"} `}>
                        {p.isPayment ? "Đã thanh toán" : "chưa thanh toán"}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      {!p.isActivated && (
                        <>
                          <button
                            className="text-green-600 hover:underline"
                            onClick={() => handleApprove(p.id)}
                          >
                            Duyệt
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
            <span className="px-4 py-1">
              {currentPage} / {totalPages}
            </span>
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
        </>
      )}

      {/* ✅ Modal xem ảnh */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-md relative max-w-[90%] max-h-[90%]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="License"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
