import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopsThunk } from "../../redux/shopSlice";
import { fetchServicesThunk } from "../../redux/serviceSlice";
import Rating from "react-rating";
import { getCategories } from "../../redux/categorySlice";
import {
  getFeedbacksByService,
  createFeedback,
} from "../../redux/feedbackSlice";
import { FiUserCheck } from "react-icons/fi";
const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const dispatch = useDispatch()
  const { list } = useSelector(state => state.category);
  const { shopList } = useSelector(state => state.shops);
  const {  services } = useSelector((state) => state.service);
  const {feedbacks} = useSelector((state) => state.feedback);
const [comment, setComment] = useState("");
const [rating, setRating] = useState(5);

useEffect(() => {
  if (serviceId) {
    dispatch(getFeedbacksByService(serviceId));
  }
}, [dispatch, serviceId]);

const handleSubmitFeedback = (e) => {
  e.preventDefault();
  if (!comment.trim()) return;
  console.log('Number(serviceId), rating, comment :>> ', Number(serviceId), rating, comment);
  dispatch(createFeedback({ serviceId: Number(serviceId), rating, comment }));
  setComment("");
};

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
        <div className="bg-white shadow rounded p-4 mt-10">
          <h2 className="text-2xl font-semibold text-[#26b65d] mb-4">Đánh giá dịch vụ</h2>

          <form onSubmit={handleSubmitFeedback} className="mb-6 space-y-3">
            <label className="block">
              <span className="text-gray-700">Chấm điểm:</span>
              <div className="mt-1">
                <Rating
                  initialRating={rating}
                  onChange={(rate) => setRating(rate)}
                  emptySymbol={<span className="text-gray-300 text-2xl">☆</span>}
                  fullSymbol={<span className="text-yellow-500 text-2xl">★</span>}
                />
              </div>
            </label>
            <label className="block">
              <span className="text-gray-700">Bình luận:</span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="Viết đánh giá..."
              />
            </label>
            <button
              type="submit"
              className="bg-[#26b65d] text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Gửi đánh giá
            </button>
          </form>

          <div className="space-y-4">
            {feedbacks.length === 0 ? (
              <p className="text-gray-500 italic">Chưa có đánh giá nào.</p>
            ) : (
              feedbacks.map((fb) => (
                <div key={fb?.id} className="border-t pt-3">
                  <div className="flex items-center gap-2">
                    {fb?.user?.avatar ? (
                      <img
                        src={fb?.user?.avatar}
                        alt={fb?.user?.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ):(
                    <FiUserCheck />
                    )}
                    
                    <div>
                      <p className="font-semibold">{fb?.user?.username}</p>
                      <p className="text-sm text-yellow-500">Đánh giá: {fb?.rating}⭐</p>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{fb?.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

    </div>
  );
};

export default ServiceDetailPage;
