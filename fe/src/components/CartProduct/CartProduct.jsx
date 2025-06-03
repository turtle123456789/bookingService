import { useNavigate } from "react-router-dom";
import { bg1 } from "../../units/importImg";


const CartProduct = ({ id, image, name, description, price }) => {
    const navigate = useNavigate()
  return (
    <div className="px-6 py-2 border rounded-lg" key={id}>
      <div className="rounded-lg overflow-hidden">
        <img src={image || bg1} alt={name} className="max-h-[186px] max-w-[296px] object-fill" />
      </div>
      <h3 className="text-lg font-bold my-2">{name}</h3>
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
