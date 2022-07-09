class APIfeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludefields = ['page', 'sort', 'limit', 'field'];
    excludefields.forEach((el) => delete queryObj[el]);

    // queryadvanced
    let queryString = JSON.stringify(queryObj);
    // the second argument on replace is a callback function that has access to the matched stsring found, and whatever the function returns is used to replace what is oud
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      // console.log(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  fields() {
    if (this.queryStr.fields) {
      const fieldsBy = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fieldsBy);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  page() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    if (this.queryStr.page) {
      const numObj = Tour.countDocuments();
      if (skip >= numObj)
        throw new Error('the document is not upto that nuber');
    }
    return this;
  }
}

module.exports = APIfeatures;
