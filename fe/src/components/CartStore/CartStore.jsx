const CartStore = ({ id, image, name, address, phone, email, onDetailClick }) => {
  return (
    <div className="px-6" key={id}>
      <div className="rounded-lg overflow-hidden shadow-md">
        <img src={image} alt={name} className="w-full h-40 object-cover" />
      </div>
      <h3 className="text-lg font-bold my-2 text-[#222]">{name}</h3>
      <p className="text-sm text-gray-600">SĐT: {phone}</p>
      <p className="text-sm text-gray-600">Email: {email || "Đang cập nhật"}</p>
      <p className="text-sm text-gray-600">Địa chỉ: {address}</p>
      <br />
      <button
        className="bg-[#26b65d] text-white font-bold hover:opacity-80 py-2 px-3 rounded-lg"
        onClick={() => onDetailClick(id)}
      >
        Xem chi tiết
      </button>
    </div>
  );
};

export default CartStore;
