import React, { useState } from "react";

const ChooseServicePage = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const services = [
    "Vệ sinh máy lạnh",
    "Sửa điện",
    "Sửa nước",
    "Thông tắc cống",
    "Lắp đặt camera",
    "Tư vấn kỹ thuật",
  ];

  const shops = [
    "Cửa hàng A",
    "Cửa hàng B",
    "Cửa hàng C",
  ];

  const times = [
    "9:00 - 10:00",
    "10:00 - 11:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
  ];

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedService) {
        alert("Vui lòng chọn dịch vụ");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedShop) {
        alert("Vui lòng chọn cửa hàng");
        return;
      }
      if (!selectedTime) {
        alert("Vui lòng chọn thời gian");
        return;
      }
      // TODO: Xử lý hoàn thành hoặc chuyển bước tiếp theo
      console.log("Dịch vụ:", selectedService);
      console.log("Cửa hàng:", selectedShop);
      console.log("Thời gian:", selectedTime);
      alert("Bạn đã đặt dịch vụ thành công!");
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className=" min-h-[500px]    my-16 bg-white flex flex-col items-center justify-center px-4">
      {/* Progress Stepper */}
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

      {/* Step content */}
      <div className="bg-gray-50 p-8 rounded shadow-md w-full max-w-xl">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-semibold text-center text-orange-500 mb-6">
              Tất cả các dịch vụ tiện ích của DVSG
            </h2>

            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full border border-orange-400 rounded px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="">Chọn dịch vụ</option>
              {services.map((service, index) => (
                <option key={index} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-semibold text-center text-orange-500 mb-6">
              Chọn cửa hàng và thời gian phù hợp
            </h2>

            <label className="block mb-3">
              <span className="text-gray-700 font-medium">Chọn cửa hàng:</span>
              <select
                value={selectedShop}
                onChange={(e) => setSelectedShop(e.target.value)}
                className="w-full border border-orange-400 rounded px-4 py-2 mt-1 text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                <option value="">Chọn cửa hàng</option>
                {shops.map((shop, index) => (
                  <option key={index} value={shop}>
                    {shop}
                  </option>
                ))}
              </select>
            </label>

            <label className="block mb-3">
              <span className="text-gray-700 font-medium">Chọn thời gian:</span>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full border border-orange-400 rounded px-4 py-2 mt-1 text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                <option value="">Chọn thời gian</option>
                {times.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <button
              onClick={handleBackStep}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
            >
              Quay lại
            </button>
          )}
          <button
            onClick={handleNextStep}
            className="ml-auto bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 w-full max-w-[150px] transition"
          >
            {step === 1 ? "Tiếp tục" : "Hoàn tất"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseServicePage;
