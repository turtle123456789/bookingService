import {  FaSyncAlt, FaFileAlt, FaHeadset, FaGift, FaRocket } from 'react-icons/fa';

const ServiceFeatures = () => {
  const services = [
    {
      icon: <FaRocket className="text-3xl text-orange-500" />,
      title: 'Dịch Vụ Nhanh Chóng',
      description: 'Tra cứu dịch vụ gần bạn dễ dàng, trong tích tắc',
    },
    {
      icon: <FaSyncAlt className="text-3xl text-orange-500" />,
      title: 'Đổi Lịch Linh Hoạt',
      description: 'Tùy chọn ngày giờ sử dụng dịch vụ theo ý bạn',
    },
    {
      icon: <FaFileAlt className="text-3xl text-orange-500" />,
      title: 'Thông Tin Minh Bạch',
      description: 'Mô tả dịch vụ rõ ràng, đánh giá thật từ người dùng',
    },
    {
      icon: <FaHeadset className="text-3xl text-orange-500" />,
      title: 'Hỗ Trợ Khách Hàng 24/7',
      description: 'Luôn sẵn sàng giúp bạn mọi lúc',
    },
    {
      icon: <FaGift className="text-3xl text-orange-500" />,
      title: 'Dịch Vụ Đa Dạng',
      description: 'Từ vệ sinh, sửa chữa đến làm đẹp – đủ hết cho Sài Gòn',
    },
  ];

  return (
    <div className="bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
        {services.map((service, index) => (
          <div key={index}>
            <div className="flex justify-center mb-2">
              {service.icon}
            </div>
            <h3 className="text-lg font-semibold">{service.title}</h3>
            <p className="text-sm text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceFeatures;
