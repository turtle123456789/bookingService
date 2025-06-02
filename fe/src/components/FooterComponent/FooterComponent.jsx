import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";

const FooterComponent = () => {
  return (
    <footer className="bg-gray-50 text-gray-800 pt-10 border-t">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <div>
          <h3 className="text-xl font-bold text-orange-500 mb-4">DVSG</h3>
          <div className="flex items-center gap-3 mb-4">
            <img src="/appstore.png" alt="App Store" className="h-8" />
            <img src="/googleplay.png" alt="Google Play" className="h-8" />
          </div>
          <ul className="space-y-2 text-sm">
            <li><Link to={"/"} className="hover:underline">🌐 Việt Nam</Link></li>
            <li><Link to={"/"} className="hover:underline">✉ Liên hệ</Link></li>
            <li><Link to={"/"} className="hover:underline">🎧 Hỗ trợ</Link></li>
            <li><Link to={"/"} className="hover:underline">💬 Khiếu nại</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-base mb-3">Công ty</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to={"/"} className="hover:underline">Giới thiệu</Link></li>
            <li><Link to={"/"} className="hover:underline">Tuyển dụng</Link></li>
            <li><Link to={"/"} className="hover:underline">Chi nhánh</Link></li>
            <li><Link to={"/"} className="hover:underline">Điều khoản sử dụng</Link></li>
            <li><Link to={"/"} className="hover:underline">Chính sách bảo mật</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-base mb-3">Các loại dịch vụ</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to={"/"} className="hover:underline">Làm đẹp</Link></li>
            <li><Link to={"/"} className="hover:underline">Ăn uống</Link></li>
            <li><Link to={"/"} className="hover:underline">Sửa chữa</Link></li>
            <li><Link to={"/"} className="hover:underline">Du lịch & vui chơi</Link></li>
            <li><Link to={"/"} className="hover:underline">Khách sạn</Link></li>
            <li><Link to={"/"} className="hover:underline">Học tập</Link></li>
            <li><Link to={"/"} className="hover:underline">Bất động sản</Link></li>
            <li><Link to={"/"} className="hover:underline">Vé máy bay</Link></li>
            <li><Link to={"/"} className="hover:underline">Danh mục khác</Link></li>
          </ul>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="border-t mt-8 py-4 text-center text-sm">
        <p className="mb-2">DVSG TOGETHER. FOLLOW US</p>
        <div className="flex justify-center space-x-4 text-orange-500 text-xl">
          <Link to={"/"}><FaFacebookF /></Link>
          <Link to={"/"}><FaInstagram /></Link>
          <Link to={"/"}><FaTiktok /></Link>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
