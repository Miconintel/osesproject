const fs = require('fs');
const express = require('express');

// TOUR CO
const {
  getAlltours,
  postTour,
  getSingleTour,
  patchTour,
  deleteTour,
  aliasTop,
  getTourStats,
  checkId,
  checkBody,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
} = require('./../controller/tourController');

// AUTH CONTROLLERS
const {
  protect,
  authorizeAdmin,
} = require('./../controller/authController');

// const { createReviews } = require('./../controller/reviewController');
const reviewRouter = require('./../routers/reviewRouter');

const router = express.Router();

// router.param('id', checkId);
// this is used when u want to acess the review home route from tour route,
// because u need an info from the tour route to use
// in creating review route.
// usually when the info provided in the body
// is only provided in real world by users actions.
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTop, getAlltours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthlyPlan/:year').get(getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/')
  .get(getAlltours)
  .post(protect, authorizeAdmin('admin', 'user', 'manager'), postTour);
router
  .route('/:id')
  .get(getSingleTour)
  .patch(
    protect,
    authorizeAdmin('admin', 'manager'),
    uploadTourImages,
    resizeTourImages,
    patchTour
  )
  .delete(protect, authorizeAdmin('admin', 'manager'), deleteTour);

// this is confusing as u have to use a review controller on a tour router, that is why we are going to be mounting a new router on the tour router

// router
//   .route('/:tourId/reviews')
//   .post(protect, authorizeAdmin('user'), createReviews);

module.exports = router;
