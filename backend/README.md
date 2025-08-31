# Sports Booking Backend

Backend API สำหรับระบบจองสนามกีฬา

## การติดตั้ง

1. ติดตั้ง dependencies:
```bash
npm install
```

2. สร้างไฟล์ `.env` ในโฟลเดอร์ backend:
```env
MONGODB_URI=mongodb+srv://drinkdistrict:FkmZLsfje0IgINSu@cluster0.f3euenl.mongodb.net/sports_booking?retryWrites=true&w=majority&appName=Cluster0
PORT=5001
NODE_ENV=development
```

## การรัน

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

## โครงสร้างฐานข้อมูล

### Models

#### Venue (สนามกีฬา)
- name: ชื่อสนาม
- location: ที่ตั้ง
- distance: ระยะทาง
- courts: จำนวนสนาม
- rating: คะแนน
- image: รูปภาพ
- amenities: สิ่งอำนวยความสะดวก
- price: ราคา
- availableSlots: ช่วงเวลาที่ว่าง

#### User (ผู้ใช้)
- name: ชื่อ
- email: อีเมล
- phone: เบอร์โทร
- avatar: รูปโปรไฟล์
- preferences: ความชอบ

#### Booking (การจอง)
- user: ผู้จอง
- venue: สนามที่จอง
- date: วันที่จอง
- timeSlot: ช่วงเวลา
- courtNumber: หมายเลขสนาม
- status: สถานะการจอง
- totalPrice: ราคารวม
- paymentStatus: สถานะการชำระเงิน

## API Endpoints

### Venues
- `GET /api/venues` - ดึงรายการสนามทั้งหมด
- `GET /api/venues/:id` - ดึงข้อมูลสนามตาม ID

### Users
- `GET /api/users/:id` - ดึงข้อมูลผู้ใช้
- `GET /api/users/:id/bookings` - ดึงการจองของผู้ใช้

### Bookings
- `POST /api/bookings` - สร้างการจองใหม่

### Health Check
- `GET /api/health` - ตรวจสอบสถานะ API

## การเชื่อมต่อฐานข้อมูล

ระบบใช้ MongoDB Atlas เป็นฐานข้อมูลหลัก โดยมีการเชื่อมต่อผ่าน Mongoose ODM

### Connection String
```
mongodb+srv://drinkdistrict:FkmZLsfje0IgINSu@cluster0.f3euenl.mongodb.net/sports_booking?retryWrites=true&w=majority&appName=Cluster0
```

### Database Name
`sports_booking`

## การ Seed ข้อมูล

ระบบจะสร้างข้อมูลเริ่มต้นอัตโนมัติเมื่อเริ่มต้นครั้งแรก:
- สนามกีฬา 3 แห่ง
- ช่วงเวลาการจอง
- ข้อมูลพื้นฐานอื่นๆ

## การแก้ไขปัญหา

### MongoDB Connection Error
- ตรวจสอบ connection string
- ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
- ตรวจสอบ IP whitelist ใน MongoDB Atlas

### Port Already in Use
- เปลี่ยน PORT ในไฟล์ .env
- หรือหยุด process ที่ใช้ port เดิม
