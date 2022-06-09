const express = require('express');

// ULTIMATELY THE EXPRESS AP RUNS ASYNCHROMOUSLY I THE BACKGROUD WAITING FOR AN EVEN TO TRIGGER TE CALL OD ALL THE CALLBACKS. THIS IS WHY AS SOON AS THE APP LISTENING RECEIVES THE REIEST

const {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} = require('../controller/userController');

const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  logout,
} = require('../controller/authController');

const router = express.Router();
// console.log(router);

router.route('/signup').post(signUp);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').patch(resetPassword);
// at this point u can add a single middlewear that will protec everything downwrds, u an now remove the protect from the individual middlewears
router.use(protect);
router.route('/update-password').patch(updatePassword);
router
  .route('/updateme')
  .patch(uploadUserPhoto, resizeUserPhoto, updateMe);
router.route('/deleteme').delete(deleteMe);
router;

router.route('/').get(getAllUsers).post(createUser);
router
  .route('/:id')
  .patch(updateUser)
  .delete(deleteUser)
  .get(getSingleUser);

// the only way to get a sinle user ID is when they login
router.get('/me', protect, getMe, getSingleUser);
module.exports = router;
