// Role definitions and descriptions
const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  GUEST_INVESTOR: 'guest_investor',
  STAFF: 'staff',
  USER: 'user'
};

// Role hierarchy (higher number = higher privilege)
const ROLE_HIERARCHY = {
  [ROLES.USER]: 1,
  [ROLES.STAFF]: 2,
  [ROLES.GUEST_INVESTOR]: 3,
  [ROLES.MANAGER]: 4,
  [ROLES.ADMIN]: 5
};

// Role descriptions in Thai
const ROLE_DESCRIPTIONS = {
  [ROLES.ADMIN]: {
    th: 'ผู้ดูแลระบบ',
    en: 'System Administrator',
    description: 'มีสิทธิ์สูงสุดในการจัดการระบบทั้งหมด'
  },
  [ROLES.MANAGER]: {
    th: 'ผู้จัดการ',
    en: 'Manager',
    description: 'จัดการการทำงานของระบบและพนักงาน'
  },
  [ROLES.GUEST_INVESTOR]: {
    th: 'นักลงทุนผู้เยี่ยมชม',
    en: 'Guest Investor',
    description: 'นักลงทุนที่ได้รับสิทธิ์พิเศษในการเข้าถึงข้อมูล'
  },
  [ROLES.STAFF]: {
    th: 'พนักงาน',
    en: 'Staff',
    description: 'พนักงานที่ดูแลการจองและบริการลูกค้า'
  },
  [ROLES.USER]: {
    th: 'ผู้ใช้ทั่วไป',
    en: 'Regular User',
    description: 'สมาชิกที่ลงทะเบียนเว็บตามปกติ'
  }
};

// Permissions for each role
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    'manage_users',
    'manage_roles',
    'manage_venues',
    'manage_bookings',
    'view_reports',
    'system_settings',
    'delete_data',
    'view_all_data'
  ],
  [ROLES.MANAGER]: [
    'manage_users',
    'manage_venues',
    'manage_bookings',
    'view_reports',
    'view_all_data'
  ],
  [ROLES.GUEST_INVESTOR]: [
    'view_reports',
    'view_analytics',
    'view_venue_data'
  ],
  [ROLES.STAFF]: [
    'manage_bookings',
    'view_venue_data',
    'customer_support'
  ],
  [ROLES.USER]: [
    'make_bookings',
    'view_own_profile',
    'update_own_profile'
  ]
};

// Default role for new registrations
const DEFAULT_ROLE = ROLES.USER;

// Helper function to check if a role has permission
const hasPermission = (userRole, requiredPermission) => {
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return userPermissions.includes(requiredPermission);
};

// Helper function to check if a role can manage another role
const canManageRole = (managerRole, targetRole) => {
  return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[targetRole];
};

module.exports = {
  ROLES,
  ROLE_HIERARCHY,
  ROLE_DESCRIPTIONS,
  ROLE_PERMISSIONS,
  DEFAULT_ROLE,
  hasPermission,
  canManageRole
};
