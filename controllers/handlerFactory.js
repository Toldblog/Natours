const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeature');

const getCollectionName = (Model) => Model.collection.collectionName;

const getFilterObj = ({ paramName, foreignField }, req) => {
  if (req.params && req.params[paramName]) {
    const pName = req.params[paramName];
    return { [foreignField]: pName };
  }
  return {};
};

exports.getAll = (Model, options) =>
  catchAsync(async (req, res, next) => {
    // to allow for nested GET reviews on tour
    let filterObj = {};

    if (typeof options === 'object' && Object.keys(options).length) {
      filterObj = getFilterObj(options, req);
    }

    const feature = new APIFeatures(Model.find(filterObj), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    const doc = await feature.query.explain();

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: { [getCollectionName(Model)]: doc },
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions.join(' '));

    const doc = await query;

    if (!DOMException) {
      return next(
        new AppError(`No document found with ID: ${req.params.id}`, 404),
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: { [getCollectionName(Model)]: doc },
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: { [getCollectionName(Model)]: doc },
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(
        new AppError(`No document found with ID: ${req.params.id}`, 404),
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: { [getCollectionName(Model)]: doc },
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError(`No document found with ID: ${req.params.id}`, 404),
      );
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
