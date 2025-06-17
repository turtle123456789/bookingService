import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { approveBookingThunk, getAllBookingsThunk } from "../../redux/bookingSlice";
import { toast } from "react-toastify";

export default function BookingList() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.booking);
  const { userInfo } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
const [showModal, setShowModal] = useState(false);

  const pageSize = 10;
  useEffect(() => {
    dispatch(getAllBookingsThunk());
  }, [dispatch]);
const handleApprove = async (id, status) => {
  try {
    const resultAction = await dispatch(approveBookingThunk({ id, status }));

    if (approveBookingThunk.fulfilled.match(resultAction)) {
      toast.success(`Đã ${status === 'completed' ? 'xác nhận' : 'từ chối'} lịch thành công!`);
      await dispatch(getAllBookingsThunk());
    } else {
      toast.error("Duyệt lịch thất bại!");
      console.error("Approve lỗi:", resultAction.payload);
    }
  } catch (error) {
    toast.error("Đã xảy ra lỗi!");
    console.error("Lỗi hệ thống:", error);
  }
};
const closeModal = () => {
  setShowModal(false);
  setSelectedBooking(null);
};
const filteredData = bookings
  .filter((item) => {
    if (userInfo?.role === "admin") return true;
    if (userInfo?.role === "shop") return item?.service?.creator?.id === userInfo?.id;
    if (userInfo?.role === "customer") return item?.userId === userInfo?.id;
    return false;
  })
  .filter(
    (item) =>
      item?.customer?.username.toLowerCase().includes(search.toLowerCase()) ||
      item?.service?.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Đặt lịch</h2>

      {loading && <p>Đang tải dữ liệu...</p>}
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
              <th className="px-6 py-3">Tổng tiền</th>
              <th className="px-6 py-3">Tiền đã cọc</th>
              <th className="px-6 py-3">Thời gian đặt lịch</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              console.log('item :>> ', item),
              <tr key={item?.id} className="border-b">
                <td className="px-6 py-3">{item?.customer?.username}</td>
                <td className="px-6 py-3">{item?.service?.name}</td>
                <td className="px-6 py-3">{item?.service?.creator.username}</td>
                <td className="px-6 py-3">{item?.service?.price}</td>
                <td className="px-6 py-3">{(item?.depositAmount || 0)}</td>
               <td className="px-6 py-3">
                  {item?.service?.workingHours[0]?.day} ({item?.service?.workingHours[0]?.from} - {item?.service?.workingHours[0]?.to})
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded text-white text-xs ${
                      item?.status === "completed"
                        ? "bg-green-500"
                        : item?.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {item?.status === "completed" ? "Đã duyệt" : item?.status === "cancelled" ? "Đã từ chối" : "Đợi duyệt"}
                  </span>
                </td>
                <td className="px-6 py-3 space-x-3">
                  {item?.status === "Đã xác nhận" || item?.status === "Đã huỷ" ? (
                    <button className="text-blue-600 hover:underline">
                      Xem chi tiết
                    </button>
                  ) : (
                    <>
                    {userInfo.role === "shop" && item.status === "pending" && 
                    (
                      <>
                        <button className="text-green-600 hover:underline" onClick={()=>handleApprove(item.id ,"completed")}>
                          Xác nhận
                        </button>
                        <button className="text-red-600 hover:underline" onClick={()=>handleApprove(item.id ,"cancelled")}>
                          Từ chối
                        </button>
                      </>
                    )}
                     <button
                      className="text-blue-600 hover:underline"
                      onClick={() => {
                        setSelectedBooking(item);
                        setShowModal(true);
                      }}
                    >
                      Xem chi tiết
                    </button>

                    </>
                  )}
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && !loading && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Không có dữ liệu phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    {showModal && selectedBooking && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          >
            ✕
          </button>

          <h3 className="text-xl font-bold mb-4">Chi tiết đặt lịch</h3>

          <div className="space-y-3 text-sm overflow-auto max-h-[650px]">
            <div><strong>Khách hàng:</strong> {selectedBooking.customer.username} ({selectedBooking.customer.email})</div>
            <div><strong>Dịch vụ:</strong> {selectedBooking.service.name}</div>
            <div><strong>Mô tả:</strong> <span dangerouslySetInnerHTML={{ __html: selectedBooking.service.description }} /></div>
            <div><strong>Giá:</strong> {selectedBooking.service.price}đ</div>
            <div><strong>Đã cọc:</strong> {selectedBooking.depositAmount}đ</div>
            <div><strong>Mã giảm giá:</strong> {selectedBooking.service.coupons?.map(c => `${c.code} (-${c.discountPercent}%)`).join(", ") || "Không có"}</div>
            <div><strong>Trạng thái:</strong> 
              {selectedBooking.status === "completed" ? "Đã duyệt" :
              selectedBooking.status === "cancelled" ? "Đã từ chối" : "Đợi duyệt"}
            </div>
            <div>
              <strong>Thời gian làm:</strong>{" "}
              {selectedBooking.bookingDate?.map((t, idx) => (
                <div key={idx}>
                  {t.day}: {t.from} - {t.to}
                </div>
              ))}
            </div>
            <div>
              <strong>Cửa hàng:</strong> {selectedBooking.service.creator.username} ({selectedBooking.service.creator.email})
            </div>
            {/* Nếu bạn có địa chỉ shop thì thêm dòng này: */}
            {/* <div><strong>Địa chỉ:</strong> {selectedBooking.service.creator.address}</div> */}
          </div>
        </div>
      </div>
    )}

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
