import { bg1 } from "../../units/importImg";

export const serviceSteps = [
  {
    id: 1,
    title: "Đăng ký tài khoản cửa hàng",
    description:
      "Để bắt đầu, cửa hàng của bạn cần tạo một tài khoản và đăng ký trên nền tảng.",
    image: bg1,
  },
  {
    id: 2,
    title: "Đăng tải dịch vụ và thông tin",
    description:
      "Thêm các dịch vụ của bạn, bao gồm mô tả, hình ảnh và giá cả, để khách hàng dễ dàng tìm thấy và chọn lựa.",
    image: bg1,
  },
  {
    id: 3,
    title: "Xác nhận và kích hoạt dịch vụ",
    description:
      "Sau khi dịch vụ đã được đăng tải, chúng tôi sẽ xác nhận và kích hoạt để khách hàng có thể dễ dàng đặt dịch vụ.",
    image: bg1,
  },
  {
    id: 4,
    title: "Theo dõi và đánh giá dịch vụ",
    description:
      "Quản lý các dịch vụ đã đăng và nhận phản hồi từ khách hàng để nâng cao chất lượng dịch vụ.",
    image: bg1,
  },
];

const ServiceSteps = () => {
  return (
    <div className="py-16 bg-white text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-10">
        Quy trình đăng dịch vụ lên nền tảng
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {serviceSteps.map((step) => (
          <div
            key={step.id}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-left hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={step.image}
              alt={step.title}
              className=" mb-4 rounded-lg"
            />
            <h3 className="text-[#26b65d] font-semibold text-lg mb-2 text-center">
              {step.title}
            </h3>
            <p className="text-gray-700 text-sm text-center">{step.description}</p>
          </div>
        ))}
      </div>
      <div className="bg-[#26b65d] text-white mt-16 py-14 px-6">
        <h3 className="text-2xl font-bold mb-2">Trải nghiệm ngay hôm nay</h3>
        <p className="mb-6">
          Bạn đã sẵn sàng sử dụng dịch vụ của URGENT chưa? Bắt đầu ngay với việc đặt lịch đầu tiên của bạn
        </p>
        <button className="bg-white text-[#26b65d] font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition">
          Trải nghiệm dịch vụ
        </button>
      </div>
    </div>
  );
};

export default ServiceSteps;
