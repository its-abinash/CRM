const SERVER = "http://localhost:3000/";
const WEBSOCKET_SERVER = "ws://" + window.location.hostname + ":15674/ws";
const WEBSOKET = "WebSocket";
var socket;
const DEBUG_MODE_ON = false;

/**
 * TODO: 1) add logic to pull last chat instead of pulling all chat between 2 users if notification found.
 */

var connectSoket = function () {
  socket = Stomp.client(WEBSOCKET_SERVER);

  // RabbitMQ Web-Stomp does not support heartbeats so disable them

  socket.heartbeat.outgoing = 0;
  socket.heartbeat.incoming = 0;
  // Comment below line to enable DEBUG-MODE.
  // *NOTE* Debug data can be seen in developer console.
  socket.debug = null;
  function onConnect(e) {
    console.log(`WebSocket Connection Status: OK`);
  }
  function onError(e) {
    if (String(e).toLowerCase().includes("lost connection")) {
      connectSoket();
    }
  }

  socket.connect("guest", "guest", onConnect, onError, "/");
};

$(document).mouseup(function (event) {
  // When the user clicks anywhere outside of the modal, close it
  if (event.target.id === $("#id01").attr("id")) {
    $("#id01").css("display", "none");
  }
  if (event.target.id === $("#id02").attr("id")) {
    $("#id02").css("display", "none");
  }
  if (event.target.id === $("#id03").attr("id")) {
    $("#id03").css("display", "none");
  }
  if (event.target.id === $("#id04").attr("id")) {
    $("#id04").css("display", "none");
  }
  if (event.target.id === $("#id05").attr("id")) {
    $("#id05").css("display", "none");
  }
});

function edit(email) {
  $("#id01").css("display", "block");
  $("#updatemail").attr("value", email);
}

function remove(email) {
  $("#id02").css("display", "block");
  $("#deletemail").attr("value", email);
}

function message(email) {
  $("#id03").css("display", "block");
  $("#sendmail").attr("value", email);
}

function add() {
  $("#id05").css("display", "block");
}

function chat(email) {
  $("#id04").css("display", "block");
  $("#customerEmail").attr("value", email);
}

var getHeaders = function () {
  var headers = {
    "x-access-token": localStorage.getItem("x-access-token"),
  };
  return headers;
};

var getDecryptedPayload = function (payload) {
  payload = CryptoJS.AES.decrypt(String(payload), "#").toString(
    CryptoJS.enc.Utf8
  );
  payload = JSON.parse(payload);
  return payload;
};

var updateLocalStorageValues = function (
  lcKey,
  isObject = false,
  keyToFind = null,
  valueToUpdate = null,
  primaryKeyToCheck = null,
  primaryValueToMatch = null
) {
  // lcKey -> localStorage key name
  // isObject -> is the value of given key is an object?
  var value = localStorage.getItem(lcKey);
  if (!value) {
    return null;
  }
  if (isObject) {
    var localStorageObj = JSON.parse(value);
    if (Array.isArray(localStorageObj)) {
      for (var eachItem of localStorageObj) {
        if (eachItem[primaryKeyToCheck] == primaryValueToMatch) {
          eachItem[keyToFind] = valueToUpdate;
        }
      }
      localStorage.removeItem(lcKey);
      localStorage.setItem(lcKey, JSON.stringify(localStorageObj));
    }
  }
};

async function processPendingRemainers() {
  const fixedRemainderTime = 9; // AM
  const Noon = 12;
  const dateObject = new Date();
  var currentHour = dateObject.getHours();
  if (currentHour < Noon && currentHour == fixedRemainderTime) {
    var remainderInfoList = [];
    $.ajax({
      url: `${SERVER}` + "getLatestRemainderInformation",
      method: "GET",
      async: false,
      headers: getHeaders(),
      success: function (response) {
        remainderInfoList = response.values;
      },
    });
    for (const remainderInfo of remainderInfoList) {
      await sendEmail(
        remainderInfo.email,
        remainderInfo.subject,
        remainderInfo.body
      );
    }
    return true; //Task Done
  }
  return false;
}

var checkAndgetPropertyFromCache = function (property) {
  var routes = JSON.parse(localStorage.getItem("routes"));
  if (Object.keys(routes).length == 0) {
    return null;
  }
  property = property.toString().toUpperCase();
  return routes[property] || null;
};

function getChatEndpoint() {
  var endpointFromCache = checkAndgetPropertyFromCache("chat");
  if (endpointFromCache) {
    return endpointFromCache;
  }
  var CHAT = "";
  $.ajax({
    url: `${SERVER}` + "constants/routes/chat",
    method: "GET",
    async: false,
    success: function (response) {
      CHAT = response.values[0];
    },
  });
  return CHAT;
}

function getCypherEndpoint() {
  var CYPHER = "";
  $.ajax({
    url: `${SERVER}` + "constants/cypher",
    method: "GET",
    async: false,
    success: function (response) {
      CYPHER = response.values[0];
    },
  });
  return CYPHER;
}

function getEmailEndpoint() {
  var endpointFromCache = checkAndgetPropertyFromCache("email");
  if (endpointFromCache) {
    return endpointFromCache;
  }
  var EMAIL = "";
  $.ajax({
    url: `${SERVER}` + "constants/routes/email",
    method: "GET",
    async: false,
    success: function (response) {
      EMAIL = response.values[0];
    },
  });
  return EMAIL;
}

function getEditEndpoint() {
  var endpointFromCache = checkAndgetPropertyFromCache("edit");
  if (endpointFromCache) {
    return endpointFromCache;
  }
  var EDIT = "";
  $.ajax({
    url: `${SERVER}` + "constants/routes/edit",
    method: "GET",
    async: false,
    success: function (response) {
      EDIT = response.values[0];
    },
  });
  return EDIT;
}

function getDeleteEndpoint() {
  var endpointFromCache = checkAndgetPropertyFromCache("delete");
  if (endpointFromCache) {
    return endpointFromCache;
  }
  var DELETE = "";
  $.ajax({
    url: `${SERVER}` + "constants/routes/delete",
    method: "GET",
    async: false,
    success: function (response) {
      DELETE = response.values[0];
    },
  });
  return DELETE;
}

function getAddEndpoint() {
  var endpointFromCache = checkAndgetPropertyFromCache("add");
  if (endpointFromCache) {
    return endpointFromCache;
  }
  var ADD = "";
  $.ajax({
    url: `${SERVER}` + "constants/routes/add",
    method: "GET",
    async: false,
    success: function (response) {
      ADD = response.values[0];
    },
  });
  return ADD;
}

function checkUserType() {
  var is_admin = false;
  $.ajax({
    url: `${SERVER}` + "getUserType",
    method: "GET",
    dataType: "json",
    headers: getHeaders(),
    async: false,
    success: function (response) {
      is_admin = response.values[0];
    },
  });
  return is_admin;
}

var getAllUsers = function () {
  var result = "";
  var contents = localStorage.getItem("allUsersInDash");
  contents = JSON.parse(contents);
  for (const each_content of contents) {
    result += each_content.email + ",";
  }
  result = result.trim();
  result = result.slice(0, -1); // remove extra comma at end
  return result;
};

var loadDashboardUI = function (responseValue, is_admin) {
  responseValue = JSON.parse(responseValue);
  var html_file = "";
  for (var i = 0; i < responseValue.length; i++) {
    html_file += `
    <div class="column">
        <div class="card">
            <p> ${responseValue[i].name} </p>
            <button onclick=remove('${responseValue[i].email}') style="width:auto;background-color:red"><i class="fa fa-trash"></i></button>
        `;
    if (is_admin) {
      html_file += `<button onclick=edit('${responseValue[i].email}') style="width:auto;"><i class="fa fa-edit"></i></button>`;
    }
    html_file += `
                <button onclick=message('${responseValue[i].email}') style="width:auto;background-color:blueviolet"><i class="fa fa-envelope"></i></button>
                <button onclick=chat('${responseValue[i].email}') style="width:auto;background-color:darkcyan"><i class="fa fa-arrow-right"></i></button>
                <div id="id01" class="modal">
                    <div class="container modal-content animate">
                        <input id="updatemail" type="hidden" value="" name="email" readonly="readonly"/>
                        <input type="text" placeholder="name" id="id01-name" name="name">
                        <p></p><br>
                        <input type="text" placeholder="phone" id="id01-phone" name="phone">
                        <p></p><br>
                        <input type="text" placeholder="reminder frequency" id="id01-rem" name="remfreq">
                        <p></p><br>
                        <button type="submit" id="update-btn">Update</button>
                    </div>
                </div>
                <div id="id02" class="modal">
                    <div class="container modal-content animate">
                        <input id="deletemail" type="hidden" value="" name="email" readonly="readonly"/>
                        <button type="submit" id="delete-btn" style="background-color: cadetblue;"><i class="fa fa-warning" style="font-size:28px;color:red"> Delete</i></button>
                    </div>
                </div>
                <div id="id03" class="modal">
                    <div class="container modal-content animate">
                        <div id="loading"></div>
                        <div id="email-status"></div>
                        <div>
                            <div>
                                <input type="text" id="sendmail" name="email" value="" readonly>
                                <p></p><br>
                            </div>
                            <div>
                                <input type="text" name="subject" id="email-subject" placeholder="subject" required>
                                <p></p><br>
                            </div>
                            <div>
                                <textarea type="textarea" name="body" id="email-body" placeholder="Message body Here" rows="7" cols="69"></textarea>
                                <p></p><br>
                            </div>
                            <button type="submit" id="email-btn" style="background-color: darkviolet;"><p style="color: white;font-size:100%;"><b>Send</b></p></button>
                        </div>
                    </div>
                </div>
                <div id="id04" class="modal modalbdy">
                    <div class="xyz" id="chat-div">
                        <input id="customerEmail" type="hidden" value="" name="email" id="receiver-id" readonly="readonly"/>
                        <div id="load-chat"></div>
                        <div>
                            <input type="text" name="chatmsg" placeholder="Type Message" id="chat-msg" required> <input type="submit" id="chat-btn" style="float: right;">
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
  }
  html_file += `
        <div class="column">
            <div class="card">
                <p>Add new Customer</p>
                <button onclick="add()" style="width:auto;background-color:chartreuse"><i class="fa fa-plus-square"></i></button>
                <div id="id05" class="modal">
                    <div class="container modal-content animate">
                        <input type="text" placeholder="name" name="name" id="id05_name" required/>
                        <input type="text" placeholder="email" name="email" id="id05_email"  required/>
                        <input type="text" placeholder="phone" name="phone" id="id05_phone" required/>
                        <input type="text" placeholder="GST Number" name="gst" id="id05_gst" required/>
                        <input type="number" placeholder="reminder frequency" id="id05_remfreq" name="remfreq">
                        <button type="submit" id="insert-btn">Add</button>
                    </div>
                </div>
            </div>
        </div>`;
  $("#row").html(html_file);
};

async function getdashBoard() {
  var ROUTES = localStorage.getItem("routes");
  await $.getScript(
    "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js"
  );
  if (!ROUTES) {
    $.ajax({
      url: `${SERVER}` + "constants/routes",
      method: "GET",
      dataType: "json",
      async: false,
      success: function (response) {
        ROUTES = response.values[0];
        localStorage.setItem("routes", JSON.stringify(ROUTES));
      },
    });
  } else {
    ROUTES = JSON.parse(ROUTES);
  }
  var is_admin = checkUserType();
  if (localStorage.getItem("allUsersInDash")) {
    var content = localStorage.getItem("allUsersInDash");
    loadDashboardUI(content, is_admin);
  } else {
    $.ajax({
      url:
        SERVER +
        (is_admin === true
          ? ROUTES.DASHBOARD.CUSTOMER
          : ROUTES.DASHBOARD.ADMIN),
      method: "GET",
      dataType: "json",
      headers: getHeaders(),
      success: function (response) {
        var responseValue = response.values;
        // set user data in localStorage
        localStorage.setItem("allUsersInDash", JSON.stringify(responseValue));
        loadDashboardUI(JSON.stringify(responseValue), is_admin);
      },
    });
  }
}

async function getEncryptedValue(key, ENCRYPTION_KEY) {
  var encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(key),
    ENCRYPTION_KEY
  ).toString();
  // Converting into base64 string
  var wordArray = CryptoJS.enc.Utf8.parse(String(encrypted));
  encrypted = CryptoJS.enc.Base64.stringify(wordArray).toString();
  return encrypted;
}

var getEncryptedPayload = async function (payload) {
  payload = await getEncryptedValue(payload, "#");
  return payload;
};

async function sendEmail(email, subject, body, show_html = false) {
  // Showing loading gif
  var email_loading_text_html = `
    <div class="loading-screen">
      <div class="loading">
        <span></span>
        <span></span>
        <span></span>
        <span></span> 
      </div>
    </div>`;
  $("#loading").fadeIn(0).html(email_loading_text_html);
  var EMAIL_ENDPOINT = getEmailEndpoint();
  var payload = {
    email: email,
    subject: await getEncryptedValue(subject, "#"),
    body: await getEncryptedValue(body, "#"),
  };
  if (
    $.trim(payload.subject) != "" &&
    $.trim(payload.body) != "" &&
    $.trim(payload.email) != ""
  ) {
    var requestPayload = await getEncryptedPayload(payload);
    $.ajax({
      url: SERVER + EMAIL_ENDPOINT,
      method: "POST",
      data: requestPayload,
      dataType: "text",
      headers: getHeaders(),
      success: function () {
        if (show_html) {
          $("#loading").fadeOut();
          document.getElementById("email-subject").value = "";
          document.getElementById("email-body").value = "";
          var html_file = `<div class="alert success">
                <strong>Success!</strong> Your email has been sent to <i>${payload.email}</i>.
                </div>`;
          $("#email-status").fadeIn(0).html(html_file).fadeOut(6000);
        }
      },
      error: function (response) {
        $("#loading").fadeOut();
        if (show_html) {
          var html_file = `<div class="alert">
                <span class="closebtn">&times;</span>
                <strong>Dang!</strong> Failed to send email to ${payload.email}.
                </div>`;
          $("#email-status").fadeIn(0).html(html_file).fadeOut(6000);
        }
      },
    });
  }
}

var sendMessage = function (socket, exchange, message) {
  socket.send(
    exchange,
    { "content-type": "text/plain" },
    JSON.stringify(message)
  );
  document.getElementById("chat-msg").value = "";
};

$(document).on("click", "#email-btn", async function () {
  email = document.getElementById("sendmail").value;
  subject = document.getElementById("email-subject").value;
  body = document.getElementById("email-body").value;
  var show_html = true;
  await sendEmail(email, subject, body, show_html);
});

$(document).on("click", "#chat-btn", async function () {
  var CYPHER_ENDPOINT = getCypherEndpoint();
  var timeStamp = new Date();
  var sender = localStorage.getItem("loginUser") || getLoginUserId();
  var payload = {
    sender: sender,
    receiver: document.getElementById("customerEmail").value,
    chatmsg: await getEncryptedValue(
      document.getElementById("chat-msg").value,
      CYPHER_ENDPOINT.ENCRYPTIONKEY
    ),
    timestamp: timeStamp.toISOString(),
  };

  var msg = await getEncryptedPayload(payload);

  var html_data_of_chat_div = $("#load-chat").html();
  html_data_of_chat_div += `
        <div class="chat_container">
          <p> ${document.getElementById("chat-msg").value} </p>
          <span class=time-right> ( ${new Date(
            payload.timestamp
          ).toLocaleTimeString()} ) </span>
        </div>`;
  var exchange = "/exchange/web";
  sendMessage(socket, exchange, msg);
  $("#load-chat").html(html_data_of_chat_div).fadeIn("slow");
});

var getRequestPayload = function (payload) {
  var requestPayload = {};
  for (const property in payload) {
    if (
      payload[property] in [null, "undefined"] ||
      payload[property].length == 0
    ) {
      continue;
    }
    requestPayload[property] = payload[property];
  }
  return requestPayload;
};

var getQueryParamString = function (payload) {
  var qpArgsString = "";
  for (const property in payload) {
    qpArgsString += `${property}=${payload[property]}&`;
  }
  qpArgsString = qpArgsString.trim(); // Remove trailing/leading white-space and line terminators if any.
  qpArgsString = qpArgsString.slice(0, -1); // Chop off extra '&'
  return qpArgsString;
};

$(document).on("click", "#update-btn", async function () {
  var EDIT_ENDPOINT = getEditEndpoint();
  var requestUrl = SERVER + EDIT_ENDPOINT;
  var requestMethod = "PUT";
  var payload = {
    email: document.getElementById("updatemail").value,
    name: document.getElementById("id01-name").value,
    phone: document.getElementById("id01-phone").value,
    remfreq: document.getElementById("id01-rem").value,
  };
  // update "name" in cache. After PUT/PATCH operation we don't need to call API
  // to render the users. We'll fetch it from cache
  if (payload.name.length > 0) {
    updateLocalStorageValues(
      "allUsersInDash",
      true,
      "name",
      payload.name,
      "email",
      payload.email
    );
  }
  var requestPayload = getRequestPayload(payload);
  var requestConfigs = {
    url: requestUrl,
    method: requestMethod,
    dataType: "json",
    headers: getHeaders(),
    success: function (data) {
      payload.name = "";
      payload.phone = "";
      payload.remfreq = "";
      getdashBoard(); // Loading Dashboard
    },
  };
  if (Object.keys(payload).length != Object.keys(requestPayload).length) {
    requestMethod = "PATCH";
    const qpArgsString = getQueryParamString(requestPayload);
    const encodedQueryParams = await getEncryptedValue(qpArgsString, "#");
    requestUrl += "?" + encodedQueryParams;
    requestConfigs["url"] = requestUrl;
    requestConfigs["method"] = requestMethod;
  } else {
    requestPayload = await getEncryptedPayload(payload);
    requestConfigs["data"] = requestPayload;
  }
  $.ajax(requestConfigs);
});

$(document).on("click", "#delete-btn", async function () {
  var DELETE_ENDPOINT = getDeleteEndpoint();
  var payload = {
    email: document.getElementById("deletemail").value,
  };
  // delete from cache to avoid calling API to get users
  var usersObject = localStorage.getItem("allUsersInDash");
  if (usersObject) {
    usersObject = JSON.parse(usersObject);
    usersObject = usersObject.filter((item) => item.email !== payload.email);
    localStorage.removeItem("allUsersInDash")
    localStorage.setItem("allUsersInDash", JSON.stringify(usersObject));
  }
  if ($.trim(payload.email) != "") {
    var requestPayload = await getEncryptedPayload(payload);
    $.ajax({
      url: SERVER + DELETE_ENDPOINT,
      method: "DELETE",
      data: requestPayload,
      dataType: "text",
      headers: getHeaders(),
      success: function (data) {
        getdashBoard(); // Loading Dashboard
      },
    });
  }
});

$(document).on("click", "#insert-btn", async function () {
  var ADD_ENDPOINT = getAddEndpoint();
  var payload = {
    email: document.getElementById("id05_email").value,
    name: document.getElementById("id05_name").value,
    phone: document.getElementById("id05_phone").value,
    gst: document.getElementById("id05_gst").value,
    remfreq: document.getElementById("id05_remfreq").value,
  };
  if ($.trim(payload.email) != "") {
    var requestPayload = await getEncryptedPayload(payload);
    $.ajax({
      url: SERVER + ADD_ENDPOINT,
      method: "POST",
      data: requestPayload,
      dataType: "text",
      headers: getHeaders(),
      success: function (data) {
        getdashBoard(); // Loading Dashboard
      },
    });
  }
});

var getLoginUserId = function () {
  var loginUserId = "";
  $.ajax({
    url: `${SERVER}` + "getLoginUser",
    method: "GET",
    headers: getHeaders(),
    async: false,
    success: function (response) {
      loginUserId = response.values[0];
    },
  });
  return loginUserId;
};

var loadChatData = async function (sender, receiver) {
  sender = await getEncryptedValue(sender, "#");
  receiver = await getEncryptedValue(receiver, "#");
  $.ajax({
    url: `${SERVER}chat/receivers/${receiver}/senders/${sender}`,
    method: "GET",
    dataType: "json",
    headers: getHeaders(),
    success: function (response) {
      var chat = response.values;
      var html_file = "";
      for (var i = 0; i < chat.length; i++) {
        html_file += `<div class="chat_container ${chat[i].color}">
                            <p> ${chat[i].msg} </p>
                            <span class=${chat[i].time_loc}> ( ${chat[i].timestamp} ) </span>
                        </div>`;
      }
      $("#load-chat").html(html_file).fadeIn("slow");
    },
  });
};

$(document).ready(function () {
  // disable logs if DEBUG_MODE is off
  if (!DEBUG_MODE_ON) {
    console = console || {};
    console.log = function () {};
  }
  if (localStorage.getItem("x-access-token")) {
    getdashBoard(); // Loading Dashboard
    connectSoket();
    SessionTimeout.init();
  }
  loginUser = getLoginUserId();
  localStorage.setItem("loginUser", loginUser);
  var remainderSent = false;
  var chatLoadedOnce = false;
  setInterval(async function () {
    /* Check if any remainder is pending */
    if (!remainderSent) {
      remainderSent = await processPendingRemainers();
    }

    if ($("#id04").css("display") === "block") {
      var loginUser = null;
      var receiver = $("#customerEmail").attr("value");
      if (!(localStorage.getItem("loginUser") in [null, "undefined"])) {
        loginUser = localStorage.getItem("loginUser");
      } else {
        loginUser = getLoginUserId();
        localStorage.setItem("loginUser", loginUser);
      }
      // load all prev chat once for the login user iff the chat window is opened
      if (!chatLoadedOnce) {
        loadChatData(loginUser, receiver);
        chatLoadedOnce = true;
      }
      var allUsersInDash = getAllUsers();
      allUsersInDash = await getEncryptedValue(allUsersInDash, "#");
      $.ajax({
        url: SERVER + "chat/notification/" + allUsersInDash,
        method: "GET",
        dataType: "json",
        headers: getHeaders(),
        success: function (response) {
          if (response.statusCode == 200) {
            var result = getDecryptedPayload(response.values);
            for (const res in result) {
              if (res === receiver && result[res]) {
                loadChatData(loginUser, receiver);
              }
            }
          }
        },
      });
    }
  }, 2000);
});
