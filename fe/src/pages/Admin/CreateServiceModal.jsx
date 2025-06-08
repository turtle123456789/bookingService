import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CreateServiceModal({
  isOpen,
  onClose,
  loading,
  onCreate,
  subCategoryOptions = [],
}) {
  const [formData, setFormData] = useState({
    name: "",
    subCategoryId: "",
    image: null,
    description: "",
    price: "",
    deposit: "",
    imagePreview: null,

  });

  const [workingHours, setWorkingHours] = useState([{ day: "", from: "", to: "" }]);
  
  // Thêm state quản lý coupons
  const [coupons, setCoupons] = useState([{ code: "", discountPercent: "" }]);
  const navigate = useNavigate()
  const { userInfo } = useSelector((state) => state.user);
  useEffect(()=>{
    if(userInfo?.role !== 'shop'){
      navigate('/admin/profile')
    }
  },[userInfo,navigate])
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const imagePreview = URL.createObjectURL(file);
    setFormData((f) => ({ ...f, image: file, imagePreview }));
  }
};


  const handleWorkingHourChange = (index, field, value) => {
    const updated = [...workingHours];
    updated[index][field] = value;
    setWorkingHours(updated);
  };

  const addWorkingHour = () => {
    setWorkingHours([...workingHours, { day: "", from: "", to: "" }]);
  };

  const removeWorkingHour = (index) => {
    const updated = [...workingHours];
    updated.splice(index, 1);
    setWorkingHours(updated);
  };

  // Xử lý thay đổi coupon
  const handleCouponChange = (index, field, value) => {
    const updated = [...coupons];
    updated[index][field] = value;
    setCoupons(updated);
  };

  const addCoupon = () => {
    setCoupons([...coupons, { code: "", discountPercent: "" }]);
  };

  const removeCoupon = (index) => {
    const updated = [...coupons];
    updated.splice(index, 1);
    setCoupons(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = new FormData();
    dataToSubmit.append("name", formData.name);
    dataToSubmit.append("subCategoryId", formData.subCategoryId);
    if (formData.image) dataToSubmit.append("image", formData.image);
    dataToSubmit.append("description", formData.description);
    dataToSubmit.append("price", formData.price);
    dataToSubmit.append("deposit", formData.deposit);
    dataToSubmit.append("workingHours", JSON.stringify(workingHours));
    dataToSubmit.append("coupons", JSON.stringify(coupons)); // Gửi coupons dưới dạng JSON

    onCreate(dataToSubmit);

    // Reset form sau submit
    setFormData({
      name: "",
      subCategoryId: "",
      image: null,
      description: "",
      price: "",
      deposit: "",
    });
    setWorkingHours([{ day: "", from: "", to: "" }]);
    setCoupons([{ code: "", discountPercent: "" }]);
  };

  if (!isOpen) return null;

  class CustomUploadAdapter {
    constructor(loader) {
      this.loader = loader;
    }

    upload() {
      return this.loader.file.then((file) => {
        const data = new FormData();
        data.append("upload", file);
        return fetch(`${process.env.REACT_APP_API_URL}/upload-image`, {
          method: "POST",
          body: data,
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.url) {
              return { default: res.url };
            } else {
              return Promise.reject(res.error || "Upload thất bại");
            }
          });
      });
    }

    abort() {}
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-[50%] max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Tạo dịch vụ mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... các input cũ ... */}
          <input
            type="text"
            name="name"
            placeholder="Tên dịch vụ"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
          <select
            name="subCategoryId"
            value={formData.subCategoryId}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Chọn Danh mục con --</option>
            {subCategoryOptions.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="price"
            placeholder="Giá tiền"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="number"
            name="deposit"
            placeholder="Phần trăm phải cọc"
            value={formData.deposit}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded px-3 py-2"
          />
          {formData.imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Xem trước ảnh:</p>
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover border mt-1 rounded-full"
              />
            </div>
          )}

          <div>
            <label className="block mb-1 font-semibold">Mô tả</label>
            <CKEditor
              editor={ClassicEditor}
              data={formData.description}
              onReady={(editor) => {
                editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
                  return new CustomUploadAdapter(loader);
                };
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setFormData((f) => ({ ...f, description: data }));
              }}
            />
          </div>

          {/* Khung giờ hoạt động */}
          <div>
            <label className="block font-semibold mb-1">Khung giờ hoạt động</label>
            {workingHours.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <select
                  name="workDays"
                  value={item.day}
                  onChange={(e) => handleWorkingHourChange(index, "day", e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">-- Chọn ngày --</option>
                  <option value="Thứ 2">Thứ 2</option>
                  <option value="Thứ 3">Thứ 3</option>
                  <option value="Thứ 4">Thứ 4</option>
                  <option value="Thứ 5">Thứ 5</option>
                  <option value="Thứ 6">Thứ 6</option>
                  <option value="Thứ 7">Thứ 7</option>
                  <option value="Chủ nhật">Chủ nhật</option>
                </select>

                <input
                  type="time"
                  value={item.from}
                  onChange={(e) => handleWorkingHourChange(index, "from", e.target.value)}
                  className="w-[30%] border rounded px-2 py-1"
                  required
                />
                <input
                  type="time"
                  value={item.to}
                  onChange={(e) => handleWorkingHourChange(index, "to", e.target.value)}
                  className="w-[30%] border rounded px-2 py-1"
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeWorkingHour(index)}
                    className="text-red-500 text-lg"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addWorkingHour}
              className="text-blue-600 text-sm mt-1"
            >
              + Thêm khung giờ
            </button>
          </div>

          {/* Thêm phần coupons */}
          <div>
            <label className="block font-semibold mb-1">Mã giảm giá (Coupons)</label>
            {coupons.map((coupon, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Mã coupon"
                  value={coupon.code}
                  onChange={(e) => handleCouponChange(index, "code", e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="% giảm"
                  value={coupon.discountPercent}
                  onChange={(e) =>
                    handleCouponChange(index, "discountPercent", e.target.value)
                  }
                  min="0"
                  max="100"
                  className="w-[100px] border rounded px-3 py-2"
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeCoupon(index)}
                    className="text-red-500 text-lg"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addCoupon}
              className="text-blue-600 text-sm mt-1"
            >
              + Thêm mã giảm giá
            </button>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Đang tạo..." : "Tạo dịch vụ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
