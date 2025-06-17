import {
  FaUsers,
  FaStore,
  FaClipboardList,
  FaConciergeBell,
  FaUserPlus,
  FaStoreAlt,
  FaRegCalendarPlus,
  FaPlusCircle,
} from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAdminStatistics, fetchRevenueData } from "../../services/statisticsApi";
import { getPublicShops } from "../../services/shopApi";

const statConfig = [
  { label: "Tổng khách hàng", key: "totalCustomers", icon: <FaUsers className="text-blue-500 text-3xl" /> },
  { label: "Tổng cửa hàng", key: "totalShops", icon: <FaStore className="text-green-500 text-3xl" /> },
  { label: "Tổng đơn đặt lịch", key: "totalBookings", icon: <FaClipboardList className="text-purple-500 text-3xl" /> },
  { label: "Tổng dịch vụ", key: "totalServices", icon: <FaConciergeBell className="text-yellow-500 text-3xl" /> },
  { label: "Khách hàng mới", key: "newCustomers", icon: <FaUserPlus className="text-blue-400 text-3xl" /> },
  { label: "Cửa hàng mới", key: "newShops", icon: <FaStoreAlt className="text-green-400 text-3xl" /> },
  { label: "Đơn đặt lịch mới", key: "newBookings", icon: <FaRegCalendarPlus className="text-purple-400 text-3xl" /> },
  { label: "Dịch vụ mới", key: "newServices", icon: <FaPlusCircle className="text-yellow-400 text-3xl" /> },
];


export default function AdminDashboard() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stats, setStats] = useState(null);
  const [overallData, setOverallData] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [shopData, setShopData] = useState([]);
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  useEffect(()=>{
    if(userInfo?.role === 'customer' || userInfo?.role === 'shop'){
      navigate('/admin/profile')
    }
  },[userInfo,navigate])

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchAdminStatistics();
        setStats(data);
      } catch (error) {
        console.error('Lỗi lấy thống kê:', error);
      }
    };
    if (userInfo?.role === 'admin') {
      loadStats();
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await getPublicShops();
        setShops(res.shops);
        if (res.shops.length && !selectedShop) {
          setSelectedShop(res.shops[0].id.toString());
        }
      } catch (error) {
        console.error('Lỗi lấy shop:', error);
      }
    };
    if (userInfo?.role === 'admin') {
      fetchShops();
    }
  }, [userInfo]);

  useEffect(() => {
    const loadOverall = async () => {
      try {
        const params = {};
        if (startDate) params.start = startDate;
        if (endDate) params.end = endDate;
        const data = await fetchRevenueData(params);
        setOverallData(data);
      } catch (error) {
        console.error('Lỗi lấy dữ liệu doanh thu:', error);
      }
    };

    const loadShopRevenue = async () => {
      try {
        const params = {};
        if (startDate) params.start = startDate;
        if (endDate) params.end = endDate;
        if (userInfo?.role === 'admin') {
          params.shopId = selectedShop;
        }
        const data = await fetchRevenueData(params);
        if (userInfo?.role === 'admin') setShopData(data); else setOverallData(data);
      } catch (error) {
        console.error('Lỗi lấy doanh thu shop:', error);
      }
    };

    if (userInfo?.role === 'admin') {
      loadOverall();
      if (selectedShop) loadShopRevenue();
    } else if (userInfo?.role === 'shop') {
      loadShopRevenue();
    }
  }, [startDate, endDate, userInfo, selectedShop]);

  const filteredOverall = overallData;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Trang chủ quản trị</h2>

      {/* Các ô thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statConfig.map((cfg, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-4 flex items-center space-x-4"
          >
            <div>{cfg.icon}</div>
            <div>
              <p className="text-gray-500 text-sm">{cfg.label}</p>
              <p className="text-xl font-semibold">{stats ? stats[cfg.key] : 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bộ lọc ngày */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Từ ngày:</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Đến ngày:</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Biểu đồ doanh thu */}
      {userInfo?.role === 'admin' && (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">Doanh thu tất cả shop</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredOverall}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {userInfo?.role === 'admin' && (
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="mb-4">
            <label className="mr-2 font-medium">Chọn shop:</label>
            <select
              className="border p-2 rounded"
              value={selectedShop}
              onChange={(e) => setSelectedShop(e.target.value)}
            >
              {shops.map((s) => (
                <option key={s.id} value={s.id}>{s.username}</option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={shopData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#EF4444" strokeWidth={2} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {userInfo?.role === 'shop' && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">Biểu đồ doanh thu</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredOverall}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
