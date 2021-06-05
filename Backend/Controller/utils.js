const jwt = require("jsonwebtoken");
const logger = require("../Logger/log")

module.exports.decodeJwt = async function (request) {
  try {
    var decodedToken = "";
    var accessToken = request.headers["x-access-token"];
    jwt.verify(accessToken, process.env.JWT_SECRET, function (err, decodedJwt) {
      if (err) {
        decodedToken = null;
      } else {
        decodedToken = decodedJwt;
      }
    });
    return !decodedToken ? null : decodedToken.id;
  } catch (ex) {
    throw ex;
  }
};
