import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createBookingThunk } from '../../redux/bookingSlice';
import { getPayments } from '../../redux/paymentSlice';

const PaymentPopup = ({ show, onClose, bookingData, serviceDetail, shop, selectedTime }) => {
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(180); // 3 phút
  const intervalRef = useRef(null);
  const pollingRef = useRef(null);
  console.log('bookingData :>> ', bookingData);
  const depositAmount = Math.floor(serviceDetail?.price * serviceDetail?.deposit / 100);

  const bankId = "MB"; 
  const accountNo = "86999904112003"; 
  const qrTemplate = "qr_only.png"; 
  const description = encodeURIComponent(`Dat coc dich vu ${serviceDetail?.name}`);
  const vietqrUrl = `https://api.vietqr.io/image/${bankId}-${accountNo}-${qrTemplate}?amount=${depositAmount}&addInfo=${description}`;

  // Hàm kiểm tra payment phù hợp
  const isValidPayment = (payment) => {
    return (
      payment.description?.includes(serviceDetail?.name) &&
      payment.amount === depositAmount
    );
  };

  // Polling API payment
  const startPolling = () => {
    pollingRef.current = setInterval(async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const res = await dispatch(getPayments({ from_date: today, to_date: today })).unwrap();

        const matched = res?.data?.find(isValidPayment);

        if (matched) {
          clearInterval(pollingRef.current);
          clearInterval(intervalRef.current);
          toast.success('Phát hiện thanh toán. Đang đặt lịch...');

          dispatch(createBookingThunk(bookingData))
            .unwrap()
            .then((res) => {
              toast.success('Đặt dịch vụ thành công!');
              onClose(true, res); // success, booking info
            })
            .catch((err) => {
              toast.error("Đặt lịch thất bại: " + (err?.message || "Lỗi không xác định"));
              onClose(false);
            });
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 10000); // 1s 1 lần
  };

  // Bắt đầu đếm giờ và polling khi show
  useEffect(() => {
    if (show) {
      setCountdown(180);

      intervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            clearInterval(pollingRef.current);
            toast.warning("Hết thời gian thanh toán.");
            onClose(false); // tự động đóng khi hết thời gian
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      startPolling();
    }

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(pollingRef.current);
    };
  }, [show]);

  if (!show || !bookingData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
        <button onClick={() => onClose(false)} className="absolute top-2 right-2 text-gray-600 hover:text-red-500">✕</button>

        <h2 className="text-xl font-bold mb-4 text-center text-green-600">Xác nhận thanh toán</h2>

        <div className="text-sm text-gray-700 mb-3">
          <p><strong>Dịch vụ:</strong> {serviceDetail?.name}</p>
          <p><strong>Cửa hàng:</strong> {shop?.username}</p>
          <p><strong>Thời gian:</strong> {bookingData?.bookingDate?.[0]?.day} {bookingData?.bookingDate?.[0]?.from} - {bookingData?.bookingDate?.[0]?.to}</p>
          <p><strong>Tổng tiền:</strong> {serviceDetail?.price?.toLocaleString()}đ</p>
          <p><strong>Tiền đặt cọc:</strong> {depositAmount?.toLocaleString()}đ</p>
        </div>

        <div className="flex justify-center">
          <img
            src={vietqrUrl}
            alt="QR VietQR"
            className="w-40 h-40 object-contain border rounded"
          />
        </div>

        <p className="text-center text-sm mt-2 text-gray-500">Quét mã QR để đặt cọc trước</p>

        <p className="text-center mt-1 text-red-500">Còn lại: {countdown}s</p>

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => {
              clearInterval(intervalRef.current);
              clearInterval(pollingRef.current);
              dispatch(createBookingThunk(bookingData))
                .unwrap()
                .then((res) => {
                  toast.success('Bạn đã đặt dịch vụ thành công!');
                  onClose(true, res);
                })
                .catch((err) => {
                  toast.error('Đặt lịch thất bại: ' + (err?.message || 'Đã có lỗi'));
                  onClose(false);
                });
            }}
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            Tôi đã thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;
