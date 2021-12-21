var express = require("express");
var router = express.Router();
var cors = require("cors");
var httpStatus = require("http-status");
var deleteServiceDao = require("./deleteServiceDao");
var chatService = require("./chatService");
var deleteService = require("./deleteService");
var editService = require("./editService");
var insertService = require("./insertService");
var emailService = require("./emailService");
var dashService = require("./dashService");
const { ResponseIds } = require("../../Configs/constants.config");
const { AppResponse } = require("./response_utils");
const { format } = require("./main_utils");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cors());

/**
 * @httpMethod GET
 * @endpoint /dashboard/getUsers
 * @function getUsers
 * @async
 * @description Fetches all users from the db according to queryParams
 * @param {Object} req
 * @param {Object} res
 * @returns users list
 */
 module.exports.getUsers = async function (req, res) {
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var [statusCode, response] = await dashService.processAndGetUsers(
      req.loggedInUser,
      AppRes
    );
    AppRes.ApiExecutionEnds();
    res.status(statusCode).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(null, ex, httpStatus.INTERNAL_SERVER_ERROR);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * @httpMethod GET
 * @endpoint /chat/receivers/{receiverId}/senders/{senderId}
 * @async
 * @function getConversation
 * @description Fetch conversations between login user and requested user
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getConversation = async function (req, res) {
  /* When fetching Chat Conversations, we have to decrypt the encoded message */
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var LoggedInUser = req.loggedInUser;
    var response = await chatService.processAndGetConversation(
      req,
      LoggedInUser,
      AppRes
    );
    AppRes.ApiExecutionEnds();
    res.status(httpStatus.OK).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(null, ex, httpStatus.INTERNAL_SERVER_ERROR);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * @httpMethod POST
 * @endpoint /chat
 * @function chat
 * @async
 * @description Save the conversation of 2 persons
 * @param {Object} req
 * @param {Object} res
 */
module.exports.chat = async function (req, res) {
  /*
    The Chat Conversation is end-end protected with encryption. Hence, the messages will be
    stored in the database are totally encrypted.
    */
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var LoggedInUser = req.loggedInUser;
    var [statusCode, response] = await chatService.processAndSaveConversation(
      LoggedInUser,
      AppRes
    );
    AppRes.ApiExecutionEnds();
    res.status(statusCode).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(
      null,
      format(ResponseIds.RI_026, [String(ex)]),
      httpStatus.INTERNAL_SERVER_ERROR
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * @function getNotification
 * @async
 * @endpoint /chat/notification/{userIds}
 * @description Checks new notification for the user and returns it as boolean (True/False)
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getNotification = async function (req, res) {
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var LoggedInUser = req.loggedInUser;
    var [statusCode, response] = await chatService.checkAndGetNotifications(
      LoggedInUser,
      AppRes
    );
    AppRes.ApiExecutionEnds();
    res.status(statusCode).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(null, ex, httpStatus.INTERNAL_SERVER_ERROR);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * @httpMethod DELETE
 * @endpoint /deleteUser
 * @function delete
 * @async
 * @description Delete user's all data
 * @param {Object} req
 * @param {Object} res
 */
module.exports.delete = async function (req, res) {
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var LoggedInUser = req.loggedInUser;
    var removeall = true;
    var [statusCode, response] = await deleteService.processAndDeleteUserData(
      LoggedInUser,
      AppRes,
      removeall
    );
    AppRes.ApiExecutionEnds();
    res.status(statusCode).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(null, ex, httpStatus.INTERNAL_SERVER_ERROR);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * @httpMethod PUT
 * @endpoint /edit
 * @function edit
 * @async
 * @description Update details of user
 * @param {Object} req
 * @param {Object} res
 */
module.exports.edit = async function (req, res) {
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var [statusCode, response] = await editService.processAndEditUserData(AppRes);
    AppRes.ApiExecutionEnds();
    res.status(statusCode).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(
      null,
      format(ResponseIds.RI_027, [String(ex)]),
      httpStatus.INTERNAL_SERVER_ERROR
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * @httpMethod PATCH
 * @endpoint /edit
 * @function updateUserProperty
 * @async
 * @description Update details of user
 * @param {Object} req
 * @param {Object} res
 */
module.exports.updateUserProperty = async function (req, res) {
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var [statusCode, response] = await editService.processAndUpdateUserProperty(AppRes);
    AppRes.ApiExecutionEnds();
    res.status(statusCode).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(
      null,
      format(ResponseIds.RI_027, [String(ex)]),
      httpStatus.INTERNAL_SERVER_ERROR
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * @httpMethod POST
 * @endpoint /insert
 * @function insert
 * @async
 * @description Inserts user data
 * @param {Object} req
 * @param {Object} res
 */
module.exports.insert = async function (req, res) {
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var LoggedInUser = req.loggedInUser;
    var [statusCode, response] = await insertService.processAndInsertUserData(
      LoggedInUser,
      AppRes
    );
    res.status(statusCode).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var reasons = [format(ResponseIds.RI_030, [String(ex)])];
    var email = req.loggedInUser;
    await deleteServiceDao.removeDataOnFailure([], email.toLowerCase());
    var response = await AppRes.buildResponse(
      null,
      reasons,
      httpStatus.INTERNAL_SERVER_ERROR,
      "RI_030"
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * @httpMethod POST
 * @endpoint /insert/profilePicture
 * @function insert
 * @async
 * @description Inserts profile picture of user into db
 * @param {Object} req
 * @param {Object} res
 */
module.exports.insertProfilePicture = async function (req, res) {
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var LoggedInUser = req.loggedInUser;
    var [statusCode, response] =
      await insertService.processAndInsertProfilePicture(
        req,
        LoggedInUser,
        AppRes
      );
    AppRes.ApiExecutionEnds();
    res.status(statusCode).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(
      null,
      format(ResponseIds.RI_028, [String(ex)]),
      httpStatus.INTERNAL_SERVER_ERROR
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * @httpMethod POST
 * @endpoint /email
 * @function email
 * @async
 * @description Sends email to user
 * @param {Object} req
 * @param {Object} res
 */
module.exports.email = async function (req, res) {
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var LoggedInUser = req.loggedInUser;
    var [statusCode, response] = await emailService.processAndSendEmail(
      LoggedInUser,
      AppRes
    );
    AppRes.ApiExecutionEnds();
    res.status(statusCode).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(
      null,
      format(ResponseIds.RI_029, [String(ex)]),
      httpStatus.INTERNAL_SERVER_ERROR
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * @httpMethod GET
 * @endpoint /user/{userId}
 * @function getUserInfo
 * @async
 * @description Returns user informations
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getUserInfo = async function (req, res) {
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var userId = req.params['userId']
    var [statusCode, response] = await dashService.getUserData(
      userId,
      AppRes
    );
    AppRes.ApiExecutionEnds();
    res.status(statusCode).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(
      null,
      format(ResponseIds.RI_034, [String(ex)]),
      httpStatus.INTERNAL_SERVER_ERROR
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * @httpMethod DELETE
 * @endpoint /user/{userId}/{deleteProperties}
 * @function delete
 * @async
 * @description Delete specific user data
 * @param {Object} req
 * @param {Object} res
 */
module.exports.deleteUserData = async function (req, res) {
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var userId = req.params['userId']
    var [statusCode, response] = await deleteService.processAndDeleteUserData(
      userId,
      AppRes
    );
    AppRes.ApiExecutionEnds();
    res.status(statusCode).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(null, ex, httpStatus.INTERNAL_SERVER_ERROR);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};

/**
 * @httpMethod POST
 * @endpoint /createPost
 * @function createPost
 * @async
 * @description Add a new blog/article
 * @param {Object} req
 * @param {Object} res
 */
 module.exports.createPost = async function (req, res) {
  var AppRes = new AppResponse(req);
  try {
    AppRes.ApiExecutionBegins();
    var LoggedInUser = req.loggedInUser;
    var [statusCode, response] = await deleteService.processAndDeleteUserData(
      LoggedInUser,
      AppRes
    );
    AppRes.ApiExecutionEnds();
    res.status(statusCode).send(response);
  } catch (ex) {
    AppRes.ApiReportsError(ex);
    var response = await AppRes.buildResponse(
      null,
      ex,
      httpStatus.INTERNAL_SERVER_ERROR
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
};
