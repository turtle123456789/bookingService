import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCategoryThunk } from '../../redux/categorySlice';
import { toast } from "react-toastify";

const CreateCategoryForm = ({ onClose, onCreated }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.category);

  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [subCategories, setSubCategories] = useState([{ name: '', image: null }]);

  const handleSubChange = (index, field, value) => {
    const newSubs = [...subCategories];
    newSubs[index][field] = value;
    setSubCategories(newSubs);
  };

  const addSubCategory = () => setSubCategories([...subCategories, { name: '', image: null }]);
  const removeSubCategory = (index) => {
    const newSubs = [...subCategories];
    newSubs.splice(index, 1);
    setSubCategories(newSubs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (image) formData.append('image', image);
    formData.append('subCategories', JSON.stringify(subCategories.map((s) => ({ name: s.name }))));

    subCategories.forEach((s) => {
      if (s.image) {
        formData.append('subImages', s.image);
      }
    });

    dispatch(createCategoryThunk(formData))
      .unwrap()
      .then((res) => {
        setName('');
        setImage(null);
        setSubCategories([{ name: '', image: null }]);
        toast.success("Tạo danh mục thành công");
        if (onCreated) onCreated();
        
      })
      .catch((err) => {
        console.error('Lỗi:', err);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">Tạo Danh Mục Mới</h2>

      <input
        type="text"
        placeholder="Tên danh mục"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        required
      />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} className="mb-4" />

      {subCategories.map((sub, index) => (
        <div key={index} className="mb-3 border p-2 rounded">
          <input
            type="text"
            placeholder="Tên sub category"
            value={sub.name}
            onChange={(e) => handleSubChange(index, 'name', e.target.value)}
            className="w-full p-1 border rounded mb-1"
            required
          />
          <input
            type="file"
            onChange={(e) => handleSubChange(index, 'image', e.target.files[0])}
            className="mb-1"
          />
          <button type="button" onClick={() => removeSubCategory(index)} className="text-red-600 text-sm">
            Xóa
          </button>
        </div>
      ))}

      <button type="button" onClick={addSubCategory} className="bg-blue-500 text-white px-3 py-1 rounded mb-3">
        Thêm Sub Category
      </button>
      <div className="flex justify-between items-center">
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
          {loading ? 'Đang gửi...' : 'Tạo danh mục'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Đóng
        </button>
      </div>
    </form>
  );
};

export default CreateCategoryForm;
