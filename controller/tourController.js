const exp = require('constants');
const res = require('express/lib/response');
const fs = require('fs');
const Tour = require('../models/tourModel.js');
const AppError = require('../utilities/appError.js');
const APIfeatures = require('../utilities/APIfeatures');
const catchAsync = require('../utilities/catchAsync');
const handlerFactory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

// const tours = JSON.parse(
//   fs.readFileSync(
//     `${__dirname}/../dev-data/data/tours-simple.json`,
//     `utf-8`
//   )
// );

// function 1 get all tours

// exports.checkId = (request, response, next, val) => {
//   console.log('checkId id' + ' ' + val);
//   if (request.params.id * 1 > tours.length) {
//     return response
//       .status(404)
//       .json({ status: 'failed', message: 'inalide Id' });
//   }
//   next();
// };

// exports.checkBody = (request, response, next) => {
//   if (!request.body.name || !request.body.price) {
//     return response
//       .status(400)
//       .json({ status: 'failed', message: 'the request must have price' });
//   }
//   next();
// };
const multerStorage = multer.memoryStorage();

const multerFilter = (request, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(
      new AppError('not an image please upload only images', 400),
      false
    );
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

// incase it was just one field and we are expecting many enteries, we would use the folowing below
//  upload.array('images', 3); request.files which is an object containing other named object, the named object is now arra of objects
// if its one we use the ne below
//  upload.single('images');uses request.file
exports.resizeTourImages = catchAsync(async (request, response, next) => {
  if (!request.files.imageCover || !request.files.images) return next();
  // for image cover
  request.body.imageCover = `tour-${
    request.params.id
  }-${Date.now()}-cover.jpeg`;

  // process.image
  await sharp(request.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`Public/img/tours/${request.body.imageCover}`);

  // images
  request.body.images = [];

  const newImagePromises = request.files.images.map(async (file, i) => {
    const filename = `tour-${request.params.id}-${Date.now()}-${
      i + 1
    }.jpeg`;
    await sharp(file.buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`Public/img/tours/${filename}`);

    request.body.images.push(filename);
  });

  await Promise.all(newImagePromises);
  next();
});

exports.aliasTop = (request, response, next) => {
  request.query.limit = '5';
  request.query.sort = '-rating,price';
  request.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// we use to catch the error on catch bok but now use catch async to handle errors so it canbe sent to the global error objet

exports.getAlltours = handlerFactory.getAll(Tour);

// exports.getAlltours = catchAsync(async (request, response, next) => {
//   // console.log(tours);

//   // console.log(request.query.limit);
//   // console.log(request.query);
//   // const tours = await Tour.find({ duration: 5, difficulty: 'easy' });
//   // const query =  Tour.find()
//   //   .where('duration')
//   //   .equals(5)
//   //   .where('difficulty')
//   //   .equals('easy');
//   // query easy
//   // const queryObj = { ...request.query };
//   // const excludefields = ['page', 'sort', 'limit', 'field'];
//   // excludefields.forEach((el) => delete queryObj[el]);

//   // // queryadvanced
//   // let queryString = JSON.stringify(queryObj);
//   // queryString = queryString.replace(
//   //   /\b(gte|gt|lte|lt)\b/g,
//   //   (match) => `$${match}`
//   // );

//   // sorting

//   // let query = Tour.find(JSON.parse(queryString));
//   const features = new APIfeatures(Tour.find(), request.query)
//     .filter()
//     .sort()
//     .fields()
//     .page();

//   // if (request.query.sort) {
//   //   const sortBy = request.query.sort.split(',').join(' ');
//   //   query = query.sort(sortBy);
//   //   console.log(sortBy);
//   // } else {
//   //   query = query.sort('-createdAt');
//   // }

//   // if (request.query.fields) {
//   //   const fieldsBy = request.query.fields.split(',').join(' ');
//   //   query = query.select(fieldsBy);
//   // } else {
//   //   query = query.select('-__v');
//   // }

//   // const page = request.query.page * 1 || 1;
//   // const limit = request.query.limit * 1 || 10;
//   // const skip = (page - 1) * limit;
//   // query = query.skip(skip).limit(limit);

//   // if (request.query.page) {
//   //   const numObj = Tour.countDocuments();
//   //   if (skip >= numObj)
//   //     throw new Error('the document is not upto that nuber');
//   // }

//   const tours = await features.query;
//   response.status(200).json({
//     status: 'success',
//     results: tours.length,
//     requestTime: request.requestTime,
//     data: { tours: tours },
//   });
// });

// ////////////////////////////////
// functions2

exports.getSingleTour = handlerFactory.getOne(Tour, { path: 'reviews' });
// exports.getSingleTour = catchAsync(async (request, response, next) => {
//   // console.log(request.params);

//   // const tour = tours.find((myTour) => {
//   //   return myTour.id === Number(id);
//   // });
//   // if (Number(id) > tours.length)
//   // if (!tour) return response.status(404).json({ status: 'failed' });

//   // /////////////
//   // console.log(tour);

//   const id = request.params.id;

//   const tour = await Tour.findById(id).populate('reviews');
//   if (!tour) {
//     return next(new AppError('sorry this tour doesnt not exist', 404));
//   }

//   response.status(200).json({
//     status: 'success',
//     data: { tour },
//   });
// });

// function 3
exports.postTour = handlerFactory.createOne(Tour);
// exports.postTour = catchAsync(async (request, response, next) => {
//   // console.log(request.body);
//   // const newId = tours[tours.length - 1].id + 1;
//   // const newTour = Object.assign({ id: newId }, request.body);
//   // tours.push(newTour);
//   // console.log(tours);
//   // const tourString = JSON.stringify(tours);
//   // fs.writeFile(
//   //   `${__dirname}/dev-data/data/tours-simple.json`,
//   //   tourString,
//   //   (err) => {
//   //     response
//   //       .status(200)
//   //       .json({ status: 'success', data: { tours: newTour } });
//   //   }
//   // );

//   // const newTour = new Tour({});
//   const newTour = await Tour.create(request.body);

//   response
//     .status(201)
//     .json({ status: 'success', data: { tour: newTour } });
// });

// ////////
// function 4 patch

exports.patchTour = handlerFactory.updateOne(Tour);
// exports.patchTour = catchAsync(async (request, response, next) => {
//   // if (request.params.id * 1 > tours.length)
//   //   return response.status(404).json({ status: 'failed' });
//   // const newTours = tours.map((tour) => {
//   //   if (request.params.id * 1 === tour.id)
//   //     tour.duration = request.body.duration;
//   //   return tour;
//   // });
//   // console.log(newTours);

//   // fs.writeFile(
//   //   `${__dirname}/dev-data/data/tours-simple.json`,
//   //   JSON.stringify(newTours),
//   //   (err) => {
//   //     response
//   //       .status(200)
//   //       .json({ status: 'success', data: { tours: request.body } });
//   //   }
//   // );
//   // response.status(200).json({
//   //   status: 'sucess',
//   //   data: {
//   //     tours: newTour,
//   //   },
//   // });

//   const tour = await Tour.findByIdAndUpdate(
//     request.params.id,
//     request.body,
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   if (!tour) {
//     return next(new AppError('sorry this tour doesnt not exist', 404));
//   }
//   response.status(200).json({ status: 'success', data: { tour } });
// });

// function 5

exports.deleteTour = handlerFactory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (request, response, next) => {
//   const tour = await Tour.findByIdAndDelete(request.params.id);
//   if (!tour) {
//     return next(new AppError('sorry this tour doesnt not exist', 404));
//   }
//   response.status(204).json({
//     status: 'sucess',
//     data: { tour },
//   });
// });

exports.getTourStats = catchAsync(async (request, response, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },

    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },

    {
      $sort: {
        avgPrice: 1,
      },
    },

    // {
    //   $match: {
    //     _id: { $ne: 'EASY' },
    //   },
    // },
  ]);

  response.status(200).json({ status: 'success', data: { stats } });
});
exports.getMonthlyPlan = catchAsync(async (request, response, next) => {
  const year = request.params.id;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $gte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStats: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },

    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStats: -1,
      },
    },

    {
      $limit: 12,
    },
  ]);

  response.status(200).json({ status: 'success', data: { plan } });
});
exports.getToursWithin = catchAsync(async (request, response, next) => {
  const { distance, latlng, unit } = request.params;

  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    next(new AppError('please provide latitude and longity'), 200);
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  response.status(200).json({
    status: 'success',
    result: tours.length,
    data: { tours },
  });
});
exports.getDistances = catchAsync(async (request, response, next) => {
  const { latlng, unit } = request.params;

  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(new AppError('please provide latitude and longity'), 200);
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: { distance: 1, name: 1 },
    },
  ]);

  response.status(200).json({
    status: 'success',

    data: { distances },
  });
});
