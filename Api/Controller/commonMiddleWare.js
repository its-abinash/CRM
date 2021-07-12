module.exports.setHeaderElements = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
};
