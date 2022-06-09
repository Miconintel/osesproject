const mongoose = require('mongoose');
const Tour = require('./tourModel');

const bookingSchema = mongoose.Schema({
  parentTour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'booking must have a tour'],
  },
  parentUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'booking must have a user'],
  },
  price: {
    type: Number,
    required: [true, 'a booking must have price'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});
bookingSchema.pre(/^find/, function (next) {
  this.populate('parentUser').populate({
    path: 'parentTour',
  });
  // this.populate('parentUser').populate({
  //   path: 'parentTour',
  //   select: 'name',
  // });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
