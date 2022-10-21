// const fs = require('fs');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const AppError = require('./utilities/appError');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const tourRouter = require('./routers/tourRouter');
const foodRouter = require('./routers/foodRouter');
const userRouter = require('./routers/userRouter');
const reviewRouter = require('./routers/reviewRouter');
const errorController = require('./controller/errorController');
const viewRouter = require('./routers/viewRouter');
const bookingRouter = require('./routers/bookingRouter');
const checkoutRouter = require('./routers/checkoutRouter');
const bodyParser = require('body-parser');
//
const { webhookCheckout } = require('./controller/bookingController');
// const res = require('express/lib/response');
// const { request } = require('http');

/* BASICALLY EXPRESS JS IS A FRAMEWORK THAT USES ASYNCHRONOUS MEANS TO RUN CODES WHEN YO CREATE AN APP, U CREATE AN APP OBJECT,
U STILL RUN METHODS THAT HAPPEN ASYNCHRONOUSLY.*/

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// serving static file
app.use(express.static(path.join(__dirname, 'public')));

// enable CORS

app.use(cors());

// allow non simple request

app.options('*', cors());
// parsing directly from form
app.use(
  express.urlencoded({
    extended: true,
    limit: '50kb',
  })
);
app.use(cookieParser());

// MIDDLE WARES

// set security http header
app.use('/api', helmet());

//
// console.log(process.env.SENDGRID_PASSWORD);
// evelopment loggig
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

//rate limiing
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many request from this IP check again after one hour',
});
app.use('/api', limiter);

// we need this before the body parser
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

// body parser reading data into req.body
app.use(
  express.json({
    limit: '50kb',
  })
);
// data sanitization against nosql query injection
app.use(mongoSanitize());

// data sanitizaton aginst xssi
app.use(xss());

// prevent parameter pollution

app.use(
  hpp({
    whitelist: [
      'duration',
      'average',
      'difficlty',
      'price',
      'ratingsAverage',
      'ratingQuantity',
      'maxGroupSize',
    ],
  })
);

app.use(compression());
// /////

// test midlewear 1
app.use((request, response, next) => {
  console.log('hello from middle wear');

  next();
});
// ////

// test middlewear 2
app.use((request, response, next) => {
  request.requestTime = new Date().toISOString();
  next();
});

// app.get('/', (req, res) => {
//   res.status(200).json({ hello: 'info' });
// });
// app.post('/', (req, res) => {
//   res.status(200).send('you just sent a request');
// });

// //////////////////////////
// //////////////////////
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, `utf-8`)
// );
// // function 1 get all tours

// const getAlltours = (request, response) => {
//   console.log(tours);
//   response.status(200).json({
//     status: 'success',
//     results: tours.length,
//     requestTime: request.requestTime,
//     data: { tours: tours },
//   });
// };

// // ////////////////////////////////
// // functions2
// const getSingleTour = (request, response) => {
//   console.log(request.params);
//   const { id } = request.params;
//   const tour = tours.find((myTour) => {
//     return myTour.id === Number(id);
//   });
//   // if (Number(id) > tours.length)
//   if (!tour) return response.status(404).json({ status: 'failed' });

//   // /////////////
//   console.log(tour);
//   response.status(200).json({
//     status: 'success',
//     data: { tour },
//   });
// };

// // function 3
// const postTour = (request, response) => {
//   // console.log(request.body);
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, request.body);
//   tours.push(newTour);
//   console.log(tours);
//   const tourString = JSON.stringify(tours);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     tourString,
//     (err) => {
//       response
//         .status(200)
//         .json({ status: 'success', data: { tours: newTour } });
//     }
//   );
// };

// // ////////
// // function 4 patch
// const patchTour = (request, response) => {
//   if (request.params.id * 1 > tours.length)
//     return response.status(404).json({ status: 'failed' });
//   const newTours = tours.map((tour) => {
//     if (request.params.id * 1 === tour.id)
//       tour.duration = request.body.duration;
//     return tour;
//   });
//   console.log(newTours);

//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(newTours),
//     (err) => {
//       response
//         .status(200)
//         .json({ status: 'success', data: { tours: request.body } });
//     }
//   );
//   // response.status(200).json({
//   //   status: 'sucess',
//   //   data: {
//   //     tours: newTour,
//   //   },
//   // });
// };

// // function 5
// const deleteTour = (request, response) => {
//   if (request.params.id * 1 > tours.length) {
//     return response
//       .status(404)
//       .json({ status: 'failed', message: 'inalide Id' });
//   }

//   response.status(204).json({
//     status: 'sucess',
//     data: null,
//   });
// };

// const getAllUsers = (request, response) => {
//   response
//     .status(500)
//     .json({ status: 'error', message: 'this route is not yet defined' });
// };
// const createUser = (request, response) => {
//   response
//     .status(500)
//     .json({ status: 'error', message: 'this route is not yet defined' });
// };
// const getSingleUser = (request, response) => {
//   response
//     .status(500)
//     .json({ status: 'error', message: 'this route is not yet defined' });
// };
// const UpdateUser = (request, response) => {
//   response
//     .status(500)
//     .json({ status: 'error', message: 'this route is not yet defined' });
// };
// const deleteUser = (request, response) => {
//   response
//     .status(500)
//     .json({ status: 'error', message: 'this route is not yet defined' });
// };

// CRUD

// app.get('/api/v1/tours', getAlltours);

// app.post('/api/v1/tours', postTour);

// app.get('/api/v1/tours/:id', getSingleTour);

// app.patch('/api/v1/tours/:id', patchTour);

// app.delete('/api/v1/tours/:id', deleteTour);

// apptour
// TOUR ROUTE

// const tourRouter = express.Router();
// const userRouter = express.Router();

// tourRouter.route('/').get(getAlltours).post(postTour);
// tourRouter
//   .route('/:id')
//   .get(getSingleTour)
//   .patch(patchTour)
//   .delete(deleteTour);

// USER ROUTE

// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter
//   .route('/:id')
//   .get(getSingleUser)
//   .patch(UpdateUser)
//   .delete(deleteUser);

// render html
/*
 ROUTERS ARE MIDDLEWEARS ALSO CALLBACKS THAT WHEN EXECUTED ON USE, TAKES THE END POINT, MOUNTING TEM ON ITSELF AND PERFORS
THE ROUTE.GET.PATCH FUNCTIONS, 
that now calls the controller. BEFORE THE ACTUAL CONTROLLER FUNCTION THAT TAKES THE ENDPOINT AND MOUNTS IT ON A NEW ROUTE, 
THIS ROUTE IS THEN USING THE 
ENDPOINT AS ITS BASEPOINT TO CALL THE CALLBACKFUNCTION OR MIDDLWEAR-CALLBACK-FUNCTION CONTROLLER
WHICH NOW PERFORMS THE ACTION THAT HAS BEEN CODED INTO IT*/

app.use('/', viewRouter);
//
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/foods', foodRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/checkout-session', checkoutRouter);
app.all('*', (request, response, next) => {
  // here we send it directly from the middle wear
  // response.status(404).json({
  //   status: 'failed',
  //   message: `the page ${request.originalUrl} cannot be found`,
  // });

  // here you can send the error to the errror middlewear by cretaing an error object
  // const err = new Error(`cannot find the ${request.originalUrl}`);
  // err.statusCode = 404;
  // err.status = 'fail';

  next(new AppError(`cannot find the ${request.originalUrl}`, 404));
});
app.use(errorController);
// listening

module.exports = app;
