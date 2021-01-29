var proxyrequire = require("proxyquire").noCallThru();
var sinon = require("sinon");
var assert = sinon.assert;
var logUtils = require("../Logger/log");
var { DATABASE } = require("../../Configs/constants.config");
const {
  fakeCredData,
  specificCredData,
  fakeCustomerData,
  fakeSpecificCustomerData,
  fakeConversationData,
  fakeSpecificConversationData,
  fakeLatestRemainderData,
} = require("./mockData");

function fakePgPool(fakePgStubData) {
  var pgStub = {
    Pool: function () {
      this.connect = function () {
        return this;
      };
      this.query = function () {
        return fakePgStubData;
      };
      this.release = function () {
        return;
      };
    },
  };
  return pgStub;
}

function fakePgPoolException() {
  var pgStub = {
    Pool: function () {
      this.connect = function () {
        throw "CONNERR";
      };
    },
  };
  return pgStub;
}

var databaseControllerTest = function () {
  it("valid user check test", async function () {
    sinon.stub(logUtils, "info");
    let pgData = { rows: [{ email: "demo@gmail.com", password: "pass" }] };
    var pgStub = fakePgPool(pgData);
    var dbUtils = proxyrequire("../../Database/databaseOperations", {
      pg: pgStub,
    });
    var result = await dbUtils.isValidUser(
      "fake_email",
      "demo@gmail.com",
      "pass"
    );
    assert.match(result, true);
  });
  it("invalid user check test", async function () {
    sinon.stub(logUtils, "error");
    sinon.stub(logUtils, "info");
    var pgData = { rows: [{ email: "demo1@gmail.com", password: "pass1" }] };
    var pgStub = fakePgPool(pgData);
    var dbUtils = proxyrequire("../../Database/databaseOperations", {
      pg: pgStub,
    });
    // checking user with wrong email_id and password
    var result = await dbUtils.isValidUser(
      "fake_email",
      "demo2@gmail.com",
      "pass2"
    );
    assert.match(result, false);
  });
  it("existing user check test", async function () {
    sinon.stub(logUtils, "info");
    var pgData = { rows: [{ exists: true }] };
    var pgStub = fakePgPool(pgData);
    var dbUtils = proxyrequire("../../Database/databaseOperations", {
      pg: pgStub,
    });
    var result = await dbUtils.isExistingUser("fake_email", "demo@gmail.com");
    assert.match(result, true);
  });
  it("remove user test", async function () {
    var testCases = [
      {
        databaseId: DATABASE.CONVERSATION,
        exp: true,
        pgStub: fakePgPool(true),
      },
      { databaseId: DATABASE.CREDENTIALS, exp: true, pgStub: fakePgPool(true) },
      { databaseId: DATABASE.CUSTOMER, exp: true, pgStub: fakePgPool(true) },
    ];
    sinon.stub(logUtils, "info");
    for (const testCase of testCases) {
      var dbUtils = proxyrequire("../../Database/databaseOperations", {
        pg: testCase.pgStub,
      });
      var result = await dbUtils.remove(
        testCase.databaseId,
        "fake_email",
        "demo@gmail.com"
      );
      assert.match(result, testCase.exp);
    }
  });
  it("update user test", async function () {
    var testCases = [
      {
        databaseId: DATABASE.CREDENTIALS,
        exp: true,
        pgStub: fakePgPool(true),
      },
      { databaseId: DATABASE.CUSTOMER, exp: true, pgStub: fakePgPool(true) },
    ];
    sinon.stub(logUtils, "info");
    for (const testCase of testCases) {
      var dbUtils = proxyrequire("../../Database/databaseOperations", {
        pg: testCase.pgStub,
      });
      var result = await dbUtils.update(
        testCase.databaseId,
        "fake_email",
        "demo@gmail.com",
        ["fake_fields"],
        ["fake_data"]
      );
      assert.match(result, testCase.exp);
    }
  });
  it("insert user test", async function () {
    var testCases = [
      {
        databaseId: DATABASE.CREDENTIALS,
        exp: true,
        pgStub: fakePgPool(true),
      },
      { databaseId: DATABASE.CUSTOMER, exp: true, pgStub: fakePgPool(true) },
      {
        databaseId: DATABASE.CONVERSATION,
        exp: true,
        pgStub: fakePgPool(true),
      },
    ];
    sinon.stub(logUtils, "info");
    for (const testCase of testCases) {
      var dbUtils = proxyrequire("../../Database/databaseOperations", {
        pg: testCase.pgStub,
      });
      var result = await dbUtils.insert(testCase.databaseId, ["fake_data"]);
      assert.match(result, testCase.exp);
    }
  });
  it("fetch user data test", async function () {
    var testCases = [
      {
        databaseId: DATABASE.CREDENTIALS,
        fetchType: DATABASE.FETCH_ALL,
        exp: fakeCredData,
        pgStub: fakePgPool({ rows: fakeCredData }),
      },
      {
        databaseId: DATABASE.CREDENTIALS,
        fetchType: DATABASE.FETCH_SPECIFIC,
        exp: specificCredData,
        pgStub: fakePgPool({ rows: specificCredData }),
      },
      {
        databaseId: DATABASE.CUSTOMER,
        fetchType: DATABASE.FETCH_ALL,
        exp: fakeCustomerData,
        pgStub: fakePgPool({ rows: fakeCustomerData }),
      },
      {
        databaseId: DATABASE.CUSTOMER,
        fetchType: DATABASE.FETCH_SPECIFIC,
        exp: fakeSpecificCustomerData,
        pgStub: fakePgPool({ rows: fakeSpecificCustomerData }),
      },
      {
        databaseId: DATABASE.CONVERSATION,
        fetchType: DATABASE.FETCH_ALL,
        exp: fakeConversationData,
        pgStub: fakePgPool({ rows: fakeConversationData }),
      },
      {
        databaseId: DATABASE.CONVERSATION,
        fetchType: DATABASE.FETCH_SPECIFIC,
        exp: fakeSpecificConversationData,
        pgStub: fakePgPool({ rows: fakeSpecificConversationData }),
      },
    ];
    sinon.stub(logUtils, "info");
    for (const testCase of testCases) {
      var dbUtils = proxyrequire("../../Database/databaseOperations", {
        pg: testCase.pgStub,
      });
      var result = await dbUtils.fetch(testCase.databaseId, testCase.fetchType);
      assert.match(result, testCase.exp);
    }
  });
  it("fetch user of given type test", async function () {
    sinon.stub(logUtils, "info");
    var pgStub = fakePgPool({ rows: fakeSpecificCustomerData });
    var dbUtils = proxyrequire("../../Database/databaseOperations", {
      pg: pgStub,
    });
    var result = await dbUtils.fetchAllUserOfGivenType();
    assert.match(result, fakeSpecificCustomerData);
  });
  it("fetch latest remainder test", async function () {
    sinon.stub(logUtils, "info");
    var pgStub = fakePgPool({ rows: fakeLatestRemainderData });
    var dbUtils = proxyrequire("../../Database/databaseOperations", {
      pg: pgStub,
    });
    var result = await dbUtils.fetchLatestRemainder();
    assert.match(result, fakeLatestRemainderData);
  });
  it("insert exception test", async function () {
    var testCases = [
      {
        databaseId: DATABASE.CREDENTIALS,
        exp: false,
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CUSTOMER,
        exp: false,
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CONVERSATION,
        exp: false,
        pgStub: fakePgPoolException(),
      },
    ];
    sinon.stub(logUtils, "info");
    sinon.stub(logUtils, "error");
    for (const testCase of testCases) {
      var dbUtils = proxyrequire("../../Database/databaseOperations", {
        pg: testCase.pgStub,
      });
      var result = await dbUtils.insert(testCase.databaseId, ["fake_data"]);
      assert.match(result, testCase.exp);
    }
  });
  it("fetch exception test", async function () {
    var testCases = [
      {
        databaseId: DATABASE.CREDENTIALS,
        fetchType: DATABASE.FETCH_ALL,
        exp: [],
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CREDENTIALS,
        fetchType: DATABASE.FETCH_SPECIFIC,
        exp: [],
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CUSTOMER,
        fetchType: DATABASE.FETCH_ALL,
        exp: [],
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CUSTOMER,
        fetchType: DATABASE.FETCH_SPECIFIC,
        exp: [],
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CONVERSATION,
        fetchType: DATABASE.FETCH_ALL,
        exp: [],
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CONVERSATION,
        fetchType: DATABASE.FETCH_SPECIFIC,
        exp: [],
        pgStub: fakePgPoolException(),
      },
    ];
    sinon.stub(logUtils, "info");
    sinon.stub(logUtils, "error");
    for (const testCase of testCases) {
      var dbUtils = proxyrequire("../../Database/databaseOperations", {
        pg: testCase.pgStub,
      });
      var result = await dbUtils.fetch(testCase.databaseId, testCase.fetchType);
      assert.match(result, testCase.exp);
    }
  });
  it("update user exception test", async function () {
    var testCases = [
      {
        databaseId: DATABASE.CREDENTIALS,
        exp: false,
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CUSTOMER,
        exp: false,
        pgStub: fakePgPoolException(),
      },
    ];
    sinon.stub(logUtils, "info");
    sinon.stub(logUtils, "error");
    for (const testCase of testCases) {
      var dbUtils = proxyrequire("../../Database/databaseOperations", {
        pg: testCase.pgStub,
      });
      var result = await dbUtils.update(
        testCase.databaseId,
        "fake_email",
        "demo@gmail.com",
        ["fake_fields"],
        ["fake_data"]
      );
      assert.match(result, testCase.exp);
    }
  });
  it("remove user exception test", async function () {
    var testCases = [
      {
        databaseId: DATABASE.CONVERSATION,
        exp: false,
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CREDENTIALS,
        exp: false,
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CUSTOMER,
        exp: false,
        pgStub: fakePgPoolException(),
      },
    ];
    sinon.stub(logUtils, "info");
    sinon.stub(logUtils, "error");
    for (const testCase of testCases) {
      var dbUtils = proxyrequire("../../Database/databaseOperations", {
        pg: testCase.pgStub,
      });
      var result = await dbUtils.remove(
        testCase.databaseId,
        "fake_email",
        "demo@gmail.com"
      );
      assert.match(result, testCase.exp);
    }
  });
  it("fetch all user of given type exception test", async function () {
    sinon.stub(logUtils, "info");
    sinon.stub(logUtils, "error");
    var pgStub = fakePgPoolException();
    var dbUtils = proxyrequire("../../Database/databaseOperations", {
      pg: pgStub,
    });
    var result = await dbUtils.fetchAllUserOfGivenType();
    assert.match(result, []);
  });
  it("fetch latest remainder exception test", async function () {
    sinon.stub(logUtils, "info");
    sinon.stub(logUtils, "error");
    var pgStub = fakePgPoolException();
    var dbUtils = proxyrequire("../../Database/databaseOperations", {
      pg: pgStub,
    });
    var result = await dbUtils.fetchLatestRemainder();
    assert.match(result, []);
  });
  it("existing user check exception test", async function () {
    sinon.stub(logUtils, "info");
    sinon.stub(logUtils, "error");
    var pgStub = fakePgPoolException();
    var dbUtils = proxyrequire("../../Database/databaseOperations", {
      pg: pgStub,
    });
    var result = await dbUtils.isExistingUser("fake_email", "demo@gmail.com");
    assert.match(result, false);
  });
  it("valid user check exception test", async function () {
    sinon.stub(logUtils, "info");
    sinon.stub(logUtils, 'error')
    var pgStub = fakePgPoolException();
    var dbUtils = proxyrequire("../../Database/databaseOperations", {
      pg: pgStub,
    });
    var result = await dbUtils.isValidUser(
      "fake_email",
      "demo@gmail.com",
      "pass"
    );
    assert.match(result, false);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

describe("test_database_utils", databaseControllerTest);
