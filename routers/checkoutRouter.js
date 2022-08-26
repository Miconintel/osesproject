const express = require('express');
const {
  protect,
  authorizeAdmin,
} = require('../controller/authController');
const {
  getCheckoutSession,
  getCheckoutSessionOld,
  getAllBookings,
  getOneBooking,
  updateBooking,
  deleteBooking,
  createBooking,
} = require('../controller/bookingController');

const router = express.Router();
// router.use(protect);

//
router.route('/:foodId').get(getCheckoutSession);
// router.route('/checkout-session/:tourId').get(getCheckoutSession);
module.exports = router;
