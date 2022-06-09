const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const handlerFactory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');

// setting upmulter to upload image
// here we are saving in a disk, but then we can save it in memory and read it afterwards to resize it
// const multerStorage = multer.diskStorage({
//   destination: (request, file, callback) => {
//     callback(null, 'public/img/users');
//   },
//   filename: (request, file, callback) => {
//     const ext = file.mimetype.split('/')[1];
//     callback(null, `users-${request.user.id}-${Date.now()}.${ext}`);
//   },
// });

// HERE WE STORE THE IMAGE IN A BUFFER WAITING TO READ
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
exports.uploadUserPhoto = upload.single('photo');
// the 'photo' argument is the name of the field the multer middleweaer is expecting to have, so any field having the data must have the name photo
exports.resizeUserPhoto = catchAsync(async (request, response, next) => {
  if (!request.file) return next();
  request.file.filename = `users-${request.user.id}-${Date.now()}.jpeg`;
  await sharp(request.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`Public/img/users/${request.file.filename}`);
  next();
});

// get all users
exports.getAllUsers = handlerFactory.getAll(User);
// exports.getAllUsers = catchAsync(async (request, response, next) => {
//   const users = await User.find();
//   response.status(200).json({
//     status: 'success',
//     message: 'user gotten',
//     data: { users },
//   });
// });
exports.createUser = catchAsync(async (request, response, next) => {
  // you can only sign up
  // User.create({
  //   name: 'Chinaza',
  //   email: 'amdichrist4love@gmail.com',
  //   password: '12345',
  // }).then((user) => {
  //   response.status(500).json({
  //     status: 'success',
  //     data: { users: user },
  //   });
  // });

  response.status(500).json({
    status: 'error',
    message: 'this route is not yet defined use sig up',
  });
});
// exports.createUser = handlerFactory.createOne(User);

exports.updateMe = catchAsync(async (request, response, next) => {
  // check if user trying to update password.

  if (request.body.password || request.body.passwordConfirmed) {
    return next(
      new AppError('please this route is not for password update', 400)
    );
  }

  // update user.

  const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) {
        // this is the other way of getting values or setting values of object, if the key to be gotten is stored in a variable eg el= 'name' and u want to reference an object that as name as one of its keys , because name is stored in te variable el u have to now use block brackets to access the key via the variable storing it eg insted of obj.name u vanse say obj[el], because el is a variable that has its object as name

        newObj[el] = obj[el];
      }
    });
    return newObj;
  };

  // calling te obj to get the returned object
  const filteredBody = filterObj(request.body, 'name', 'email');
  if (request.file) filteredBody.photo = request.file.filename;
  const { name, email } = filteredBody;

  // always remember the or operator runs with the first true

  if (!name && !email && !photo) {
    return next(
      new AppError(
        'wrong route, this endpoint requires email and name and not password',
        401
      )
    );
  }

  const updatedUser = await User.findByIdAndUpdate(
    request.user.id,
    filteredBody,
    {
      new: true,
      // this returned the newobject updated with new data and not the old one
      runValidators: true,
    }
  );
  response.status(200).json({
    status: 'success',
    message: 'user info updated ',
    data: { user: updatedUser },
  });
});

exports.deleteMe = catchAsync(async (request, response, next) => {
  await User.findByIdAndUpdate(request.user, { active: false });

  response.status(204).json({
    status: 'sucsess',
    message: 'user deleted succesfuly',
    data: null,
  });
});

// get usr
//
exports.getMe = (request, response, next) => {
  request.params.id = request.user.id;
  next();
};
exports.getSingleUser = handlerFactory.getOne(User);
//  use sign in instead

//
exports.updateUser = handlerFactory.updateOne(User);
// exports.UpdateUser = (request, response) => {
//   response
//     .status(500)
//     .json({ status: 'error', message: 'this route is not yet defined' });
// };

// fnc 5
// exports.deleteUser = (request, response) => {
//   response
//     .status(500)
//     .json({ status: 'error', message: 'this route is not yet defined' });
// };
exports.deleteUser = handlerFactory.deleteOne(User);
