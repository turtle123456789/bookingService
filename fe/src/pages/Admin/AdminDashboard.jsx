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

import { useState } from "react";

const stats = [
  { label: "Tổng khách hàng", icon: <FaUsers className="text-blue-500 text-3xl" />, count: 1200 },
  { label: "Tổng cửa hàng", icon: <FaStore className="text-green-500 text-3xl" />, count: 150 },
  { label: "Tổng đơn đặt lịch", icon: <FaClipboardList className="text-purple-500 text-3xl" />, count: 340 },
  { label: "Tổng dịch vụ", icon: <FaConciergeBell className="text-yellow-500 text-3xl" />, count: 90 },
  { label: "Khách hàng mới", icon: <FaUserPlus className="text-blue-400 text-3xl" />, count: 32 },
  { label: "Cửa hàng mới", icon: <FaStoreAlt className="text-green-400 text-3xl" />, count: 7 },
  { label: "Đơn đặt lịch mới", icon: <FaRegCalendarPlus className="text-purple-400 text-3xl" />, count: 18 },
  { label: "Dịch vụ mới", icon: <FaPlusCircle className="text-yellow-400 text-3xl" />, count: 12 },
];

// Dữ liệu mẫu biểu đồ doanh thu
const fullData = [
  { date: "2025-01-01", revenue: 1000 },
  { date: "2025-01-15", revenue: 1200 },
  { date: "2025-02-01", revenue: 1500 },
  { date: "2025-02-15", revenue: 1700 },
  { date: "2025-03-01", revenue: 2000 },
  { date: "2025-03-15", revenue: 1800 },
  { date: "2025-04-01", revenue: 2100 },
];

export default function AdminDashboard() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Lọc dữ liệu theo ngày
  const filteredData = fullData.filter((item) => {
    const itemDate = new Date(item.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (!start || itemDate >= start) && (!end || itemDate <= end);
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Trang chủ quản trị</h2>

      {/* Các ô thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-4 flex items-center space-x-4"
          >
            <div>{stat.icon}</div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-xl font-semibold">{stat.count}</p>
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
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Biểu đồ doanh thu</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4F46E5"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
