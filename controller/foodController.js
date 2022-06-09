const AppError = require('../utilities/appError.js');
const APIfeatures = require('../utilities/APIfeatures');
const catchAsync = require('../utilities/catchAsync');
const handlerFactory = require('./handlerFactory');
const Food = require('./../models/foodModel');

exports.getAllFoods = handlerFactory.getAll(Food);
exports.createFood = handlerFactory.createOne(Food);
exports.getSingleFood = handlerFactory.getOne(Food);
exports.updateFood = handlerFactory.updateOne(Food);
exports.deleteFood = handlerFactory.deleteOne(Food);
