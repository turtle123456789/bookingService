import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bg1 } from "../../units/importImg";
import { useSelector } from "react-redux";
import { fetchShopsThunk } from "../../redux/shopSlice";

const StoreDetailPage = () => {
  const { storeId } = useParams();
  const dispatch = useNavigate()
  const navigate = useNavigate()
    const { shopList } = useSelector(state => state.shops);
    useEffect(() => {
      dispatch(fetchShopsThunk({ isActivated: true }));
    }, [dispatch]);

  const store = shopList.find((s) => s.id === parseInt(storeId));

  if (!store) {
    return <div className="text-center py-10 text-red-500">Cửa hàng không tồn tại</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl font-bold text-[#26b65d]">{store.username}</h1>
          <p>SĐT: {store.phonenumber}</p>
          <p>Email: <a href={`mailto:${store.email}`} className="text-blue-500 underline">{store.email}</a></p>
          <p className="text-sm text-gray-700">Địa chỉ: {store.address}</p>
        </div>
        <div>
          <img
            src={store.avatar}
            alt={store.name}
            className="w-64 h-40 object-cover rounded shadow"
          />
        </div>
      </div>
      <div className="bg-white shadow rounded p-4 space-y-3 image-custom">
        <h2 className="text-xl font-semibold text-[#26b65d]">Mô tả cửa hàng</h2>
          <p
            className="my-2 "
            dangerouslySetInnerHTML={{
              __html: store.description || '<span class="text-gray-400 italic">Không có mô tả</span>',
            }}
          ></p>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold text-[#26b65d] mb-4">Dịch vụ</h2>
        <div className="space-y-4">
          {store.services.map((service) => (
            <div key={service.id} className="flex items-start gap-4 border-b pb-4">
              <img
                src={service.image}
                alt={service.title}
                className="w-28 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{service.name}</h3>
                 <p className="font-bold mt-1">Đia chỉ: {service.address}</p>
                <p className="font-bold mt-1 text-[#26b65d]">Giá: {service.price}</p>
              </div>
              <button className="bg-[#26b65d] text-white px-3 py-1 rounded hover:bg-[#26b65d]" onClick={()=>{navigate(`/service-detail/${service.id}`)}}>
                Trải nghiệm dịch vụ
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreDetailPage;
