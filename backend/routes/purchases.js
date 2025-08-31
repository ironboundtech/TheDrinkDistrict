const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const { User } = require('../models/User');
const mongoose = require('mongoose'); // ต้องใช้เพื่อสร้าง session

// Create a new purchase
router.post('/', authenticateToken, async (req, res) => {
  console.log('DEBUG: [purchases.js] route called');
  try { console.log('DEBUG: req.user =', JSON.stringify(req.user)); } catch (e) { console.log('DEBUG: req.user error', e); }
  try { console.log('DEBUG: req.body =', JSON.stringify(req.body)); } catch (e) { console.log('DEBUG: req.body error', e); }
  // Defensive: check req.user and req.body
  if (!req.user) {
    console.log('❌ [early] req.user missing');
    return res.status(401).json({ success: false, message: 'ไม่พบข้อมูลผู้ใช้' });
  }
  if (!req.body || typeof req.body !== 'object') {
    console.log('❌ [early] req.body missing or not object');
    return res.status(400).json({ success: false, message: 'ข้อมูลการสั่งซื้อไม่ถูกต้อง' });
  }

  // Try to start a mongoose session/transaction. If the MongoDB deployment
  // doesn't support transactions (standalone server), fall back to no-session
  // mode to avoid crashing with an unhandled error.
  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
  } catch (err) {
    console.warn('⚠️ Transactions not available, proceeding without transaction:', err.message);
    session = null;
  }

  try {
    // attach a short request id to log lines for easier tracing
  const requestId = (new mongoose.Types.ObjectId()).toString();
    console.log(`🔍 [${requestId}] Purchase request received:`, {
      body: req.body,
      userId: req.user?._id,
      userWallet: req.user?.walletBalance,
      tokenSource: req.authInfo ? req.authInfo.tokenSource : undefined
    });


  let { items, totalAmount } = req.body;
  const userId = req.user._id;
  console.log('DEBUG: items =', JSON.stringify(items));
  console.log('DEBUG: totalAmount =', totalAmount);

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('❌ [early] items missing or not array:', items);
      if (session) await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'ข้อมูลการสั่งซื้อไม่ถูกต้อง' });
    }

    // Validate totalAmount
    if (totalAmount === undefined || totalAmount === null) {
      console.log('❌ [early] totalAmount missing:', totalAmount);
      if (session) await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'ยอดรวมไม่ถูกต้อง' });
    }
    totalAmount = Number(totalAmount);
    if (Number.isNaN(totalAmount) || totalAmount <= 0) {
      console.log('❌ [early] totalAmount not a valid number:', totalAmount);
      if (session) await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'ยอดรวมไม่ถูกต้อง' });
    }

    // Check user
    if (!req.user) {
      console.log('❌ User not found');
      if (session) await session.abortTransaction();
      return res.status(401).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    // Check balance
    if (req.user.walletBalance < totalAmount) {
      console.log('❌ Insufficient balance');
      if (session) await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'ยอดเงินในกระเป๋าไม่เพียงพอ'
      });
    }

    let calculatedTotal = 0;

    // Validate products and update stock atomically
    for (const item of items) {
      console.log('DEBUG: item =', JSON.stringify(item));
      if (!item || typeof item !== 'object') {
        console.log('❌ [early] item not object:', item);
        if (session) await session.abortTransaction();
        return res.status(400).json({ success: false, message: 'ข้อมูลสินค้าไม่ถูกต้อง' });
      }
      const { productId, quantity, price } = item;
      if (!productId || !mongoose.isValidObjectId(productId)) {
        console.log('❌ [early] Invalid productId:', productId);
        if (session) await session.abortTransaction();
        return res.status(400).json({ success: false, message: `ข้อมูลสินค้าไม่ถูกต้อง: ${productId}` });
      }
      if (quantity === undefined || price === undefined) {
        console.log('❌ [early] quantity or price missing:', item);
        if (session) await session.abortTransaction();
        return res.status(400).json({ success: false, message: 'ข้อมูลสินค้าไม่ครบถ้วน' });
      }
      const qty = Number(quantity);
      const pr = Number(price);
      if (Number.isNaN(qty) || Number.isNaN(pr) || qty <= 0 || pr <= 0) {
        console.log('❌ [early] quantity or price not valid number:', { quantity, price });
        if (session) await session.abortTransaction();
        return res.status(400).json({ success: false, message: 'จำนวนหรือราคาสินค้าต้องมากกว่า 0' });
      }
      // Defensive: check product exists
      let product;
      try {
        const productQuery = Product.findById(productId);
        if (session) productQuery.session(session);
        product = await productQuery;
        console.log('DEBUG: product =', JSON.stringify(product));
      } catch (e) {
        console.log('❌ [early] Product.findById error:', e && e.message ? e.message : e);
        if (session) await session.abortTransaction();
        return res.status(400).json({ success: false, message: `ข้อมูลสินค้าไม่ถูกต้อง: ${productId}` });
      }
      if (!product) {
        console.log('❌ [early] Product not found:', productId);
        if (session) await session.abortTransaction();
        return res.status(400).json({ success: false, message: `ไม่พบสินค้า: ${productId}` });
      }
      if (product.stock < qty) {
        console.log('❌ [early] Insufficient stock:', { product: product.name, available: product.stock, requested: qty });
        if (session) await session.abortTransaction();
        return res.status(400).json({ success: false, message: `สินค้า ${product.name} มีไม่เพียงพอ` });
      }
      // Deduct stock atomically
      const updateFilter = { _id: productId, stock: { $gte: qty } };
      const updateAction = { $inc: { stock: -qty } };
      const updateOptions = session ? { session } : {};
      let result;
      try {
        result = await Product.updateOne(updateFilter, updateAction, updateOptions);
        console.log('DEBUG: Product.updateOne result =', JSON.stringify(result));
      } catch (e) {
        console.log('❌ [early] Product.updateOne error:', e && e.message ? e.message : e);
        if (session) await session.abortTransaction();
        return res.status(400).json({ success: false, message: `เกิดข้อผิดพลาดขณะอัปเดตสต็อกสินค้า: ${productId}` });
      }
      if (result.modifiedCount === 0) {
        console.log('❌ [early] Stock update failed (race condition):', productId);
        if (session) await session.abortTransaction();
        return res.status(400).json({ success: false, message: `สินค้า ${product.name} มีไม่เพียงพอ (มี ${product.stock} ชิ้น)` });
      }
      calculatedTotal += pr * qty;
    }

    // ตรวจสอบว่า totalAmount ตรงกับที่คำนวณ
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      console.log('❌ Total amount mismatch:', { calculatedTotal, totalAmount });
      if (session) await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'ยอดรวมไม่ตรงกับราคาสินค้า'
      });
    }

  // Create purchase
    const purchase = new Purchase({
      userId,
      items: items.map(item => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        price: Number(item.price)
      })),
      totalAmount,
      status: 'completed',
      createdAt: new Date()
    });

  try {
    if (session) await purchase.save({ session });
    else await purchase.save();
    console.log('DEBUG: purchase.save success');
  } catch (e) {
    console.log('❌ purchase.save error:', e && e.message ? e.message : e);
    if (session) await session.abortTransaction();
    return res.status(400).json({ success: false, message: 'เกิดข้อผิดพลาดขณะบันทึกการสั่งซื้อ' });
  }

    // Deduct wallet
  const userFilter = { _id: userId, walletBalance: { $gte: totalAmount } };
  const userUpdateAction = { $inc: { walletBalance: -totalAmount } };
  const userUpdateOptions = session ? { session } : {};
  let userUpdate;
  try {
    userUpdate = await User.updateOne(userFilter, userUpdateAction, userUpdateOptions);
    console.log('DEBUG: User.updateOne result =', JSON.stringify(userUpdate));
  } catch (e) {
    console.log('❌ User.updateOne error:', e && e.message ? e.message : e);
    if (session) await session.abortTransaction();
    return res.status(400).json({ success: false, message: 'เกิดข้อผิดพลาดขณะหักเงินในกระเป๋า' });
  }

    if (userUpdate.modifiedCount === 0) {
      console.log('❌ Wallet update failed');
      if (session) await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'ไม่สามารถหักเงินได้ (ยอดเงินไม่เพียงพอ)'
      });
    }

  // Commit transaction if using session
  if (session) await session.commitTransaction();

    // Populate for response
    let populatedPurchase;
    try {
      populatedPurchase = await Purchase.findById(purchase._id)
        .populate('items.productId', 'name category image');
      console.log('DEBUG: populatedPurchase =', JSON.stringify(populatedPurchase));
    } catch (e) {
      console.log('❌ Purchase.findById(populate) error:', e && e.message ? e.message : e);
      // ไม่ critical, ตอบกลับข้อมูล purchase ธรรมดา
      populatedPurchase = purchase;
    }

  console.log(`✅ [${requestId}] Purchase completed successfully: purchaseId=${purchase._id}`);
    return res.status(201).json({
      success: true,
      message: 'สั่งซื้อสำเร็จ',
      data: populatedPurchase
    });

  } catch (error) {
    if (session) {
      try { await session.abortTransaction(); } catch (_) { /* ignore */ }
    }
    const errMsg = error && error.message ? error.message : String(error);
    console.error(`❌ [${typeof requestId !== 'undefined' ? requestId : 'no-id'}] Error creating purchase:`, errMsg);
    if (error && error.stack) console.error(error.stack);
    // attach auth/token debug if available
    try { console.error('Auth debug:', req.authInfo ? req.authInfo : { userId: req.user?._id }); } catch (_) { /* ignore */ }
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสั่งซื้อ',
      error: process.env.NODE_ENV === 'development' ? { message: errMsg, stack: error && error.stack ? error.stack : undefined } : undefined
    });
  } finally {
    if (session) try { session.endSession(); } catch (_) { /* ignore */ }
  }
});

// Get user's purchases
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ไม่มีสิทธิ์เข้าถึง'
      });
    }

    const purchases = await Purchase.find({ userId })
      .populate('items.productId', 'name category image')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: purchases
    });
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการสั่งซื้อ'
    });
  }
});

// Get all purchases (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ไม่มีสิทธิ์เข้าถึง'
      });
    }

    const purchases = await Purchase.find()
      .populate('userId', 'username name email')
      .populate('items.productId', 'name category image')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: purchases
    });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการสั่งซื้อ'
    });
  }
});

// Get single purchase
router.get('/:purchaseId', authenticateToken, async (req, res) => {
  try {
    const { purchaseId } = req.params;

    const purchase = await Purchase.findById(purchaseId)
      .populate('userId', 'username name email')
      .populate('items.productId', 'name category image');

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบการสั่งซื้อ'
      });
    }

    if (purchase.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ไม่มีสิทธิ์เข้าถึง'
      });
    }

    return res.json({
      success: true,
      data: purchase
    });
  } catch (error) {
    console.error('Error fetching purchase:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการสั่งซื้อ'
    });
  }
});

module.exports = router;
