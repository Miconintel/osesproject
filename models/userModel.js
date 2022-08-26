const crypto = require('crypto');
const mongoose = require('mongoose');
const validatorM = require('validator');
const bcrypt = require('bcryptjs');
const Booking = require('./../models/bookingModel');

const userSchema = mongoose.Schema(
  {
    firstname: { type: String, required: [true, 'must have a name'] },
    email: {
      type: String,
      required: [true, 'must have email'],
      unique: [true, 'user already exists'],
      lowercase: true,
      validate: [validatorM.isEmail, 'please provide a valid email'],
    },
    lastname: { type: String, required: [true, 'must have a name'] },
    // email: {
    //   type: String,
    //   required: [true, 'must have email'],
    //   unique: [true, 'user already exists'],
    //   lowercase: true,
    //   validate: [validatorM.isEmail, 'please provide a valid email'],
    // },
    role: {
      type: String,
      enum: ['user', 'admin', 'manager', 'lead-guide', 'guide'],
      default: 'user',
    },
    photo: { type: String, default: 'default.jpg' },
    password: {
      type: String,
      required: [true, 'please input password'],
      minlength: 8,
      select: false,
    },
    passwordConfirmed: {
      type: String,
      required: [true, 'please conform password'],
      validate: {
        validator: function (currEl) {
          return currEl === this.password;
        },
        message: 'please your password does not match',
      },
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: { type: Boolean, default: true, select: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'parentUser',
  // in a nut shell, the virtual is populated with document in ref, whose foreign field matches local field, eg the local field is the number of the document and in foreign fiels, the same number is stored in the field called parentTour, so that way the document is populated

  // in the foreign module,that is the review model, the object is called tour and refrenced with a number in the local field, the same number is in the key of id in
});

userSchema.pre('save', async function (next) {
  // you have to check this if block incase u want to make any other changes on the othre options rather than the password
  if (!this.isModified('password')) return next();

  // encrypt password
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirmed = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  // this is to change the time password was changed only for objects that re not new
  if (!this.isModified('password') || this.isNew) return next();

  // encrypt password
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// userSchema.pre(/^find/, async function (next) {
//   // encrypt password
//   await Booking.find();
//   next();
// });

userSchema.pre(/^find/, function (next) {
  // this query middle ear further uses .returned query to find dcument with active true, and before now sending the found document
  // console.log(this);
  this.find({ active: { $ne: false } });
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.createPasswordReset = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
