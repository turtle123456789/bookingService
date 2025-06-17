import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../redux/categorySlice";
import { fetchShopsThunk } from "../../redux/shopSlice";
import { fetchServicesThunk } from "../../redux/serviceSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { createBookingThunk } from "../../redux/bookingSlice";
import { toast } from "react-toastify";
import PaymentPopup from "../../components/PaymentPopup/PaymentPopup";

const ChooseServicePage = () => {
  const [step, setStep] = useState(1);
  const location = useLocation();
  const { serviceId } = location.state || {};
  const [selectedService, setSelectedService] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list } = useSelector(state => state.category);
  const { shopList } = useSelector(state => state.shops);
  const { services } = useSelector(state => state.service);
  const { userInfo } = useSelector((state) => state.user);
  const [showPopup, setShowPopup] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState(null);

  const selectedServiceDetail = services?.find((item) => item.id === Number(selectedService));

  useEffect(() => {
    if (serviceId) setSelectedService(serviceId);
  }, [serviceId]);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(fetchShopsThunk({ isActivated: true }));
    dispatch(fetchServicesThunk());
  }, [dispatch]);

  const filteredList = list.filter(category =>
    category.subCategories.some(
      sub => sub.name === selectedServiceDetail?.subCategory?.name
    )
  );
  const creatorIds = filteredList.map(category => category.creatorId);
  const matchedShops = shopList.filter(shop => creatorIds.includes(shop.id));

  const handleNextStep = () => {
    if (!userInfo) {
      toast.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }

    if (step === 1) {
      if (!selectedService) {
        toast.warning("Vui lòng chọn dịch vụ.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedTime) {
        toast.warning("Vui lòng chọn thời gian.");
        return;
      }

      const rawPrice = Number(selectedServiceDetail?.price || 0);
      const depositPercent = Math.min(Number(selectedServiceDetail?.deposit || 0), 100);
      const discountPercent = Number(selectedCoupon?.discountPercent || 0);
      const finalPrice = rawPrice * (1 - discountPercent / 100);
      const depositAmount = finalPrice * (depositPercent / 100);

      const [from, to] = selectedTime.split("-");
      const day = selectedServiceDetail?.workingHours?.find(t => `${t.from}-${t.to}` === selectedTime)?.day || "Unknown";

      const bookingData = {
        serviceId: selectedService,
        shopId: selectedServiceDetail.creator.id,
        bookingDate: [{ day, from, to }],
        depositAmount,
        coupons: selectedCoupon?.code || null,
      };

      setPendingBookingData(bookingData);
      setShowPaymentPopup(true);
    }
  };

  const confirmAndCreateBooking = (bookingData) => {
    dispatch(createBookingThunk(bookingData))
      .unwrap()
      .then((res) => {
        toast.success("Bạn đã đặt dịch vụ thành công!");
        setBookingInfo(res);
        setShowPopup(true);
        setStep(1);
        setSelectedService("");
        setSelectedTime("");
        setDropdownOpen(false);
        setShowPaymentPopup(false);
      })
      .catch((error) => {
        toast.error("Đặt lịch thất bại: " + error?.message || "Đã có lỗi xảy ra.");
      });
  };

  const handleBackStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-[500px] my-16 bg-white flex flex-col items-center justify-center px-4">
      <div className="flex items-center mb-10">
        <div className={`flex items-center relative ${step === 1 ? "text-white" : "text-gray-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 1 ? "bg-blue-600" : "bg-gray-200"}`}>
            1
          </div>
          <span className={`ml-2 font-medium ${step === 1 ? "text-black" : "text-gray-400"}`}>Dịch vụ</span>
        </div>
        <div className="w-12 h-px bg-gray-300 mx-2" />
        <div className={`flex items-center relative ${step === 2 ? "text-white" : "text-gray-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 2 ? "bg-blue-600" : "bg-gray-200"}`}>
            2
          </div>
          <span className={`ml-2 font-medium ${step === 2 ? "text-black" : "text-gray-400"}`}>Chọn cửa hàng và thời gian</span>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded shadow-md w-full max-w-xl">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-semibold text-center text-orange-500 mb-6">
              Tất cả các dịch vụ tiện ích của URGENT
            </h2>
            <div className="relative w-full">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full border border-orange-400 rounded px-4 py-2 text-gray-600 text-left"
              >
                {selectedService
                  ? services?.find((s) => s.id === selectedService)?.name
                  : "Chọn dịch vụ"}
              </button>

              {dropdownOpen && (
                <div className="absolute z-10 w-full border border-orange-300 bg-white rounded shadow mt-1 max-h-60 overflow-y-auto">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => {
                        setSelectedService(service.id);
                        setDropdownOpen(false);
                      }}
                      className="flex items-center px-4 py-2 hover:bg-orange-100 cursor-pointer"
                    >
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-8 h-8 rounded-full object-cover mr-3"
                      />
                      <span>{service.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {step === 2 && selectedServiceDetail && (
          <>
            <h2 className="text-2xl font-semibold text-center text-orange-500 mb-6">
              Chọn thời gian phù hợp
            </h2>

            <label className="block mb-3">
              <span className="text-gray-700 font-medium">Chọn thời gian:</span>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full border border-orange-400 rounded px-4 py-2 mt-1 text-gray-600"
              >
                <option value="">Chọn thời gian</option>
                {selectedServiceDetail?.workingHours?.map((time, index) => (
                  <option key={index} value={`${time.from}-${time.to}`}>
                    {`${time.day}: ${time.from} - ${time.to}`}
                  </option>
                ))}
              </select>
            </label>

            {selectedServiceDetail?.coupons?.length > 0 && (
              <div className="mb-4">
                <span className="text-gray-700 font-medium">Chọn mã giảm giá (nếu có):</span>
                <div className="mt-2 space-y-2">
                  {selectedServiceDetail.coupons.map((coupon) => (
                    <label
                      key={coupon.code}
                      className="flex items-center space-x-2 border p-2 rounded hover:bg-orange-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="coupon"
                        value={coupon.code}
                        checked={selectedCoupon?.code === coupon.code}
                        onChange={() =>
                          setSelectedCoupon({
                            code: coupon.code,
                            discountPercent: Number(coupon.discountPercent),
                          })
                        }
                      />
                      <div>
                        <p className="font-semibold">{coupon.code}</p>
                        <p className="text-sm text-green-600">
                          Giảm giá: {coupon.discountPercent}%
                        </p>
                      </div>
                    </label>
                  ))}
                  <label className="flex items-center space-x-2 border p-2 rounded hover:bg-orange-50">
                    <input
                      type="radio"
                      name="coupon"
                      value=""
                      checked={selectedCoupon === null}
                      onChange={() => setSelectedCoupon(null)}
                    />
                    <span>Không chọn mã giảm giá</span>
                  </label>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Thông tin thanh toán
              </h3>

              {(() => {
                const rawPrice = Number(selectedServiceDetail?.price || 0);
                const depositPercent = Math.min(Number(selectedServiceDetail?.deposit || 0), 100);
                const discountPercent = Number(selectedCoupon?.discountPercent || 0);
                const totalAfterDiscount = rawPrice * (1 - discountPercent / 100);
                const depositAmount = totalAfterDiscount * (depositPercent / 100);

                return (
                  <>
                    <div className="flex justify-between text-gray-700">
                      <span>Tổng tiền:</span>
                      <span className="font-medium text-blue-600">
                        {totalAfterDiscount.toLocaleString()}₫
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700 mt-1">
                      <span>Tiền phải đặt cọc:</span>
                      <span className="font-medium text-orange-600">
                        {depositAmount.toLocaleString()}₫
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          </>
        )}

        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <button
              onClick={handleBackStep}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
            >
              Quay lại
            </button>
          )}
          <button
            onClick={handleNextStep}
            className="ml-auto bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 w-full max-w-[150px]"
          >
            {step === 1 ? "Tiếp tục" : "Hoàn tất"}
          </button>
        </div>

        <PaymentPopup
          show={showPaymentPopup}
          onClose={(success, bookingInfo) => {
            setShowPaymentPopup(false);
            if (success) {
              setBookingInfo(bookingInfo);
              setShowPopup(true);
            }
          }}
          bookingData={pendingBookingData}
          serviceDetail={selectedServiceDetail}
          selectedTime={selectedTime}
        />
      </div>
    </div>
  );
};

export default ChooseServicePage;
