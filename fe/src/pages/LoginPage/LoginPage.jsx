import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { loginUserThunk, getProfileThunk } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, accessToken, error } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(loginUserThunk({ email, password }));

    if (loginUserThunk.fulfilled.match(resultAction)) {
      localStorage.setItem("accessToken", resultAction.payload.accessToken);
      localStorage.setItem("refreshToken", resultAction.payload.refreshToken);

      await dispatch(getProfileThunk()); // gọi profile sau khi login thành công

      toast.success("Đăng nhập thành công!");
      navigate("/"); 
    } else {
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra email hoặc password.");
    }
  };

  const handleForgotPassword = () => {
    alert("Bạn đã bấm Quên mật khẩu. Thực hiện xử lý quên mật khẩu ở đây.");
  };

  return (
    <div className="h-[calc(100vh-112px-434px)] flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>

        <label htmlFor="email" className="block text-gray-700 mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Nhập email"
        />

        <label htmlFor="password" className="block text-gray-700 mb-2">
          Mật khẩu
        </label>
        <div className="relative mb-2">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
            placeholder="Nhập mật khẩu"
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

        {loading && <p className="text-gray-600 text-sm mb-4">Đang đăng nhập...</p>}

        <div className="mb-6 text-right">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 hover:underline"
          >
            Quên mật khẩu?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
