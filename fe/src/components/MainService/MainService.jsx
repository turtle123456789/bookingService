import { useEffect, useState } from "react";
import CartProduct from "../CartProduct/CartProduct";
import { useDispatch, useSelector } from "react-redux";
import { fetchServicesThunk } from "../../redux/serviceSlice";



const MainService = ({ keyword, city, district, ward, store, selectedService }) => {
  console.log('selectedService :>> ', store);
  const dispatch = useDispatch()
  const {  services } = useSelector((state) => state.service);
  console.log('services :>> ', services);
  useEffect(() => {
    dispatch(fetchServicesThunk()); 
  }, [dispatch]);
const filteredServices = services?.filter((service) => {
  const matched = !selectedService || service.subCategoryId === selectedService || service.categoryId === selectedService;

  return (
    matched &&
    (!keyword || service.name.toLowerCase().includes(keyword.toLowerCase())) &&
    (!city || service.city === city) &&
    (!district || service.district === district) &&
    (!ward || service.ward === ward) &&
    (!store || service.creator.username === store)
  );
});

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filteredServices?.map((item) => (
        <CartProduct key={item.id} {...item} />
      ))}
    </div>
  );
};


export default MainService;
