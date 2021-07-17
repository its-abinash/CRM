var proxyrequire = require("proxyquire").noCallThru();
var sinon = require("sinon");
var assert = sinon.assert;
var { DATABASE } = require("../Configs/constants.config");
const {
  fakeCredData,
  specificCredData,
  fakeCustomerData,
  fakeSpecificCustomerData,
  fakeConversationData,
  fakeSpecificConversationData,
  fakeLatestRemainderData,
} = require("../Configs/mockData");

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
    let pgData = { rows: [{ email: "demo@gmail.com", password: "pass" }] };
    var pgStub = fakePgPool(pgData);
    var dbUtils = proxyrequire("../Database/databaseOperations", {
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
    var pgData = { rows: [{ email: "demo1@gmail.com", password: "pass1" }] };
    var pgStub = fakePgPool(pgData);
    var dbUtils = proxyrequire("../Database/databaseOperations", {
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
    var pgData = { rows: [{ exists: true }] };
    var pgStub = fakePgPool(pgData);
    var dbUtils = proxyrequire("../Database/databaseOperations", {
      pg: pgStub,
    });
    var result = await dbUtils.isExistingUser("fake_email", "demo@gmail.com");
    assert.match(result, true);
  });
  it("remove user test", async function () {
    var testCases = [
      {
        databaseId: DATABASE.CONVERSATION,
        exp: 1,
        pgStub: fakePgPool({rowCount: 1}),
      },
      { databaseId: DATABASE.CREDENTIALS, exp: 1, pgStub: fakePgPool({rowCount: 1}) },
      { databaseId: DATABASE.CUSTOMER, exp: 1, pgStub: fakePgPool({rowCount: 1}) },
    ];
    for (const testCase of testCases) {
      var dbUtils = proxyrequire("../Database/databaseOperations", {
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
  it("remove user from user map - success test", async function () {
    var pgStub = fakePgPool({rowCount: 1});
    var dbUtils = proxyrequire("../Database/databaseOperations", {
      pg: pgStub,
    });
    var result = await dbUtils.remove(DATABASE.USERS_MAP, null, null);
    assert.match(result, 1);
  });
  it("remove user from user map - exception test", async function () {
    var pgStub = fakePgPoolException();
    var dbUtils = proxyrequire("../Database/databaseOperations", {
      pg: pgStub,
    });
    try {
      await dbUtils.remove(DATABASE.USERS_MAP, null, null);
    } catch (ex) {
      assert.match(ex, "CONNERR");
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
    for (const testCase of testCases) {
      var dbUtils = proxyrequire("../Database/databaseOperations", {
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
      {
        databaseId: DATABASE.USERS_MAP,
        exp: true,
        pgStub: fakePgPool(true),
      },
    ];
    for (const testCase of testCases) {
      var dbUtils = proxyrequire("../Database/databaseOperations", {
        pg: testCase.pgStub,
      });
      var result = await dbUtils.insert(testCase.databaseId, ["fake_data"]);
      assert.match(result, testCase.exp);
    }
  });
  it("fetch all users for given userId - success test", async function () {
    var pgStub = fakePgPool({ rows: fakeCustomerData });
    var dbUtils = proxyrequire("../Database/databaseOperations", {
      pg: pgStub,
    });
    var result = await dbUtils.fetchAllUsersForGivenUserId(null);
    assert.match(result, fakeCustomerData);
  });
  it("fetch all users for given userId - exception test", async function () {
    var pgStub = fakePgPoolException();
    var dbUtils = proxyrequire("../Database/databaseOperations", {
      pg: pgStub,
    });
    try {
      await dbUtils.fetchAllUsersForGivenUserId(null);
    } catch (ex) {
      assert.match(ex, "CONNERR");
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
    for (const testCase of testCases) {
      var dbUtils = proxyrequire("../Database/databaseOperations", {
        pg: testCase.pgStub,
      });
      var result = await dbUtils.fetch(testCase.databaseId, testCase.fetchType);
      assert.match(result, testCase.exp);
    }
  });
  it("fetch user of given type test", async function () {
    var pgStub = fakePgPool({ rows: fakeSpecificCustomerData });
    var dbUtils = proxyrequire("../Database/databaseOperations", {
      pg: pgStub,
    });
    var result = await dbUtils.fetchAllUserOfGivenType();
    assert.match(result, fakeSpecificCustomerData);
  });
  it("fetch latest remainder test", async function () {
    var pgStub = fakePgPool({ rows: fakeLatestRemainderData });
    var dbUtils = proxyrequire("../Database/databaseOperations", {
      pg: pgStub,
    });
    var result = await dbUtils.fetchLatestRemainder();
    assert.match(result, fakeLatestRemainderData);
  });
  it("insert exception test", async function () {
    var testCases = [
      {
        databaseId: DATABASE.CREDENTIALS,
        exp: "CONNERR",
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CUSTOMER,
        exp: "CONNERR",
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CONVERSATION,
        exp: "CONNERR",
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.USERS_MAP,
        exp: "CONNERR",
        pgStub: fakePgPoolException(),
      },
    ];
    for (const testCase of testCases) {
      var dbUtils = proxyrequire("../Database/databaseOperations", {
        pg: testCase.pgStub,
      });
      try {
        await dbUtils.insert(testCase.databaseId, ["fake_data"]);
      } catch (ex) {
        assert.match(ex, testCase.exp);
      }
    }
  });
  it("fetch exception test", async function () {
    var testCases = [
      {
        databaseId: DATABASE.CREDENTIALS,
        fetchType: DATABASE.FETCH_ALL,
        exp: "CONNERR",
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CREDENTIALS,
        fetchType: DATABASE.FETCH_SPECIFIC,
        exp: "CONNERR",
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CUSTOMER,
        fetchType: DATABASE.FETCH_ALL,
        exp: "CONNERR",
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CUSTOMER,
        fetchType: DATABASE.FETCH_SPECIFIC,
        exp: "CONNERR",
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CONVERSATION,
        fetchType: DATABASE.FETCH_ALL,
        exp: "CONNERR",
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CONVERSATION,
        fetchType: DATABASE.FETCH_SPECIFIC,
        exp: "CONNERR",
        pgStub: fakePgPoolException(),
      },
    ];
    for (const testCase of testCases) {
      var dbUtils = proxyrequire("../Database/databaseOperations", {
        pg: testCase.pgStub,
      });
      try {
        await dbUtils.fetch(testCase.databaseId, testCase.fetchType);
      } catch (exc) {
        assert.match(exc, testCase.exp);
      }
    }
  });
  it("update user exception test", async function () {
    var testCases = [
      {
        databaseId: DATABASE.CREDENTIALS,
        exp: "CONNERR",
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CUSTOMER,
        exp: "CONNERR",
        pgStub: fakePgPoolException(),
      },
    ];
    for (const testCase of testCases) {
      var dbUtils = proxyrequire("../Database/databaseOperations", {
        pg: testCase.pgStub,
      });
      try {
        await dbUtils.update(
          testCase.databaseId,
          "fake_email",
          "demo@gmail.com",
          ["fake_fields"],
          ["fake_data"]
        );
      } catch (exc) {
        assert.match(exc, testCase.exp);
      }
    }
  });
  it("remove user exception test", async function () {
    var testCases = [
      {
        databaseId: DATABASE.CONVERSATION,
        exp: "CONNERR",
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CREDENTIALS,
        exp: "CONNERR",
        pgStub: fakePgPoolException(),
      },
      {
        databaseId: DATABASE.CUSTOMER,
        exp: "CONNERR",
        pgStub: fakePgPoolException(),
      },
    ];
    for (const testCase of testCases) {
      var dbUtils = proxyrequire("../Database/databaseOperations", {
        pg: testCase.pgStub,
      });
      try {
        await dbUtils.remove(
          testCase.databaseId,
          "fake_email",
          "demo@gmail.com"
        );
      } catch (exc) {
        assert.match(exc, testCase.exp);
      }
    }
  });
  it("fetch all user of given type exception test", async function () {
    var pgStub = fakePgPoolException();
    var dbUtils = proxyrequire("../Database/databaseOperations", {
      pg: pgStub,
    });
    try {
      await dbUtils.fetchAllUserOfGivenType();
    } catch (exc) {
      assert.match(exc, "CONNERR");
    }
  });
  it("fetch latest remainder exception test", async function () {
    var pgStub = fakePgPoolException();
    var dbUtils = proxyrequire("../Database/databaseOperations", {
      pg: pgStub,
    });
    try {
      await dbUtils.fetchLatestRemainder();
    } catch (exc) {
      assert.match(exc, "CONNERR");
    }
  });
  it("existing user check exception test", async function () {
    var pgStub = fakePgPoolException();
    var dbUtils = proxyrequire("../Database/databaseOperations", {
      pg: pgStub,
    });
    try {
      await dbUtils.isExistingUser("fake_email", "demo@gmail.com");
    } catch (exc) {
      assert.match(exc, "CONNERR");
    }
  });
  it("valid user check exception test", async function () {
    var pgStub = fakePgPoolException();
    var dbUtils = proxyrequire("../Database/databaseOperations", {
      pg: pgStub,
    });
    try {
      var result = await dbUtils.isValidUser(
        "fake_email",
        "demo@gmail.com",
        "pass"
      );
    } catch (exc) {
      assert.match(exc, "CONNERR");
    }
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

describe("test_database_utils", databaseControllerTest);
