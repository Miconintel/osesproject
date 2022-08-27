const mongoose = require('mongoose');
const Tour = require('./tourModel');
const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, 'a reiew cannot be empty'] },
    rating: { type: Number, default: 4.5, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now() },
    parentTour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'review must belong to a tour'],
    },

    parentUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.statics.calculateAverageRatings = async function (tourId) {
  // this stats return array of objects with fields holding aggregate calcuations., if there are more tha one objects, they are collected in the array.
  const stats = await this.aggregate([
    {
      $match: { parentTour: tourId },
    },
    // match all the reviews that have their parent tour as thistour ID

    {
      $group: {
        _id: '$parentTour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }

  console.log(stats);
};
// stop multiple revies
reviewSchema.index({ parentTour: 1, parentUser: 1 }, { unique: true });

reviewSchema.post('save', function () {
  this.constructor.calculateAverageRatings(this.parentTour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  // untill  call the last find one it doesnt execute
  // then we save the await to a variable the bext middlwe wear wil hace ccess o which is "this" variable
   //  we have to add the r to the "this" property, because that is the variable that is passed down to the next middlwe wear

  this.r = await this.findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  // untill u  call the last find one it doesnt execute the query , when query executes it eturns the doc
  // this is the nextmiddle wear having access to this.r, saved in the this
 
  this.r.constructor.calculateAverageRatings(this.r.parentTour);
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'parentUser',
    select: '-_v',
  });
  // you n chain the popuate but we wil be populating only the user and review
  // this.populate({
  //   path: 'parentTour',
  //   select: '-_v',
  // }).populate({
  //   path: 'parentUser',
  //   select: '-_v',
  // });
  // you can populate by spacing and adding the fields
  // this.populate({
  //   path: 'parentTour parentUser',
  //   select: '-_v',
  // });
  // you can populate twice
  // this.populate({
  //   path: 'parentUser',
  //   select: '-_v',
  // });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
