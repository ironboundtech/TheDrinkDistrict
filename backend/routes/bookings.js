const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Court = require('../models/Court');
const User = require('../models/User');

// Create a new booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('Booking request received:', req.body);
    console.log('User from token:', req.user);
    
    const { courtId, bookingDate, startTime, endTime, totalPrice } = req.body;

    // Validate required fields
    if (!courtId || !bookingDate || !startTime || !endTime || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
    }

    // Check if court exists
    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบสนามที่เลือก'
      });
    }

    // Use user from token instead of finding by userId
    const user = req.user;

    // Check if user has sufficient balance
    if (user.walletBalance < totalPrice) {
      return res.status(400).json({
        success: false,
        message: 'ยอดเงินในกระเป๋าไม่เพียงพอ'
      });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      courtId: courtId,
      bookingDate: bookingDate,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ],
      status: { $ne: 'cancelled' }
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'ช่วงเวลานี้มีการจองแล้ว กรุณาเลือกเวลาอื่น'
      });
    }

    // Create new booking
    const booking = new Booking({
      courtId: courtId,
      userId: user._id,
      bookingDate: bookingDate,
      startTime: startTime,
      endTime: endTime,
      totalPrice: totalPrice,
      status: 'confirmed',
      createdAt: new Date()
    });

    await booking.save();

    // Update user's wallet balance
    user.walletBalance -= totalPrice;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'จองสนามสำเร็จ',
      data: booking
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการจอง'
    });
  }
});

// Get user's bookings
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const bookings = await Booking.find({ userId: userId })
      .populate('courtId', 'name address image price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings
    });

  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง'
    });
  }
});

// Get all bookings (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ไม่มีสิทธิ์เข้าถึง'
      });
    }

    const bookings = await Booking.find()
      .populate('courtId', 'name address')
      .populate('userId', 'username name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง'
    });
  }
});

// Update booking status
router.patch('/:bookingId/status', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    // Check if user is admin or the booking owner
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบการจอง'
      });
    }

    if (req.user.role !== 'admin' && booking.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'ไม่มีสิทธิ์แก้ไขการจองนี้'
      });
    }

    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      message: 'อัปเดตสถานะการจองสำเร็จ',
      data: booking
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะ'
    });
  }
});

module.exports = router;
