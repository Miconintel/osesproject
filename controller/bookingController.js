const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel.js');
const User = require('../models/userModel');
const Food = require('../models/foodModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utilities/appError.js');
const APIfeatures = require('../utilities/APIfeatures');
const catchAsync = require('../utilities/catchAsync');
const handlerFactory = require('./handlerFactory');
const { promises } = require('nodemailer/lib/xoauth2/index.js');

// EDIT THIS

// exports.getCheckoutSession = catchAsync(
//   async (req, res,next) => {
//     const food = await Food.findById(req.params.foodId);

//     // res.json({ id: session.id });
//     res.status(200).json({
//       status: 'success',
//       food,
//     });
//   }
// )

exports.getCheckoutSessionwait = catchAsync(async (req, res, next) => {
  const food = await Food.findById(req.params.foodId);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/productname/${
      food.slug
    }`,
    client_reference_id: req.params.foodId,
    shipping_address_collection: {
      allowed_countries: ['US', 'CA'],
    },
    shipping_options: [
      // {
      //   shipping_rate_data: {
      //     type: 'fixed_amount',
      //     fixed_amount: {
      //       amount: 0,
      //       currency: 'usd',
      //     },
      //     display_name: 'Free shipping',
      //     // Delivers between 5-7 business days
      //     delivery_estimate: {
      //       minimum: {
      //         unit: 'business_day',
      //         value: 5,
      //       },
      //       maximum: {
      //         unit: 'business_day',
      //         value: 7,
      //       },
      //     }
      //   }
      // },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 1500,
            currency: 'usd',
          },
          display_name: 'Express',
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 1,
            },
            maximum: {
              unit: 'business_day',
              value: 1,
            },
          },
        },
      },
    ],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: (food.price * 100).toFixed(1),
          product_data: {
            name: food.productName,
            images: [
              `${req.protocol}://${req.get('host')}/img/product-images/${
                food.image
              }`,
            ],
          },
        },

        quantity: 1,
      },
    ],
    mode: 'payment',
  });

  // res.json({ id: session.id });
  res.status(200).json({
    status: 'success',
    session,
  });
});

// const useStripe = stripe(process.env.STRIPE_SECRET_KEY);
// WE ARE GOING TO BE WROKING FOR PLENTY TOURS THIS TIME

exports.checkId = catchAsync(async (request, response, next) => {
  const idd = request.params.foodId;
  const test = JSON.parse(idd);
  console.log(test.length);

  // const idArray = idd.split(',');
  // if (test.length == 1) {
  //   next();
  //   return;
  // }
  const idp = test.map((item) => {
    return item.id;
  });
  const mapId = idp.map(async (id) => {
    return await Food.findById(id);
  });
  const all = await Promise.all(mapId);

  const final = all.map((food) => {
    return test.reduce((acc, item) => {
      return food.id === item.id
        ? { food: food, amount: item.amount }
        : acc;
      // if (food.id === item.id) {
      //   return { food: food, amount: item.amount };
      // }
    }, 0);
  });

  console.log(final);
  // const idp = idArray.map(async (el) => {
  //   return await Food.findById(el);
  // });
  // const all = await Promise.all(idp);
  request.id = final;
  // res.status(200).json({
  //   status: 'success',
  //   all,
  // });
  next();
});

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  let food = req.id;
  // if (req.id) {
  //   food = req.id;
  // } else {
  //   food = [await Food.findById(req.params.foodId)];
  // }

  const getline = food.map((el) => {
    return {
      price_data: {
        currency: 'usd',
        unit_amount: el.food.price.toFixed(1) * 100,
        product_data: {
          name: el.food.productName,
          images: [
            `${req.protocol}://${req.get('host')}/img/product-images/${
              el.food.image
            }`,
          ],
        },
      },

      quantity: el.amount,
    };
  });

  // const food = await Food.findById(req.params.foodId);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/`,
    //  cancel_url: `${req.protocol}://${req.get('host')}/productname/${
    //     food.slug
    //   }`,
    client_reference_id: req.params.foodId,
    shipping_address_collection: {
      allowed_countries: ['US', 'CA'],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 1500,
            currency: 'usd',
          },
          display_name: 'Express',
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 1,
            },
            maximum: {
              unit: 'business_day',
              value: 1,
            },
          },
        },
      },
    ],
    line_items: getline,
    // line_items: [
    //   {
    //     price_data: {
    //       currency: 'usd',
    //       unit_amount: food.price*100,
    //       product_data: {
    //         name: food.productName,
    //         images: [
    //           `${req.protocol}://${req.get('host')}/img/product-images/${
    //             food.image
    //           }`,
    //         ],
    //       },
    //     },

    //     quantity: food.length,
    //   },
    // ],
    mode: 'payment',
  });

  // res.status(200).json({
  //   status: 'success',
  //   getline
  // });
  res.status(200).json({
    status: 'success',
    session,
  });
});

/** */

// exports.getCheckoutSessionOld = catchAsync(
//   async (request, response, next) => {
//     // get currently booke tour
//     const tour = await Tour.findById(request.params.tourId);
//     // create checkout
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       success_url: `${request.protocol}://${request.get(
//         'host'
//       )}/?alert=booking`,
//       cancel_url: `${request.protocol}://${request.get('host')}/tour/${
//         tour.slug
//       }`,
//       customer_email: request.user.email,
//       client_reference_id: request.params.tourId,
//       line_items: [
//         {
//           name: `${tour.name} Tour`,
//           description: tour.summary,
//           images: [
//             `${request.protocol}://${request.get('host')}/img/tours/${
//               tour.imageCover
//             }`,
//           ],
//           amount: tour.price * 100,
//           // amount is usually in cents
//           currency: 'usd',
//           quantity: 1,
//         },
//       ],
//     });

//     response.status(200).json({
//       status: 'success',
//       session,
//     });
//   }
// );
// exports.getCheckoutSession = catchAsync(
//   async (request, response, next) => {
//     // get currently booke tour
//     const tour = await Tour.findById(request.params.tourId);
//     // create checkout
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       // success_url: `${request.protocol}://${request.get(
//       //   'host'
//       // )}/?parentTour=${request.params.tourId}&parentUser=${
//       //   request.user.id
//       // }&price=${tour.price}`,
//       success_url: `${request.protocol}://${request.get(
//         'host'
//       )}/?alert=booking`,
//       cancel_url: `${request.protocol}://${request.get('host')}/tour/${
//         tour.slug
//       }`,
//       customer_email: request.user.email,
//       client_reference_id: request.params.tourId,
//       line_items: [
//         {
//           name: `${tour.name} Tour`,
//           description: tour.summary,
//           images: [
//             `${request.protocol}://${request.get('host')}/img/tours/${
//               tour.imageCover
//             }`,
//           ],
//           amount: tour.price * 100,
//           // amount is usually in cents
//           currency: 'usd',
//           quantity: 1,
//         },
//       ],
//     });

//     response.status(200).json({
//       status: 'success',
//       session,
//     });
//   }
// );

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
