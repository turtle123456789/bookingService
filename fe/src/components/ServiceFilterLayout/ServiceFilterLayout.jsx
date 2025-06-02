import { useState } from "react";
import MainService from "../MainService/MainService";
import StoreList from "../StoreList/StoreList";
import { useLocation } from "react-router-dom";
const serviceCategories = [
  {
    id: "cleaning",
    name: "Vệ sinh máy lạnh",
    subServices: [
      { id: "cleaning_basic", name: "Vệ sinh cơ bản" },
      { id: "cleaning_advanced", name: "Vệ sinh nâng cao" },
    ],
  },
  {
    id: "electric_water",
    name: "Sửa điện nước",
    subServices: [
      { id: "electric_repair", name: "Sửa điện" },
      { id: "water_repair", name: "Sửa nước" },
    ],
  },
  {
    id: "water_heater",
    name: "Lắp đặt máy nước nóng",
    subServices: [],
  },
];

const ServiceFilterLayout = () => {
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [store, setStore] = useState("");
const [selectedService, setSelectedService] = useState(""); 
  const location = useLocation();
  const isStoreView = location.pathname.includes("store");

  return (
    <div className="min-h-screen bg-white">
      <div className="flex max-w-7xl mx-auto mt-4 px-4 gap-4">
        <div className="w-full max-w-xs">
            {!isStoreView && (
                <>
                    <h2 className="text-[#26b65d] font-bold mb-2 cursor-pointer" onClick={() => setSelectedService("")}>
                    Tất cả dịch vụ
                    </h2>
                    {serviceCategories.map((category) => (
                    <div key={category.id} className="mb-3">
                        <p 
                        className={`font-semibold cursor-pointer ${selectedService === category.id ? 'text-orange-600' : ''}`}
                        onClick={() => setSelectedService(category.id)}
                        >
                        {category.name}
                        </p>
                        <div className="pl-4 mt-1">
                        {category.subServices.map((sub) => (
                            <p
                            key={sub.id}
                            className={`cursor-pointer text-sm ${selectedService === sub.id ? 'text-orange-500' : ''}`}
                            onClick={() => setSelectedService(sub.id)}
                            >
                            - {sub.name}
                            </p>
                        ))}
                        </div>
                    </div>
                    ))}
                </>
            )}

          <h2 className="text-[#26b65d] font-bold mb-2">Chọn địa điểm</h2>

          <div className="space-y-3 mb-4">
            <select
              className="w-full border rounded px-3 py-2"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setDistrict("");
                setWard("");
              }}
            >
              <option value="">Chọn tỉnh</option>
              <option value="HCM">Thành phố Hồ Chí Minh</option>
              {/* Có thể thêm các tỉnh khác */}
            </select>

            <select
              className="w-full border rounded px-3 py-2"
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setWard("");
              }}
              disabled={!city} // disable nếu chưa chọn tỉnh
            >
              <option value="">Chọn quận/huyện</option>
              {/* Ví dụ nếu city là HCM thì hiển thị quận/huyện */}
              {city === "HCM" && (
                <>
                  <option value="District1">Quận 1</option>
                  <option value="District3">Quận 3</option>
                </>
              )}
            </select>

            <select
              className="w-full border rounded px-3 py-2"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              disabled={!district} // disable nếu chưa chọn quận
            >
              <option value="">Chọn phường/xã</option>
              {district === "District1" && (
                <>
                  <option value="Ward1">Phường Bến Nghé</option>
                  <option value="Ward2">Phường Bến Thành</option>
                </>
              )}
            </select>
          </div>

          <button
            onClick={() => {
              setKeyword("");
              setCity("");
              setDistrict("");
              setWard("");
              setStore("");
              setSelectedService("")
            }}
            className="w-full border border-gray-300 rounded px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            ❌ Xóa bộ lọc
          </button>
        </div>

        <div className="flex-1">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder={isStoreView ? "Tìm kiếm cửa hàng" : "Tìm kiếm dịch vụ"}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            />
            <select
              className="border rounded px-3 py-2 min-w-[200px]"
              value={store}
              onChange={(e) => setStore(e.target.value)}
            >
              <option value="">Chọn cửa hàng</option>
              <option value="Barber Legend">Barber Legend</option>
              <option value="Boy Barber Shop CN 1">Boy Barber Shop CN 1</option>
              <option value="Mr. Cut HN">Mr. Cut HN</option>
            </select>
          </div>

            {isStoreView ? (
               <StoreList
                store={store}
                keyword={keyword}
                city={city}
                district={district}
                ward={ward}
                />

            ) : (
                <MainService
                keyword={keyword}
                city={city}
                district={district}
                ward={ward}
                store={store}
                selectedService={selectedService}
                />
            )}

          <div className="flex justify-center mt-4 gap-4 text-gray-600">
            <button>{"<"}</button>
            <span className="font-semibold text-black">1</span>
            <button>{">"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceFilterLayout;
