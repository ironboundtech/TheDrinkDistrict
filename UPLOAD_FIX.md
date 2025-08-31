# การแก้ไขปัญหาการอัพโหลดภาพใน Production

## ปัญหาที่พบ
- ไม่สามารถอัพโหลดภาพสนามได้เมื่อ deploy ไปแล้ว
- Error เกี่ยวกับ file permissions หรือ directory access

## สาเหตุของปัญหา
1. **โฟลเดอร์ uploads ไม่มีสิทธิ์เขียนใน production**
2. **Path ไม่ถูกต้องใน production environment**
3. **Multer configuration ไม่เหมาะสมสำหรับ production**

## การแก้ไขที่ทำแล้ว

### 1. ปรับปรุง Multer Configuration
- ✅ เพิ่มการสร้างโฟลเดอร์อัตโนมัติ
- ✅ ใช้ absolute path แทน relative path
- ✅ เพิ่ม error handling ที่ดีขึ้น

### 2. เพิ่ม Error Handling
- ✅ จัดการ Multer errors
- ✅ จัดการ file size limits
- ✅ จัดการ file type validation

### 3. อัปเดต Server Startup
- ✅ สร้างโฟลเดอร์ uploads อัตโนมัติเมื่อเริ่ม server
- ✅ เพิ่ม logging สำหรับ debugging

## การทดสอบ

### Development
```bash
cd backend
npm run dev
```

### Production
```bash
cd backend
npm start
```

## การตรวจสอบ

### 1. ตรวจสอบโฟลเดอร์
```bash
# ตรวจสอบว่าโฟลเดอร์ถูกสร้างขึ้น
ls -la uploads/
ls -la uploads/courts/
ls -la uploads/products/
```

### 2. ตรวจสอบ Permissions
```bash
# ตรวจสอบสิทธิ์การเขียน
chmod 755 uploads/
chmod 755 uploads/courts/
chmod 755 uploads/products/
```

### 3. ทดสอบการอัพโหลด
- เข้าไปที่หน้า Court Management
- ลองอัพโหลดภาพสนามใหม่
- ตรวจสอบ console logs

## Troubleshooting

### ปัญหา: "ENOENT: no such file or directory"
**วิธีแก้:**
```bash
# สร้างโฟลเดอร์ด้วยตนเอง
mkdir -p uploads/courts
mkdir -p uploads/products
```

### ปัญหา: "EACCES: permission denied"
**วิธีแก้:**
```bash
# เปลี่ยนสิทธิ์โฟลเดอร์
chmod 755 uploads/
chmod 755 uploads/courts/
chmod 755 uploads/products/
```

### ปัญหา: "File too large"
**วิธีแก้:**
- ลดขนาดไฟล์ภาพให้ต่ำกว่า 5MB
- หรือเพิ่ม limit ใน multer configuration

## การตั้งค่าใน Render

### Environment Variables
ตรวจสอบว่าใน Render dashboard มีการตั้งค่า:
- `NODE_ENV=production`
- `UPLOAD_PATH=./uploads`

### Build Command
```bash
npm install && npm run setup-uploads
```

### Start Command
```bash
npm start
```

## การตรวจสอบ Logs

### Development
```bash
# ดู logs ใน terminal
npm run dev
```

### Production (Render)
- ไปที่ Render dashboard
- ดู logs ใน "Logs" tab
- ค้นหา error messages เกี่ยวกับ upload

## การทดสอบหลังแก้ไข

1. **ทดสอบการสร้างสนามใหม่**
   - เข้าไปที่ Court Management
   - สร้างสนามใหม่พร้อมอัพโหลดภาพ
   - ตรวจสอบว่าภาพแสดงผลถูกต้อง

2. **ทดสอบการอัปเดตสนาม**
   - แก้ไขสนามที่มีอยู่
   - อัพโหลดภาพใหม่
   - ตรวจสอบว่าภาพอัปเดตถูกต้อง

3. **ทดสอบการอัพโหลดสินค้า**
   - เข้าไปที่ Product Management
   - สร้างสินค้าใหม่พร้อมอัพโหลดภาพ
   - ตรวจสอบว่าภาพแสดงผลถูกต้อง

## หมายเหตุ

- ไฟล์ที่อัพโหลดจะถูกเก็บใน `uploads/` directory
- ไฟล์จะถูกตั้งชื่อด้วย timestamp เพื่อป้องกันการซ้ำ
- ขนาดไฟล์สูงสุดคือ 5MB
- รองรับไฟล์ภาพ: JPEG, JPG, PNG, GIF, WEBP
