# Role System สำหรับ Sports Booking

## ภาพรวม
ระบบ role ได้ถูกสร้างขึ้นเพื่อจัดการสิทธิ์การเข้าถึงของผู้ใช้ในเว็บไซต์ Sports Booking โดยแบ่งเป็น 5 ระดับสิทธิ์

## รายการ Role

### 1. Admin (ผู้ดูแลระบบ)
- **สิทธิ์สูงสุด** ในการจัดการระบบทั้งหมด
- สามารถจัดการผู้ใช้ทุกคน
- สามารถเปลี่ยน role ของผู้ใช้ได้
- สามารถลบข้อมูลได้
- เข้าถึงการตั้งค่าระบบ

### 2. Manager (ผู้จัดการ)
- จัดการการทำงานของระบบและพนักงาน
- สามารถจัดการผู้ใช้ (ยกเว้น Admin)
- จัดการสถานที่และข้อมูลการจอง
- ดูรายงานต่างๆ

### 3. Guest Investor (นักลงทุนผู้เยี่ยมชม)
- นักลงทุนที่ได้รับสิทธิ์พิเศษ
- เข้าถึงรายงานและข้อมูลวิเคราะห์
- ดูข้อมูลสถานที่

### 4. Staff (พนักงาน)
- ดูแลการจองและบริการลูกค้า
- จัดการการจอง
- เข้าถึงข้อมูลสถานที่
- ให้บริการลูกค้า

### 5. User (ผู้ใช้ทั่วไป)
- สมาชิกที่ลงทะเบียนเว็บตามปกติ
- ทำการจองได้
- ดูและแก้ไขข้อมูลส่วนตัว

## การใช้งาน

### การสร้าง Admin Account แรกเริ่ม
```bash
npm run create-admin
```

### การ Login
```bash
POST /api/auth/login
{
  "email": "admin@sportsbooking.com",
  "password": "admin123456"
}
```

### การ Register ผู้ใช้ใหม่
```bash
POST /api/auth/register
{
  "name": "ชื่อผู้ใช้",
  "email": "email@example.com",
  "password": "รหัสผ่าน",
  "phone": "เบอร์โทร"
}
```

### การเปลี่ยน Role (Admin/Manager เท่านั้น)
```bash
PUT /api/auth/users/:userId/role
{
  "role": "manager"
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - ลงทะเบียนผู้ใช้ใหม่
- `POST /api/auth/login` - เข้าสู่ระบบ
- `GET /api/auth/profile` - ดูข้อมูลส่วนตัว
- `PUT /api/auth/profile` - แก้ไขข้อมูลส่วนตัว
- `PUT /api/auth/change-password` - เปลี่ยนรหัสผ่าน

### User Management (Admin/Manager)
- `GET /api/auth/users` - ดูรายชื่อผู้ใช้ทั้งหมด (Admin เท่านั้น)
- `PUT /api/auth/users/:userId/role` - เปลี่ยน role ของผู้ใช้
- `PUT /api/auth/users/:userId/status` - เปิด/ปิดการใช้งานผู้ใช้

## การตรวจสอบสิทธิ์

### Middleware ที่ใช้
- `authenticateToken` - ตรวจสอบ JWT token
- `requireAdmin` - ต้องเป็น Admin เท่านั้น
- `requireManagerOrAdmin` - ต้องเป็น Manager หรือ Admin
- `requireStaffOrHigher` - ต้องเป็น Staff หรือสูงกว่า
- `requireGuestInvestorOrHigher` - ต้องเป็น Guest Investor หรือสูงกว่า

### ตัวอย่างการใช้งาน
```javascript
const { authenticateToken, requireAdmin } = require('./middleware/auth');

// Route ที่ต้องเป็น Admin เท่านั้น
app.get('/admin/users', authenticateToken, requireAdmin, (req, res) => {
  // Admin only code
});
```

## การตั้งค่า

### Environment Variables
```env
JWT_SECRET=your-secret-key-here
MONGODB_URI=your-mongodb-connection-string
PORT=5001
```

### การติดตั้ง Dependencies
```bash
npm install bcryptjs jsonwebtoken
```

## ความปลอดภัย

### Password Hashing
- ใช้ bcryptjs สำหรับเข้ารหัสรหัสผ่าน
- Salt rounds: 10

### JWT Token
- หมดอายุใน 24 ชั่วโมง
- ใช้สำหรับการยืนยันตัวตน

### Role Hierarchy
- Admin > Manager > Guest Investor > Staff > User
- ผู้ใช้สามารถจัดการได้เฉพาะ role ที่ต่ำกว่าเท่านั้น

## หมายเหตุสำคัญ

1. **เปลี่ยนรหัสผ่าน Admin** - หลังจากสร้าง admin account แรกเริ่ม ควรเปลี่ยนรหัสผ่านทันที
2. **การจัดการ Admin** - เฉพาะ Admin เท่านั้นที่สามารถสร้างหรือลบ Admin account อื่นได้
3. **การ Deactivate** - ไม่สามารถ deactivate Admin account ได้ (ยกเว้น Admin คนอื่น)
4. **Default Role** - ผู้ใช้ที่ลงทะเบียนใหม่จะได้รับ role "user" โดยอัตโนมัติ
