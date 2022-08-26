const { promisify } = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utilities/appError');
const Email = require('../utilities/newEmail');

// CONTROLLERS HAS ACCES TO INFOS COMING FROM THE ROUTE BEING ACCESE, ON THE BODY, COOKIES, ORIGINAL URL, OR PARAMETERS params, ueries SPECIFIED ON THE ROUTE

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const getAndSendToken = (user, status, response) => {
  const token = signToken(user.id);

  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    // secure: true, used the if statememnt to set it
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOption.secure = true;
  }
  response.cookie('jwt', token, cookieOption);

  user.password = undefined;

  response.status(status).json({
    status: 'success',
    token,
    data: { user },
  });
};

exports.signUp = catchAsync(async (request, response, next) => {
  //  this is flawed because we need to make sure the user wont login as admin
  const newUser = await User.create(request.body);

  const url = `${request.protocol}://${request.get('host')}/`;

  // await new Email(newUser, url).sendWelcome();

  getAndSendToken(newUser, 201, response);
});
exports.login = catchAsync(async (request, response, next) => {
  const { email, password } = request.body;
  // check email and password

  if (!email || !password) {
    next(new AppError('please put email and password', 400));
  }

  // check if user exist and password is correct we use select because password select is off
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password', 401));
  }

  getAndSendToken(user, 200, response);
});

exports.logout = (request, response, next) => {
  response.cookie('jwt', 'logged out', {
    // this is 10seconds
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  response.status(200).json({
    status: 'success',
  });
};

exports.protect = catchAsync(async (request, response, next) => {
  // check if token is there
  let token;
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith('Bearer')
  ) {
    token = request.headers.authorization.split(' ')[1];
  } else if (request.cookies.jwt) {
    token = request.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('sorry login to continue', 401));
  }
  // verification token

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // check if user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('this user no longer exists', 401));
  }

  // check if user recently changed pasword

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'user recently changed password please login again',
        401
      )
    );
  }

  // grant acess the protetive route
  // the reason we also added response here is because when one does something that requires just protect, the pug will still have access to this eh submit user data and me route on view
  response.locals.user = currentUser;
  request.user = currentUser;
  next();
});

// check if logged in

exports.isLoggedIn = async (request, response, next) => {
  // check if token is there
  try {
    if (request.cookies.jwt) {
      const decoded = await promisify(jwt.verify)(
        request.cookies.jwt,
        process.env.JWT_SECRET
      );

      // check if user exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // check if user recently changed pasword

      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // grant acess the protetive route because there is a logged in user
      response.locals.user = currentUser;
      return next();
    }
    next();
  } catch (err) {
    next();
  }
};

// authorize admin
exports.authorizeAdmin = (...roles) => {
  return (request, response, next) => {
    if (!roles.includes(request.user.role)) {
      return next(
        new AppError('please you are not authorized to do this', 403)
      );
    }
    next();
  };
};
exports.forgotPassword = catchAsync(async (request, response, next) => {
  const { email } = request.body;
  // check if user exist
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(
      new AppError('there is no user with that email adress', 404)
    );
  }

  // generate reset token
  const resetToken = user.createPasswordReset();
  //this is very important to save the modified fields/keys on your database. when u modify in a code and the key is on schema, u will only see it on the variable that the object is stored inside of your code and function and not your database
  await user.save({ validateBeforeSave: false });

  // send it to user
  const url = `${request.protocol}://${request.get(
    'host'
  )}/ap1/v1/users/reset-password/${resetToken}`;
  console.log(user, url);

  try {
    await new Email(user, url).sendPasswordReset();

    response.status(200).json({
      status: 'success',
      message: 'token sent to mail',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(err.message, 500));
  }
});
exports.resetPassword = catchAsync(async (request, response, next) => {
  // get user based on toke
  const hashedToken = crypto
    .createHash('sha256')
    .update(request.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // if password has not expired

  if (!user) {
    return next(new AppError('token has expired or is invalid', 400));
  }
  user.password = request.body.password;
  user.passwordConfirmed = request.body.passwordConfirmed;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // dont put the save and false
  await user.save();
  // update changed passwrd at property

  getAndSendToken(user, 200, response);
});

exports.updatePassword = catchAsync(async (request, response, next) => {
  // for anytime soneone wants to acces a route run the protct middle ware function to get to confirm user exist and now use the request.user to store user properties
  // get the user
  const { currentPassword, newPassword, confirmNewPassword } =
    request.body;

  const user = await User.findById(request.user.id).select('+password');

  // check if password iscorrect
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(
      new AppError('sorry your password does not match from update')
    );
  }
  // update the password
  user.password = newPassword;
  user.passwordConfirmed = confirmNewPassword;
  await user.save();

  getAndSendToken(user, 200, response);
});
