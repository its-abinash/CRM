const jwt = require("jsonwebtoken");
const logger = require("../Logger/log")

module.exports.decodeJwt = async function (AppRes) {
  try {
    var accessToken = AppRes.getAccessToken();
    var decodedToken = await jwt.verify(accessToken, process.env.JWT_SECRET);
    return !decodedToken ? null : decodedToken.id;
  } catch (ex) {
    logger.error(`Exception in decodeJWT: ${ex}`);
    return null;
  }
};
