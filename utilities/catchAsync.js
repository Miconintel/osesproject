module.exports = (fn) => {
  return function (request, response, next) {
    // this is like callinf the async function passed into the catch async function which inturn returns a proise that the error can now be cauht and sent in the next
    fn(request, response, next).catch(next);
  };
};
