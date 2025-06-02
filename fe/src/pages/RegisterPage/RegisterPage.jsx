import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { registerUserThunk } from "../../redux/userSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const navigate = useNavigate()
  // Bỏ localError để dùng toast thay thế
  // const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);  // Hiện toast khi có lỗi
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !password || !confirmPass) {
      toast.warn("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPass) {
      toast.warn("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    // Gửi dữ liệu lên redux thunk
    dispatch(registerUserThunk({ username: fullName, email, phonenumber: phone, password, role: "customer" }))
      .unwrap()
      .then(() => {
        toast.success("Đăng ký thành công vui lòng đăng nhập!");
        navigate("/login")
      })
      .catch((err) => {
        console.log('err :>> ', err.error);
        toast.error(err.error || "Đăng ký thất bại!");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký</h2>

        {/* Bỏ phần hiện error dưới form */}
        {/* {localError && (
          <div className="mb-4 text-red-600 text-center font-semibold">{localError}</div>
        )} */}

        <label htmlFor="fullName" className="block text-gray-700 mb-2">
          Họ và tên
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Nhập họ và tên"
          required
          disabled={loading}
        />

        <label htmlFor="email" className="block text-gray-700 mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Nhập email"
          required
          disabled={loading}
        />

        <label htmlFor="phone" className="block text-gray-700 mb-2">
          Số điện thoại
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Nhập số điện thoại"
          required
          disabled={loading}
        />

        <label htmlFor="password" className="block text-gray-700 mb-2">
          Mật khẩu
        </label>
        <div className="relative mb-4">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
            placeholder="Nhập mật khẩu"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2/4 -translate-y-2/4 text-gray-600 hover:text-gray-900"
            tabIndex={-1}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>

        <label htmlFor="confirmPass" className="block text-gray-700 mb-2">
          Xác nhận mật khẩu
        </label>
        <div className="relative mb-6">
          <input
            id="confirmPass"
            type={showConfirmPass ? "text" : "password"}
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
            placeholder="Nhập lại mật khẩu"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPass(!showConfirmPass)}
            className="absolute right-3 top-2/4 -translate-y-2/4 text-gray-600 hover:text-gray-900"
            tabIndex={-1}
            aria-label={showConfirmPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showConfirmPass ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded transition-colors ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
          }`}
          disabled={loading}
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
}
