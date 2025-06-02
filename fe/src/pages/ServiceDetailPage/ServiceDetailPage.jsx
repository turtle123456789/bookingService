import React from "react";
import { useParams } from "react-router-dom";
import { bg1 } from "../../units/importImg";

const fakeProducts = [
  {
    id: 1,
    image: bg1,
    title: "Vệ sinh máy lạnh cơ bản",
    description: "Làm sạch và bảo dưỡng máy lạnh cơ bản",
    price: "250,000đ",
    city: "HCM",
    district: "District1",
    ward: "Ward1",
    store: "Boy Barber Shop CN 1",
    serviceId: "cleaning_basic",
  },
  {
    id: 2,
    image: bg1,
    title: "Sửa điện nước tại nhà",
    description: "Sửa chữa điện nước, rò rỉ nhanh gọn",
    price: "350,000đ",
    city: "HCM",
    district: "District3",
    ward: "Ward5",
    store: "Barber Legend",
    serviceId: "electric_water",
  },
  {
    id: 3,
    image: bg1,
    title: "Lắp đặt máy nước nóng",
    description: "Lắp đặt nhanh, bảo hành dài hạn",
    price: "500,000đ",
    city: "HN",
    district: "DistrictA",
    ward: "WardX",
    store: "Mr. Cut HN",
    serviceId: "water_heater",
  },
];

const fakeStores = [
  {
    id: 1,
    name: "Boy Barber Shop CN 1",
    city: "HCM",
    district: "District1",
    ward: "Ward1",
    phone: "038 627 7737",
    email: "boybarber1@example.com",
    address: "273A Lê Văn Việt, Phường Hiệp Phú, TP. Thủ Đức, TP.HCM",
    services: ["cleaning_basic", "electric_water"],
  },
  {
    id: 2,
    name: "Barber Legend",
    city: "HCM",
    district: "District3",
    ward: "Ward5",
    phone: "090 123 4567",
    email: "barberlegend@example.com",
    address: "123 Nguyễn Trãi, Quận 1, TP.HCM",
    services: ["electric_water"],
  },
  {
    id: 3,
    name: "Mr. Cut HN",
    city: "HN",
    district: "DistrictA",
    ward: "WardX",
    phone: "098 765 4321",
    email: "mrcut@example.com",
    address: "456 Đường Láng, Hà Nội",
    services: ["water_heater"],
  },
];

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const service = fakeProducts.find((item) => item.id === Number(serviceId));

  if (!service) {
    return <div className="text-center py-10 text-red-500">Dịch vụ không tồn tại</div>;
  }

  const storesWithService = fakeStores.filter((store) =>
    store.services.includes(service.serviceId)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#26b65d]">{service.title}</h1>

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
            <strong>Cửa hàng cung cấp:</strong> {service.store}
          </p>
        </div>
      </div>

      <button className="bg-[#26b65d] text-white px-6 py-2 rounded hover:bg-green-700 transition">
        Đặt dịch vụ
      </button>
      <div className="bg-white shadow rounded p-4 space-y-3">
        <h2 className="text-xl font-semibold text-[#26b65d]">Mô tả dịch vụ</h2>
        <p className="text-sm whitespace-pre-line text-gray-700">{service.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          <img src="/images/store1.jpg" alt="Store 1" className="rounded" />
          <img src="/images/store2.jpg" alt="Store 2" className="rounded" />
          <img src="/images/store3.jpg" alt="Store 3" className="rounded" />
        </div>
      </div>

        <div className="bg-white shadow rounded p-4 mt-10">
        <h2 className="text-2xl font-semibold text-[#26b65d] mb-4">
            Các cửa hàng có dịch vụ này
        </h2>

        {storesWithService.length === 0 ? (
            <p>Không có cửa hàng nào cung cấp dịch vụ này.</p>
        ) : (
            <div className="space-y-4">
            {storesWithService.map((store) => (
                <div key={store.id} className="flex items-start gap-4 border-b pb-4">
                <img
                    src={store.image}
                    alt={store.name}
                    className="w-28 h-20 object-cover rounded shadow"
                />
                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#26b65d]">{store.name}</h3>
                    <p className="text-sm text-gray-700">{store.description}</p>
                    <p className="mt-1">
                    <strong>Địa chỉ:</strong> {store.address}
                    </p>
                    <p>
                    <strong>Điện thoại:</strong> {store.phone}
                    </p>
                    <p>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${store.email}`} className="text-blue-500 underline">
                        {store.email}
                    </a>
                    </p>
                </div>
                <button className="bg-[#26b65d] text-white px-3 py-1 rounded hover:bg-green-700 transition whitespace-nowrap">
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
