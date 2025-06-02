import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

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
    image: null, // lưu file ảnh
    description: "",
    price: "",     // thêm price
    deposit: "",   // thêm deposit
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((f) => ({ ...f, image: file }));
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = new FormData();
    dataToSubmit.append("name", formData.name);
    dataToSubmit.append("subCategoryId", formData.subCategoryId);
    if (formData.image) dataToSubmit.append("image", formData.image);
    dataToSubmit.append("description", formData.description);
    dataToSubmit.append("price", formData.price);
    dataToSubmit.append("deposit", formData.deposit);

    onCreate(dataToSubmit);

    setFormData({
      name: "",
      subCategoryId: "",
      image: null,
      description: "",
      price: "",
      deposit: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-[400px] max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Tạo dịch vụ mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Thêm input giá tiền */}
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

          {/* Thêm input tiền cọc */}
          <input
            type="number"
            name="deposit"
            placeholder="Tiền phải cọc"
            value={formData.deposit}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="w-full border rounded px-3 py-2"
          />

          {/* Chọn ảnh */}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded px-3 py-2"
          />

          {/* CKEditor cho description */}
          <div>
            <label className="block mb-1 font-semibold">Mô tả</label>
            <CKEditor
              editor={ClassicEditor}
              data={formData.description}
              onChange={(event, editor) => {
                const data = editor.getData();
                setFormData((f) => ({ ...f, description: data }));
              }}
            />
          </div>

          <div className="flex justify-end gap-3">
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
              {loading? "Đang tạo ..."  : "Tạo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
