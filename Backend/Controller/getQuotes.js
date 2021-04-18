const httpStatus = require("http-status");
const axios = require("axios").default;
const {
  ResponseIds,
  DATABASE,
  URL,
  StringConstant,
} = require("../../Configs/constants.config");
const logger = require("../Logger/log");
const { format, isLoggedInUser } = require("./main_utils");
const { buildResponse, getEndMessage } = require("./response_utils");
const jp = require("jsonpath");
const session = require("express-session");
var db = require("../../Database/databaseOperations");

const DEFAULT_DATA = {
  defaultCategoryList: ["students"],
  defaultImgUrl: URL.defaultQuoteBGImg,
  defaultQuote: StringConstant.defaultQuote,
  defaultAuthor: StringConstant.defaultAuthor,
  defaultTitle: StringConstant.defaultTitle,
  defaultCredit: URL.defaultQuoteCreditUrl,
  defaultProfilePicture: URL.defaultProfilePictureUrl,
};

var UNKNOWN = "Unknown"

var getRandomCategory = async function () {
  var url = URL.defaultGETCategoryUrl;
  var categoryList = [];
  var defaultCategoryList = DEFAULT_DATA.defaultCategoryList;
  try {
    logger.info(`making external call to url: ${url}`)
    var data = await axios.get(url);
    logger.info(`response received from external service`)
    var result = data.data;
    var catListExpr = "$.contents.categories";
    var catList = jp.query(result, catListExpr);
    for (const category in catList[0]) {
      categoryList.push(category);
    }
    if (!categoryList.length) {
      categoryList = defaultCategoryList;
    }
    logger.info(`quote categories: ${JSON.stringify(categoryList)}`);
  } catch {
    categoryList = defaultCategoryList;
  }
  var categoryIdx = Math.floor(Math.random() * categoryList.length);
  return categoryList[categoryIdx];
};

var processQuoteResult = async function (result) {
  if (!Object.keys(result).length) {
    throw new Error("EMPTY_RESPONSE_FOUND");
  }
  var exprList = [
    { name: "quote", expr: "$.contents.quotes[0].quote" },
    { name: "author", expr: "$.contents.quotes[0].author" },
    { name: "title", expr: "$.contents.quotes[0].title" },
    { name: "imgUrl", expr: "$.contents.quotes[0].background" },
    { name: "credit", expr: "$.contents.quotes[0].permalink" },
  ];
  var res = {};
  for (const eachExpr of exprList) {
    var queryResult = jp.query(result, eachExpr.expr);
    res[eachExpr.name] = queryResult[0] || null;
  }
  res["author"] = res["author"] || UNKNOWN;
  return res;
};

/**
 * @httpMethod GET
 * @function getQuotes
 * @async
 * @description fetch random quotes from https://quotes.rest/
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getQuotes = async function (req, res) {
  req._initialTime = Date.now();
  logger.info("GET /getQuotes begins");
  try {
    var category = await getRandomCategory();
    logger.info(`category: ${category}`);
    var result = {};
    if (category != DEFAULT_DATA.defaultCategoryList[0]) {
      var url = `https://quotes.rest/qod?category=${category}&language=en`;
      logger.info(`making external call to url: ${url}`)
      var data = await axios.get(url);
      logger.info(`response received from external service`)
      result = data.data;
      result = await processQuoteResult(result);
    } else {
      result = {
        quote: DEFAULT_DATA.defaultQuote,
        author: DEFAULT_DATA.defaultAuthor,
        title: DEFAULT_DATA.defaultTitle,
        imgUrl: DEFAULT_DATA.defaultImgUrl,
        credit: DEFAULT_DATA.defaultCredit,
      };
    }
    var response = await buildResponse(
      result,
      format(ResponseIds.RI_006, ["quote", JSON.stringify(result)]),
      httpStatus.OK,
      "RI_006"
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.OK).send(response);
  } catch (ex) {
    logger.error(`Error in GET /getQuotes: ${ex}`);
    var response = await buildResponse(null, ex, httpStatus.BAD_GATEWAY);
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod GET
 * @function loadHomePage
 * @async
 * @description Renders the home page
 * @param {Object} req
 * @param {Object} res
 */
module.exports.loadHomePage = async function (req, res) {
  // Check if the session is valid
  var isUserSessionValid = await isLoggedInUser(req);
  if (isUserSessionValid) {
    logger.info(`Loading home page`);
    res.render("home");
  } else {
    res.redirect("/login");
  }
};

/**
 * @function getImageOfLoggedInUser
 * @async
 * @description Fetch the image base64 string and the name of the user
 * @param {String} loggedInUser user_id of logged-in user
 */
var getImageOfLoggedInUser = async function (loggedInUser) {
  try {
    var userData = await db.fetch(
      DATABASE.CUSTOMER,
      DATABASE.FETCH_SPECIFIC,
      "email",
      loggedInUser
    );
    return [userData[0].img_data, userData[0].name];
  } catch (ex) {
    throw ex;
  }
};

/**
 * @httpMethod GET
 * @function getProfilePicture
 * @async
 * @description Returns profile picture of logged-in user
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getProfilePicture = async function (req, res) {
  req._initialTime = Date.now();
  logger.info("GET /getProfilePicture begins");
  try {
    var [imgUrl, username] = await getImageOfLoggedInUser(req.session.user);
    if (!imgUrl) {
      var img_data = await axios.get(DEFAULT_DATA.defaultProfilePicture, {
        responseType: "arraybuffer",
      });
      var base64Uri = await Buffer.from(img_data.data, "binary").toString(
        "base64"
      );
      imgUrl = `data:image/png;base64, ${base64Uri}`;
    }
    var result = {
      name: username,
      url: imgUrl,
    };
    var response = await buildResponse(
      result,
      format(ResponseIds.RI_006, ["Img Data", imgUrl]),
      httpStatus.OK,
      "RI_006"
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.OK).send(response);
  } catch (ex) {
    logger.error(`Error in GET /getProfilePicture: ${ex}`);
    var response = await buildResponse(null, ex, httpStatus.BAD_GATEWAY);
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};
