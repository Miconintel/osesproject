const express = require('express');

const {
  getAllFoods,
  createFood,
  getSingleFood,
  updateFood,
  deleteFood,
} = require('./../controller/foodController');

const {
  protect,
  authorizeAdmin,
} = require('./../controller/authController');

const router = express.Router();

module.exports = router;
router
  .route('/')
  .get(getAllFoods)
  .post(protect, authorizeAdmin('admin', 'user', 'manager'), createFood);
router
  .route('/:id')
  .get(getSingleFood)
  .patch(protect, authorizeAdmin('admin', 'manager'), updateFood)
  .delete(protect, authorizeAdmin('admin', 'manager'), deleteFood);
