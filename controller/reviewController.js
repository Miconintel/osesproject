const catchAsync = require('../utilities/catchAsync');
const Review = require('../models/reviewModel');
const handlerFactory = require('./handlerFactory');

exports.getAllReviews = handlerFactory.getAll(Review);
// exports.getAllReviews = catchAsync(async (request, response, next) => {
//   let filter = {};

//   if (request.params.tourId) filter = { parentTour: request.params.id };

//   const reviews = await Review.find({ filter });
//   response.status(200).json({
//     status: 'success',
//     data: {
//       reviews,
//     },
//   });
// });
// could have left tis bt lets refactor it

exports.getSingleReview = handlerFactory.getOne(Review);

exports.setTourIds = (request, response, next) => {
  if (!request.body.parentTour)
    request.body.parentTour = request.params.tourId;
  if (!request.body.parentUser) request.body.parentUser = request.user.id;
  next();
};

exports.createReviews = handlerFactory.createOne(Review);
// exports.createReviews = catchAsync(async (request, response, next) => {
//   // parent tour and parent user which is a schema that is being populated on reviw

//   const reviews = await Review.create(request.body);

//   response.status(200).json({
//     status: 'success',
//     data: {
//       reviews,
//     },
//   });
// });
exports.updateReviews = handlerFactory.updateOne(Review);
exports.deleteReviews = handlerFactory.deleteOne(Review);
