import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getUsersThunk } from '../../redux/userSlice';

export default function UserManagementPage() {
  const dispatch = useDispatch();

  // Lấy users từ redux state
  const users = useSelector((state) => state.user.usersList || []);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getUsersThunk());
  }, [dispatch]);

  // Filter & phân trang
  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleLock = (id) => {
    // Ở đây bạn có thể dispatch action update status nếu có
    alert(`Bạn muốn khóa tài khoản ID ${id}? Chức năng cập nhật chưa được cài đặt.`);
  };

  const handleView = (user) => {
    alert(`Chi tiết: ${user.username}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Quản lý người dùng</h2>

      {/* Hiển thị loading hoặc error */}
      {loading && <p>Đang tải danh sách người dùng...</p>}

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên người dùng..."
          className="px-4 py-2 border rounded w-96"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Tên người dùng</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Số điện thoại</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Không có người dùng nào
                </td>
              </tr>
            )}
            {currentUsers.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-4 py-3">{user.username}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.phonenumber || '-'}</td>
                <td className="px-4 py-3">{user.role || '-'}</td>
                <td className="px-4 py-3 font-medium">{user.status ? "Hoạt động" : "Bị khóa"}</td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    onClick={() => handleView(user)}
                    className="text-blue-600 hover:underline"
                  >
                    Xem chi tiết
                  </button>
                  {user.role !== 'admin' && 
                  (
                    <>
                      {user.status ?  (
                        <button
                          onClick={() => handleLock(user.id)}
                          className="text-red-600 hover:underline"
                        >
                          Khóa tài khoản
                        </button>
                      ):
                      (
                        <button
                          onClick={() => handleLock(user.id)}
                          className="text-green-600 hover:underline"
                        >
                          Mở khóa
                        </button>
                      )}
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
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Sau
        </button>
      </div>
    </div>
  );
}
