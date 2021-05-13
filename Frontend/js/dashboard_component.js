const SERVER = "http://localhost:3000/";

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

function getChatEndpoint() {
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
    async: false,
    success: function (response) {
      is_admin = response.values[0];
    },
  });
  return is_admin;
}

async function getdashBoard() {
  var ROUTES = {};
  await $.getScript(
    "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js"
  );
  $.ajax({
    url: `${SERVER}` + "constants/routes",
    method: "GET",
    dataType: "json",
    async: false,
    success: function (response) {
      ROUTES = response.values[0];
    },
  });
  var is_admin = checkUserType();
  $.ajax({
    url:
      SERVER +
      (is_admin === true ? ROUTES.DASHBOARD.CUSTOMER : ROUTES.DASHBOARD.ADMIN),
    method: "GET",
    dataType: "json",
    success: function (response) {
      var responseValue = response.values;
      var html_file = "";
      for (var i = 0; i < responseValue.length; i++) {
        html_file += `<div class="column">
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
                                <input type="number" placeholder="reminder frequency" id="id01-rem" name="remfreq">
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
    },
  });
}

async function getEncryptedValue(key, ENCRYPTION_KEY) {
  var encrypted = CryptoJS.AES.encrypt(key, ENCRYPTION_KEY);
  return encrypted.toString();
}

async function sendEmail(email, subject, body, show_html = false) {
  var EMAIL_ENDPOINT = getEmailEndpoint();
  var CYPHER_ENDPOINT = getCypherEndpoint();
  var payload = {
    email: email,
    subject: await getEncryptedValue(subject, CYPHER_ENDPOINT.ENCRYPTIONKEY),
    body: await getEncryptedValue(body, CYPHER_ENDPOINT.ENCRYPTIONKEY),
  };
  if (
    $.trim(payload.subject) != "" &&
    $.trim(payload.body) != "" &&
    $.trim(payload.email) != ""
  ) {
    $.ajax({
      url: SERVER + EMAIL_ENDPOINT,
      method: "POST",
      data: payload,
      dataType: "text",
      success: function () {
        if (show_html) {
          document.getElementById("email-subject").value = "";
          document.getElementById("email-body").value = "";
          var html_file = `<div class="alert success">
                <span class="closebtn">&times;</span>
                <strong>Success!</strong> Your email has been sent to <i>${payload.email}</i>.
                </div>`;
          $("#email-status").html(html_file).fadeIn("slow");
        }
      },
      error: function (response) {
        if (show_html) {
          var html_file = `<div class="alert">
                <span class="closebtn">&times;</span>
                <strong>Dang!</strong> Failed to send email to ${payload.email}.
                </div>`;
          $("#email-status").html(html_file).fadeIn("slow");
        }
      },
    });
  }
}

$(document).on("click", "#email-btn", async function () {
  email = document.getElementById("sendmail").value;
  subject = document.getElementById("email-subject").value;
  body = document.getElementById("email-body").value;
  await sendEmail(email, subject, body, (show_html = true));
});
$(document).on("click", "#chat-btn", async function () {
  var CHAT_ENDPOINT = getChatEndpoint();
  var CYPHER_ENDPOINT = getCypherEndpoint();
  var timeStamp = new Date();
  var payload = {
    receiver: document.getElementById("customerEmail").value,
    chatmsg: await getEncryptedValue(
      document.getElementById("chat-msg").value,
      CYPHER_ENDPOINT.ENCRYPTIONKEY
    ),
    timestamp: timeStamp.toISOString(),
  };
  if ($.trim(payload.chatmsg) != "") {
    $.ajax({
      url: SERVER + CHAT_ENDPOINT,
      method: "POST",
      data: payload,
      dataType: "text",
      success: function () {
        document.getElementById("chat-msg").value = "";
      },
      error: function (err) {
        // Handle this with more interactive way -- todo --
        // alert("exception");
      },
    });
  }
});
$(document).on("click", "#update-btn", async function () {
  var EDIT_ENDPOINT = getEditEndpoint();
  var payload = {
    email: document.getElementById("updatemail").value,
    remfreq: document.getElementById("id01-rem").value,
  };
  if ($.trim(payload.email) != "") {
    $.ajax({
      url: SERVER + EDIT_ENDPOINT,
      method: "POST",
      data: payload,
      dataType: "json",
      success: function (data) {
        payload.name = "";
        payload.phone = "";
        payload.remfreq = "";
        getdashBoard(); // Loading Dashboard
      },
    });
  }
});

$(document).on("click", "#delete-btn", async function () {
  var DELETE_ENDPOINT = getDeleteEndpoint();
  var payload = {
    email: document.getElementById("deletemail").value,
  };
  if ($.trim(payload.email) != "") {
    $.ajax({
      url: SERVER + DELETE_ENDPOINT,
      method: "POST",
      data: payload,
      dataType: "text",
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
    $.ajax({
      url: SERVER + ADD_ENDPOINT,
      method: "POST",
      data: payload,
      dataType: "text",
      success: function (data) {
        getdashBoard(); // Loading Dashboard
      },
    });
  }
});

$(document).ready(function () {
  getdashBoard(); // Loading Dashboard
  var remainderSent = false;
  var CHAT = null;
  setInterval(async function () {
    /* Check if any remainder is pending */
    if (!remainderSent) {
      remainderSent = await processPendingRemainers();
    }

    if ($("#id04").css("display") === "block") {
      if (!CHAT) {
        CHAT = getChatEndpoint();
      }
      var receiver = $("#customerEmail").attr("value");
      $.ajax({
        url: `${SERVER + CHAT}/${receiver}`,
        method: "GET",
        dataType: "json",
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
    }
  }, 1000);
});
