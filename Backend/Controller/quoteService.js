const { buildResponse, getEndMessage } = require("./response_utils");
const { ResponseIds, StringConstant, URL } = require("../../Configs/constants.config");
const httpStatus = require("http-status");
const axios = require("axios").default;
const jp = require("jsonpath");
var logger = require("../Logger/log");
const { format } = require("./main_utils");

const DEFAULT_DATA = {
  defaultCategoryList: ["students"],
  defaultImgUrl: URL.defaultQuoteBGImg,
  defaultQuote: StringConstant.defaultQuote,
  defaultAuthor: StringConstant.defaultAuthor,
  defaultTitle: StringConstant.defaultTitle,
  defaultCredit: URL.defaultQuoteCreditUrl,
  defaultProfilePicture: URL.defaultProfilePictureUrl,
};

const UNKNOWN = "Unknown";

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

var getRandomCategory = async function () {
  var url = URL.defaultGETCategoryUrl;
  var categoryList = [];
  var defaultCategoryList = DEFAULT_DATA.defaultCategoryList;
  try {
    logger.info(`making external call to url: ${url}`);
    var data = await axios.get(url);
    logger.info(`response received from external service`);
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

/**
 * @function processAndGetQuotes
 * @async
 * @description fetch random quotes from https://quotes.rest/
 * @param {Object} req
 */
module.exports.processAndGetQuotes = async function (req) {
  var category = await getRandomCategory();
  logger.info(`category: ${category}`);
  var result = {};
  if (category != DEFAULT_DATA.defaultCategoryList[0]) {
    var url = `https://quotes.rest/qod?category=${category}&language=en`;
    logger.info(`making external call to url: ${url}`);
    var data = await axios.get(url);
    logger.info(`response received from external service`);
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
  return [httpStatus.OK, response];
};
