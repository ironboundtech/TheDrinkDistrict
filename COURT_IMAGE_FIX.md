# Court Image Display Fix

## ปัญหา
ภาพสนามในหน้าแรกไม่แสดงหลังจากแก้ไขปัญหาภาพสินค้า

## สาเหตุ
การสร้าง URL ของภาพสนามไม่สอดคล้องกันในแต่ละส่วนของแอปพลิเคชัน

### Backend Storage
```javascript
// backend/routes/courts.js
courtData.image = `/uploads/courts/${req.file.filename}`;
// ผลลัพธ์: /uploads/courts/court-1234567890.jpg
```

### Frontend URL Construction (เดิม)
```typescript
// frontend/src/app.tsx - ส่วนใหญ่ใช้ถูกต้อง
src={court.image.startsWith('http') ? court.image : `${config.apiUrl}${court.image}`}

// frontend/src/app.tsx - Court Management ใช้ผิด
src={court.image ? `${config.apiUrl}${court.image}` : `${config.apiBaseUrl}/placeholder/300/200`}
```

## การแก้ไข

### 1. แก้ไข URL Construction ใน Court Management
```typescript
// เปลี่ยนจาก
src={court.image ? `${config.apiUrl}${court.image}` : `${config.apiBaseUrl}/placeholder/300/200`}

// เป็น
src={court.image ? (court.image.startsWith('http') ? court.image : `${config.apiUrl}${court.image}`) : `${config.apiBaseUrl}/placeholder/300/200`}
```

### 2. การทำงาน
1. **ตรวจสอบ URL เต็ม**: `court.image.startsWith('http')`
2. **สร้าง URL ถูกต้อง**: `${config.apiUrl}${court.image}`
3. **ใช้ placeholder**: `${config.apiBaseUrl}/placeholder/300/200` เมื่อไม่มีภาพ

### 3. ตัวอย่าง
- **Input**: `/uploads/courts/court-123.jpg`
- **Final URL**: `https://thedrinkdistrict.onrender.com/uploads/courts/court-123.jpg`
- **Result**: ✅ ภาพแสดงผลถูกต้อง

## ไฟล์ที่แก้ไข

### frontend/src/app.tsx
1. **Court Management Page (Line 4055)**:
   ```typescript
   // ก่อนแก้ไข
   src={court.image ? `${config.apiUrl}${court.image}` : `${config.apiBaseUrl}/placeholder/300/200`}
   
   // หลังแก้ไข
   src={court.image ? (court.image.startsWith('http') ? court.image : `${config.apiUrl}${court.image}`) : `${config.apiBaseUrl}/placeholder/300/200`}
   ```

## ตำแหน่งอื่นที่ใช้ถูกต้องแล้ว
1. **BookingModal (Line 644)**: ใช้ logic ที่ถูกต้อง
2. **Dashboard Page (Line 2862)**: ใช้ logic ที่ถูกต้อง  
3. **Booking Page (Line 3001)**: ใช้ logic ที่ถูกต้อง

## การทดสอบ
1. อัพโหลดภาพสนามใหม่
2. ตรวจสอบการแสดงภาพในหน้า Court Management
3. ตรวจสอบการแสดงภาพในหน้า Dashboard
4. ตรวจสอบการแสดงภาพในหน้า Booking
5. ตรวจสอบการแสดงภาพใน BookingModal

## ผลลัพธ์ที่คาดหวัง
- ภาพสนามแสดงได้ถูกต้องในทุกหน้า
- ไม่มี regression กับภาพสินค้า
- URL construction สอดคล้องกันทั้งระบบ

## หมายเหตุ
- การแก้ไขนี้ทำให้ URL construction ของภาพสนามสอดคล้องกันทั้งระบบ
- ใช้ `config.apiUrl` สำหรับภาพที่อัพโหลด (ไม่มี `/api`)
- ใช้ `config.apiBaseUrl` สำหรับ placeholder images (มี `/api`)
- ภาพที่อัพโหลดจะถูกเก็บไว้ที่ `https://thedrinkdistrict.onrender.com/uploads/courts/`
