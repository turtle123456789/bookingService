import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bg1 } from "../../units/importImg";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopsThunk } from "../../redux/shopSlice";
import { fetchServicesThunk } from "../../redux/serviceSlice";
import { getCategories } from "../../redux/categorySlice";


const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const dispatch = useDispatch()
  const { list } = useSelector(state => state.category);
  const { shopList } = useSelector(state => state.shops);
  const {  services } = useSelector((state) => state.service);
  const navigate = useNavigate()
    useEffect(() => {
       dispatch(getCategories());
      dispatch(fetchShopsThunk({ isActivated: true }));
       dispatch(fetchServicesThunk()); 
    }, [dispatch]);

  const service = services?.find((item) => item.id === Number(serviceId));
  if (!service) {
    return <div className="text-center py-10 text-red-500">Dịch vụ không tồn tại</div>;
  }
  const filteredList = list.filter(category =>
    category.subCategories.some(
      sub => sub.name === service.subCategory.name
    )
  );
const creatorIds = filteredList.map(category => category.creatorId);

const matchedShops = shopList.filter(shop => creatorIds.includes(shop.id));

console.log('Matched Shops:', matchedShops);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#26b65d]">{service.name}</h1>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <img
          src={service.image}
          alt={service.title}
          className="w-full md:w-64 h-40 object-cover rounded shadow"
        />
        <div className="flex-1 space-y-2">
          <p className="text-lg font-semibold text-[#26b65d]">Giá: {service.price}</p>
          <p className="text-sm text-gray-700">
            <strong>Địa điểm:</strong> {service.city}, {service.district}, {service.ward}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Cửa hàng cung cấp:</strong> {service.creator.username}
          </p>
        </div>
      </div>

      <button className="bg-[#26b65d] text-white px-6 py-2 rounded hover:bg-green-700 transition" 
      onClick={()=>{navigate(`/choice-service`, {
        state: {
          serviceId: service.id,
        },
      });}}>
        Đặt dịch vụ
      </button>
      <div className="bg-white shadow rounded p-4 space-y-3 image-custom">
        <h2 className="text-xl font-semibold text-[#26b65d]">Mô tả dịch vụ</h2>
         <p
            className="my-2"
            dangerouslySetInnerHTML={{
              __html: service.description || '<span class="text-gray-400 italic">Không có mô tả</span>',
            }}
          ></p>
      </div>

        <div className="bg-white shadow rounded p-4 mt-10">
        <h2 className="text-2xl font-semibold text-[#26b65d] mb-4">
            Các cửa hàng có dịch vụ này
        </h2>

        {matchedShops.length === 0 ? (
            <p>Không có cửa hàng nào cung cấp dịch vụ này.</p>
        ) : (
            <div className="space-y-4">
            {matchedShops.map((store) => (
                <div key={store.id} className="flex items-center gap-4 border-b pb-4">
                <img
                    src={store.avatar}
                    alt={store.username}
                    className="w-28 h-20 object-cover rounded shadow"
                />
                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#26b65d]">{store.username}</h3>
                    <p className="text-sm text-gray-700">{store.description}</p>
                    <p className="mt-1">
                    <strong>Địa chỉ:</strong> {store.address}
                    </p>
                    <p>
                    <strong>Điện thoại:</strong> {store.phonenumber}
                    </p>
                    <p>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${store.email}`} className="text-blue-500 underline">
                        {store.email}
                    </a>
                    </p>
                </div>
                <button className="bg-[#26b65d] text-white px-3 py-1 rounded hover:bg-green-700 transition whitespace-nowrap" onClick={()=>{navigate(`/store-detail/${store.id}`)}}>
                    Xem cửa hàng
                </button>
                </div>
            ))}
            </div>
        )}
        </div>

    </div>
  );
};

export default ServiceDetailPage;
