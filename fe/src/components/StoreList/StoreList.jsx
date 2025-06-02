import CartStore from "../CartStore/CartStore";
import { bg1 } from "../../units/importImg";
import { useNavigate } from "react-router-dom";

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
  },
  {
    id: 2,
    name: "Barber Legend",
    image: bg1,
    city: "HCM",
    district: "District3",
    ward: "Ward5",
    phone: "090 123 4567",
    email: "boybarber1@example.com",
  },
  {
    id: 3,
    name: "Mr. Cut HN",
    image: bg1,
    city: "HN",
    district: "DistrictA",
    ward: "WardX",
    phone: "012 345 6789",
    email: "boybarber1@example.com",

  },
];

const StoreList = ({ keyword, city, district, ward, store }) => {
    const navigate = useNavigate()
  const filteredStores = fakeStores.filter((storeItem) => {
    return (
      (!keyword || storeItem.name.toLowerCase().includes(keyword.toLowerCase())) &&
      (!city || storeItem.city === city) &&
      (!district || storeItem.district === district) &&
      (!ward || storeItem.ward === ward) &&
      (!store || storeItem.name === store) 
    );
  });



  const handleDetailClick = (storeId) => {
    navigate(`/store-detail/${storeId}`)
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filteredStores.map((store) => (
        <CartStore
            key={store.id}
            id={store.id}
            name={store.name}
            image={store.image}
            address={`${store.ward}, ${store.district}, ${store.city}`}
            phone={store.phone}
             email={store.email}
            onDetailClick={handleDetailClick}
            />
      ))}
    </div>
  );
};

export default StoreList;
