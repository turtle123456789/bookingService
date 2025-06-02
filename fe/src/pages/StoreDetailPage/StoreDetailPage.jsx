import React from "react";
import { useParams } from "react-router-dom";
import { bg1 } from "../../units/importImg";

const fakeStores = [
  {
    id: 1,
    name: "Boy Barber Shop CN 1",
    image: bg1,
    city: "HCM",
    district: "District1",
    ward: "Ward1",
    phone: "038 627 7737",
    email: "boybarber1@example.com",
    address: "273A Lê Văn Việt, Phường Hiệp Phú, Thành phố Thủ Đức, TP.HCM",
    owner: {
      name: "Tare Nguyễn Văn C",
      phone: "038 627 7737",
    },
    description: `Mỗi kiểu tóc đều mang đến sự ngầu lòi và gọn gàng!...`,
    services: [
      {
        id: 1,
        title: "Cắt tóc, tạo kiểu",
        description: "Kiểu tóc đẹp giúp nâng tầm hình ảnh.",
        price: "99.000 đ",
        image: "/images/haircut.jpg",
      },
      {
        id: 2,
        title: "Nhuộm tóc màu",
        description: "Khác biệt, cá tính và đẹp mắt.",
        price: "300.000 đ",
        image: "/images/dye.jpg",
      },
    ],
  },
  // Thêm các cửa hàng khác...
];

const StoreDetailPage = () => {
  const { storeId } = useParams();
  const store = fakeStores.find((s) => s.id === parseInt(storeId));

  if (!store) {
    return <div className="text-center py-10 text-red-500">Cửa hàng không tồn tại</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl font-bold text-[#26b65d]">{store.name}</h1>
          <p>SĐT: {store.phone}</p>
          <p>Email: <a href={`mailto:${store.email}`} className="text-blue-500 underline">{store.email}</a></p>
          <p className="text-sm text-gray-700">Địa chỉ: {store.address}</p>
        </div>
        <div>
          <img
            src={store.image}
            alt={store.name}
            className="w-64 h-40 object-cover rounded shadow"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded">
        <div className="w-16 h-16 rounded-full bg-gray-300" />
        <div>
          <p className="font-semibold">Chủ cửa hàng: {store.owner.name}</p>
          <p className="text-sm text-gray-600">SĐT: {store.owner.phone}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4 space-y-3">
        <h2 className="text-xl font-semibold text-[#26b65d]">Mô tả cửa hàng</h2>
        <p className="text-sm whitespace-pre-line text-gray-700">{store.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          <img src="/images/store1.jpg" alt="Store 1" className="rounded" />
          <img src="/images/store2.jpg" alt="Store 2" className="rounded" />
          <img src="/images/store3.jpg" alt="Store 3" className="rounded" />
        </div>
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
                <h3 className="font-semibold text-lg">{service.title}</h3>
                <p className="text-sm text-gray-700">{service.description}</p>
                <p className="font-bold mt-1 text-[#26b65d]">Giá: {service.price}</p>
              </div>
              <button className="bg-[#26b65d] text-white px-3 py-1 rounded hover:bg-[#26b65d]">
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
