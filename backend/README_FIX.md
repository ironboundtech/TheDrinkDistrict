# การแก้ไขปัญหาการบันทึกข้อมูลผู้ใช้ใน MongoDB

## ปัญหาที่พบ
Frontend ใช้ localStorage แทนที่จะเรียก API ไปยัง backend ทำให้ข้อมูลผู้ใช้ไม่ถูกบันทึกใน MongoDB

## วิธีแก้ไข

### 1. แก้ไข Frontend (app.tsx)

#### ก่อนแก้ไข:
```javascript
const handleRegister = async (userData: any): Promise<boolean> => {
  try {
    const users = getUsersFromStorage(); // ใช้ localStorage
    // ... สร้าง user ใน localStorage
    saveUsersToStorage(users);
    return true;
  } catch (error) {
    return false;
  }
};
```

#### หลังแก้ไข:
```javascript
const handleRegister = async (userData: any): Promise<boolean> => {
  try {
    // เรียก API register ที่ backend
    const response = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        password: userData.password,
        phone: userData.phone
      })
    });

    const result = await response.json();
    if (response.ok && result.success) {
      // บันทึก token และข้อมูลผู้ใช้
      localStorage.setItem('authToken', result.data.token);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
```

### 2. แก้ไข Login Function

#### ก่อนแก้ไข:
```javascript
const handleLogin = async (username: string, password: string): Promise<boolean> => {
  try {
    const users = getUsersFromStorage(); // ใช้ localStorage
    const user = users.find((u: any) => u.username === username && u.password === password);
    if (user) {
      // login สำเร็จ
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
```

#### หลังแก้ไข:
```javascript
const handleLogin = async (username: string, password: string): Promise<boolean> => {
  try {
    // เรียก API login ที่ backend
    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: username, // ใช้ email สำหรับ login
        password: password
      })
    });

    const result = await response.json();
    if (response.ok && result.success) {
      // บันทึก token
      localStorage.setItem('authToken', result.data.token);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
```

## การทดสอบ

### 1. ทดสอบ API Register
```bash
# ใช้ PowerShell
Invoke-RestMethod -Uri "http://localhost:5001/api/auth/register" -Method POST -ContentType "application/json" -Body '{"name":"Test User","email":"test@example.com","password":"123456","phone":"0812345678"}'
```

### 2. ทดสอบ API Login
```bash
# ใช้ PowerShell
Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","password":"123456"}'
```

### 3. ตรวจสอบข้อมูลใน MongoDB
```bash
npm run test-users
```

## ผลลัพธ์

### ก่อนแก้ไข:
- ข้อมูลผู้ใช้ถูกเก็บใน localStorage เท่านั้น
- ไม่มีข้อมูลใน MongoDB
- ไม่สามารถใช้ role system ได้

### หลังแก้ไข:
- ข้อมูลผู้ใช้ถูกบันทึกใน MongoDB
- สามารถใช้ role system ได้
- มี JWT token สำหรับ authentication
- ข้อมูลถูกเข้ารหัสด้วย bcrypt

## ข้อมูลผู้ใช้ในระบบ

### Admin Account:
- **Email**: admin@sportsbooking.com
- **Password**: admin123456
- **Role**: admin
- **สิทธิ์**: สิทธิ์สูงสุด

### Test User:
- **Email**: test@example.com
- **Password**: 123456
- **Role**: user
- **สิทธิ์**: ผู้ใช้ทั่วไป

## คำสั่งที่มีประโยชน์

```bash
# สร้าง admin account
npm run create-admin

# ตรวจสอบผู้ใช้ในระบบ
npm run test-users

# รัน backend
npm run dev
```

## หมายเหตุสำคัญ

1. **เปลี่ยนรหัสผ่าน Admin** - หลังจากสร้าง admin account แรกเริ่ม ควรเปลี่ยนรหัสผ่านทันที
2. **CORS** - Backend รองรับ CORS แล้วสำหรับ frontend
3. **JWT Token** - Token หมดอายุใน 24 ชั่วโมง
4. **Password Hashing** - รหัสผ่านถูกเข้ารหัสด้วย bcrypt
5. **Role System** - ระบบ role ทำงานได้แล้ว (admin, manager, guest_investor, staff, user)
