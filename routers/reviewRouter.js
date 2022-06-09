const express = require('express');
const {
  protect,
  authorizeAdmin,
} = require('../controller/authController');
const {
  getAllReviews,
  createReviews,
  deleteReviews,
  updateReviews,
  setTourIds,
  getSingleReview,
} = require('../controller/reviewController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/').get(getAllReviews);
router
  .route('/')
  .post(authorizeAdmin('user', 'admin'), setTourIds, createReviews);
router
  .route('/:id')
  .patch(authorizeAdmin('user', 'admin'), updateReviews)
  .delete(authorizeAdmin('user', 'admin'), deleteReviews)
  .get(getSingleReview);

module.exports = router;
