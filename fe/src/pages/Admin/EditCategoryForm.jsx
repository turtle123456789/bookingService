import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCategoryThunk, updateSubCategoryThunk } from '../../redux/categorySlice';
import { toast } from 'react-toastify';

const EditCategoryForm = ({ data, isSub = false, onClose, onUpdated }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.category);
  const [name, setName] = useState(data.name || '');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(data.image || data.subImages || null);
  const [subCategories, setSubCategories] = useState([]);

  const handleSubChange = (index, field, value) => {
    const newSubs = [...subCategories];
    if (field === 'image') {
      newSubs[index].image = value;
      newSubs[index].preview = value ? URL.createObjectURL(value) : null;
    } else {
      newSubs[index][field] = value;
    }
    setSubCategories(newSubs);
  };

  const addSubCategory = () => setSubCategories([...subCategories, { name: '', image: null, preview: null }]);
  const removeSubCategory = (index) => {
    const newSubs = [...subCategories];
    newSubs.splice(index, 1);
    setSubCategories(newSubs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (image) formData.append('image', image);

    if (!isSub && subCategories.length > 0) {
      formData.append('subCategories', JSON.stringify(subCategories.map((s) => ({ name: s.name }))));
      subCategories.forEach((s) => {
        if (s.image) formData.append('subImages', s.image);
      });
    }

    const thunk = isSub ? updateSubCategoryThunk : updateCategoryThunk;
    dispatch(thunk({ id: data.id, data: formData }))
      .unwrap()
      .then(() => {
        toast.success('Cập nhật thành công');
        if (onUpdated) onUpdated();
      })
      .catch(() => {
        toast.error('Lỗi cập nhật');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">{isSub ? 'Sửa Danh Mục Con' : 'Sửa Danh Mục'}</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        required
      />
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          setImage(file);
          setPreview(file ? URL.createObjectURL(file) : preview);
        }}
        className="mb-2"
      />
      {preview && <img src={preview} alt="preview" className="h-20 w-20 object-cover rounded mb-2" />}

      {!isSub && subCategories.map((sub, index) => (
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
          {sub.preview && (
            <img src={sub.preview} alt="Sub Preview" className="h-16 w-16 object-cover rounded mb-1" />
          )}
          <button type="button" onClick={() => removeSubCategory(index)} className="text-red-600 text-sm">
            Xóa
          </button>
        </div>
      ))}

      {!isSub && (
        <button type="button" onClick={addSubCategory} className="bg-blue-500 text-white px-3 py-1 rounded mb-3">
          Thêm Sub Category
        </button>
      )}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">
          Đóng
        </button>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </form>
  );
};

export default EditCategoryForm;