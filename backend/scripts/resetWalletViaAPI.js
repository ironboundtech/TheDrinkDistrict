const https = require('https');
const http = require('http');

// Simple fetch function using http/https
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          json: () => JSON.parse(data),
          text: () => data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function resetWalletBalance() {
  try {
    console.log('กำลังรีเซ็ต wallet balance ผ่าน API...');
    
    // First, login as admin to get token
    const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Failed to login as admin');
    }

    const loginData = await loginResponse.json();
    const token = loginData.data.token;

    console.log('✅ เข้าสู่ระบบเป็น admin สำเร็จ');

    // Get current wallet balance
    const getBalanceResponse = await fetch('http://localhost:5001/api/auth/users-wallet-balance', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (getBalanceResponse.ok) {
      const balanceData = await getBalanceResponse.json();
      console.log('\nรายการ users และ wallet balance ปัจจุบัน:');
      balanceData.data.users.forEach(user => {
        console.log(`- ${user.username} (${user.email}): ฿${user.walletBalance}`);
      });
    }

    // Reset wallet balance
    const resetResponse = await fetch('http://localhost:5001/api/auth/reset-wallet-balance', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!resetResponse.ok) {
      throw new Error('Failed to reset wallet balance');
    }

    const resetData = await resetResponse.json();
    console.log(`\n✅ ${resetData.message}`);

    // Get updated wallet balance
    const updatedBalanceResponse = await fetch('http://localhost:5001/api/auth/users-wallet-balance', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (updatedBalanceResponse.ok) {
      const updatedBalanceData = await updatedBalanceResponse.json();
      console.log('\nรายการ users และ wallet balance หลังรีเซ็ต:');
      updatedBalanceData.data.users.forEach(user => {
        console.log(`- ${user.username} (${user.email}): ฿${user.walletBalance}`);
      });
    }

    console.log('\n✅ รีเซ็ต wallet balance เสร็จสิ้น!');
    console.log('ตอนนี้ account ใหม่จะเริ่มต้นด้วย 0 บาทเสมอ');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

resetWalletBalance();
