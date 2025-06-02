import { useState } from "react";
import { bg1 } from "../../units/importImg";
import CartProduct from "../CartProduct/CartProduct";

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

const MainService = ({ keyword, city, district, ward, store, selectedService }) => {
  const filteredServices = fakeProducts.filter((service) => {
    const serviceMatch =
      !selectedService ||
      service.serviceId === selectedService || 
      serviceCategories.some(
        (cat) =>
          cat.id === selectedService && 
          cat.subServices.some((sub) => sub.id === service.serviceId)
      );

    return (
      serviceMatch &&
      (!keyword || service.title.toLowerCase().includes(keyword.toLowerCase())) &&
      (!city || service.city === city) &&
      (!district || service.district === district) &&
      (!ward || service.ward === ward) &&
      (!store || service.store === store)
    );
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filteredServices.map((item) => (
        <CartProduct key={item.id} {...item} />
      ))}
    </div>
  );
};


export default MainService;
