const mongoose = require('mongoose');
const slugify = require('slugify');
const validatorReq = require('validator');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a tour must be a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'a tour name must have <= 40 chr'],
      minlength: [10, 'a tour name musthave > 10  chr'],
      // validate: [
      //   validatorReq.isAlpha,
      //   'tour name must contain characters',
      // ],
    },
    duration: {
      type: Number,
      required: [true, 'a tour must be a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must be have price'],
    },
    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'must have medium easy and difficult',
      },
      required: [true, 'a tour must be have price'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must be above 1'],
      max: [5, 'rating must be less thn oe eual 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'a tour must be have price'] },
    priceDiscount: {
      Type: Number,
      // validate: {
      //   validator: function (val) {
      //     // this only points to current doc on NEW document creation
      //     return val < this.price;
      //   },
      //   message: 'Discount price ({VALUE}) should be below regular price',
      // },

      // validate: {
      //   validator: function (val) {
      //     // this keyword doesnt work with updtate
      //     return val < this.price;
      //   },
      // },
    },

    summary: {
      type: String,
      trim: true,
      required: [true, 'a tour must be have summary check again'],
    },
    description: {
      type: String,
      trim: true,
    },
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
    imageCover: {
      type: String,
      required: [true, 'a tour must have image cover'],
    },
    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
      // select: false,
    },

    startDates: [Date],
    /**because type is a reserved keyword in mongoose
 * when you want to nest another object as one of the properties
 * of your schema but u want the object to have a property called type,
 * you have to work areoud it this way
 * location :{ type:{type:string,enum:['sing'], location
 * }
 * this is saying that location has a property name type, and that
 * type is not defining the type of location but is a type, and its type of type
 * is a string , means a type that will be a property provided by someone and
 * which will be a of type text.
 
 * }
 */
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    // startLocation: {
    //   // GeoJSON
    //   type: {
    //     type: String,
    //     default: 'Point',
    //     enum: ['Point'],
    //   },
    //   coordinates: [Number],
    //   address: String,
    //   description: String,
    // },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],

    // guides: Array, for using embeding
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// so this virtual populate is use to set the reviews property on the tour with the id of the review, just like it would have been done manually

tourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'parentTour',
  // in a nut shell, the virtual is populated with document in ref, whose foreign field matches local field, eg the local field is the number of the document and in foreign fiels, the same number is stored in the field called parentTour, so that way the document is populated

  // in the foreign module,that is the review model, the object is called tour and refrenced with a number in the local field, the same number is in the key of id in
});

// tourSchema.index({ price: 1 });
// tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
tourSchema.pre('save', function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre('save', async function (next) {
//   const guides = this.guides.map(async (el) => await User.findById(el));
//   //  now note that guide is an array of promises and not just the variables because the map function returns a promise,
//   // this is because the map function houses the async function is collecting a returned data and whenenver an Async function returns something , its stil a promise.
//   this.guides = await Promise.all(guides);
//   next();
// });
tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find',function) doesnt work for find 1 all query middle wears return a query and not an object
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find',function) doesnt work for find 1
  this.populate({
    path: 'guides',
    select: '-_v -passwordChangedAt',
  });
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  // tourSchema.pre('find',function) doesnt work for find 1
  console.log(`query took ${Date.now() - this.start} milliseconds`);
  // console.log(doc);
  next();
});
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline.unshift({
//     $match: { secretTour: { $ne: true } },
//   });
//   next();
// });

// we  can use thhis fr find one
// tourSchema.pre('findOne', function (next) {
//   this.find({ secretTour: { $ne: true } });
//   console.log(doc);
//   next();
// });
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
