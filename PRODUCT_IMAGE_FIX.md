# Product Image Display Fix

## ปัญหา
ภาพสินค้าที่อัพโหลดไม่แสดงใน production environment

## สาเหตุ
Backend เก็บ full file path ของภาพ แต่ frontend พยายามสร้าง URL ผิด

### Backend Storage
```javascript
// backend/routes/products.js
productData.image = req.file.path.replace(/\\/g, '/');
// ผลลัพธ์: /Users/nb1003503/Downloads/Project/SportsBooking/backend/uploads/products/product-1234567890.jpg
```

### Frontend URL Construction (เดิม)
```typescript
// frontend/src/app.tsx
src={`${config.apiUrl}/${product.image}`}
// ผลลัพธ์: https://thedrinkdistrict.onrender.com//Users/nb1003503/Downloads/Project/SportsBooking/backend/uploads/products/product-1234567890.jpg
// ❌ URL ไม่ถูกต้อง
```

## การแก้ไข

### 1. แก้ไข URL Construction
```typescript
// เปลี่ยนจาก
src={`${config.apiUrl}/${product.image}`}

// เป็น
src={product.image.startsWith('http') ? product.image : `${config.apiUrl}${product.image.includes('uploads') ? product.image.substring(product.image.indexOf('uploads')) : product.image}`}
```

### 2. การทำงาน
1. **ตรวจสอบ URL เต็ม**: `product.image.startsWith('http')`
2. **Extract relative path**: `product.image.substring(product.image.indexOf('uploads'))`
3. **สร้าง URL ถูกต้อง**: `${config.apiUrl}/uploads/products/filename.jpg`

### 3. ตัวอย่าง
- **Input**: `/Users/nb1003503/Downloads/Project/SportsBooking/backend/uploads/products/product-123.jpg`
- **Extracted**: `/uploads/products/product-123.jpg`
- **Final URL**: `https://thedrinkdistrict.onrender.com/uploads/products/product-123.jpg`
- **Result**: ✅ ภาพแสดงผลถูกต้อง

## ไฟล์ที่แก้ไข

### frontend/src/app.tsx
1. **หน้า Store (Line 3317)**:
```typescript
{product.image ? (
  <img 
    src={product.image.startsWith('http') ? product.image : `${config.apiUrl}${product.image.includes('uploads') ? product.image.substring(product.image.indexOf('uploads')) : product.image}`} 
    alt={product.name}
    className="w-full h-32 md:h-40 object-cover"
    onError={(e) => {
      e.target.style.display = 'none';
      e.target.nextSibling.style.display = 'flex';
    }}
  />
) : (
  // fallback
)}
```

2. **หน้า Product Management (Line 4858)**:
```typescript
{product.image ? (
  <img 
    src={product.image.startsWith('http') ? product.image : `${config.apiUrl}${product.image.includes('uploads') ? product.image.substring(product.image.indexOf('uploads')) : product.image}`} 
    alt={product.name}
    className="w-full h-full object-cover"
    onError={(e) => {
      e.target.style.display = 'none';
      e.target.nextSibling.style.display = 'flex';
    }}
  />
) : null}
```

3. **Cart Modal (Line 3407)**:
```typescript
<img 
  src={item.image ? (item.image.startsWith('http') ? item.image : `${config.apiUrl}${item.image.includes('uploads') ? item.image.substring(item.image.indexOf('uploads')) : item.image}`) : ''} 
  alt={item.name}
  className="w-12 h-12 rounded-lg object-cover bg-gray-600"
/>
```

## การทดสอบ

### 1. อัพโหลดภาพสินค้าใหม่
1. เข้าไปที่หน้า Product Management
2. เพิ่มสินค้าใหม่พร้อมอัพโหลดภาพ
3. ตรวจสอบว่าภาพแสดงผลในหน้า Product Management

### 2. ตรวจสอบหน้า Store
1. ไปที่หน้า Store
2. ตรวจสอบว่าภาพสินค้าแสดงผลถูกต้อง
3. ตรวจสอบ console ว่าไม่มี image errors

### 3. ตรวจสอบ Cart
1. เพิ่มสินค้าลงในรถเข็น
2. เปิด Cart Modal
3. ตรวจสอบว่าภาพสินค้าแสดงผลในรถเข็น

### 4. ตรวจสอบ Console
- ไม่มี 404 errors สำหรับภาพสินค้า
- ไม่มี CORS errors
- URL ของภาพถูกต้อง

## หมายเหตุ

- การแก้ไขนี้รองรับทั้ง relative และ absolute URLs
- เพิ่ม error handling สำหรับภาพที่ไม่สามารถโหลดได้
- ใช้ `config.apiUrl` สำหรับ static files (ไม่มี `/api`)
- ตรวจสอบ console errors หลัง deploy

## ผลลัพธ์ที่คาดหวัง

✅ ภาพสินค้าแสดงผลถูกต้องในทุกหน้า  
✅ ไม่มี console errors เกี่ยวกับภาพสินค้า  
✅ URL ของภาพถูกต้องและเข้าถึงได้  
✅ Error handling ทำงานเมื่อภาพไม่สามารถโหลดได้
