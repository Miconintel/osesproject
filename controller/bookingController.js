const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel.js');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utilities/appError.js');
const APIfeatures = require('../utilities/APIfeatures');
const catchAsync = require('../utilities/catchAsync');
const handlerFactory = require('./handlerFactory');

// const useStripe = stripe(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(
  async (request, response, next) => {
    // get currently booke tour
    const tour = await Tour.findById(request.params.tourId);
    // create checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      // success_url: `${request.protocol}://${request.get(
      //   'host'
      // )}/?parentTour=${request.params.tourId}&parentUser=${
      //   request.user.id
      // }&price=${tour.price}`,
      success_url: `${request.protocol}://${request.get(
        'host'
      )}/?alert=booking`,
      cancel_url: `${request.protocol}://${request.get('host')}/tour/${
        tour.slug
      }`,
      customer_email: request.user.email,
      client_reference_id: request.params.tourId,
      line_items: [
        {
          name: `${tour.name} Tour`,
          description: tour.summary,
          images: [
            `${request.protocol}://${request.get('host')}/img/tours/${
              tour.imageCover
            }`,
          ],
          amount: tour.price * 100,
          // amount is usually in cents
          currency: 'usd',
          quantity: 1,
        },
      ],
    });

    response.status(200).json({
      status: 'success',
      session,
    });
  }
);

// we are literally creating a booking object when someone hits the route
// exports.createBookingcheckout = catchAsync(
//   async (request, response, next) => {
//     const { parentTour, parentUser, price } = request.query;
//     // we can populate user and get all the bookings under a user and then the tours
//     if (!parentTour && !parentUser && !price) return next();
//     await Booking.create({ parentTour, parentUser, price });

//     response.redirect(request.originalUrl.split('?')[0]);
//   }
// );
// we will be using the hooks from stripe

const checkOut = async (session) => {
  // parentUser ID to get the parent tour to crette bookinsg
  const parentTour = session.client_reference_id;
  // parentUser ID to get the parent tour to cretae book
  const parentUser = (
    await User.findOne({ email: session.customer_email })
  ).id;

  // // parentUser ID to get the parent tour to cretae book
  const price = session.amount_total / 100;

  await Booking.create({ parentTour, parentUser, price });
};

exports.webhookCheckout = (request, response, next) => {
  const signature = request.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return response.status(400).send(`webhook error:${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    console.log('completed event');
    checkOut(event.data.object);
    return response.status(200).json({ received: `created object too` });
  }
  response.status(200).json({ received: true });
};

exports.createBooking = handlerFactory.createOne(Booking);
exports.getOneBooking = handlerFactory.getOne(Booking);
exports.getAllBookings = handlerFactory.getAll(Booking);
exports.updateBooking = handlerFactory.updateOne(Booking);
exports.deleteBooking = handlerFactory.deleteOne(Booking);
