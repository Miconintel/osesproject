const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });
// if an env variable is set manually before running the App, it ovewrites any other varible set by dotenv. when it sees a  variable with same name it skips it. simply because this variables are constant variables.

// using _dirname is important because it states the actual path to a file, despite which folder and file u want to refernce it from.
// this is beacuse the dot in referencing a file is talking abou the folder that is opened on vs code which the node app is running.
// so if the js file referencing other files is already sitted on the root folder which is he folder opened in vscode,
// it wont be much of a problem, since the dot is the root folder and the js file running is already there,
// but if the js file u want to run is inside a folder an u acces it on the command line by referencing it on the command
// that is referencing through the folder it is, u might assume that the dot is the direct parent folder and start
//  referencing other files/folder from there, this will cause an errror because the dot wont be talking about
//  the direct parent folder, but the root folder that is the folder opened in vs code the folder in the terminal
//  upon which the vs code is running.

// this error doesnt need to hit our error controller already because if it happens the App wont load the contents.

process.on('uncaughtException', (err) => {
  console.log('shutting down exception error');
  console.log(err.name, err.message);
  process.exit(1);
});
const app = require('./app');

// console.log(`${process.env.NODE_ENV} from server.js`);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// console.log(DB);
// this asynchronous code here is unhandled  in acse of rejection

mongoose.connect(DB).then((con) => {
  console.log('I am connected');
});

// const testTour = new Tour({
//   name: 'the forest',
//   rating: 4.7,
//   price: 497,
// });
// testTour
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => console.log(err));
// const testTour2 = new Tour({ name: 'the rain', rating: 3.5, price: 310 });
// testTour2
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => console.log(err));

// {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// }

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`I am listening from port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('unhandled error');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED SHUTTING DOWN');
  server.close(() => {
    console.log('process terminated');
  });
});
