const jwt = require("jsonwebtoken");

module.exports.decodeJwt = async function (AppRes) {
  try {
    var accessToken = AppRes.getAccessToken();
    var decodedToken = await jwt.verify(accessToken, process.env.JWT_SECRET);
    return !decodedToken ? null : decodedToken.id;
  } catch (ex) {
    throw ex;
  }
};
