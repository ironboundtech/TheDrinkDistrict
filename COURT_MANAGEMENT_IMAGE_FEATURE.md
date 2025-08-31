# Court Management Image Upload Feature

## 🖼️ ฟีเจอร์อัปโหลดรูปภาพสำหรับ Court Management

### ✅ สิ่งที่เพิ่มเข้ามา

1. **ช่องอัปโหลดรูปภาพในฟอร์มสร้างสนาม**
   - เพิ่มช่อง URL สำหรับรูปภาพสนาม
   - แสดงตัวอย่างรูปภาพแบบ real-time
   - รองรับการใส่ URL หรือปล่อยว่างเพื่อใช้รูปภาพเริ่มต้น

2. **ช่องอัปโหลดรูปภาพในฟอร์มแก้ไขสนาม**
   - แสดงรูปภาพปัจจุบันของสนาม
   - สามารถเปลี่ยนรูปภาพได้
   - แสดงตัวอย่างรูปภาพใหม่แบบ real-time

3. **การแสดงรูปภาพในหน้า Court Management**
   - แสดงรูปภาพของแต่ละสนาม
   - รองรับการแสดงรูปภาพเริ่มต้นเมื่อไม่มีรูปภาพ
   - จัดการ error เมื่อรูปภาพไม่สามารถโหลดได้

4. **Backend API รองรับ**
   - อัปเดต API สำหรับสร้างและแก้ไขสนาม
   - รองรับการบันทึก URL รูปภาพ
   - สร้าง placeholder image service สำหรับทดสอบ

### 🚀 วิธีการใช้งาน

#### สำหรับ Admin:

1. **เข้าสู่ระบบด้วย Admin Account**
   - Username: `admin`
   - Password: `admin123`

2. **เข้าถึง Court Management**
   - ไปที่หน้า Profile
   - คลิกปุ่ม "Court Management"

3. **สร้างสนามใหม่**
   - คลิกปุ่ม "สร้างสนามใหม่"
   - กรอกข้อมูลสนาม
   - **ใส่ URL รูปภาพ** (เช่น: `https://example.com/court-image.jpg`)
   - หรือปล่อยว่างเพื่อใช้รูปภาพเริ่มต้น
   - คลิก "สร้างสนาม"

4. **แก้ไขสนาม**
   - คลิกไอคอนแก้ไข (ดินสอ) ที่สนาม
   - แก้ไขข้อมูลสนาม
   - **เปลี่ยน URL รูปภาพ** หากต้องการ
   - คลิก "บันทึกการเปลี่ยนแปลง"

#### ตัวอย่าง URL รูปภาพที่ใช้ได้:

- **รูปภาพจริง**: `https://example.com/court-image.jpg`
- **Placeholder**: `http://localhost:5001/api/placeholder/300/200`
- **รูปภาพจาก Unsplash**: `https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200`
- **รูปภาพจาก Pexels**: `https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?w=300&h=200`

### 🔧 Technical Details

#### Frontend Changes:
- เพิ่ม `image` field ใน form states
- เพิ่ม input field สำหรับ URL รูปภาพ
- เพิ่ม image preview ในฟอร์ม
- อัปเดต API calls เพื่อส่งข้อมูลรูปภาพ

#### Backend Changes:
- อัปเดต Court model รองรับ `image` field
- อัปเดต API endpoints สำหรับ create และ update
- สร้าง placeholder image service
- เพิ่ม error handling สำหรับรูปภาพ

#### Database Changes:
- Court documents จะมี `image` field
- Default value: `/api/placeholder/300/200`

### 🎨 UI/UX Features

1. **Real-time Preview**
   - แสดงตัวอย่างรูปภาพทันทีที่ใส่ URL
   - รองรับการแสดงรูปภาพเริ่มต้นเมื่อ URL ไม่ถูกต้อง

2. **Error Handling**
   - แสดงรูปภาพเริ่มต้นเมื่อรูปภาพไม่สามารถโหลดได้
   - ไม่ทำให้ระบบ crash เมื่อรูปภาพมีปัญหา

3. **Responsive Design**
   - รูปภาพปรับขนาดตามหน้าจอ
   - แสดงตัวอย่างรูปภาพในขนาดที่เหมาะสม

### 📝 หมายเหตุ

- รูปภาพจะถูกเก็บเป็น URL ไม่ใช่ไฟล์จริง
- ระบบรองรับรูปภาพจาก external sources
- มี placeholder image service สำหรับทดสอบ
- รูปภาพเริ่มต้นจะใช้จาก `/api/placeholder/300/200`

### 🔮 Future Enhancements

1. **File Upload**
   - รองรับการอัปโหลดไฟล์รูปภาพจริง
   - จัดการ storage สำหรับรูปภาพ

2. **Image Optimization**
   - บีบอัดรูปภาพอัตโนมัติ
   - สร้าง thumbnail versions

3. **Multiple Images**
   - รองรับหลายรูปภาพต่อสนาม
   - สร้าง image gallery

---

**สร้างโดย**: AI Assistant  
**วันที่**: 30 สิงหาคม 2025  
**เวอร์ชัน**: 1.0.0
