# การปรับปรุงระบบ Authentication

## ปัญหาที่แก้ไข

### 1. ปัญหาการรีเฟรชหน้าเว็บ
- **ปัญหาเดิม:** เมื่อรีเฟรชหน้าเว็บ ผู้ใช้จะถูกส่งกลับไปหน้าแรกและต้องล็อกอินใหม่
- **สาเหตุ:** ไม่มีการตรวจสอบ token จาก backend เมื่อโหลดหน้าเว็บใหม่
- **วิธีแก้ไข:** เพิ่มการตรวจสอบ token กับ backend เมื่อโหลดหน้าเว็บ

### 2. การจัดการ Session
- **ปัญหาเดิม:** ไม่มีการจัดการ session ที่เหมาะสม
- **วิธีแก้ไข:** ใช้ JWT token และ localStorage เพื่อเก็บข้อมูลการล็อกอิน

### 3. Auto Logout
- **ฟีเจอร์ใหม่:** ระบบจะทำการ logout อัตโนมัติหลังจากไม่มีการใช้งาน 15 นาที
- **การทำงาน:** ตรวจจับการเคลื่อนไหวของผู้ใช้ (mouse, keyboard, touch) และรีเซ็ต timer

## การเปลี่ยนแปลงที่สำคัญ

### Frontend (app.tsx)

#### 1. เพิ่ม Token Management
```typescript
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
```

#### 2. เพิ่ม Auto Logout Timer
```typescript
// Auto logout timer
const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const resetLogoutTimer = () => {
  if (logoutTimerRef.current) {
    clearTimeout(logoutTimerRef.current);
  }
  
  logoutTimerRef.current = setTimeout(() => {
    console.log('🕐 Auto logout after 15 minutes of inactivity');
    handleLogout();
  }, 900000); // 15 minutes
};
```

#### 3. เพิ่ม User Activity Detection
```typescript
const handleUserActivity = () => {
  if (isLoggedIn) {
    resetLogoutTimer();
  }
};

// Add event listeners for user activity
const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
activityEvents.forEach(event => {
  document.addEventListener(event, handleUserActivity, true);
});
```

#### 4. เพิ่ม Token Validation
```typescript
const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5001/api/auth/validate', {
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
```

### Backend (auth.js)

#### 1. เพิ่ม Token Validation Endpoint
```javascript
// Validate token
router.get('/validate', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Check if user is still active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        userId: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
```

## การทำงานของระบบ

### 1. การล็อกอิน
1. ผู้ใช้กรอก username และ password
2. ระบบส่งข้อมูลไปยัง backend
3. Backend ตรวจสอบและส่ง JWT token กลับมา
4. Frontend เก็บ token และข้อมูลผู้ใช้ใน localStorage
5. เริ่มต้น auto logout timer

### 2. การรีเฟรชหน้าเว็บ
1. เมื่อโหลดหน้าเว็บใหม่ ระบบจะตรวจสอบ token ใน localStorage
2. ส่ง token ไปยัง backend เพื่อตรวจสอบความถูกต้อง
3. หาก token ถูกต้อง จะล็อกอินอัตโนมัติ
4. หาก token ไม่ถูกต้อง จะล้างข้อมูลและส่งไปหน้าแรก

### 3. Auto Logout
1. ระบบตรวจจับการเคลื่อนไหวของผู้ใช้
2. เมื่อมีการเคลื่อนไหว จะรีเซ็ต timer 15 นาที
3. หากไม่มีการเคลื่อนไหว 15 นาที จะ logout อัตโนมัติ

## การทดสอบ

### 1. ทดสอบการล็อกอิน
```bash
# ใช้ test account
Username: admin
Password: password
```

### 2. ทดสอบการรีเฟรช
1. ล็อกอินเข้าสู่ระบบ
2. รีเฟรชหน้าเว็บ (F5)
3. ตรวจสอบว่ายังคงล็อกอินอยู่

### 3. ทดสอบ Auto Logout
1. ล็อกอินเข้าสู่ระบบ
2. ไม่เคลื่อนไหวเป็นเวลา 15 นาที
3. ระบบจะ logout อัตโนมัติ

## ข้อควรระวัง

1. **Token Expiration:** JWT token มีอายุ 24 ชั่วโมง
2. **Browser Storage:** ข้อมูลจะหายไปหากล้าง browser cache
3. **Network Issues:** หากไม่สามารถเชื่อมต่อ backend ได้ จะไม่สามารถตรวจสอบ token ได้

## การปรับแต่งเพิ่มเติม

### เปลี่ยนเวล Auto Logout
```typescript
// เปลี่ยนจาก 15 นาที เป็น 30 นาที
logoutTimerRef.current = setTimeout(() => {
  handleLogout();
}, 1800000); // 30 minutes
```

### เพิ่มการแจ้งเตือนก่อน Auto Logout
```typescript
// แจ้งเตือน 1 นาทีก่อน logout
setTimeout(() => {
  alert('คุณจะถูก logout อัตโนมัติใน 1 นาที');
}, 840000); // 14 minutes
```
