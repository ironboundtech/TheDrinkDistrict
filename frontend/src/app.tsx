import React, { useState, useEffect, useRef, useCallback } from 'react';
import config from './config';
import { 
  Calendar, 
  MapPin, 
  Wallet, 
  ShoppingBag, 
  User, 
  Settings, 
  Bell, 
  QrCode,
  CreditCard,
  Clock,
  Star,
  Shield,
  Zap,
  Phone,
  Globe,
  BarChart3,
  DoorOpen,
  Smartphone,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Heart,
  LogIn,
  LogOut,
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserPlus,
  X,
  Building2,
  Store,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Image,
  ShoppingCart
} from 'lucide-react';

// AuthModal Component
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => Promise<boolean>;
  onRegister: (userData: RegisterData) => Promise<boolean>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  username: string;
  password: string;
}

// BookingModal Component
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  court: any;
  onConfirmBooking: (bookingData: BookingData) => Promise<boolean>;
}

interface BookingData {
  courtId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
}

// Notification Component
interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

// TopUpModal Component
interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTopUp: (amount: number, paymentMethod: string) => Promise<boolean>;
}

// CheckoutModal Component
interface CheckoutModalProps {
  cart: any[];
  total: number;
  currentUser: any;
  isLoggedIn: boolean;
  walletBalance: number;
  getAuthToken: () => string | null;
  setCurrentUser: (user: any) => void;
  onClose: () => void;
  onSuccess: () => void;
  showNotification: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
  setCurrentPage: (page: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLoginMode) {
        const success = await onLogin(loginData.username, loginData.password);
        if (success) {
          onClose();
          // Reset form
          setLoginData({ username: '', password: '' });
        } else {
          setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        }
      } else {
        // Validate register form
        if (!registerData.firstName || !registerData.lastName || !registerData.email || 
            !registerData.phone || !registerData.gender || !registerData.username || !registerData.password) {
          setError('กรุณากรอกข้อมูลให้ครบถ้วน');
          return;
        }
        
        if (registerData.password.length < 6) {
          setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
          return;
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(registerData.email)) {
          setError('รูปแบบอีเมลไม่ถูกต้อง');
          return;
        }

        // Check phone format (10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(registerData.phone)) {
          setError('เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก');
          return;
        }

        const success = await onRegister(registerData);
        if (success) {
          onClose();
          // Reset form
          setRegisterData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            gender: '',
            username: '',
            password: ''
          });
        } else {
          setError('ชื่อผู้ใช้หรืออีเมลนี้มีอยู่ในระบบแล้ว');
        }
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {isLoginMode ? (
              <>
                <LogIn size={24} className="text-blue-400" />
                เข้าสู่ระบบ
              </>
            ) : (
              <>
                <UserPlus size={24} className="text-green-400" />
                ลงทะเบียน
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {isLoginMode ? (
            // Login Form
            <>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  ชื่อผู้ใช้
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="กรอกชื่อผู้ใช้"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-10 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="กรอกรหัสผ่าน"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Register Form
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    ชื่อจริง
                  </label>
                  <input
                    type="text"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    placeholder="ชื่อจริง"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    นามสกุล
                  </label>
                  <input
                    type="text"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    placeholder="นามสกุล"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  อีเมล
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    placeholder="example@email.com"
                    required
                  />
                               </div>
             </div>

             <div>
               <label className="block text-gray-300 text-sm font-medium mb-2">
                 เบอร์โทรศัพท์
               </label>
               <div className="relative">
                 <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                 <input
                   type="tel"
                   value={registerData.phone}
                   onChange={(e) => {
                     // Only allow numbers
                     const value = e.target.value.replace(/[^0-9]/g, '');
                     // Limit to 10 digits
                     if (value.length <= 10) {
                       setRegisterData({...registerData, phone: value});
                     }
                   }}
                   className="w-full bg-gray-700 border border-gray-600 rounded-lg px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                   placeholder="0812345678"
                   required
                   maxLength={10}
                 />
               </div>
             </div>

             <div>
               <label className="block text-gray-300 text-sm font-medium mb-2">
                 เพศ
               </label>
                <select
                  value={registerData.gender}
                  onChange={(e) => setRegisterData({...registerData, gender: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  required
                >
                  <option value="">เลือกเพศ</option>
                  <option value="male">ชาย</option>
                  <option value="female">หญิง</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  ชื่อผู้ใช้
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    placeholder="ชื่อผู้ใช้สำหรับเข้าสู่ระบบ"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-10 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              isLoginMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {isLoginMode ? 'กำลังเข้าสู่ระบบ...' : 'กำลังลงทะเบียน...'}
              </div>
            ) : (
              <>
                {isLoginMode ? 'เข้าสู่ระบบ' : 'ลงทะเบียน'}
              </>
            )}
          </button>

          {/* Switch Mode */}
          <div className="text-center pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              {isLoginMode ? 'ยังไม่มีบัญชี?' : 'มีบัญชีอยู่แล้ว?'}
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setError('');
                  setShowPassword(false);
                }}
                className={`ml-2 font-medium transition-colors ${
                  isLoginMode 
                    ? 'text-green-400 hover:text-green-300' 
                    : 'text-blue-400 hover:text-blue-300'
                }`}
              >
                {isLoginMode ? 'ลงทะเบียนที่นี่' : 'เข้าสู่ระบบที่นี่'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

const Notification: React.FC<NotificationProps> = ({ isOpen, onClose, type, title, message }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'info':
        return <AlertCircle className="w-6 h-6 text-blue-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative max-w-md w-full mx-4 p-6 rounded-lg shadow-lg border ${getBgColor()}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-medium ${getTextColor()}`}>
              {title}
            </h3>
            <p className={`mt-1 text-sm ${getTextColor()}`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              type === 'success' ? 'bg-green-600 text-white hover:bg-green-700' :
              type === 'error' ? 'bg-red-600 text-white hover:bg-red-700' :
              type === 'warning' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
              type === 'info' ? 'bg-blue-600 text-white hover:bg-blue-700' :
              'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
};

// BookingModal Component
const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, court, onConfirmBooking }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate time slots from 6:00 to 22:00
  const timeSlots = [];
  for (let hour = 6; hour <= 22; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!startTime || !endTime) return 0;
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const hours = endHour - startHour;
    return hours * court.price;
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    if (!selectedDate || !startTime || !endTime) {
      setError('กรุณาเลือกวันที่และเวลาให้ครบถ้วน');
      return;
    }

    if (startTime >= endTime) {
      setError('เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const bookingData: BookingData = {
        courtId: court._id,
        bookingDate: selectedDate,
        startTime: startTime,
        endTime: endTime,
        totalPrice: calculateTotalPrice()
      };

      const success = await onConfirmBooking(bookingData);
      if (success) {
        onClose();
        // Reset form
        setSelectedDate('');
        setStartTime('');
        setEndTime('');
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">จองสนาม {court?.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Court Info */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex gap-3">
              {court?.image ? (
                <img 
                  src={court.image.startsWith('data:') ? court.image : (court.image.startsWith('http') ? court.image : `${config.apiUrl}${court.image}`)} 
                  alt={court.name}
                  className="w-16 h-16 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center ${court?.image ? 'hidden' : 'flex'}`}>
                <Image size={24} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{court?.name}</h3>
                <p className="text-gray-400 text-sm">{court?.address}</p>
                <p className="text-blue-400 font-semibold">฿{court?.price}/hr</p>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              เลือกวันที่
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getMinDate()}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                เวลาเริ่มต้น
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">เลือกเวลา</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                เวลาสิ้นสุด
              </label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">เลือกเวลา</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Total Price */}
          {startTime && endTime && (
            <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-300 text-sm">ราคารวม:</span>
                <span className="text-white font-semibold text-lg">฿{calculateTotalPrice()}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={isLoading || !selectedDate || !startTime || !endTime}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                isLoading || !selectedDate || !startTime || !endTime
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  กำลังจอง...
                </div>
              ) : (
                'จองเลย'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ cart, total, currentUser, isLoggedIn, walletBalance, getAuthToken, setCurrentUser, onClose, onSuccess, showNotification, setCurrentPage }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      setError('กรุณาเข้าสู่ระบบก่อนดำเนินการสั่งซื้อ');
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        setError('ไม่พบ token การเข้าสู่ระบบ กรุณาเข้าสู่ระบบใหม่');
        return;
      }

      // Use current wallet balance from props instead of fetching again
      if (walletBalance < total) {
        setError('ยอดเงินในกระเป๋าไม่เพียงพอ กรุณาเติมเงินก่อน');
        return;
      }

      setIsProcessing(true);
      setError('');

              const response = await fetch(`${config.apiBaseUrl}/purchases`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item._id,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: total
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Clear cache to force fresh data on next fetch
          localStorage.removeItem('userDataCache');
          localStorage.removeItem('userDataCacheTime');
          localStorage.removeItem('walletBalanceCache');
          localStorage.removeItem('walletBalanceCacheTime');

          console.log('Purchase successful! Showing alert...');
          
          // Show success notification immediately
          showNotification('success', 'การสั่งซื้อเสร็จสมบูรณ์', 'ระบบจะกลับไปหน้า Store ภายใน 5 วินาที');
          
          // Also show browser alert
          setTimeout(() => {
            if (window.confirm('การสั่งซื้อเสร็จสมบูรณ์! ระบบจะกลับไปหน้า Store ภายใน 5 วินาที\n\nกด OK เพื่อไปที่หน้า Store ทันที หรือ Cancel เพื่อรอ 5 วินาที')) {
              console.log('User confirmed - navigating immediately');
              setCurrentPage('store');
              onSuccess();
              return;
            }
          }, 200);
          
          // Refresh user data (wallet, etc.)
          if (typeof (window as any).refreshUserData === 'function') {
            (window as any).refreshUserData();
          }
          
          console.log('Setting timeout to navigate to store page...');
          
          // Navigate to store page after 5 seconds
          setTimeout(() => {
            console.log('Auto-navigating to store page...');
            setCurrentPage('store');
            onSuccess(); // This will close the modal and clear cart
          }, 5000);
        } else {
          setError(result.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">ยืนยันการสั่งซื้อ</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            disabled={isProcessing}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 max-h-96 overflow-y-auto">
          {/* Order Summary */}
          <div className="mb-4">
            <h4 className="text-white font-medium mb-2">สรุปการสั่งซื้อ</h4>
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-300">{item.name} x{item.quantity}</span>
                  <span className="text-white">฿{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-600 mt-2 pt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-white">รวมทั้งหมด:</span>
                <span className="text-blue-400">฿{total}</span>
              </div>
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="mb-4 p-3 bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">ยอดเงินในกระเป๋า:</span>
              <span className="text-white font-medium">฿{walletBalance}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-gray-300 text-sm">ยอดเงินหลังหัก:</span>
              <span className={`font-medium ${walletBalance - total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ฿{walletBalance - total}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleCheckout}
            disabled={isProcessing || !isLoggedIn || walletBalance < total}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
          >
            {isProcessing ? 'กำลังดำเนินการ...' : 'ยืนยันการสั่งซื้อ'}
          </button>
        </div>
      </div>
    </div>
  );
};

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose, onTopUp }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const predefinedAmounts = [50, 100, 300, 500, 1000];
  const paymentMethods = [
    { id: 'promptpay', label: 'Prompt Pay', icon: '💳' },
    { id: 'creditcard', label: 'Credit/Debit Card', icon: '💳' },
    { id: 'truemoney', label: 'TrueMoney Wallet', icon: '📱' },
    { id: 'free', label: 'Free', icon: '🎁' }
  ];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleTopUp = async () => {
    if (selectedAmount <= 0 || !selectedPaymentMethod) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await onTopUp(selectedAmount, selectedPaymentMethod);
      if (success) {
        // Reset form
        setSelectedAmount(0);
        setSelectedPaymentMethod('');
        onClose();
      }
    } catch (error) {
      console.error('Top-up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = selectedAmount > 0 && selectedPaymentMethod !== '';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Top Up Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Amount Selection */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">Select Amount</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  selectedAmount === amount
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                    : 'border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                ฿{amount}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">Payment Method</h3>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handlePaymentMethodSelect(method.id)}
                className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                  selectedPaymentMethod === method.id
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                    : 'border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{method.icon}</span>
                  <span className="font-medium">{method.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handleTopUp}
          disabled={!isFormValid || isLoading}
          className={`w-full p-4 rounded-lg font-medium transition-colors ${
            isFormValid && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Processing...' : selectedPaymentMethod === 'free' ? `Get Free ฿${selectedAmount.toFixed(2)}` : `Pay ฿${selectedAmount.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};



const DistrictSportsPWA = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [language, setLanguage] = useState('en');
  const [walletBalance, setWalletBalance] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Guest',
    level: 'Member',
    avatar: `${config.apiBaseUrl}/placeholder/40/40`
  });

  // Update userProfile when currentUser changes
  useEffect(() => {
    if (currentUser) {
      let displayName = 'Guest';
      if (currentUser.name && typeof currentUser.name === 'string') {
        displayName = currentUser.name;
      } else if (currentUser.firstName || currentUser.lastName) {
        displayName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
      } else if (currentUser.username) {
        displayName = currentUser.username;
      }
      setUserProfile({
        name: displayName,
        level: currentUser.level || 'Member',
        avatar: currentUser.avatar || `${config.apiBaseUrl}/placeholder/40/40`
      });
          } else {
        setUserProfile({
          name: 'Guest',
          level: 'Member',
          avatar: `${config.apiBaseUrl}/placeholder/40/40`
        });
    }
  }, [currentUser]);
  const [courts, setCourts] = useState([]);
  const [isLoadingCourts, setIsLoadingCourts] = useState(true);
  const [userBookings, setUserBookings] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  // Auto logout timer
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mock Database - เก็บข้อมูลใน localStorage
  const initializeMockDB = () => {
    const existingUsers = localStorage.getItem('sportsBookingUsers');
    if (!existingUsers) {
      const defaultUsers = [
        {
          id: '1',
          username: 'admin',
          password: 'password',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
          gender: 'other',
          level: 'Gold Member',
          createdAt: new Date().toISOString()
        },
        {
          id: '2', 
          username: 'demo',
          password: '123456',
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@example.com',
          gender: 'male',
          level: 'Silver Member',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('sportsBookingUsers', JSON.stringify(defaultUsers));
    }
  };

  const getUsersFromStorage = () => {
    const users = localStorage.getItem('sportsBookingUsers');
    return users ? JSON.parse(users) : [];
  };

  const saveUsersToStorage = (users: any[]) => {
    localStorage.setItem('sportsBookingUsers', JSON.stringify(users));
  };

  const getCurrentUserFromStorage = () => {
    const currentUser = localStorage.getItem('sportsBookingCurrentUser');
    return currentUser ? JSON.parse(currentUser) : null;
  };

  const saveCurrentUserToStorage = useCallback((user: any) => {
    localStorage.setItem('sportsBookingCurrentUser', JSON.stringify(user));
  }, []);

  const clearCurrentUserFromStorage = () => {
    localStorage.removeItem('sportsBookingCurrentUser');
  };

  // Token management functions
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const setAuthToken = (token: string) => {
    localStorage.setItem('authToken', token);
  };

  const clearAuthToken = () => {
    localStorage.removeItem('authToken');
  };

  // Auto logout functions
  const resetLogoutTimer = useCallback(() => {
    // Clear existing timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    
    // Set new timer for 15 minutes (900000 ms)
    logoutTimerRef.current = setTimeout(() => {
      console.log('🕐 Auto logout after 15 minutes of inactivity');
      // Call handleLogout directly without dependency
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
      
      // Clear all caches on logout
      localStorage.removeItem('userDataCache');
      localStorage.removeItem('userDataCacheTime');
      localStorage.removeItem('walletBalanceCache');
      localStorage.removeItem('walletBalanceCacheTime');
      localStorage.removeItem('courtsCache');
      localStorage.removeItem('courtsCacheTime');
      localStorage.removeItem('productsCache');
      localStorage.removeItem('productsCacheTime');
      localStorage.removeItem('lastWalletRefresh');
      localStorage.removeItem('lastBookingRefresh');
      localStorage.removeItem('lastWalletPageRefresh');
      
      setIsLoggedIn(false);
      setCurrentUser(null);
      setUserProfile({
        name: 'Guest',
        level: 'Member',
        avatar: `${config.apiBaseUrl}/placeholder/40/40`
      });
      setWalletBalance(0);
      localStorage.removeItem('sportsBookingCurrentUser');
      localStorage.removeItem('authToken');
      setCurrentPage('dashboard');
    }, 900000);
  }, []);

  const handleUserActivity = useCallback(() => {
    if (isLoggedIn) {
      resetLogoutTimer();
    }
  }, [isLoggedIn, resetLogoutTimer]);

  // Validate token with backend
  const validateToken = async (token: string): Promise<boolean> => {
    try {
              const response = await fetch(`${config.apiBaseUrl}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        return result.success;
      }
      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  // Get current page from URL or localStorage
  const getCurrentPageFromStorage = () => {
    const savedPage = localStorage.getItem('sportsBookingCurrentPage');
    return savedPage || 'dashboard';
  };

  const saveCurrentPageToStorage = useCallback((page: string) => {
    localStorage.setItem('sportsBookingCurrentPage', page);
  }, []);

  // Get language from localStorage
  const getLanguageFromStorage = () => {
    const savedLanguage = localStorage.getItem('sportsBookingLanguage');
    return savedLanguage || 'en';
  };

  const saveLanguageToStorage = useCallback((lang: string) => {
    localStorage.setItem('sportsBookingLanguage', lang);
  }, []);

  // Fetch wallet balance from backend - optimized with caching
  const fetchWalletBalance = useCallback(async () => {
    const startTime = performance.now();
    try {
      const token = getAuthToken();
      if (!token) {
        setWalletBalance(0);
        return;
      }

      // Check cache first
      const cachedBalance = localStorage.getItem('walletBalanceCache');
      const cacheTime = localStorage.getItem('walletBalanceCacheTime');
      const now = Date.now();
      
      if (cachedBalance && cacheTime && (now - parseInt(cacheTime)) < 15000) { // 15 second cache
        setWalletBalance(parseFloat(cachedBalance));
        return;
      }

      const response = await fetch(`${config.apiBaseUrl}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('fetchWalletBalance response:', result);
        if (result.success && result.data.walletBalance !== undefined) {
          // Cache the balance
          localStorage.setItem('walletBalanceCache', result.data.walletBalance.toString());
          localStorage.setItem('walletBalanceCacheTime', now.toString());
          
          console.log('Setting wallet balance from API:', result.data.walletBalance);
          setWalletBalance(result.data.walletBalance);
          localStorage.setItem('sportsBookingWalletBalance', result.data.walletBalance.toString());
        }
      } else {
        console.error('Failed to fetch wallet balance');
        setWalletBalance(0);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      
      // Handle specific error types
      if (error.message && error.message.includes('Failed to fetch')) {
        console.warn('Network error - this might be due to ad-blocker or network issues');
        // Try to use cached balance if available
        const cachedBalance = localStorage.getItem('walletBalanceCache');
        if (cachedBalance) {
          console.log('Using cached wallet balance');
          setWalletBalance(parseFloat(cachedBalance));
        } else {
          setWalletBalance(0);
        }
      } else {
        setWalletBalance(0);
      }
    } finally {
      logPerformance('fetchWalletBalance', startTime);
    }
  }, []);

  // Get wallet balance from localStorage
  const getWalletBalanceFromStorage = () => {
    const savedBalance = localStorage.getItem('sportsBookingWalletBalance');
    return savedBalance ? parseFloat(savedBalance) : 0;
  };

  const saveWalletBalanceToStorage = useCallback((balance: number) => {
    localStorage.setItem('sportsBookingWalletBalance', balance.toString());
  }, []);

  // Function to refresh user data and wallet balance - optimized with caching
  const refreshUserData = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      // Check if we have recent data in cache
      const cachedData = localStorage.getItem('userDataCache');
      const cacheTime = localStorage.getItem('userDataCacheTime');
      const now = Date.now();
      
      if (cachedData && cacheTime && (now - parseInt(cacheTime)) < 30000) { // 30 second cache
        const parsedData = JSON.parse(cachedData);
        setCurrentUser(parsedData);
        setWalletBalance(parsedData.walletBalance);
        return;
      }

      const response = await fetch(`${config.apiBaseUrl}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Cache the data
          localStorage.setItem('userDataCache', JSON.stringify(result.data));
          localStorage.setItem('userDataCacheTime', now.toString());
          
          setCurrentUser(result.data);
          saveCurrentUserToStorage(result.data);
          setWalletBalance(result.data.walletBalance);
          saveWalletBalanceToStorage(result.data.walletBalance);
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      
      // Handle specific error types
      if (error.message && error.message.includes('Failed to fetch')) {
        console.warn('Network error - this might be due to ad-blocker or network issues');
        // Try to use cached data if available
        const cachedData = localStorage.getItem('userDataCache');
        if (cachedData) {
          console.log('Using cached user data');
          const parsedData = JSON.parse(cachedData);
          setCurrentUser(parsedData);
          setWalletBalance(parsedData.walletBalance);
        }
      }
    }
  }, [saveCurrentUserToStorage, saveWalletBalanceToStorage]);

  // Initialize app state from localStorage - optimized for performance
  useEffect(() => {
    initializeMockDB();
    
    // Load saved state from localStorage
    const savedPage = getCurrentPageFromStorage();
    const savedLanguage = getLanguageFromStorage();
    const savedBalance = getWalletBalanceFromStorage();
    const savedUser = getCurrentUserFromStorage();
    const authToken = getAuthToken();
    
    setCurrentPage(savedPage);
    setLanguage(savedLanguage);
    setWalletBalance(savedBalance);
    
    // Check if user is already logged in with valid token
    const checkAuthStatus = async () => {
      if (savedUser && authToken) {
        // Validate token with backend
        const isValidToken = await validateToken(authToken);
        
        if (isValidToken) {
          setIsLoggedIn(true);
          setCurrentUser(savedUser);
          setUserProfile({
            name: `${savedUser.firstName} ${savedUser.lastName}`,
            level: savedUser.level,
            avatar: `${config.apiBaseUrl}/placeholder/40/40`
          });
          
          // Fetch wallet balance from backend with caching
          await fetchWalletBalance();
          
          // Start auto logout timer
          resetLogoutTimer();
        } else {
          // Token is invalid, clear everything
          clearAllCaches();
          handleLogout();
        }
      }
    };
    
    checkAuthStatus();
    
    // Add event listeners for user activity - optimized to use passive listeners
    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });
    
    // Cleanup function
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
      
      // Clear timers on cleanup
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
      // Capture the ref value inside the effect to avoid stale closure
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const currentActivityTimer = activityTimerRef.current;
      if (currentActivityTimer) {
        clearTimeout(currentActivityTimer);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleUserActivity, resetLogoutTimer]);

  // Save current page to localStorage when it changes
  useEffect(() => {
    saveCurrentPageToStorage(currentPage);
  }, [currentPage, saveCurrentPageToStorage]);

  // Save language to localStorage when it changes
  useEffect(() => {
    saveLanguageToStorage(language);
  }, [language, saveLanguageToStorage]);

  // Refresh wallet balance when navigating to wallet page - optimized to prevent excessive calls
  useEffect(() => {
    if (currentPage === 'wallet' && isLoggedIn) {
      // Only refresh if we haven't refreshed recently
      const lastRefresh = localStorage.getItem('lastWalletRefresh');
      const now = Date.now();
      if (!lastRefresh || (now - parseInt(lastRefresh)) > 5000) { // 5 second cooldown
        console.log('Navigating to wallet page - refreshing wallet balance');
        refreshUserData();
        localStorage.setItem('lastWalletRefresh', now.toString());
      }
    }
  }, [currentPage, isLoggedIn, refreshUserData]);

  // Save wallet balance to localStorage when it changes
  useEffect(() => {
    saveWalletBalanceToStorage(walletBalance);
  }, [walletBalance, saveWalletBalanceToStorage]);

  // Function to clear all caches
  const clearAllCaches = useCallback(() => {
    localStorage.removeItem('userDataCache');
    localStorage.removeItem('userDataCacheTime');
    localStorage.removeItem('walletBalanceCache');
    localStorage.removeItem('walletBalanceCacheTime');
    localStorage.removeItem('courtsCache');
    localStorage.removeItem('courtsCacheTime');
    localStorage.removeItem('productsCache');
    localStorage.removeItem('productsCacheTime');
    localStorage.removeItem('lastWalletRefresh');
    localStorage.removeItem('lastBookingRefresh');
    localStorage.removeItem('lastWalletPageRefresh');
    // Clear user-specific booking caches
    if (currentUser?._id) {
      localStorage.removeItem(`bookingsCache_${currentUser._id}`);
      localStorage.removeItem(`bookingsCacheTime_${currentUser._id}`);
    }
  }, [currentUser?._id]);

  // Performance monitoring function
  const logPerformance = (operation: string, startTime: number) => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    if (duration > 100) { // Log slow operations (>100ms)
      console.warn(`⚠️ Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
    }
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get('page') || 'dashboard';
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL when page changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', currentPage);
    window.history.replaceState({}, '', url.toString());
  }, [currentPage]);

  // Fetch courts on component mount
  useEffect(() => {
    fetchCourts();
  }, []);

  // Initialize wallet balance from localStorage on component mount
  useEffect(() => {
    const savedBalance = localStorage.getItem('sportsBookingWalletBalance');
    if (savedBalance) {
      const balance = parseFloat(savedBalance);
      console.log('Initializing wallet balance from localStorage:', balance);
      setWalletBalance(balance);
    }
  }, []);

  // Fetch user bookings when user logs in or currentUser changes - optimized to prevent excessive calls
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      const lastBookingRefresh = localStorage.getItem('lastBookingRefresh');
      const now = Date.now();
      if (!lastBookingRefresh || (now - parseInt(lastBookingRefresh)) > 10000) { // 10 second cooldown
        fetchUserBookings();
        localStorage.setItem('lastBookingRefresh', now.toString());
      }
    } else {
      setUserBookings([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, currentUser]); // Only depend on user ID, not entire user object

  // Fetch wallet balance when user logs in or currentUser changes
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      console.log('Fetching wallet balance on login/user change:', currentUser._id);
      fetchWalletBalance();
    } else {
      setWalletBalance(0);
    }
  }, [isLoggedIn, currentUser, fetchWalletBalance]);

  // Update current time every minute for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Helper function to show notifications
  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  // Top-up functions
  const handleTopUp = async (amount: number, paymentMethod: string): Promise<boolean> => {
    if (!isLoggedIn) {
      showNotification('warning', 'แจ้งเตือน', 'กรุณาเข้าสู่ระบบก่อนเติมเงิน');
      return false;
    }

    // Check if currentUser exists and has an _id
    if (!currentUser || !currentUser._id) {
      console.error('Current user is not properly loaded:', currentUser);
      showNotification('error', 'ข้อผิดพลาด', 'ข้อมูลผู้ใช้ไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่');
      return false;
    }

    try {
      // Handle free top-up (no payment processing needed)
      if (paymentMethod === 'free') {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update wallet balance in backend for free top-up too
        const response = await fetch(`${config.apiBaseUrl}/auth/users/${currentUser._id}/wallet/topup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            amount: amount,
            paymentMethod: 'free'
          })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Immediately update local wallet balance
          const newBalance = walletBalance + amount;
          console.log('Updated wallet balance (free):', { current: walletBalance, amount, newBalance });
          setWalletBalance(newBalance);
          
          // Update localStorage immediately
          localStorage.setItem('walletBalanceCache', newBalance.toString());
          localStorage.setItem('walletBalanceCacheTime', Date.now().toString());
          localStorage.setItem('sportsBookingWalletBalance', newBalance.toString());

                  // Show success message
        showNotification('success', 'สำเร็จ', `เติมเงินฟรีสำเร็จ! เพิ่ม ${amount} บาท`);

        // Force a re-render by updating currentUser wallet balance
        if (currentUser) {
          setCurrentUser(prev => ({
            ...prev,
            walletBalance: newBalance
          }));
        }

        // Clear cache and fetch fresh wallet balance from backend to ensure synchronization
        localStorage.removeItem('walletBalanceCache');
        localStorage.removeItem('walletBalanceCacheTime');
        await fetchWalletBalance();

        return true;
        } else {
          showNotification('error', 'ข้อผิดพลาด', result.message || 'เกิดข้อผิดพลาดในการเติมเงินฟรี');
          return false;
        }
      }

      // Regular payment processing for other methods
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update wallet balance in backend
      const response = await fetch(`${config.apiBaseUrl}/auth/users/${currentUser._id}/wallet/topup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          amount: amount,
          paymentMethod: paymentMethod
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Immediately update local wallet balance
        const newBalance = walletBalance + amount;
        console.log('Updated wallet balance (paid):', { current: walletBalance, amount, newBalance });
        setWalletBalance(newBalance);
        
        // Update localStorage immediately
        localStorage.setItem('walletBalanceCache', newBalance.toString());
        localStorage.setItem('walletBalanceCacheTime', Date.now().toString());
        localStorage.setItem('sportsBookingWalletBalance', newBalance.toString());

        // Show success message
        showNotification('success', 'สำเร็จ', `เติมเงินสำเร็จ! เพิ่ม ${amount} บาท`);

        // Force a re-render by updating currentUser wallet balance
        if (currentUser) {
          setCurrentUser(prev => ({
            ...prev,
            walletBalance: newBalance
          }));
        }

        // Clear cache and fetch fresh wallet balance from backend to ensure synchronization
        localStorage.removeItem('walletBalanceCache');
        localStorage.removeItem('walletBalanceCacheTime');
        await fetchWalletBalance();

        return true;
      } else {
        showNotification('error', 'ข้อผิดพลาด', result.message || 'เกิดข้อผิดพลาดในการเติมเงิน');
        return false;
      }
    } catch (error) {
      console.error('Error processing top-up:', error);
      showNotification('error', 'ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
      return false;
    }
  };

  // Booking functions
  const handleConfirmBooking = async (bookingData: BookingData): Promise<boolean> => {
    if (!isLoggedIn) {
      showNotification('warning', 'แจ้งเตือน', 'กรุณาเข้าสู่ระบบก่อนจองสนาม');
      return false;
    }

    try {
              const response = await fetch(`${config.apiBaseUrl}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          courtId: bookingData.courtId,
          bookingDate: bookingData.bookingDate,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          totalPrice: bookingData.totalPrice
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update wallet balance
        setWalletBalance(prev => prev - bookingData.totalPrice);

        // Show success message
        showNotification('success', 'สำเร็จ', 'จองสนามสำเร็จ!');

        // Clear caches to force fresh data
        localStorage.removeItem('walletBalanceCache');
        localStorage.removeItem('walletBalanceCacheTime');
        if (currentUser?._id) {
          localStorage.removeItem(`bookingsCache_${currentUser._id}`);
          localStorage.removeItem(`bookingsCacheTime_${currentUser._id}`);
        }

        return true;
      } else {
        showNotification('error', 'ข้อผิดพลาด', result.message || 'เกิดข้อผิดพลาดในการจอง');
        return false;
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      showNotification('error', 'ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
      return false;
    }
  };

  // Auth functions
  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      // Call backend API for login
              const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username, // Using username for login
          password: password
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Login successful
        const user = result.data.user;
        
        setIsLoggedIn(true);
        setCurrentUser({
          _id: user._id,
          username: user.username,
          firstName: user.name.split(' ')[0] || '',
          lastName: user.name.split(' ').slice(1).join(' ') || '',
          email: user.email,
          phone: user.phone,
          role: user.role,
          level: 'Bronze Member',
          createdAt: user.createdAt
        });
        setUserProfile({
          name: user.name,
          level: 'Bronze Member',
          avatar: `${config.apiBaseUrl}/placeholder/40/40`
        });
        
        // Save user and token to localStorage
        const userData = {
          _id: user._id,
          username: user.username,
          firstName: user.name.split(' ')[0] || '',
          lastName: user.name.split(' ').slice(1).join(' ') || '',
          email: user.email,
          phone: user.phone,
          role: user.role,
          level: 'Bronze Member',
          createdAt: user.createdAt
        };
        
        saveCurrentUserToStorage(userData);
        setAuthToken(result.data.token);
        
        // Clear caches on login
        clearAllCaches();
        
        // Start auto logout timer
        resetLogoutTimer();
        
        return true;
      } else {
        // Login failed
        console.log('❌ Login failed:', result.message);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleRegister = async (userData: any): Promise<boolean> => {
    try {
      // Call backend API for registration
              const response = await fetch(`${config.apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${userData.firstName} ${userData.lastName}`,
          username: userData.username,
          email: userData.email,
          password: userData.password,
          phone: userData.phone
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Registration successful
        const newUser = result.data.user;
        
        // Auto login after registration
        setIsLoggedIn(true);
        setCurrentUser({
          _id: newUser._id,
          username: newUser.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          level: 'Bronze Member',
          createdAt: newUser.createdAt
        });
        setUserProfile({
          name: `${userData.firstName} ${userData.lastName}`,
          level: 'Bronze Member',
          avatar: `${config.apiBaseUrl}/placeholder/40/40`
        });
        
        // Save user and token to localStorage
        const userDataForStorage = {
          _id: newUser._id,
          username: newUser.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          level: 'Bronze Member',
          createdAt: newUser.createdAt
        };
        
        saveCurrentUserToStorage(userDataForStorage);
        setAuthToken(result.data.token);
        
        // Clear caches on registration
        clearAllCaches();
        
        // Start auto logout timer
        resetLogoutTimer();
        
        return true;
      } else {
        // Registration failed
        console.log('❌ Registration failed:', result.message);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const handleLogout = useCallback(() => {
    // Clear logout timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    
    // Clear all caches on logout
    clearAllCaches();
    
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserProfile({
      name: 'Guest',
      level: 'Member',
      avatar: `${config.apiBaseUrl}/placeholder/40/40`
    });
    setWalletBalance(0); // Reset wallet balance to 0
    clearCurrentUserFromStorage();
    clearAuthToken();
    setCurrentPage('dashboard');
  }, [clearAllCaches]);

  // Fetch courts function - optimized with caching
  const fetchCourts = async () => {
    try {
      // Check cache first
      const cachedCourts = localStorage.getItem('courtsCache');
      const cacheTime = localStorage.getItem('courtsCacheTime');
      const now = Date.now();
      
      if (cachedCourts && cacheTime && (now - parseInt(cacheTime)) < 60000) { // 1 minute cache
        setCourts(JSON.parse(cachedCourts));
        setIsLoadingCourts(false);
        return;
      }

      setIsLoadingCourts(true);
      const response = await fetch(`${config.apiBaseUrl}/courts/available`);
      if (response.ok) {
        const result = await response.json();
        // API returns array directly, so we set courts to the result
        if (Array.isArray(result)) {
          // Cache the courts data
          localStorage.setItem('courtsCache', JSON.stringify(result));
          localStorage.setItem('courtsCacheTime', now.toString());
          setCourts(result);
        } else {
          console.error('Invalid courts data format:', result);
          setCourts([]);
        }
      } else {
        console.error('Failed to fetch courts:', response.status);
        setCourts([]);
      }
    } catch (error) {
      console.error('Error fetching courts:', error);
      
      // Handle specific error types
      if (error.message && error.message.includes('Failed to fetch')) {
        console.warn('Network error - this might be due to ad-blocker or network issues');
        // Try to use cached data if available
        const cachedCourts = localStorage.getItem('courtsCache');
        if (cachedCourts) {
          console.log('Using cached courts data');
          setCourts(JSON.parse(cachedCourts));
        } else {
          setCourts([]);
        }
      } else {
        setCourts([]);
      }
    } finally {
      setIsLoadingCourts(false);
    }
  };

  // Fetch user bookings function - optimized with caching
  const fetchUserBookings = useCallback(async () => {
    if (!currentUser || !isLoggedIn) {
      setUserBookings([]);
      setIsLoadingBookings(false);
      return;
    }

    try {
      // Check cache first
      const cachedBookings = localStorage.getItem(`bookingsCache_${currentUser._id}`);
      const cacheTime = localStorage.getItem(`bookingsCacheTime_${currentUser._id}`);
      const now = Date.now();
      
      if (cachedBookings && cacheTime && (now - parseInt(cacheTime)) < 30000) { // 30 second cache
        setUserBookings(JSON.parse(cachedBookings));
        setIsLoadingBookings(false);
        return;
      }

      setIsLoadingBookings(true);
      const token = getAuthToken();
              const response = await fetch(`${config.apiBaseUrl}/bookings/user/${currentUser._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Cache the bookings data
          localStorage.setItem(`bookingsCache_${currentUser._id}`, JSON.stringify(result.data));
          localStorage.setItem(`bookingsCacheTime_${currentUser._id}`, now.toString());
          setUserBookings(result.data);
        } else {
          console.error('Failed to fetch bookings:', result.message);
          setUserBookings([]);
        }
      } else {
        console.error('Failed to fetch bookings:', response.status);
        setUserBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      
      // Handle specific error types
      if (error.message && error.message.includes('Failed to fetch')) {
        console.warn('Network error - this might be due to ad-blocker or network issues');
        // Try to use cached data if available
        const cachedBookings = localStorage.getItem(`bookingsCache_${currentUser._id}`);
        if (cachedBookings) {
          console.log('Using cached bookings data');
          setUserBookings(JSON.parse(cachedBookings));
        } else {
          setUserBookings([]);
        }
      } else {
        setUserBookings([]);
      }
    } finally {
      setIsLoadingBookings(false);
    }
  }, [currentUser, isLoggedIn]);

  // Edit Profile Modal Component
  const EditProfileModal = () => {
    const [editData, setEditData] = useState({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      username: currentUser?.username || '',
      gender: currentUser?.gender || '',
      birthMonth: '',
      birthDay: '',
      birthYear: ''
    });

    const months = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const getDaysInMonth = (month: string) => {
      const monthIndex = months.indexOf(month);
      if (monthIndex === -1) return 31;
      
      // เดือนที่มี 30 วัน: เมษายน, มิถุนายน, กันยายน, พฤศจิกายน
      const monthsWith30Days = [3, 5, 8, 10]; // index ของเดือนที่มี 30 วัน
      if (monthsWith30Days.includes(monthIndex)) return 30;
      
      // กุมภาพันธ์ (เดือนที่ 1) มี 28 วัน
      if (monthIndex === 1) return 28;
      
      return 31;
    };

    const generateYearOptions = () => {
      const currentYear = new Date().getFullYear() + 543; // แปลงเป็น พ.ศ.
      const years = [];
      for (let i = currentYear - 100; i <= currentYear - 15; i++) {
        years.push(i);
      }
      return years.reverse();
    };

    const handleSave = () => {
      // อัพเดทข้อมูลผู้ใช้
      const updatedUser = {
        ...currentUser,
        firstName: editData.firstName,
        lastName: editData.lastName,
        username: editData.username,
        gender: editData.gender,
        birthDate: {
          month: editData.birthMonth,
          day: editData.birthDay,
          year: editData.birthYear
        }
      };

      // อัพเดทใน localStorage
      const users = getUsersFromStorage();
      const userIndex = users.findIndex((u: any) => u.id === currentUser._id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        saveUsersToStorage(users);
      }

      // อัพเดท state
      setCurrentUser(updatedUser);
      setUserProfile({
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        level: updatedUser.level,
        avatar: updatedUser.avatar
      });
      saveCurrentUserToStorage(updatedUser);

      setIsEditProfileModalOpen(false);
      console.log('✅ Profile updated successfully');
    };

    if (!isEditProfileModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <User size={24} className="text-blue-400" />
              แก้ไขข้อมูลส่วนตัว
            </h2>
            <button
              onClick={() => setIsEditProfileModalOpen(false)}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {/* ชื่อจริง - แก้ไขไม่ได้ */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                ชื่อจริง
              </label>
              <input
                type="text"
                value={editData.firstName}
                disabled
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-gray-400 cursor-not-allowed"
                placeholder="ชื่อจริง"
              />
            </div>

            {/* นามสกุล - แก้ไขไม่ได้ */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                นามสกุล
              </label>
              <input
                type="text"
                value={editData.lastName}
                disabled
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-gray-400 cursor-not-allowed"
                placeholder="นามสกุล"
              />
            </div>

            {/* Username - แก้ไขไม่ได้ */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                value={editData.username}
                disabled
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-gray-400 cursor-not-allowed"
                placeholder="ชื่อผู้ใช้"
              />
            </div>

            {/* เพศ - แก้ไขไม่ได้ */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                เพศ
              </label>
              <select
                value={editData.gender}
                disabled
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-gray-400 cursor-not-allowed"
              >
                <option value="">เลือกเพศ</option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>

            {/* วันเดือนปีเกิด */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                วันเดือนปีเกิด
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* เดือน */}
                <select
                  value={editData.birthMonth}
                  onChange={(e) => {
                    setEditData({
                      ...editData,
                      birthMonth: e.target.value,
                      birthDay: '' // รีเซ็ตวันเมื่อเปลี่ยนเดือน
                    });
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">เดือน</option>
                  {months.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                  ))}
                </select>

                {/* วัน */}
                <select
                  value={editData.birthDay}
                  onChange={(e) => setEditData({...editData, birthDay: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">วัน</option>
                  {editData.birthMonth && Array.from({length: getDaysInMonth(editData.birthMonth)}, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>

                {/* ปี */}
                <select
                  value={editData.birthYear}
                  onChange={(e) => setEditData({...editData, birthYear: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">ปี</option>
                  {generateYearOptions().map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full py-3 px-4 rounded-lg font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
            >
              บันทึกการเปลี่ยนแปลง
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Debug functions - สำหรับตรวจสอบข้อมูล
  const showAllUsers = () => {
    const users = getUsersFromStorage();
    console.log('📋 รายชื่อผู้ใช้ทั้งหมด:', users);
    return users;
  };

  const showCurrentUser = () => {
    console.log('👤 ผู้ใช้ปัจจุบัน:', currentUser);
    return currentUser;
  };

  // เพิ่มฟังก์ชันเหล่านี้ใน window object สำหรับ debug
  if (typeof window !== 'undefined') {
    (window as any).showAllUsers = showAllUsers;
    (window as any).showCurrentUser = showCurrentUser;
    (window as any).clearAllUsers = () => {
      localStorage.removeItem('sportsBookingUsers');
      localStorage.removeItem('sportsBookingCurrentUser');
      console.log('🗑️ ลบข้อมูลผู้ใช้ทั้งหมดแล้ว');
    };
  }

  const translations = {
    en: {
      dashboard: 'Dashboard',
      book: 'Book Court',
      wallet: 'Wallet',
      store: 'Store',
      profile: 'Profile',
      welcomeBack: 'Welcome back',
      quickActions: 'Quick Actions',
      recentBookings: 'Recent Bookings',
      nearbyVenues: 'Nearby Venues',
      activeBooking: 'Active Booking',
      balance: 'Balance',
      topUp: 'Top Up',
      scanPay: 'Scan & Pay',
      transactions: 'Transactions',
      settings: 'Settings'
    },
    th: {
      dashboard: 'หน้าหลัก',
      book: 'จองสนาม',
      wallet: 'กระเป๋าเงิน',
      store: 'ร้านค้า',
      profile: 'โปรไฟล์',
      welcomeBack: 'ยินดีต้อนรับกลับ',
      quickActions: 'การดำเนินการด่วน',
      recentBookings: 'การจองล่าสุด',
      nearbyVenues: 'สถานที่ใกล้เคียง',
      activeBooking: 'การจองที่ใช้งานอยู่',
      balance: 'ยอดเงิน',
      topUp: 'เติมเงิน',
      scanPay: 'สแกนและจ่าย',
      transactions: 'ธุรกรรม',
      settings: 'การตั้งค่า'
    }
  };

  const t = translations[language];

  // Navigation Component
  const Navigation = () => (
    <>
      {/* Mobile Navigation - Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-2 z-50 lg:hidden">
        <div className="flex justify-around max-w-md mx-auto">
          {[
            { id: 'dashboard', icon: BarChart3, label: t.dashboard },
            { id: 'book', icon: Calendar, label: t.book },
            { id: 'wallet', icon: Wallet, label: t.wallet },
            { id: 'store', icon: ShoppingBag, label: t.store }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                currentPage === id 
                  ? 'text-blue-400 bg-blue-900/30' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Tablet Navigation - Bottom with larger buttons */}
      <nav className="hidden md:flex lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-6 py-3 z-50">
        <div className="flex justify-around max-w-2xl mx-auto">
          {[
            { id: 'dashboard', icon: BarChart3, label: t.dashboard },
            { id: 'book', icon: Calendar, label: t.book },
            { id: 'wallet', icon: Wallet, label: t.wallet },
            { id: 'store', icon: ShoppingBag, label: t.store }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              className={`flex flex-col items-center py-3 px-4 rounded-lg transition-all ${
                currentPage === id 
                  ? 'text-blue-400 bg-blue-900/30' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={24} />
              <span className="text-sm mt-2 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Navigation - Left Sidebar */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 flex-col z-40">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">The Drink District</h1>
          <p className="text-gray-400 text-sm mt-1">Sports Court Booking</p>
        </div>
        
        <div className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: BarChart3, label: t.dashboard },
            { id: 'book', icon: Calendar, label: t.book },
            { id: 'wallet', icon: Wallet, label: t.wallet },
            { id: 'store', icon: ShoppingBag, label: t.store }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentPage === id 
                  ? 'text-blue-400 bg-blue-900/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* User Profile in Sidebar */}
        <div className="p-4 border-t border-gray-800">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <img 
                src={userProfile.avatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
              <div>
                <p className="text-white font-medium text-sm">{userProfile.name}</p>
                <span className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-2 py-1 rounded-full">
                  {userProfile.level}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <LogIn size={20} />
              <span className="font-medium">เข้าสู่ระบบ</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );

  // Header Component
  const Header = ({ title, showBack = false, actions = [] }: { title: string; showBack?: boolean; actions?: React.ReactNode[] }) => {
    return (
    <header className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-4 py-3 z-40 lg:ml-64">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={() => setCurrentPage('dashboard')} className="text-gray-400 lg:hidden">
              <ChevronRight className="rotate-180" size={20} />
            </button>
          )}
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">{title}</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          {actions}
          
          {/* Auth Button */}
          {isLoggedIn ? (
            <div className="relative">
              {/* Profile Button with Dropdown */}
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-2 md:p-3 text-white hover:bg-gray-800 transition-colors rounded-lg"
                title="เมนูผู้ใช้"
              >
                <img 
                  src={userProfile.avatar} 
                  alt="Profile" 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-blue-500"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{userProfile.name}</p>
                  <p className="text-xs text-gray-400">{userProfile.level}</p>
                </div>
                <ChevronRight 
                  size={16} 
                  className={`transform transition-transform ${isProfileDropdownOpen ? 'rotate-90' : 'rotate-0'} text-gray-400`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setIsProfileDropdownOpen(false)}
                  ></div>
                  
                  {/* Dropdown Content */}
                  <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-40 overflow-hidden">
                    {/* User Info Header */}
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <div className="flex items-center gap-3">
                        <img 
                          src={userProfile.avatar} 
                          alt="Profile" 
                          className="w-12 h-12 rounded-full border-2 border-white/30"
                        />
                        <div>
                          <p className="font-semibold text-sm">{userProfile.name}</p>
                          <p className="text-xs text-blue-200">{currentUser?.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                            {userProfile.level}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setCurrentPage('profile');
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <User size={18} className="text-blue-400" />
                        <span className="text-sm font-medium">ข้อมูลส่วนตัว</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentPage('bookings');
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <Calendar size={18} className="text-green-400" />
                        <span className="text-sm font-medium">รายการจองของฉัน</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentPage('purchases');
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <ShoppingBag size={18} className="text-orange-400" />
                        <span className="text-sm font-medium">รายการซื้อของฉัน</span>
                      </button>

                      <div className="border-t border-gray-700 my-1"></div>

                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
                      >
                        <LogOut size={18} className="text-red-400" />
                        <span className="text-sm font-medium">ออกจากระบบ</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-2 md:p-3 text-gray-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-800"
              title="เข้าสู่ระบบ"
            >
              <LogIn size={20} className="md:w-6 md:h-6" />
            </button>
          )}
          
          <button
            onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
            className="p-2 md:p-3 text-gray-400 hover:text-white transition-colors"
            title="Change Language"
          >
            <Globe size={20} className="md:w-6 md:h-6" />
          </button>
          <button className="p-2 md:p-3 text-gray-400 hover:text-white relative" title="Notifications">
            <Bell size={20} className="md:w-6 md:h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full"></div>
          </button>
        </div>
      </div>
    </header>
    );
  };

  // Dashboard Page
  const DashboardPage = ({ courts, isLoadingCourts, userBookings, isLoadingBookings, currentTime }: {
    courts: any[],
    isLoadingCourts: boolean,
    userBookings: any[],
    isLoadingBookings: boolean,
    currentTime: Date
  }) => {
    // Refresh wallet balance when entering dashboard
    useEffect(() => {
      if (isLoggedIn) {
        fetchWalletBalance();
      }
    }, []);

        return (
      <div className="pb-20 md:pb-0 lg:ml-64">
        <Header title="The Drink District" />
        
        {/* Welcome Section */}
        <section className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
          {/* Mobile Welcome - Hidden on Tablet and Desktop */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            {isLoggedIn ? (
              <>
                <img 
                  src={userProfile.avatar} 
                  alt="Profile" 
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-blue-500"
                />
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-white">{t.welcomeBack},</h2>
                  <p className="text-blue-400 text-sm md:text-base">{userProfile.name}</p>
                  <span className="text-xs md:text-sm bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-2 py-1 rounded-full font-medium">
                    {userProfile.level}
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl text-center">
                <h2 className="text-lg md:text-xl font-semibold text-white mb-2">ยินดีต้อนรับสู่ The Drink District</h2>
                <p className="text-blue-200 text-sm md:text-base mb-3">เข้าสู่ระบบเพื่อเริ่มจองสนามกีฬา</p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  เข้าสู่ระบบ / ลงทะเบียน
                </button>
              </div>
            )}
          </div>

          {/* Tablet Welcome */}
          <div className="hidden md:block lg:hidden mb-6">
            {isLoggedIn ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">{t.welcomeBack}, {userProfile.name}!</h2>
                <p className="text-gray-300 text-base">Ready to book your next sports session?</p>
              </>
            ) : (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl text-center">
                <h2 className="text-2xl font-bold text-white mb-2">ยินดีต้อนรับสู่ The Drink District</h2>
                <p className="text-blue-200 text-base mb-4">เข้าสู่ระบบเพื่อเริ่มจองสนามกีฬา</p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  เข้าสู่ระบบ / ลงทะเบียน
                </button>
              </div>
            )}
          </div>

          {/* Desktop Welcome */}
          <div className="hidden lg:block mb-8">
            {isLoggedIn ? (
              <>
                <h2 className="text-3xl font-bold text-white mb-2">{t.welcomeBack}, {userProfile.name}!</h2>
                <p className="text-gray-300 text-lg">Ready to book your next sports session?</p>
              </>
            ) : (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl text-center">
                <h2 className="text-3xl font-bold text-white mb-2">ยินดีต้อนรับสู่ The Drink District</h2>
                <p className="text-blue-200 text-lg mb-6">เข้าสู่ระบบเพื่อเริ่มจองสนามกีฬาและใช้งานฟีเจอร์ต่างๆ</p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-white text-blue-600 px-10 py-4 rounded-lg font-medium hover:bg-blue-50 transition-colors text-lg"
                >
                  เข้าสู่ระบบ / ลงทะเบียน
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
            <button 
              onClick={() => setCurrentPage('book')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 md:p-5 lg:p-6 rounded-xl text-left hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              <Calendar className="mb-2 text-blue-200" size={24} />
              <h3 className="font-semibold text-white text-sm md:text-base lg:text-lg">Quick Book</h3>
              <p className="text-blue-200 text-xs md:text-sm lg:text-base">Find courts now</p>
            </button>
            
            <button 
              onClick={() => setCurrentPage('wallet')}
              className="bg-gradient-to-r from-green-600 to-green-700 p-4 md:p-5 lg:p-6 rounded-xl text-left hover:from-green-700 hover:to-green-800 transition-all"
            >
              <QrCode className="mb-2 text-green-200" size={24} />
              <h3 className="font-semibold text-white text-sm md:text-base lg:text-lg">Scan & Pay</h3>
              <p className="text-green-200 text-xs md:text-sm lg:text-base">₿{walletBalance.toFixed(2)}</p>
            </button>

            <button 
              onClick={() => setCurrentPage('store')}
              className="bg-gradient-to-r from-orange-600 to-orange-700 p-4 md:p-5 lg:p-6 rounded-xl text-left hover:from-orange-700 hover:to-orange-800 transition-all md:col-span-2 lg:col-span-1"
            >
              <ShoppingBag className="mb-2 text-orange-200" size={24} />
              <h3 className="font-semibold text-white text-sm md:text-base lg:text-lg">Store</h3>
              <p className="text-orange-200 text-xs md:text-sm lg:text-base">Shop equipment</p>
            </button>


          </div>

          {/* Active Booking - Only show when user is logged in and has active bookings */}
          {isLoggedIn && userBookings.length > 0 && userBookings.find(b => {
            // ตรวจสอบว่าการจองจะเริ่มในอีก 10 นาทีหรือไม่
            if (b.status === 'confirmed') {
              const bookingDateTime = new Date(`${b.bookingDate}T${b.startTime}`);
              const timeDiff = bookingDateTime.getTime() - currentTime.getTime();
              const minutesDiff = Math.floor(timeDiff / (1000 * 60));
              return minutesDiff <= 10 && minutesDiff >= 0; // แสดงก่อนเวลา 10 นาที
            }
            return b.status === 'active';
          }) && (
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 md:p-6 rounded-xl mb-6 md:mb-8 border border-purple-700">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-purple-400" size={16} />
                <h3 className="font-semibold text-white text-lg md:text-xl">
                  {userBookings.find(b => b.status === 'active') ? t.activeBooking : 'การจองที่กำลังจะเริ่ม'}
                </h3>
              </div>
              {(() => {
                const activeBooking = userBookings.find(b => b.status === 'active');
                const upcomingBooking = userBookings.find(b => {
                  if (b.status === 'confirmed') {
                    const bookingDateTime = new Date(`${b.bookingDate}T${b.startTime}`);
                    const timeDiff = bookingDateTime.getTime() - currentTime.getTime();
                    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
                    return minutesDiff <= 10 && minutesDiff >= 0;
                  }
                  return false;
                });
                
                const displayBooking = activeBooking || upcomingBooking;
                const isUpcoming = !activeBooking && upcomingBooking;
                
                return (
                  <>
                    <p className="text-purple-200 text-sm md:text-base">{displayBooking.courtId?.name || displayBooking.courtId || 'Unknown Court'}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-white text-sm md:text-base">{new Date(displayBooking.bookingDate).toLocaleDateString('th-TH')} • {displayBooking.startTime}-{displayBooking.endTime}</span>
                      <div className="flex items-center gap-2">
                        <DoorOpen className="text-purple-400" size={16} />
                        <span className="font-mono text-lg md:text-2xl text-purple-300">
                          {isUpcoming ? 'PIN: จะแสดงเมื่อถึงเวลา' : `PIN: ${displayBooking.pin || 'N/A'}`}
                        </span>
                      </div>
                    </div>
                    {isUpcoming && (
                      <div className="mt-2">
                        <p className="text-yellow-300 text-sm">
                          ⏰ การจองจะเริ่มในอีก {Math.floor((new Date(`${displayBooking.bookingDate}T${displayBooking.startTime}`).getTime() - currentTime.getTime()) / (1000 * 60))} นาที
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* Content Grid for Tablet and Desktop */}
          <div className={`${isLoggedIn && userBookings.length > 0 ? 'md:grid md:grid-cols-2 md:gap-6 lg:gap-8' : ''}`}>
            {/* Recent Bookings - Only show when user is logged in and has bookings */}
            {isLoggedIn && userBookings.length > 0 && (
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-3">{t.recentBookings}</h3>
                {isLoadingBookings ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-3 mb-6">
                    {userBookings.slice(0, 3).map(booking => (
                      <div key={booking._id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-white font-medium">{booking.courtId?.name || booking.courtId || 'Unknown Court'}</h4>
                            <p className="text-gray-400 text-sm">{new Date(booking.bookingDate).toLocaleDateString('th-TH')} • {booking.startTime}-{booking.endTime}</p>
                            <p className="text-gray-400 text-sm">{booking.courtId?.address || 'N/A'}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'upcoming' 
                              ? 'bg-blue-900 text-blue-300' 
                              : booking.status === 'active'
                              ? 'bg-green-900 text-green-300'
                              : 'bg-gray-700 text-gray-300'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Available Courts */}
            <div className={isLoggedIn && userBookings.length > 0 ? '' : 'md:col-span-2'}>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3">สนามที่พร้อมใช้งาน</h3>
              {isLoadingCourts ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {courts.map(court => (
                    <div key={court._id} className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors">
                      <div className="flex gap-3">
                        {court.image ? (
                          <img 
                            src={court.image.startsWith('data:') ? court.image : (court.image.startsWith('http') ? court.image : `${config.apiUrl}${court.image}`)} 
                            alt={court.name}
                            className="w-20 h-20 rounded-lg object-cover"
                            onError={(e) => {
                              console.log('Dashboard - Court image failed to load:', court.image);
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-20 h-20 rounded-lg bg-gray-700 flex items-center justify-center ${court.image ? 'hidden' : 'flex'}`}>
                          <Image size={24} className="text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{court.name}</h4>
                          <div className="flex items-center gap-1 mb-1">
                            <MapPin className="text-gray-400" size={12} />
                            <span className="text-gray-400 text-sm">{court.address}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="text-yellow-500 fill-current" size={12} />
                            <span className="text-sm text-gray-300">{court.rating}</span>
                          </div>
                          <span className="text-blue-400 font-semibold">฿{court.price}/hr</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
  );
};

  // Booking Page
  const BookingPage = () => {
    const [courts, setCourts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch available courts
    const fetchAvailableCourts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${config.apiBaseUrl}/courts/available`);
        const result = await response.json();
        
        if (response.ok) {
          console.log('BookingPage - Courts API response:', result);
          setCourts(result);
        } else {
          setError('ไม่สามารถโหลดข้อมูลสนามได้');
        }
      } catch (error) {
        console.error('Error fetching courts:', error);
        
        // Handle specific error types
        if (error.message && error.message.includes('Failed to fetch')) {
          console.warn('Network error - this might be due to ad-blocker or network issues');
          setError('เกิดข้อผิดพลาดในการเชื่อมต่อ - กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
          
          // Try to use cached data if available
          const cachedCourts = localStorage.getItem('courtsCache');
          if (cachedCourts) {
            console.log('Using cached courts data for BookingPage');
            setCourts(JSON.parse(cachedCourts));
            setError(''); // Clear error if we have cached data
          }
        } else {
          setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Load courts on component mount
    useEffect(() => {
      fetchAvailableCourts();
    }, []);

    // Handle book now button click
    const handleBookNow = (court: any) => {
      if (!isLoggedIn) {
        setIsAuthModalOpen(true);
        return;
      }
      setSelectedCourt(court);
      setIsBookingModalOpen(true);
    };

    return (
      <div className="pb-20 md:pb-0 lg:ml-64">
        <Header 
          title="Book Courts" 
          showBack 
          actions={[
            <button key="search" className="p-2 md:p-3 text-gray-400 hover:text-white" title="Search">
              <Search size={20} className="md:w-6 md:h-6" />
            </button>,
            <button key="filter" className="p-2 md:p-3 text-gray-400 hover:text-white" title="Filter">
              <Filter size={20} className="md:w-6 md:h-6" />
            </button>
          ]}
        />
        
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {/* Location Filter */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="text-blue-400" size={20} />
              <span className="text-white font-medium text-lg md:text-xl">สนามที่พร้อมใช้งาน</span>
            </div>
            <div className="bg-gray-800 p-3 md:p-4 rounded-lg">
              <p className="text-gray-300 text-sm md:text-base">แสดงเฉพาะสนามที่เปิดให้บริการ</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[40vh]">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">กำลังโหลดข้อมูล...</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courts.map(court => (
                <div key={court._id} className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-all hover:scale-105">
                  <img 
                    src={court.image.startsWith('data:') ? court.image : (court.image.startsWith('http') ? court.image : `${config.apiUrl}${court.image}`)} 
                    alt={court.name}
                    className="w-full h-48 md:h-56 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className={`w-full h-48 md:h-56 bg-gray-700 flex items-center justify-center ${court.image ? 'hidden' : 'flex'}`}>
                    <Image size={48} className="text-gray-500" />
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg md:text-xl font-semibold text-white">{court.name}</h3>
                      <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                        <Heart size={18} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="text-gray-400" size={14} />
                      <span className="text-gray-300 text-sm">{court.address}</span>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500 fill-current" size={14} />
                        <span className="text-sm text-gray-300">{court.rating}</span>
                      </div>
                      <span className="text-sm text-gray-400">{court.venue}</span>
                    </div>

                    {court.amenities && court.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {court.amenities.slice(0, 3).map(amenity => (
                          <span key={amenity} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                            {amenity}
                          </span>
                        ))}
                        {court.amenities.length > 3 && (
                          <span className="text-blue-400 text-xs">+{court.amenities.length - 3} more</span>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xl md:text-2xl font-bold text-white">฿{court.price}</span>
                        <span className="text-gray-400 text-sm">/hour</span>
                      </div>
                      <button 
                        onClick={() => handleBookNow(court)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 md:px-8 md:py-3 rounded-lg font-medium transition-colors hover:shadow-lg"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && courts.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">ไม่มีสนามที่พร้อมใช้งาน</h3>
              <p className="text-gray-400">กรุณาลองใหม่อีกครั้งในภายหลัง</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Wallet Page - optimized for performance
  const WalletPage = () => {
    // Refresh wallet balance when entering wallet page - optimized to prevent excessive calls
    useEffect(() => {
      if (isLoggedIn) {
        const lastWalletRefresh = localStorage.getItem('lastWalletPageRefresh');
        const now = Date.now();
        if (!lastWalletRefresh || (now - parseInt(lastWalletRefresh)) > 10000) { // 10 second cooldown
          fetchWalletBalance();
          localStorage.setItem('lastWalletPageRefresh', now.toString());
        }
      }
    }, []);

    return (
    <div className="pb-20 md:pb-0 lg:ml-64">
      <Header 
        title="District Wallet" 
        showBack 
        actions={[
          <button key="qr" className="p-2 md:p-3 text-gray-400 hover:text-white" title="QR Code">
            <QrCode size={20} className="md:w-6 md:h-6" />
          </button>
        ]}
      />
      
      <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 md:p-7 lg:p-8 rounded-2xl mb-6 md:mb-8 text-white">
          <div className="flex justify-between items-start mb-4 md:mb-6">
            <div>
              <p className="text-blue-100 text-sm md:text-base">Available Balance</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">₿{walletBalance.toFixed(2)}</h2>
            </div>
            <Wallet className="text-blue-200" size={32} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setIsTopUpModalOpen(true)}
              className="bg-white/20 hover:bg-white/30 p-3 md:p-4 rounded-xl text-left transition-colors hover:scale-105"
            >
              <Plus className="mb-2" size={20} />
              <p className="font-medium text-sm md:text-base">Top Up</p>
              <p className="text-blue-100 text-xs md:text-sm">Add credits</p>
            </button>
            <button className="bg-white/20 hover:bg-white/30 p-3 md:p-4 rounded-xl text-left transition-colors hover:scale-105">
              <QrCode className="mb-2" size={20} />
              <p className="font-medium text-sm md:text-base">Scan & Pay</p>
              <p className="text-blue-100 text-xs md:text-sm">Quick payment</p>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6 md:mb-8">
          {[
            { icon: CreditCard, label: 'Transfer', color: 'bg-green-600' },
            { icon: Phone, label: 'Mobile Top-up', color: 'bg-orange-600' },
            { icon: Shield, label: 'Insurance', color: 'bg-purple-600' },
            { icon: Calendar, label: 'Bookings', color: 'bg-blue-600' },
            { icon: ShoppingBag, label: 'Store', color: 'bg-pink-600' },
            { icon: Settings, label: 'Settings', color: 'bg-gray-600' }
          ].map(({ icon: Icon, label, color }, index) => (
            <button key={index} className="bg-gray-800 p-4 md:p-6 rounded-xl text-center hover:bg-gray-700 transition-colors hover:scale-105">
              <div className={`${color} w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <Icon size={20} className="text-white" />
              </div>
              <p className="text-white text-sm md:text-base font-medium">{label}</p>
            </button>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="md:grid md:grid-cols-2 md:gap-8">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {[
                { type: 'Court Booking', venue: 'The Drink District Sukhumvit', amount: -400, time: '2 hours ago', icon: Calendar },
                { type: 'Wallet Top-up', venue: 'Credit Card', amount: +1000, time: '1 day ago', icon: Plus },
                { type: 'Energy Smoothie', venue: 'The Drink District Thonglor', amount: -120, time: '2 days ago', icon: ShoppingBag },
                { type: 'Court Booking', venue: 'The Drink District Silom', amount: -350, time: '3 days ago', icon: Calendar }
              ].map((transaction, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-700 p-2 rounded-lg">
                      <transaction.icon size={20} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{transaction.type}</h4>
                      <p className="text-gray-400 text-sm">{transaction.venue}</p>
                      <p className="text-gray-500 text-xs">{transaction.time}</p>
                    </div>
                    <div className={`font-semibold ${
                      transaction.amount > 0 ? 'text-green-400' : 'text-white'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}₿{Math.abs(transaction.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wallet Statistics */}
          <div className="hidden md:block">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Wallet Statistics</h3>
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Total Spent</span>
                  <span className="text-white font-semibold">₿2,450</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Monthly Budget</span>
                  <span className="text-white font-semibold">₿1,200</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Savings Goal</span>
                  <span className="text-white font-semibold">₿5,000</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '25%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  };

  // Store Page - optimized for performance
  const StorePage = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState([]);
    const [cart, setCart] = useState([]);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

    // Fetch products - optimized with caching
    const fetchProducts = async () => {
      try {
        // Check cache first
        const cachedProducts = localStorage.getItem('productsCache');
        const cacheTime = localStorage.getItem('productsCacheTime');
        const now = Date.now();
        
        if (cachedProducts && cacheTime && (now - parseInt(cacheTime)) < 120000) { // 2 minute cache
          const parsedProducts = JSON.parse(cachedProducts);
          setProducts(parsedProducts);
          const uniqueCategories = [...new Set(parsedProducts.map(product => product.category))];
          setCategories(['All', ...uniqueCategories]);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        const response = await fetch(`${config.apiBaseUrl}/products`);
        const result = await response.json();
        
        if (response.ok) {
          // Cache the products data
          localStorage.setItem('productsCache', JSON.stringify(result));
          localStorage.setItem('productsCacheTime', now.toString());
          
          setProducts(result);
          // Extract unique categories
          const uniqueCategories = [...new Set(result.map(product => product.category))];
          setCategories(['All', ...uniqueCategories]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        
        // Handle specific error types
        if (error.message && error.message.includes('Failed to fetch')) {
          console.warn('Network error - this might be due to ad-blocker or network issues');
          // Try to use cached data if available
          const cachedProducts = localStorage.getItem('productsCache');
          if (cachedProducts) {
            console.log('Using cached products data');
            const parsedProducts = JSON.parse(cachedProducts);
            setProducts(parsedProducts);
            const uniqueCategories = [...new Set(parsedProducts.map(product => product.category))];
            setCategories(['All', ...uniqueCategories]);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Filter products by category - memoized to prevent unnecessary recalculations
    const filteredProducts = React.useMemo(() => {
      return selectedCategory === 'All' 
        ? products 
        : products.filter(product => product.category === selectedCategory);
    }, [products, selectedCategory]);

    // Cart functions - optimized to prevent unnecessary re-renders
    const addToCart = React.useCallback((product) => {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item._id === product._id);
        if (existingItem) {
          return prevCart.map(item =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevCart, { ...product, quantity: 1 }];
        }
      });
    }, []);

    const removeFromCart = React.useCallback((productId) => {
      setCart(prevCart => prevCart.filter(item => item._id !== productId));
    }, []);

    const updateQuantity = React.useCallback((productId, quantity) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setCart(prevCart =>
        prevCart.map(item =>
          item._id === productId
            ? { ...item, quantity }
            : item
        )
      );
    }, [removeFromCart]);

    const getCartTotal = React.useCallback(() => {
      return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cart]);

    const getCartItemCount = React.useCallback(() => {
      return cart.reduce((count, item) => count + item.quantity, 0);
    }, [cart]);

    useEffect(() => {
      fetchProducts();
    }, []);

    return (
      <div className="pb-20 md:pb-0 lg:ml-64">
        <Header 
          title="District Store" 
          showBack 
          actions={[
            <button key="search" className="p-2 md:p-3 text-gray-400 hover:text-white" title="Search">
              <Search size={20} className="md:w-6 md:h-6" />
            </button>,
            <button 
              key="cart" 
              className="p-2 md:p-3 text-gray-400 hover:text-white relative" 
              title="Shopping Cart"
              onClick={() => setIsCartModalOpen(true)}
            >
              <ShoppingCart size={20} className="md:w-6 md:h-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </button>
          ]}
        />
        
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
          {/* Categories */}
          <div className="flex gap-2 mb-6 md:mb-8 overflow-x-auto">
            {categories.map(category => (
              <button 
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 md:px-5 md:py-3 lg:px-6 lg:py-3 rounded-full whitespace-nowrap transition-colors hover:scale-105 ${
                  selectedCategory === category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 hover:bg-blue-600 text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Promotion */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 md:p-6 rounded-xl mb-6 md:mb-8 text-white">
            <div className="md:flex md:items-center md:justify-between">
              <div>
                <h3 className="font-bold text-lg md:text-xl lg:text-2xl mb-2">🎉 Special Package Deal</h3>
                <p className="text-orange-100 text-sm md:text-base mb-3 md:mb-0">Get 10% off on 5-session packages this week!</p>
              </div>
              <button className="bg-white text-orange-600 px-4 py-2 md:px-5 md:py-3 lg:px-6 lg:py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors hover:scale-105">
                Shop Now
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
              {filteredProducts.map(product => (
                <div key={product._id} className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-all hover:scale-105">
                  <div className="relative">
                    {product.image ? (
                                      <img
                  src={product.image.startsWith('data:') ? product.image : (product.image.startsWith('http') ? product.image : `${config.apiUrl}/uploads/products/${product.image.split('/').pop()}`)}
                  alt={product.name}
                  className="w-full h-32 md:h-40 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                    ) : (
                      <div className="w-full h-32 md:h-40 bg-gray-700 flex items-center justify-center">
                        <Image size={48} className="text-gray-500" />
                      </div>
                    )}
                    <button className="absolute top-2 left-2 p-1 bg-black/30 rounded-full text-white hover:text-red-400 transition-colors">
                      <Heart size={16} />
                    </button>
                  </div>
                  
                  <div className="p-3 md:p-4">
                    <h4 className="font-medium text-white text-sm md:text-base mb-1">{product.name}</h4>
                    <p className="text-gray-400 text-xs md:text-sm mb-2">{product.category}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-blue-400 font-bold text-sm md:text-base">฿{product.price}</span>
                      </div>
                      <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 md:p-3 rounded-lg transition-colors hover:shadow-lg"
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    {product.stock > 0 ? (
                      <p className="text-green-400 text-xs mt-2">มีสินค้า: {product.stock} ชิ้น</p>
                    ) : (
                      <p className="text-red-400 text-xs mt-2">สินค้าหมด</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Store Statistics - Desktop Only */}
          <div className="hidden md:block mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Store Statistics</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{products.length}</div>
                <div className="text-gray-400">Products Available</div>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">89%</div>
                <div className="text-gray-400">Customer Satisfaction</div>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">24h</div>
                <div className="text-gray-400">Delivery Time</div>
              </div>
            </div>
          </div>

          {/* Cart Modal */}
      {isCartModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">รถเข็น ({getCartItemCount()} รายการ)</h3>
              <button 
                onClick={() => setIsCartModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart size={48} className="text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">รถเข็นว่างเปล่า</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                      <img 
                        src={item.image ? (item.image.startsWith('http') ? item.image : `${config.apiUrl}/uploads/products/${item.image.split('/').pop()}`) : ''} 
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-600"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{item.name}</h4>
                        <p className="text-blue-400 font-bold text-sm">฿{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500"
                        >
                          -
                        </button>
                        <span className="text-white text-sm w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-500"
                        >
                          +
                        </button>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-400 hover:text-red-300 ml-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-4 border-t border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-semibold">รวมทั้งหมด:</span>
                  <span className="text-blue-400 font-bold text-lg">฿{getCartTotal()}</span>
                </div>
                <button 
                  onClick={() => {
                    setIsCartModalOpen(false);
                    setIsCheckoutModalOpen(true);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  ดำเนินการสั่งซื้อ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

          {/* Checkout Modal */}
          {isCheckoutModalOpen && (
            <CheckoutModal 
              cart={cart}
              total={getCartTotal()}
              currentUser={currentUser}
              isLoggedIn={isLoggedIn}
              walletBalance={walletBalance}
              getAuthToken={getAuthToken}
              setCurrentUser={setCurrentUser}
              showNotification={showNotification}
              setCurrentPage={setCurrentPage}
              onClose={() => setIsCheckoutModalOpen(false)}
              onSuccess={() => {
                setCart([]);
                setIsCheckoutModalOpen(false);
                setIsCartModalOpen(false);
                // Clear caches to force fresh data
                clearAllCaches();
                
                // Show success notification
                showNotification('success', 'สั่งซื้อสำเร็จ', 'ยอดเงินในกระเป๋าถูกอัปเดตแล้ว');
              }}
            />
          )}
        </div>
      </div>
    );
  };

  // Profile Page
  const ProfilePage = () => {
    if (!isLoggedIn) {
      return (
        <div className="pb-20 md:pb-0 lg:ml-64">
          <Header title="Profile" showBack />
          
          <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md mx-auto">
                <div className="bg-gray-800 p-8 rounded-2xl">
                  <User className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">เข้าสู่ระบบ</h2>
                  <p className="text-gray-400 mb-6">เข้าสู่ระบบเพื่อดูข้อมูลโปรไฟล์และประวัติการจอง</p>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    เข้าสู่ระบบ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="pb-20 md:pb-0 lg:ml-64">
        <Header title="Profile" showBack />
        
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
        {/* User Info */}
        <div className="bg-gray-800 p-6 md:p-7 lg:p-8 rounded-xl mb-6 md:mb-8">
          <div className="md:flex md:items-center md:gap-6 lg:gap-8">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <img 
                src={userProfile.avatar} 
                alt="Profile"
                className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full border-2 border-blue-500"
              />
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">{userProfile.name}</h2>
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-2 py-0.5 md:px-3 md:py-1 rounded-full text-sm md:text-base font-medium mt-2 inline-block">
                  {userProfile.level}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8 mt-4 md:mt-0 md:pt-0 pt-4 border-t md:border-t-0 border-gray-700">
              <div className="text-center">
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">27</p>
                <p className="text-gray-400 text-sm md:text-base">Total Bookings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-400">₿2,450</p>
                <p className="text-gray-400 text-sm md:text-base">Spent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-400">4.9</p>
                <p className="text-gray-400 text-sm md:text-base">Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid for Tablet and Desktop */}
        <div className="md:grid md:grid-cols-2 md:gap-6 lg:gap-8">
          {/* Menu Options */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:hidden">Profile Options</h3>
            <div className="space-y-2">
                             {[
                 { icon: User, label: 'Edit Profile', color: 'text-blue-400', action: () => setIsEditProfileModalOpen(true) },
                 { icon: CreditCard, label: 'Payment Methods', color: 'text-green-400', action: () => {} },
                 { icon: Clock, label: 'Booking History', color: 'text-purple-400', action: () => {} },
                 { icon: Heart, label: 'Favorites', color: 'text-red-400', action: () => {} }
               ].map(({ icon: Icon, label, color, action }, index) => (
                 <button 
                   key={index}
                   onClick={action}
                   className="w-full bg-gray-800 p-4 md:p-5 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors hover:scale-105 border-0 !border-0 !bg-gray-800"
                 >
                   <Icon size={20} className={color} />
                   <span className="text-white font-medium text-sm md:text-base">{label}</span>
                   <ChevronRight size={16} className="text-gray-400 ml-auto" />
                 </button>
               ))}
            </div>
          </div>

          {/* Additional Profile Info - Desktop Only */}
          <div className="hidden md:block">
            <h3 className="text-xl font-semibold text-white mb-4">Account Details</h3>
            
            {/* Personal Information */}
            <div className="bg-gray-800 p-6 rounded-xl mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">Personal Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white">{currentUser?.email || 'Not provided'}</span>
                </div>
                                 <div className="flex justify-between">
                   <span className="text-gray-400">Username</span>
                   <span className="text-white">{currentUser?.username || 'Not provided'}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-400">เบอร์โทรศัพท์</span>
                   <span className="text-white">{currentUser?.phone || 'Not provided'}</span>
                 </div>
                                   <div className="flex justify-between">
                    <span className="text-gray-400">Gender</span>
                    <span className="text-white">
                      {currentUser?.gender === 'male' ? 'ชาย' : 
                       currentUser?.gender === 'female' ? 'หญิง' : 
                       currentUser?.gender === 'other' ? 'อื่นๆ' : 'Not provided'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">วันเดือนปีเกิด</span>
                    <span className="text-white">
                      {currentUser?.birthDate ? 
                        `${currentUser.birthDate.day || ''} ${currentUser.birthDate.month || ''} ${currentUser.birthDate.year || ''}`.trim() || 'Not provided' : 
                        'Not provided'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">อายุ</span>
                    <span className="text-white">
                      {currentUser?.birthDate?.year ? 
                        (() => {
                          const currentYear = new Date().getFullYear() + 543; // พ.ศ. ปัจจุบัน
                          const birthYear = parseInt(currentUser.birthDate.year);
                          const age = currentYear - birthYear;
                          return `${age} ปี`;
                        })() : 
                        'Not provided'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Member Since</span>
                    <span className="text-white">
                      {currentUser?.createdAt ? 
                        new Date(currentUser.createdAt).toLocaleDateString('th-TH') : 
                        'Not provided'}
                    </span>
                  </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-gray-800 p-6 rounded-xl mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">Preferences</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Language</span>
                  <span className="text-white">{language === 'en' ? 'English' : 'ไทย'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Notifications</span>
                  <span className="text-green-400">Enabled</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Dark Mode</span>
                  <span className="text-green-400">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Access (if applicable) */}
        {currentUser?.role === 'admin' && (
          <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-purple-400" size={20} />
              <span className="text-purple-300 font-medium text-sm md:text-base">Admin Access</span>
            </div>
            <p className="text-purple-200 text-sm md:text-base mb-4">Manage venues, bookings, and system settings</p>
            
            {/* Admin Management Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  setCurrentPage('court-management');
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-sm md:text-base font-medium transition-colors hover:scale-105 flex items-center justify-center gap-2"
              >
                <Building2 size={18} />
                Court Management
              </button>
              <button 
                onClick={() => {
                  setCurrentPage('store-management');
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-sm md:text-base font-medium transition-colors hover:scale-105 flex items-center justify-center gap-2"
              >
                <Store size={18} />
                Store Management
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  };

  // Court Management Page
  const CourtManagementPage = () => {
    const [courts, setCourts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCourt, setSelectedCourt] = useState(null);
    const [error, setError] = useState('');

    // Form states
    const [createForm, setCreateForm] = useState({
      name: '',
      address: '',
      price: '',
      venue: '',
      amenities: '',
      image: null
    });

    const [editForm, setEditForm] = useState({
      name: '',
      address: '',
      price: '',
      venue: '',
      status: 'open',
      amenities: '',
      image: null
    });

    // Fetch courts
    const fetchCourts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${config.apiBaseUrl}/courts`);
        const result = await response.json();
        
        if (response.ok) {
          setCourts(result);
        } else {
          setError('ไม่สามารถโหลดข้อมูลสนามได้');
        }
      } catch (error) {
        console.error('Error fetching courts:', error);
        
        // Handle specific error types
        if (error.message && error.message.includes('Failed to fetch')) {
          console.warn('Network error - this might be due to ad-blocker or network issues');
          setError('เกิดข้อผิดพลาดในการเชื่อมต่อ - กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
        } else {
          setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Create court
    const handleCreateCourt = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        
        formData.append('name', createForm.name);
        formData.append('address', createForm.address);
        formData.append('price', createForm.price);
        formData.append('venue', createForm.venue);
        formData.append('amenities', createForm.amenities);
        
        if (createForm.image instanceof File) {
          formData.append('image', createForm.image);
        }

        const response = await fetch(`${config.apiBaseUrl}/courts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const result = await response.json();

        if (response.ok) {
          setIsCreateModalOpen(false);
          setCreateForm({ name: '', address: '', price: '', venue: '', amenities: '', image: null });
          fetchCourts();
          console.log('✅ Court created successfully');
        } else {
          setError(result.message || 'เกิดข้อผิดพลาดในการสร้างสนาม');
        }
      } catch (error) {
        console.error('Error creating court:', error);
        
        // Handle specific error types
        if (error.message && error.message.includes('Failed to fetch')) {
          console.warn('Network error - this might be due to ad-blocker or network issues');
          setError('เกิดข้อผิดพลาดในการเชื่อมต่อ - กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
        } else {
          setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
      }
    };

    // Update court
    const handleUpdateCourt = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        
        formData.append('name', editForm.name);
        formData.append('address', editForm.address);
        formData.append('price', editForm.price);
        formData.append('venue', editForm.venue);
        formData.append('status', editForm.status);
        formData.append('amenities', editForm.amenities);
        
        if (editForm.image instanceof File) {
          formData.append('image', editForm.image);
        }

        const response = await fetch(`${config.apiBaseUrl}/courts/${selectedCourt._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const result = await response.json();

        if (response.ok) {
          setIsEditModalOpen(false);
          setSelectedCourt(null);
          setEditForm({ name: '', address: '', price: '', venue: '', status: 'open', amenities: '', image: null });
          fetchCourts();
          console.log('✅ Court updated successfully');
        } else {
          setError(result.message || 'เกิดข้อผิดพลาดในการแก้ไขสนาม');
        }
      } catch (error) {
        console.error('Error updating court:', error);
        
        // Handle specific error types
        if (error.message && error.message.includes('Failed to fetch')) {
          console.warn('Network error - this might be due to ad-blocker or network issues');
          setError('เกิดข้อผิดพลาดในการเชื่อมต่อ - กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
        } else {
          setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
      }
    };

    // Delete court
    const handleDeleteCourt = async (courtId) => {
      if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบสนามนี้?')) {
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${config.apiBaseUrl}/courts/${courtId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (response.ok) {
          fetchCourts();
          console.log('✅ Court deleted successfully');
        } else {
          setError(result.message || 'เกิดข้อผิดพลาดในการลบสนาม');
        }
      } catch (error) {
        console.error('Error deleting court:', error);
        
        // Handle specific error types
        if (error.message && error.message.includes('Failed to fetch')) {
          console.warn('Network error - this might be due to ad-blocker or network issues');
          setError('เกิดข้อผิดพลาดในการเชื่อมต่อ - กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
        } else {
          setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
      }
    };

    // Open edit modal
    const openEditModal = (court) => {
      setSelectedCourt(court);
      setEditForm({
        name: court.name,
        address: court.address,
        price: court.price.toString(),
        venue: court.venue,
        status: court.status,
        amenities: court.amenities.join(', '),
        image: court.image || null
      });
      setIsEditModalOpen(true);
    };

    // Load courts on component mount
    useEffect(() => {
      fetchCourts();
    }, []);

    if (!isLoggedIn || currentUser?.role !== 'admin') {
      return (
        <div className="pb-20 md:pb-0 lg:ml-64">
          <Header title="Court Management" showBack />
          <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md mx-auto">
                <div className="bg-gray-800 p-8 rounded-2xl">
                  <Shield className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">ไม่ได้รับอนุญาต</h2>
                  <p className="text-gray-400 mb-6">คุณต้องเป็น Admin เพื่อเข้าถึงหน้านี้</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="pb-20 md:pb-0 lg:ml-64">
        <Header 
          title="Court Management" 
          showBack 
          actions={[
            <button 
              key="create" 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              สร้างสนามใหม่
            </button>
          ]}
        />
        
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[40vh]">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">กำลังโหลดข้อมูล...</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courts.map(court => (
                <div key={court._id} className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-all">
                  <div className="relative">
                    <img 
                      src={court.image ? (court.image.startsWith('data:') ? court.image : (court.image.startsWith('http') ? court.image : `${config.apiUrl}${court.image}`)) : `${config.apiBaseUrl}/placeholder/300/200`} 
                      alt={court.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = `${config.apiBaseUrl}/placeholder/300/200`;
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button 
                        onClick={() => openEditModal(court)}
                        className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        title="แก้ไข"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCourt(court._id)}
                        className="p-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        title="ลบ"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        court.status === 'open' 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-red-900 text-red-300'
                      }`}>
                        {court.status === 'open' ? 'พร้อมใช้งาน' : 'ไม่พร้อมใช้งาน'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{court.name}</h3>
                    <p className="text-gray-300 text-sm mb-2">{court.venue}</p>
                    <p className="text-gray-400 text-sm mb-3">{court.address}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-blue-400 font-bold">฿{court.price}/hr</span>
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500 fill-current" size={14} />
                        <span className="text-sm text-gray-300">{court.rating}</span>
                      </div>
                    </div>

                    {court.amenities && court.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {court.amenities.slice(0, 3).map(amenity => (
                          <span key={amenity} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                            {amenity}
                          </span>
                        ))}
                        {court.amenities.length > 3 && (
                          <span className="text-blue-400 text-xs">+{court.amenities.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && courts.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">ยังไม่มีสนาม</h3>
              <p className="text-gray-400 mb-4">เริ่มต้นโดยการสร้างสนามใหม่</p>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                สร้างสนามใหม่
              </button>
            </div>
          )}
        </div>

        {/* Create Court Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Plus size={24} className="text-purple-400" />
                  สร้างสนามใหม่
                </h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    ชื่อสนาม *
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="เช่น Court 1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    ที่อยู่ *
                  </label>
                  <input
                    type="text"
                    value={createForm.address}
                    onChange={(e) => setCreateForm({...createForm, address: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="เช่น Sukhumvit Road, Bangkok"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    ราคา (บาท/ชั่วโมง) *
                  </label>
                  <input
                    type="number"
                    value={createForm.price}
                    onChange={(e) => setCreateForm({...createForm, price: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="เช่น 400"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    สถานที่ *
                  </label>
                  <input
                    type="text"
                    value={createForm.venue}
                    onChange={(e) => setCreateForm({...createForm, venue: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="เช่น The Drink District Sukhumvit"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    สิ่งอำนวยความสะดวก (คั่นด้วยเครื่องหมายจุลภาค)
                  </label>
                  <input
                    type="text"
                    value={createForm.amenities}
                    onChange={(e) => setCreateForm({...createForm, amenities: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="เช่น Air Conditioning, Parking, Locker Room"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    รูปภาพสนาม
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCreateForm({...createForm, image: file});
                      }
                    }}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  />
                  <p className="text-gray-400 text-xs mt-1">เลือกไฟล์รูปภาพ หรือปล่อยว่างเพื่อใช้รูปภาพเริ่มต้น</p>
                  
                  {createForm.image && createForm.image instanceof File && (
                    <div className="mt-2">
                      <img 
                        src={URL.createObjectURL(createForm.image)} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg border border-gray-600"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCreateCourt}
                  className="w-full py-3 px-4 rounded-lg font-medium transition-all bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg"
                >
                  สร้างสนาม
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Court Modal */}
        {isEditModalOpen && selectedCourt && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Edit size={24} className="text-blue-400" />
                  แก้ไขสนาม
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    ชื่อสนาม *
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="เช่น Court 1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    ที่อยู่ *
                  </label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="เช่น Sukhumvit Road, Bangkok"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    ราคา (บาท/ชั่วโมง) *
                  </label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="เช่น 400"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    สถานที่ *
                  </label>
                  <input
                    type="text"
                    value={editForm.venue}
                    onChange={(e) => setEditForm({...editForm, venue: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="เช่น The Drink District Sukhumvit"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    สถานะ
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="open">เปิด (พร้อมใช้งาน)</option>
                    <option value="closed">ปิด (ไม่พร้อมใช้งาน)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    สิ่งอำนวยความสะดวก (คั่นด้วยเครื่องหมายจุลภาค)
                  </label>
                  <input
                    type="text"
                    value={editForm.amenities}
                    onChange={(e) => setEditForm({...editForm, amenities: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="เช่น Air Conditioning, Parking, Locker Room"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    รูปภาพสนาม
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditForm({...editForm, image: file});
                      }
                    }}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  <p className="text-gray-400 text-xs mt-1">เลือกไฟล์รูปภาพ หรือปล่อยว่างเพื่อใช้รูปภาพเดิม</p>
                  
                  {editForm.image && editForm.image instanceof File && (
                    <div className="mt-2">
                      <img 
                        src={URL.createObjectURL(editForm.image)} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg border border-gray-600"
                      />
                    </div>
                  )}
                  
                  {editForm.image && typeof editForm.image === 'string' && (
                    <div className="mt-2">
                      <img 
                        src={editForm.image.startsWith('http') ? editForm.image : `${config.apiUrl}${editForm.image}`} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        onError={(e) => {
                          e.target.src = `${config.apiBaseUrl}/placeholder/300/200`;
                        }}
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleUpdateCourt}
                  className="w-full py-3 px-4 rounded-lg font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
                >
                  บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

// My Bookings Page
const MyBookingsPage = () => {
    if (!isLoggedIn) {
      return (
        <div className="pb-20 md:pb-0 lg:ml-64">
          <Header title="รายการจองของฉัน" showBack />
          <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md mx-auto">
                <div className="bg-gray-800 p-8 rounded-2xl">
                  <Calendar className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">เข้าสู่ระบบ</h2>
                  <p className="text-gray-400 mb-6">เข้าสู่ระบบเพื่อดูรายการจองของคุณ</p>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    เข้าสู่ระบบ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const mockBookings = [
      {
        id: 1,
        venueName: 'The Drink District Sukhumvit',
        courtName: 'Court 2',
        date: '2025-01-30',
        time: '18:00-19:00',
        status: 'upcoming',
        price: 400,
        pin: '7294'
      },
      {
        id: 2,
        venueName: 'The Drink District Thonglor',
        courtName: 'Court 1',
        date: '2025-01-28',
        time: '19:00-20:00',
        status: 'completed',
        price: 500,
        pin: null
      },
      {
        id: 3,
        venueName: 'The Drink District Silom',
        courtName: 'Court 3',
        date: '2025-01-25',
        time: '17:00-18:00',
        status: 'cancelled',
        price: 350,
        pin: null
      }
    ];

    return (
      <div className="pb-20 md:pb-0 lg:ml-64">
        <Header title="รายการจองของฉัน" showBack />
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <div className="space-y-4">
            {mockBookings.map(booking => (
              <div key={booking.id} className="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{booking.venueName}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">สนาม:</span>
                        <p className="text-white font-medium">{booking.courtName}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">วันที่:</span>
                        <p className="text-white font-medium">{new Date(booking.date).toLocaleDateString('th-TH')}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">เวลา:</span>
                        <p className="text-white font-medium">{booking.time}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">ราคา:</span>
                        <p className="text-white font-medium">₿{booking.price}</p>
                      </div>
                    </div>
                    {booking.pin && (
                      <div className="mt-3 flex items-center gap-2">
                        <DoorOpen className="text-purple-400" size={16} />
                        <span className="text-purple-300 font-mono text-lg">PIN: {booking.pin}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'upcoming' ? 'bg-blue-900 text-blue-300' :
                      booking.status === 'completed' ? 'bg-green-900 text-green-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {booking.status === 'upcoming' ? 'กำลังมาถึง' :
                       booking.status === 'completed' ? 'เสร็จสิ้น' :
                       'ยกเลิก'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // My Purchases Page
  const MyPurchasesPage = () => {
    if (!isLoggedIn) {
      return (
        <div className="pb-20 md:pb-0 lg:ml-64">
          <Header title="รายการซื้อของฉัน" showBack />
          <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md mx-auto">
                <div className="bg-gray-800 p-8 rounded-2xl">
                  <ShoppingBag className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">เข้าสู่ระบบ</h2>
                  <p className="text-gray-400 mb-6">เข้าสู่ระบบเพื่อดูรายการซื้อของคุณ</p>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    เข้าสู่ระบบ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const mockPurchases = [
      {
        id: 1,
        itemName: 'Energy Smoothie',
        category: 'Beverages',
        quantity: 2,
        price: 120,
        total: 240,
        date: '2025-01-29',
        status: 'delivered'
      },
      {
        id: 2,
        itemName: 'The Drink District T-Shirt',
        category: 'Merchandise',
        quantity: 1,
        price: 890,
        total: 890,
        date: '2025-01-27',
        status: 'delivered'
      },
      {
        id: 3,
        itemName: '5-Session Package',
        category: 'Packages',
        quantity: 1,
        price: 1800,
        total: 1800,
        date: '2025-01-25',
        status: 'active'
      },
      {
        id: 4,
        itemName: 'Protein Bar',
        category: 'Snacks',
        quantity: 3,
        price: 85,
        total: 255,
        date: '2025-01-24',
        status: 'delivered'
      }
    ];

    return (
      <div className="pb-20 md:pb-0 lg:ml-64">
        <Header title="รายการซื้อของฉัน" showBack />
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-xl text-white">
              <h3 className="text-sm font-medium text-green-200">ยอดซื้อทั้งหมด</h3>
              <p className="text-2xl font-bold">₿{mockPurchases.reduce((sum, item) => sum + item.total, 0)}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-xl text-white">
              <h3 className="text-sm font-medium text-blue-200">จำนวนรายการ</h3>
              <p className="text-2xl font-bold">{mockPurchases.length}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-xl text-white">
              <h3 className="text-sm font-medium text-purple-200">Package ที่ใช้งานได้</h3>
              <p className="text-2xl font-bold">{mockPurchases.filter(p => p.status === 'active').length}</p>
            </div>
          </div>

          {/* Purchase List */}
          <div className="space-y-4">
            {mockPurchases.map(purchase => (
              <div key={purchase.id} className="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{purchase.itemName}</h3>
                        <p className="text-sm text-gray-400">{purchase.category}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        purchase.status === 'active' ? 'bg-green-900 text-green-300' :
                        'bg-blue-900 text-blue-300'
                      }`}>
                        {purchase.status === 'active' ? 'ใช้งานได้' : 'จัดส่งแล้ว'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">จำนวน:</span>
                        <p className="text-white font-medium">{purchase.quantity}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">ราคา/ชิ้น:</span>
                        <p className="text-white font-medium">₿{purchase.price}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">รวม:</span>
                        <p className="text-white font-medium">₿{purchase.total}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">วันที่:</span>
                        <p className="text-white font-medium">{new Date(purchase.date).toLocaleDateString('th-TH')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Store Management Page
  const StoreManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Form states
    const [createForm, setCreateForm] = useState({
      name: '',
      category: '',
      price: '',
      description: '',
      stock: '',
      image: null
    });

    const [editForm, setEditForm] = useState({
      name: '',
      category: '',
      price: '',
      description: '',
      stock: '',
      isActive: true,
      image: null
    });

    // Fetch products
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${config.apiBaseUrl}/products/admin`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        
        if (response.ok) {
          setProducts(result);
        } else {
          setError('ไม่สามารถโหลดข้อมูลสินค้าได้');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      } finally {
        setIsLoading(false);
      }
    };

    // Create product
    const handleCreateProduct = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        
        formData.append('name', createForm.name);
        formData.append('category', createForm.category);
        formData.append('price', createForm.price);
        formData.append('description', createForm.description);
        formData.append('stock', createForm.stock);
        
        if (createForm.image instanceof File) {
          formData.append('image', createForm.image);
        }

        const response = await fetch(`${config.apiBaseUrl}/products`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const result = await response.json();

        if (response.ok) {
          setSuccessMessage('สร้างสินค้าสำเร็จ');
          setIsCreateModalOpen(false);
          setCreateForm({
            name: '',
            category: '',
            price: '',
            description: '',
            stock: '',
            image: null
          });
          fetchProducts();
        } else {
          setError(result.message || 'เกิดข้อผิดพลาดในการสร้างสินค้า');
        }
      } catch (error) {
        console.error('Error creating product:', error);
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      }
    };

    // Update product
    const handleUpdateProduct = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        
        formData.append('name', editForm.name);
        formData.append('category', editForm.category);
        formData.append('price', editForm.price);
        formData.append('description', editForm.description);
        formData.append('stock', editForm.stock);
        formData.append('isActive', editForm.isActive);
        
        if (editForm.image instanceof File) {
          formData.append('image', editForm.image);
        }

        const response = await fetch(`${config.apiBaseUrl}/products/${selectedProduct._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const result = await response.json();

        if (response.ok) {
          setSuccessMessage('แก้ไขสินค้าสำเร็จ');
          setIsEditModalOpen(false);
          setSelectedProduct(null);
          setEditForm({
            name: '',
            category: '',
            price: '',
            description: '',
            stock: '',
            isActive: true,
            image: null
          });
          fetchProducts();
        } else {
          setError(result.message || 'เกิดข้อผิดพลาดในการแก้ไขสินค้า');
        }
      } catch (error) {
        console.error('Error updating product:', error);
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      }
    };

    // Delete product
    const handleDeleteProduct = async (productId) => {
      if (!window.confirm('คุณต้องการลบสินค้านี้หรือไม่?')) {
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${config.apiBaseUrl}/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (response.ok) {
          setSuccessMessage('ลบสินค้าสำเร็จ');
          fetchProducts();
        } else {
          setError(result.message || 'เกิดข้อผิดพลาดในการลบสินค้า');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      }
    };



    // Open edit modal
    const openEditModal = (product) => {
      setSelectedProduct(product);
      setEditForm({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        description: product.description,
        stock: product.stock.toString(),
        isActive: product.isActive,
        image: null
      });
      setIsEditModalOpen(true);
    };

    useEffect(() => {
      fetchProducts();
    }, []);

    if (!isLoggedIn || currentUser?.role !== 'admin') {
      return (
        <div className="pb-20 md:pb-0 lg:ml-64">
          <Header title="Store Management" showBack />
          <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md mx-auto">
                <div className="bg-gray-800 p-8 rounded-2xl">
                  <Shield className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">ไม่ได้รับอนุญาต</h2>
                  <p className="text-gray-400 mb-6">คุณต้องเป็น Admin เพื่อเข้าถึงหน้านี้</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="pb-20 md:pb-0 lg:ml-64">
        <Header 
          title="Store Management" 
          showBack 
          actions={[
            <button 
              key="create" 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">เพิ่มสินค้าใหม่</span>
              <span className="sm:hidden">เพิ่ม</span>
            </button>
          ]}
        />
        
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-900/30 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <CheckCircle size={20} />
              {successMessage}
            </div>
          )}

          {/* Products List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:bg-gray-700 transition-colors">
                  <div className="aspect-square bg-gray-700 rounded-lg mb-3 md:mb-4 overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image.startsWith('data:') ? product.image : (product.image.startsWith('http') ? product.image : `${config.apiUrl}/uploads/products/${product.image.split('/').pop()}`)} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center text-gray-500 ${product.image ? 'hidden' : 'flex'}`}>
                      <Image size={32} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-white line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-gray-400">{product.category}</p>
                    <p className="text-sm font-bold text-blue-400">฿{product.price}</p>
                    <p className="text-xs text-gray-400">สต็อก: {product.stock}</p>

                    <div className="flex items-center gap-2 mt-2 md:mt-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                      }`}>
                        {product.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-3 md:mt-4">
                      <button
                        onClick={() => openEditModal(product)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 md:px-3 py-2 rounded text-xs md:text-sm font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <Edit size={14} className="md:w-4 md:h-4" />
                        <span className="hidden sm:inline">แก้ไข</span>
                        <span className="sm:hidden">แก้</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 md:px-3 py-2 rounded text-xs md:text-sm font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 size={14} className="md:w-4 md:h-4" />
                        <span className="hidden sm:inline">ลบ</span>
                        <span className="sm:hidden">ลบ</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && products.length === 0 && (
            <div className="text-center py-12">
              <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">ยังไม่มีสินค้า</h3>
              <p className="text-gray-400 mb-4">เริ่มต้นโดยการเพิ่มสินค้าใหม่</p>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                เพิ่มสินค้าใหม่
              </button>
            </div>
          )}
        </div>

        {/* Create Product Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Plus size={24} className="text-blue-400" />
                  เพิ่มสินค้าใหม่
                </h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    ชื่อสินค้า *
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="ชื่อสินค้า"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    หมวดหมู่ *
                  </label>
                  <input
                    type="text"
                    value={createForm.category}
                    onChange={(e) => setCreateForm({...createForm, category: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="หมวดหมู่สินค้า"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    ราคา (บาท) *
                  </label>
                  <input
                    type="number"
                    value={createForm.price}
                    onChange={(e) => setCreateForm({...createForm, price: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="ราคาสินค้า"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    คำอธิบาย
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="คำอธิบายสินค้า"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    จำนวนสต็อก *
                  </label>
                  <input
                    type="number"
                    value={createForm.stock}
                    onChange={(e) => setCreateForm({...createForm, stock: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="จำนวนสต็อก"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    รูปภาพสินค้า
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCreateForm({...createForm, image: file});
                      }
                    }}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  <p className="text-gray-400 text-xs mt-1">เลือกไฟล์รูปภาพ หรือปล่อยว่างเพื่อใช้รูปภาพเริ่มต้น</p>
                  
                  {createForm.image && createForm.image instanceof File && (
                    <div className="mt-2">
                      <img 
                        src={URL.createObjectURL(createForm.image)} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg border border-gray-600"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCreateProduct}
                  className="w-full py-3 px-4 rounded-lg font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
                >
                  เพิ่มสินค้า
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {isEditModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Edit size={24} className="text-blue-400" />
                  แก้ไขสินค้า
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    ชื่อสินค้า *
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="ชื่อสินค้า"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    หมวดหมู่ *
                  </label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="หมวดหมู่สินค้า"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    ราคา (บาท) *
                  </label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="ราคาสินค้า"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    คำอธิบาย
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="คำอธิบายสินค้า"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    จำนวนสต็อก *
                  </label>
                  <input
                    type="number"
                    value={editForm.stock}
                    onChange={(e) => setEditForm({...editForm, stock: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="จำนวนสต็อก"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    สถานะ
                  </label>
                  <select
                    value={editForm.isActive}
                    onChange={(e) => setEditForm({...editForm, isActive: e.target.value === 'true'})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value={true}>เปิดใช้งาน</option>
                    <option value={false}>ปิดใช้งาน</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    รูปภาพสินค้า
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditForm({...editForm, image: file});
                      }
                    }}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  <p className="text-gray-400 text-xs mt-1">เลือกไฟล์รูปภาพ หรือปล่อยว่างเพื่อใช้รูปภาพเดิม</p>
                  
                  {editForm.image && editForm.image instanceof File && (
                    <div className="mt-2">
                      <img 
                        src={URL.createObjectURL(editForm.image)} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg border border-gray-600"
                      />
                    </div>
                  )}
                  
                  {editForm.image && typeof editForm.image === 'string' && (
                    <div className="mt-2">
                      <img 
                        src={editForm.image} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        onError={(e) => {
                          e.target.src = `${config.apiBaseUrl}/placeholder/300/200`;
                        }}
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleUpdateProduct}
                  className="w-full py-3 px-4 rounded-lg font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
                >
                  บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Main App Component
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* PWA Status Bar - Mobile Only */}
      <div className="bg-black h-6 flex items-center justify-center lg:hidden">
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Page Content */}
      {currentPage === 'dashboard' &&             <DashboardPage 
              courts={courts}
              isLoadingCourts={isLoadingCourts}
              userBookings={userBookings}
              isLoadingBookings={isLoadingBookings}
              currentTime={currentTime}
            />}
      {currentPage === 'book' && <BookingPage />}
              {currentPage === 'wallet' && <WalletPage />}
      {currentPage === 'store' && <StorePage />}
      {currentPage === 'profile' && <ProfilePage />}
      {currentPage === 'bookings' && <MyBookingsPage />}
      {currentPage === 'purchases' && <MyPurchasesPage />}
      {currentPage === 'court-management' && <CourtManagementPage />}
      {currentPage === 'store-management' && <StoreManagementPage />}

      {/* Navigation */}
      <Navigation />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

        {/* Booking Modal */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          court={selectedCourt}
          onConfirmBooking={handleConfirmBooking}
        />

        {/* Notification */}
        {notification.isOpen && (
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={closeNotification}
          />
        )}

        {/* TopUp Modal */}
        <TopUpModal
          isOpen={isTopUpModalOpen}
          onClose={() => setIsTopUpModalOpen(false)}
          onTopUp={handleTopUp}
        />

       {/* Edit Profile Modal */}
       <EditProfileModal />

      {/* LINE Integration Indicator */}
      <div className="fixed top-8 right-4 z-50">
        <div className="bg-green-500 p-2 rounded-full">
          <Smartphone size={16} className="text-white" />
        </div>
      </div>

      {/* Tablet Welcome Message */}
      <div className="hidden md:block lg:hidden fixed bottom-8 right-8 z-40">
        <div className="bg-gray-800 p-4 md:p-5 rounded-xl border border-gray-700 shadow-lg">
          <p className="text-gray-300 text-sm md:text-base">Welcome to The Drink District!</p>
          <p className="text-blue-400 text-xs md:text-sm">Your sports booking companion</p>
        </div>
      </div>

      {/* Desktop Welcome Message */}
      <div className="hidden lg:block fixed bottom-8 right-8 z-40">
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg">
          <p className="text-gray-300 text-sm">Welcome to The Drink District!</p>
          <p className="text-blue-400 text-xs">Your sports booking companion</p>
        </div>
      </div>
    </div>
  );
};

export default DistrictSportsPWA;

