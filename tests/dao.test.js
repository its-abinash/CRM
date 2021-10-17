var sinon = require("sinon");
var assert = sinon.assert;

const chatDao = require("../Api/Controller/chatDao");
const coreServiceDao = require("../Api/Controller/coreServiceDao");
const dashDao = require("../Api/Controller/dashDao");
const deleteServiceDao = require("../Api/Controller/deleteServiceDao");
const editServiceDao = require("../Api/Controller/editServiceDao");
const emailServiceDao = require("../Api/Controller/emailServiceDao");
const insertServiceDao = require("../Api/Controller/insertServiceDao");
const dbUtils = require("../Database/databaseOperations");

var daoControllerTestPositive = function () {
  const tableID = 1;
  const fetchType = 1;
  const sender = "sender@domain.com";
  const receiver = "receiver@domain.com";
  it("chatDao - success test", async function () {
    sinon.stub(dbUtils, "fetch").returns([]);
    sinon.stub(dbUtils, "insert").returns(true);
    var result1 = await chatDao.getConversation(
      tableID,
      fetchType,
      sender,
      receiver
    );
    var result2 = await chatDao.saveConversation(tableID, []);
    assert.match(result1, []);
    assert.match(result2, true);
  });
  it("chatDao - getConversation exception test", async function () {
    sinon.stub(dbUtils, "fetch").throwsException({ name: "CONNERR" });
    sinon.stub(dbUtils, "insert").returns(true);
    try {
      await chatDao.getConversation(tableID, fetchType, sender, receiver);
      var result2 = await chatDao.saveConversation(tableID, []);
      assert.match(result2, true);
    } catch (exc) {
      assert.match(exc.name, "CONNERR");
    }
  });
  it("chatDao - saveConversation exception test", async function () {
    sinon.stub(dbUtils, "fetch").returns([]);
    sinon.stub(dbUtils, "insert").throwsException({ name: "CONNERR" });
    try {
      var result1 = await chatDao.getConversation(
        tableID,
        fetchType,
        sender,
        receiver
      );
      assert.match(result1, []);
      await chatDao.saveConversation(tableID, []);
    } catch (exc) {
      assert.match(exc.name, "CONNERR");
    }
  });
  it("chatDao - getConversationWithImage success test", async function () {
    sinon.stub(dbUtils, "fetchConversationWithImg").returns([]);
    var result = await chatDao.getConversationWithImage(sender, receiver);
    assert.match(result, [[], []]);
  });
  it("coreServicesDao - success test", async function () {
    sinon.stub(dbUtils, "fetchLatestRemainder").returns([]);
    var fetchStub = sinon.stub(dbUtils, "fetch");
    sinon.stub(dbUtils, "fetchUserData").returns(["img", "name"]);
    fetchStub.onCall(0).returns(["img_link", "name"]);
    fetchStub.onCall(1).returns({ is_admin: true });
    sinon.stub(dbUtils, "update");
    await coreServiceDao.getCustomerForRemainderFromDB();
    await coreServiceDao.getImageOfLoggedInUser("loggedinuser@domain.com");
    await coreServiceDao.getUserTypeFromDB("user@domain.com");
    await coreServiceDao.updateRemainderDateInDB(["customer1,, customer2"]);
  });
  it("coreServicesDao - getCustomerForRemainderFromDB exception test", async function () {
    sinon
      .stub(dbUtils, "fetchLatestRemainder")
      .throwsException({ name: "CONNERR" });
    try {
      await coreServiceDao.getCustomerForRemainderFromDB();
    } catch (ex) {
      assert.match(ex.name, "CONNERR");
    }
  });
  it("coreServicesDao - getImageOfLoggedInUser exception test", async function () {
    sinon.stub(dbUtils, "fetchUserData").throwsException({ name: "CONNERR" });
    try {
      await coreServiceDao.getImageOfLoggedInUser("loggedinuser@domain.com");
    } catch (ex) {
      assert.match(ex.name, "CONNERR");
    }
  });
  it("coreServicesDao - getUserTypeFromDB exception test", async function () {
    sinon.stub(dbUtils, "fetch").throwsException({ name: "CONNERR" });
    try {
      await coreServiceDao.getUserTypeFromDB("user@domain.com");
    } catch (ex) {
      assert.match(ex.name, "CONNERR");
    }
  });
  it("coreServicesDao - updateRemainderDateInDB exception test", async function () {
    sinon.stub(dbUtils, "update").throwsException({ name: "CONNERR" });
    try {
      await coreServiceDao.updateRemainderDateInDB(["cus1, cus2"]);
    } catch (ex) {
      assert.match(ex.name, "CONNERR");
    }
  });
  it("dashDao - success test", async function () {
    var stub = sinon.stub(dbUtils, "fetchAllUsersForGivenUserId");
    sinon.stub(dbUtils, "fetchUserData").returns(["img", "username"]);
    stub.onCall(0).returns(["cus1, cus2"]);
    stub.onCall(1).returns(["admin1, admin2"]);
    sinon.stub(dbUtils, "getUsersBySearchText").returns([
      {
        email: "user1@gmail.com",
        name: "user1",
      },
      {
        email: "fakeemail@gmail.com",
        name: "fakecustomer",
      },
    ]);
    var cusList = await dashDao.getAllCustomer("loggedinuser@domain.com");
    var adminList = await dashDao.getAllAdmins("loggedinuser@domain.com");
    var userData = await dashDao.getUserData("loggedinuser@domain.com");
    await dashDao.getAllUsers("my name");
    assert.match(userData, ["img", "username"]);
    assert.match(cusList, ["cus1, cus2"]);
    assert.match(adminList, ["admin1, admin2"]);
  });
  it("dashDao - getAllCustomer exception test", async function () {
    sinon
      .stub(dbUtils, "fetchAllUsersForGivenUserId")
      .throwsException({ name: "CONNERR" });
    try {
      await dashDao.getAllCustomer("loggedinuser@domain.com");
    } catch (exc) {
      assert.match(exc.name, "CONNERR");
    }
  });
  it("dashDao - getAllAdmins exception test", async function () {
    sinon
      .stub(dbUtils, "fetchAllUsersForGivenUserId")
      .throwsException({ name: "CONNERR" });
    try {
      await dashDao.getAllAdmins("loggedinuser@domain.com");
    } catch (exc) {
      assert.match(exc.name, "CONNERR");
    }
  });
  it("dashDao - getAllUsers exception test", async function () {
    sinon
      .stub(dbUtils, "getUsersBySearchText")
      .throwsException({ name: "CONNERR" });
    try {
      await dashDao.getAllUsers("searchText");
    } catch (exc) {
      assert.match(exc.name, "CONNERR");
    }
  });
  it("deleteServiceDao - success test", async function () {
    var removefields = ["field1", "field2"];
    sinon.stub(dbUtils, "remove").returns(1);
    await deleteServiceDao.removeUserData(removefields, "user@domain.com");
    await deleteServiceDao.removeDataOnFailure([], "user@domain.com");
  });
  it("deleteServiceDao with valid userMap - success test", async function () {
    var userMap = ["field1", "field2"];
    sinon.stub(dbUtils, "remove").returns(1);
    await deleteServiceDao.removeDataOnFailure(userMap, "user@domain.com");
  });
  it("deleteServiceDao - removeUserData exception test", async function () {
    var removefields = ["field1", "field2"];
    sinon.stub(dbUtils, "remove").throwsException({ name: "CONNERR" });
    try {
      await deleteServiceDao.removeUserData(removefields, "user@domain.com");
    } catch (exc) {
      assert.match(exc.name, "CONNERR");
    }
  });
  it("deleteServiceDao - removeDataOnFailure exception test", async function () {
    sinon.stub(dbUtils, "remove").throwsException({ name: "CONNERR" });
    try {
      await deleteServiceDao.removeDataOnFailure([], "user@domain.com");
    } catch (exc) {
      assert.match(exc.name, "CONNERR");
    }
  });
  it("editServiceDao - success test", async function () {
    var dataToUpdateProfilePict = { key1: "val1" };
    sinon.stub(dbUtils, "update").returns(true);
    sinon.stub(dbUtils, "updateMedia").returns(true);
    await editServiceDao.saveEditedData(
      "user@domain.com",
      ["field1"],
      ["data1"]
    );
    await editServiceDao.updateProfilePicture(
      "email@domain.com",
      dataToUpdateProfilePict
    );
    await editServiceDao.updateCredential(
      "email@domain.com",
      "some_credential"
    );
  });
  it("editServiceDao - exception test", async function () {
    sinon.stub(dbUtils, "update").throwsException({ name: "CONNERR" });
    try {
      editServiceDao.saveEditedData("user@domain.com", ["field1"], ["data1"]);
    } catch (exc) {
      assert.match(exc.name, "CONNERR");
    }
  });
  it("emailServiceDao - success test", async function () {
    sinon.stub(dbUtils, "fetch").returns([{ passcode: "fakePasscode" }]);
    var passcode = await emailServiceDao.getPassCode("user@domain.com");
    assert.match(passcode, "fakePasscode");
  });
  it("emailServiceDao - exception test", async function () {
    sinon.stub(dbUtils, "fetch").throwsException({ name: "CONNERR" });
    try {
      await emailServiceDao.getPassCode("user@domain.com");
    } catch (exc) {
      assert.match(exc.name, "CONNERR");
    }
  });
  it("insertServiceDao - success test", async function () {
    sinon.stub(dbUtils, "insert").returns(true);
    sinon.stub(dbUtils, "updateMedia").returns(true);
    await insertServiceDao.insertUserData(1, []);
    await insertServiceDao.saveImageIntoDB(
      "user@gmail.com",
      "some encoded data"
    );
  });
  it("insertServiceDao - insertUserData exception test", async function () {
    sinon.stub(dbUtils, "insert").throwsException({ name: "CONNERR" });
    try {
      await insertServiceDao.insertUserData(1, []);
    } catch (exc) {
      assert.match(exc.name, "CONNERR");
    }
  });
  it("insertServiceDao - saveImageIntoDB exception test", async function () {
    sinon.stub(dbUtils, "updateMedia").throwsException({ name: "CONNERR" });
    try {
      await insertServiceDao.saveImageIntoDB(
        "user@gmail.com",
        "some encoded data"
      );
    } catch (exc) {
      assert.match(exc.name, "CONNERR");
    }
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

describe("test_dao", daoControllerTestPositive);
