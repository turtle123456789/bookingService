import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { registerUserThunk } from "../../redux/userSlice";
import { toast } from "react-toastify";
export default function PartnerRegisterPage() {
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [licenseFile, setLicenseFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setLicenseFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !phone || !email || !password) {
      toast.warn("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (!licenseFile) {
      toast.warn("Vui lòng tải lên giấy phép kinh doanh.");
      return;
    }

    setLoading(true);
    console.log('licenseFile :>> ', licenseFile);
    const formData = new FormData();
    formData.append("username", fullName);
    formData.append("phonenumber", phone);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", "shop"); // Gán role là shop/partner
    formData.append("businessLicenseFile", licenseFile);

    try {
      await dispatch(registerUserThunk(formData)).unwrap();
      toast.success("Đăng ký thành công, vui lòng chờ xác minh.");
      setFullName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setLicenseFile(null);
    } catch (err) {
      toast.error(err.error || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen container mx-auto flex flex-col md:flex-row bg-gray-50">
      {/* Left content */}
      <div className="md:w-1/2 p-10 flex flex-col justify-center bg-gradient-to-br from-green-100 to-green-200">
        <h2 className="text-4xl font-bold mb-4 text-green-600">Trở thành đối tác của chúng tôi</h2>
        <p className="mb-4 text-lg">
          Bạn là chủ cửa hàng cung cấp dịch vụ và muốn gia nhập vào hệ thống của chúng tôi? 
          Hãy đăng ký ngay để tiếp cận khách hàng tiềm năng qua nền tảng của chúng tôi.
        </p>
        <p className="text-lg font-semibold">
          Cung cấp dịch vụ cho khách hàng và nhận được nhiều cơ hội hợp tác và phát triển hơn nữa!
        </p>
      </div>

      {/* Right form */}
      <div className="md:w-1/2 bg-white p-10 flex flex-col justify-center shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-gray-700">Đăng ký làm đối tác</h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-600" htmlFor="fullName">
              Họ và tên
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập họ và tên"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-600" htmlFor="phone">
              Số điện thoại
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập số điện thoại"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-600" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập email"
              required
            />
          </div>

          <label className="block mb-1 font-medium text-gray-600" htmlFor="password">
            Mật khẩu tài khoản
          </label>
          <div className="relative !mt-1">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2/4 -translate-y-2/4 text-gray-600 hover:text-gray-900"
              tabIndex={-1}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                <FaRegEyeSlash />
              ) : (
                <FaRegEye />
              )}
            </button>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-600" htmlFor="licenseFile">
              Giấy phép kinh doanh (file)
            </label>
            <input
              id="licenseFile"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full"
              required
            />
            <small className="text-gray-500">Chấp nhận file PDF, JPG, PNG</small>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng ký đối tác"}
          </button>
        </form>
      </div>
    </div>
  );
}
