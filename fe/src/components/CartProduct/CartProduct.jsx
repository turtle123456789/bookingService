import { useNavigate } from "react-router-dom";


const CartProduct = ({ id, image, title, description, price }) => {
    const navigate = useNavigate()
  return (
    <div className="px-6" key={id}>
      <div className="rounded-lg overflow-hidden">
        <img src={image} alt={title} />
      </div>
      <h3 className="text-lg font-bold my-2">{title}</h3>
      <p className="my-2">{description}</p>
      <span>
        <strong>Giá dự tính:</strong> {price}
      </span>
      <br />
      <br />
      <button className="bg-[#26b65d] text-white font-bold hover:opacity-65 py-2 px-3 rounded-lg" onClick={()=>{navigate(`/service-detail/${id}`)}}>
        Xem chi tiết
      </button>
    </div>
  );
};

export default CartProduct;
