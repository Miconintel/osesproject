const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');
const Food = require('./../../models/foodModel');

dotenv.config({ path: `./config.env` });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then((con) => {
  console.log('I am connected');
});

const food = JSON.parse(
  fs.readFileSync(`${__dirname}/foodData.json`, 'utf-8')
);

const importFoodOnly = async () => {
  try {
    await Food.create(food);
    console.log('success imp');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
//
const deleteFoodOnly = async () => {
  try {
    await Food.deleteMany();
    console.log('success del');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//

if (process.argv[2] === '--import-food') {
  importFoodOnly();
} else if (process.argv[2] === '--delete-food') {
  deleteFoodOnly();
}

//
//
//
//
//
//
const tour = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);
const user = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);
const review = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const importTourOnly = async () => {
  try {
    await Tour.create(tour);
    console.log('success imp');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteTourOnly = async () => {
  try {
    await Tour.deleteMany();
    console.log('success del');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const importDBItems = async () => {
  try {
    await Tour.create(tour);
    console.log('success imp');
    await User.create(user, { validateBeforeSave: false });
    console.log('success imp');
    await Review.create(review);
    console.log('success imp');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const deleteDBItems = async () => {
  try {
    await Tour.deleteMany();
    console.log('success del');
    await User.deleteMany();
    console.log('success del');
    await Review.deleteMany();
    console.log('success del');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importDBItems();
} else if (process.argv[2] === '--delete') {
  deleteDBItems();
}
if (process.argv[2] === '--import-tour') {
  importTourOnly();
} else if (process.argv[2] === '--delete-tour') {
  deleteTourOnly();
}

// {
//   "eslint": " eslint eslint-config-airbnb eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-node eslint-plugin-prettier eslint-plugin-react prettier  "
// }
