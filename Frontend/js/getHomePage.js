const SERVER = "http://localhost:3000/";

var getHeaders = function () {
  var headers = {
    "x-access-token": localStorage.getItem("x-access-token"),
  };
  return headers;
};

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

var loadPage = async function () {
  var profileImgString = "";
  var userName = "";
  $.ajax({
    url: SERVER + "getProfilePicture",
    method: "GET",
    dataType: "json",
    headers: getHeaders(),
    success: function (response) {
      profileImgString = response.values[0].url;
      userName = response.values[0].name;
      var html_file = `
        <div class="sidebar">
            <div class avatar_positioning id="avatar_positioning">
              <img src="${profileImgString}" alt="Avatar" class="avatar" id="avatar">
            </div>
            <div id="user-name" contenteditable="true"><h4 id="name">${userName}</h4></div>
            <ul>
                <li><a href="#sec1"><i class="fas fa-user"></i>Profile</a></li>
                <li><a href="${SERVER}dashboard"><i class="fas fa-home"></i>Dashboard</a></li>
                <li><a href="#sec2"><i class="fas fa-blog"></i>Blogs</a></li>
                <li><a href="#sec3"><i class="fas fa-address-book"></i>Contact</a></li>
                <li><a href="#sec4"><i class="fas fa-cog"></i>Setting</a></li>
            </ul>
            <div class="social_media">
            <button type="button" class="btn btn-default btn-sm" id="log-out-btn">
                <span class="glyphicon glyphicon-log-out"></span> Log out
            </button>
            </div>
            </div>
            <div class="main_content">
                <div class="info" id="info"></div>
          </div>`;
      $("#wrapper").html(html_file);
    },
  });
};

var loadAvatarDiv = async function () {
  var profileImgString = "";
  $.ajax({
    url: SERVER + "getProfilePicture",
    method: "GET",
    headers: getHeaders(),
    dataType: "json",
    success: function (response) {
      profileImgString = response.values[0].url;
      var html_file = `<img src="${profileImgString}" alt="Avatar" class="avatar" id="avatar">`;
      $("#avatar_positioning").html(html_file);
    },
  });
};

var getRandomQuote = async function () {
  var quoteResult = {};
  $.ajax({
    url: `${SERVER}` + "getQuotes",
    method: "GET",
    headers: getHeaders(),
    dataType: "json",
    success: function (response) {
      quoteResult = response.values[0];
      var html_file = `
        <div class="header">${quoteResult.title}</div>
        <div class="section_main01">
        <div id="quote_container">
        <img src="${quoteResult.imgUrl}" style="width:100%;height:100%">
        <div class="text-block">
            <h4>${quoteResult.quote}</h4>
            <p><i>-${quoteResult.author}</i></p>
        </div>
        <p><span style="color:green;"><strong>Credit: </strong></span><a>${quoteResult.credit}</a></p>
        </div>
        <div class="section_main" id="sec1" >
          <div style="height: 50px;width:100%;">
            <h2># Profile Section</h2>
            <p><i>Update Profile Picture</i></p>
            <form id="myform">
              <input type="file" name="image" id="id_img" required/>
              <button class="insert-button button1" id="insert-btn">Submit</button>
            </form>
          </div>
        </div>`;
      $("#info").html(html_file).fadeIn("slow");
    },
  });
};

function getAddEndpoint() {
  var ADD = "";
  $.ajax({
    url: `${SERVER}` + "constants/routes/upload",
    method: "GET",
    headers: getHeaders(),
    async: false,
    success: function (response) {
      ADD = response.values[0];
    },
  });
  return ADD;
}

function getEditEndpoint() {
  var EDIT = "";
  $.ajax({
    url: `${SERVER}` + "constants/routes/edit",
    method: "GET",
    headers: getHeaders(),
    async: false,
    success: function (response) {
      EDIT = response.values[0];
    },
  });
  return EDIT;
}

function getLogOutEndpoint() {
  var LOGOUT = "";
  $.ajax({
    url: `${SERVER}` + "constants/routes/logout",
    method: "GET",
    headers: getHeaders(),
    async: false,
    success: function (response) {
      LOGOUT = response.values[0];
    },
  });
  return LOGOUT;
}

function getLandingPageEndpoint() {
  var LANDINGPAGE_ENDPOINT = "";
  $.ajax({
    url: `${SERVER}` + "constants/routes/landingpage",
    method: "GET",
    headers: getHeaders(),
    async: false,
    success: function (response) {
      LANDINGPAGE_ENDPOINT = response.values[0];
    },
  });
  return LANDINGPAGE_ENDPOINT;
}

var removeSessionData = function () {
  localStorage.removeItem("x-access-token");
  localStorage.removeItem("routes");
  localStorage.removeItem("loginUser");
  localStorage.removeItem("allUsersInDash");
};

async function performLogoutTask(LOGOUT_ENDPOINT) {
  var payload = {};
  $.ajax({
    url: SERVER + LOGOUT_ENDPOINT,
    method: "POST",
    dataType: "json",
    headers: getHeaders(),
    success: function (response) {
      if (
        response.statusCode === 200 &&
        !response.values[0].auth &&
        !response.values[0].token
      ) {
        removeSessionData();
        window.location = response.values[0].link;
      }
    },
  });
}

$(document).on("click", "#log-out-btn", async function () {
  var LOGOUT_ENDPOINT = getLogOutEndpoint();
  await performLogoutTask(LOGOUT_ENDPOINT);
});

$(document).one("click", "#insert-btn", async function () {
  $("form").submit(function (evt) {
    var ADD_ENDPOINT = getAddEndpoint();
    evt.preventDefault();
    var formData = new FormData(document.getElementById("myform"));
    $.ajax({
      url: SERVER + ADD_ENDPOINT,
      method: "POST",
      headers: getHeaders(),
      data: formData,
      cache: false,
      contentType: false,
      enctype: "multipart/form-data",
      processData: false,
      success: function () {
        document.getElementById("id_img").value = null;
        formData = null;
        loadAvatarDiv();
      },
    });
    return false;
  });
});

var isClickedInsideElement = function (event, container, element) {
  return (
    event.target.id == container.attr("id") ||
    $(event.target).parents(element).length
  );
};

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

var equal = function (str1, str2) {
  return str1 == str2;
};

var localStore = {
  isClickedBefore: false,
  contentBeforeChange: "",
};

$(document).mouseup(async function (event) {
  var container = $("#user-name");
  var isClickedInside = isClickedInsideElement(event, container, "#user-name");
  var isClickedBefore = localStore.isClickedBefore;
  var contentBeforeChange = localStore.contentBeforeChange;
  var satisfying = isClickedInside && !isClickedBefore && !contentBeforeChange;
  if (satisfying) {
    localStore["isClickedBefore"] = true;
    if (!contentBeforeChange) {
      var contentEditable = document.querySelector("[contenteditable]");
      localStore["contentBeforeChange"] = contentEditable.textContent;
    }
  }
  var elementChanged =
    !isClickedInsideElement(event, container, "#user-name") &&
    localStore.isClickedBefore;
  if (elementChanged) {
    localStore["isClickedBefore"] = false;
    var contentEditable = document.querySelector("[contenteditable]");
    var contentAfterChange = contentEditable.textContent;
    var contentBeforeChange = localStore.contentBeforeChange;
    localStore["contentBeforeChange"] = "";
    if (
      contentAfterChange.length > 0 &&
      !equal(contentAfterChange, contentBeforeChange)
    ) {
      const editUrl = getEditEndpoint();
      const qpArgsString = `name=${contentAfterChange}&email=${getLoginUserId()}`;
      const encodedQueryParams = await getEncryptedValue(qpArgsString, "#");
      $.ajax({
        url: SERVER + editUrl + "?" + encodedQueryParams,
        method: "PATCH",
        headers: getHeaders(),
        dataType: "json",
        success: function () {},
      });
    }
  }
});

$(document).ready(function () {
  if (localStorage.getItem("x-access-token")) {
    $.getScript(
      "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js"
    );
    loadPage();

    // load the random quote when the page is refreshed or being loaded for the first time
    getRandomQuote();
  }

  $("a").on("click", function (event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $("html, body").animate(
        { scrollTop: $(hash).offset().top },
        800,
        function () {
          // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = hash;
        }
      );
    } // End if
  });

  setInterval(async function () {
    if (localStorage.getItem("x-access-token")) {
      getRandomQuote();
    }
  }, 360000); // API from https://quotes.rest/ is allowing 10 calls/hr
});
