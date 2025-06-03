import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePasswordThunk, updateProfileThunk } from "../../redux/userSlice";
import { toast } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
const cityOptions = [
  { id: 'hanoi', name: 'Hà Nội' },
  { id: 'hochiminh', name: 'TP. Hồ Chí Minh' },
  { id: 'danang', name: 'Đà Nẵng' },
];

const districtOptions = {
  hanoi: [
    { id: 'ba_dinh', name: 'Ba Đình' },
    { id: 'dong_da', name: 'Đống Đa' },
    { id: 'hoan_kiem', name: 'Hoàn Kiếm' },
  ],
  hochiminh: [
    { id: 'quan_1', name: 'Quận 1' },
    { id: 'quan_3', name: 'Quận 3' },
    { id: 'binh_thanh', name: 'Bình Thạnh' },
  ],
  danang: [
    { id: 'hai_chau', name: 'Hải Châu' },
    { id: 'son_tra', name: 'Sơn Trà' },
  ],
};

const wardOptions = {
  ba_dinh: [
    { id: 'phuc_xa', name: 'Phúc Xá' },
    { id: 'truc_bach', name: 'Trúc Bạch' },
  ],
  dong_da: [
    { id: 'cat_linh', name: 'Cát Linh' },
    { id: 'quan_thanh', name: 'Quán Thánh' },
  ],
  quan_1: [
    { id: 'ben_nghe', name: 'Bến Nghé' },
    { id: 'ben_thanh', name: 'Bến Thành' },
  ],
  //... bạn có thể thêm các wards khác tương tự
};

export default function Profile() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phonenumber: "",
    role: "",
    city: "",
    district: "",
    ward: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Dùng để lưu ảnh avatar tạm khi chọn file
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (userInfo) {
      setFormData({
        username: userInfo.username || "",
        email: userInfo.email || "",
        phonenumber: userInfo.phonenumber || "",
        role: userInfo.role || "",
        city: userInfo.city || "",
        district: userInfo.district || "",
        ward: userInfo.ward || "",
      });
      setAvatarPreview(userInfo.avatar || "https://via.placeholder.com/150");
    }
  }, [userInfo]);

  // Xử lý thay đổi input text
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Xử lý chọn file ảnh avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Xử lý submit form cập nhật
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const updateData = new FormData();
    updateData.append("username", formData.username);
    updateData.append("email", formData.email);
    updateData.append("phonenumber", formData.phonenumber);
    updateData.append("city", formData.city || "");
    updateData.append("district", formData.district || "");
    updateData.append("ward", formData.ward || "");

    if (avatarFile) {
      updateData.append("avatar", avatarFile);
    }

    // Dispatch async action, đợi hoàn thành
    await dispatch(updateProfileThunk(updateData));

    toast.success("Cập nhập thông tin thành công");
    setIsEditModalOpen(false);
  } catch (error) {
    // Bắt lỗi nếu có
    console.error("Lỗi cập nhật thông tin:", error);
    toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại.");
  }
};


const handlePasswordSubmit = (e) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    toast.error("Mật khẩu mới và mật khẩu xác nhận không khớp")
    return;
  }

  // Gọi API đổi mật khẩu thông qua redux thunk
  dispatch(updatePasswordThunk({ oldPassword, newPassword }))
    .unwrap()
    .then(() => {
      toast.success("Đổi mật khẩu thành công!");
      // Reset các trường sau khi submit thành công
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    })
    .catch((error) => {
      toast.error("Mật khẩu cũ không khớp");
    });
};

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
        <form className="grid grid-cols-3 gap-6 items-start">
          <div className="col-span-1 flex flex-col items-center">
            <img
              src={avatarPreview || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-2 border-gray-300 object-cover"
            />
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Cập nhật thông tin
            </button>
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600">Họ và tên</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                disabled
                className="w-full mt-1 p-2 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full mt-1 p-2 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-600">Số điện thoại</label>
              <input
                type="text"
                name="phonenumber"
                value={formData.phonenumber}
                disabled
                className="w-full mt-1 p-2 border rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-600">Vai trò</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                disabled
                className="w-full mt-1 p-2 border rounded bg-gray-100"
              />
            </div>
          </div>

        </form>
      )}

      {/* Modal popup cập nhật thông tin */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Cập nhật thông tin</h3>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-2 gap-4"
              encType="multipart/form-data"
            >
              <div>
                <label className="block text-gray-600 mb-1">Ảnh đại diện</label>
                <img
                  src={avatarPreview || "https://via.placeholder.com/150"}
                  alt="Preview Avatar"
                  className="w-24 h-24 rounded-full object-cover mb-2 border"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>

              <div>
                <label className="block text-gray-600">Họ và tên</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600">Số điện thoại</label>
                <input
                  type="text"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-600">Vai trò</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  disabled
                  className="w-full mt-1 p-2 border rounded bg-gray-100"
                />
              </div>        
              <div>
                <label className="block text-gray-600">Tỉnh/Thành phố</label>
                <select
                  name="city"
                  value={formData.city || ""}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData(prev => ({ 
                      ...prev, 
                      district: "", // reset district khi đổi city
                      ward: ""      // reset ward khi đổi city
                    }));
                  }}
                  className="w-full mt-1 p-2 border rounded"
                  required
                >
                  <option value="">Chọn tỉnh/thành phố</option>
                  {cityOptions.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600">Quận/Huyện</label>
                <select
                  name="district"
                  value={formData.district || ""}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData(prev => ({ ...prev, ward: "" })); // reset ward khi đổi district
                  }}
                  className="w-full mt-1 p-2 border rounded"
                  required
                  disabled={!formData.city}
                >
                  <option value="">Chọn quận/huyện</option>
                  {(districtOptions[formData.city] || []).map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-600">Phường/Xã</label>
                <select
                  name="ward"
                  value={formData.ward || ""}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                  required
                  disabled={!formData.district}
                >
                  <option value="">Chọn phường/xã</option>
                  {(wardOptions[formData.district] || []).map((ward) => (
                    <option key={ward.id} value={ward.id}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>
               <div className="col-span-2 flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab Đổi mật khẩu */}
      {activeTab === "password" && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div className="relative">
            <label className="block text-gray-600">Mật khẩu cũ</label>
            <input
              type={showOldPassword ? "text" : "password"}
              className="w-full mt-1 p-2 border rounded"
              placeholder="Nhập mật khẩu cũ"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowOldPassword((prev) => !prev)}
              className="absolute right-2 top-10 text-gray-600"
              tabIndex={-1}
            >
              {showOldPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-gray-600">Mật khẩu mới</label>
            <input
              type={showNewPassword ? "text" : "password"}
              className="w-full mt-1 p-2 border rounded"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-2 top-10 text-gray-600"
              tabIndex={-1}
            >
              {showNewPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-gray-600">Xác nhận mật khẩu mới</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full mt-1 p-2 border rounded"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-2 top-10 text-gray-600"
              tabIndex={-1}
            >
              {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Đang đổi..." : "Đổi mật khẩu"}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
