const CartStore = ({ id, image, username, address, phonenumber, email, onDetailClick }) => {
  return (
    <div className="px-6 py-2 border rounded-lg" key={id}>
      <div className="rounded-lg overflow-hidden shadow-md">
        <img src={image} alt={username} className="w-full h-40 object-cover" />
      </div>
      <h3 className="text-lg font-bold my-2 text-[#222]">{username}</h3>
      <p className="text-sm text-gray-600"><span className="font-bold">SĐT:</span> {phonenumber}</p>
      <p className="text-sm text-gray-600"><span className="font-bold">Email:</span> {email || "Đang cập nhật"}</p>
      <p className="text-sm text-gray-600"><span className="font-bold">Địa chỉ:</span> {address}</p>
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
