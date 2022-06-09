const mongoose = require('mongoose');
const slugify = require('slugify');
const validatorReq = require('validator');

const foodSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'a food must have a name'],
      unique: true,
    },
    category: {
      type: String,
      required: [true, 'a food must be under a category'],
    },

    price: {
      type: Number,
      required: [true, 'a food must have price'],
    },
    newPrice: Number,

    weight: {
      type: String,
    },

    slug: String,

    cart: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Cart',
      },
    ],

    relatedItems: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
    },

    image: String,
    discount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    hasDiscount: {
      type: Number,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

foodSchema.pre('save', function (next) {
  this.slug = slugify(this.productName, { lower: true });
  next();
});
foodSchema.pre('save', function (next, doc) {
  if (this.hasDiscount) {
    this.discount = ((this.hasDiscount * 1) / 100) * this.price * 1;
    this.newPrice = this.price * 1 - this.discount * 1;
  }
  next();
});

const Food = new mongoose.model('Food', foodSchema);
module.exports = Food;
