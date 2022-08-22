const express = require('express');
const {
  getProduct,
  base,
  signup,
  getOverview,
  getTour,
  login,
  getAccount,
  updateUserData,
  getMyTours,
  alerts,
} = require('../controller/viewsController');
const { protect, isLoggedIn } = require('../controller/authController');
const {
  createBookingcheckout,
} = require('../controller/bookingController');

const router = express.Router({ mergeParams: true });

router.use(isLoggedIn);

// router.use(alerts);

// router.get('/base', base);
// not useful
router.get('/', base);
router.get('/productname/:name', getProduct);
router.get('/signup', signup);
router.get('/login', login);
// router.get('/tour/:slug', isLoggedIn, getTour);
// router.get('/login', isLoggedIn, login);
// router.get('/me', protect, getAccount);
// router.post('/submit-user-data', protect, updateUserData);
// router.get('/my-tours', protect, getMyTours);

// export router

module.exports = router;
