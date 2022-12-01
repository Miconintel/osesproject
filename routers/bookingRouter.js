const express = require('express');
const {
  protect,
  authorizeAdmin,
} = require('../controller/authController');
const {
  getCheckoutSession,
  getCheckoutSessionOld,
  checkId,
  getAllBookings,
  getOneBooking,
  updateBooking,
  deleteBooking,
  createBooking,
} = require('../controller/bookingController');

const router = express.Router();
// router.use(protect);

//
// router.route('/checkout-session/:foodId').get(getCheckoutSession);
router.route('/checkout-session/:foodId').get(checkId);
// router.route('/checkout-session/:foodId').get(checkId, getCheckoutSession);
// router.route('/checkout-session/:tourId').get(getCheckoutSession);
router.use(authorizeAdmin('admin'));
router.route('/:id').get(getOneBooking).patch(updateBooking);
router.route('/').get(getAllBookings).post(createBooking);
router.route('/:id').delete(deleteBooking);

module.exports = router;
