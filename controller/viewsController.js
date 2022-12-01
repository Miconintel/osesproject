const Review = require('../models/reviewModel');
const AppError = require('../utilities/appError');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/userModel');
const Food = require('../models/foodModel');
const { filter } = require('compression');

exports.base = catchAsync(async (request, response, next) => {
  const pageThatControlsHero = request.query.page;
  const category = request.query.category;
  const product = request.query.productName;
  const filterObj = ['page'];
  const queryObj = { ...request.query };
  filterObj.forEach((element) => {
    delete queryObj[element];
  });
  const rpage = request.query.page * 1;
  const page = rpage || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  console.log(category);
  console.log(product);
  const allFoods =
    category || product ? await Food.find(queryObj) : await Food.find();
  console.log(allFoods);
  // here I check if there is category or product in the query, if any join using itenary it to find the food using category or product
  // if category is undefined and the product is defined, it runs the food.find with query.
  // else if both return undefined it finds all food.

  // const allFoods = category || product ? await Food.find({category:category}): await Food.find()

  let foodPage = category || product ? Food.find(queryObj) : Food.find();
  foodPage = await foodPage.skip(skip).limit(limit);
  // here I got the product query from the DOm so as to ascertain titile
  const allP = request.query.product;
  const checkCategory = category || allP;
  const title = checkCategory ? checkCategory : 'Home Page';
  response.status(200).render('overView', {
    currentPage: page,
    pageLimit: limit,
    foodsLength: allFoods.length,
    pageLength: foodPage.length,
    foods: foodPage,
    title,
    category,
    pageThatControlsHero,
  });
});

exports.getProduct = catchAsync(async (request, response, next) => {
  let page = request.query.page;
  // console.log(page)
  let p = request.params.name;
  const [food] = await Food.find({ slug: p });
  //  console.log(food)
  response.status(200).render('product', {
    currentPage: page,
    food,
    title: [food.category, food.slug],
  });
});
exports.signup = (request, response, next) => {
  response.status(200).render('signup', {
    title: 'signup',
  });
};
exports.login = (request, response, next) => {
  response.status(200).render('login', {
    title: 'login',
  });
};
exports.getAccount = (request, response) => {
  response.status(200).render('account', {
    title: 'your Account',
  });
};
exports.updateUserData = async (request, response) => {
  const updatedUser = await User.findByIdAndUpdate(
    request.user.id,
    {
      name: request.body.name,
      email: request.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  // this new is to return new user after update

  response.status(200).render('account', {
    title: 'your Account',
    user: updatedUser,
  });
};

exports.getMyTours = catchAsync(async (request, response, next) => {
  const user = await User.findById(request.user.id).populate('bookings');
  const tours = user.bookings.map((book) => book.parentTour);
  // remove duplicatetours
  const setTours = [...new Set(tours)];

  response.status(200).render('mainOverview', {
    title: 'My tours',
    tours: setTours,
  });
});
exports.alerts = (request, response, next) => {
  const { alert } = request.query;
  if (alert === 'booking')
    response.locals.alert = 'your booking was succesful';
  next();
};

// base not useful
// exports.getOverview = catchAsync(async (requsest, response, next) => {
//   // get tours=

//   const tours = await Tour.find();
//   response.status(200).render('mainOverview', {
//     title: 'All tours',
//     tours,
//   });
// });
// exports.getTour = catchAsync(async (request, response, next) => {
//   // get the dta for the requested tour

//   const tour = await Tour.findOne({ slug: request.params.slug }).populate({
//     path: 'reviews',
//   });
//   if (!tour) {
//     return next(
//       new AppError('sorry this tour doesnt not exist at all', 404)
//     );
//   }

//   response.status(200).render('tour', {
//     title: `${tour.name} Tour`,
//     tour,
//   });
// });
