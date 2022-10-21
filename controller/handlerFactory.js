const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const APIfeatures = require('../utilities/APIfeatures');

exports.deleteOne = (model) =>
  catchAsync(async (request, response, next) => {
    const doc = await model.findByIdAndDelete(request.params.id);
    if (!doc) {
      return next(new AppError('sorry this tour doesnt not exist', 404));
    }
    response.status(204).json({
      status: 'sucess',
      data: null,
    });
  });

exports.createOne = (model) =>
  catchAsync(async (request, response, next) => {
    const doc = await model.create(request.body);

    response.status(201).json({ status: 'success', data: { data: doc } });
  });

exports.updateOne = (model) =>
  catchAsync(async (request, response, next) => {
    const doc = await model.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doc) {
      return next(new AppError('sorry this tour doesnt not exist', 404));
    }
    response.status(200).json({ status: 'success', data: { data: doc } });
  });

exports.getOne = (model, PopulateOpt) =>
  catchAsync(async (request, response, next) => {
    // const id = request.params.id;
    let query = model.findById(request.params.id);
    if (PopulateOpt) query = query.populate(PopulateOpt);
    console.log(query);

    const doc = await query;
    if (!doc) {
      return next(new AppError('sorry this tour doesnt not exist', 404));
    }

    response.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });
exports.getAll = (model) =>
  catchAsync(async (request, response, next) => {
    // hack
    let filter = {};
    if (request.params.tourId) filter = { parentTour: request.params.id };

    const features = new APIfeatures(model.find(filter), request.query)
      .filter()
      .sort()
      .fields()
      .page();
    // the features object has a property of query as assigned in its class.
    // and also returns this.when the functions are done.
    // then
    const docs = await features.query;
    // const docs = await features.query.explain() this furher explains the returned query
    response.status(200).json({
      status: 'success',
      results: docs.length,
      requestTime: request.requestTime,
      data: { model: docs },
    });
  });
