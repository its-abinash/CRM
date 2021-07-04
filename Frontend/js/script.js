const SERVER = "http://localhost:3000/";

var loadLandingPage = async function () {
  var html_file = `
  <div class="container" id="container">
      <div class="form-container sign-up-container">
        <form id="sign-up-form">
          <h1>Create Account</h1>
          <input
            type="text"
            placeholder="Name"
            name="username"
            id="username"
            autocomplete="off"
            required
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            name="phonenum"
            id="phonenum"
            autocomplete="off"
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            id="sign-up-email"
            autocomplete="off"
            required
          />
          <input
            type="text"
            name="gstnum"
            id="gstnum"
            placeholder="GST Number"
            autocomplete="off"
            required
          />
          <input
            type="number"
            placeholder="Reminder Frequency"
            name="remfreq"
            id="remfreq"
            autocomplete="off"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="sign-up-password"
            autocomplete="off"
            required
          />
          <input
            type="password"
            placeholder="Google App Password"
            name="passcode"
            id="sign-up-passcode"
            autocomplete="off"
            required
          />
          <button id="sign-up-btnn">Sign Up</button>
        </form>
      </div>
      <div class="form-container sign-in-container">
        <form id="log-in-form">
          <h1>Sign in</h1>
          <input
            type="text"
            placeholder="Email"
            name="email"
            id="sign-in-email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="sign-in-password"
            required
          />
          <a href="#">Forgot your password?</a>
          <button id="sign-in-btnn">Sign In</button>
        </form>
      </div>
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>Hello!</h1>
            <p>Sign In here</p>
            <button class="ghost" id="signIn">Sign In</button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>Hello!</h1>
            <p>Join Us</p>
            <button class="ghost" id="signUp">Sign Up</button>
          </div>
        </div>
      </div>
    </div>`;
  $("#row").html(html_file);
};

function getSignUpEndpoint() {
  var SIGNUP_ROUTE = "";
  $.ajax({
    url: `${SERVER}` + "constants/routes/reg",
    method: "GET",
    async: false,
    success: function (response) {
      SIGNUP_ROUTE = response.values[0];
    },
  });
  return SIGNUP_ROUTE;
}

function getSignInEndpoint() {
  var SIGNIN_ROUTE = "";
  $.ajax({
    url: `${SERVER}` + "constants/routes/login",
    method: "GET",
    async: false,
    success: function (response) {
      SIGNIN_ROUTE = response.values[0];
    },
  });
  return SIGNIN_ROUTE;
}

function getHomeEndpoint() {
  var HOME_ROUTE = "";
  $.ajax({
    url: `${SERVER}` + "constants/routes/home",
    method: "GET",
    async: false,
    success: function (response) {
      HOME_ROUTE = response.values[0];
    },
  });
  return HOME_ROUTE;
}

function getEncryptedValue(key, ENCRYPTION_KEY) {
  var encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(key),
    ENCRYPTION_KEY
  ).toString();
  // Converting into base64 string
  var wordArray = CryptoJS.enc.Utf8.parse(String(encrypted));
  encrypted = CryptoJS.enc.Base64.stringify(wordArray).toString();
  return encrypted;
}

var getEncryptedPayload = function (payload) {
  payload = getEncryptedValue(payload, "#");
  return payload;
};

var resetSignUpFormProperties = async function () {
  document.getElementById("username").value = "";
  document.getElementById("phonenum").value = "";
  document.getElementById("sign-up-email").value = "";
  document.getElementById("gstnum").value = "";
  document.getElementById("remfreq").value = "";
  document.getElementById("sign-up-password").value = "";
  document.getElementById("sign-up-passcode").value = "";
};

var resetSignInFormProperties = async function () {
  document.getElementById("sign-in-email").value = "";
  document.getElementById("sign-in-password").value = "";
};

var getErrorPopUpHTML = function (response) {
  var html_file = "<strong>Error!</strong> ";
  for (var i = 0; i < response.reasons.length; i++) {
    html_file += `${response.reasons[i]}; `;
  }
  html_file = html_file.trim(); // remove extra white-spaces
  html_file = html_file.slice(0, -1); // chop off last ; [semi-colon]
  return html_file;
};

var submitSignUpForm = async function () {
  $(document).off("click", "#sign-up-btnn");
  $("form").submit(function (evt) {
    var SIGNUP_ROUTE = getSignUpEndpoint();
    evt.preventDefault();
    var payload = {
      username: $("#username").val(),
      phonenum: $("#phonenum").val(),
      email: $("#sign-up-email").val(),
      gstnum: $("#gstnum").val(),
      remfreq: $("#remfreq").val(),
      password: $("#sign-up-password").val(),
      passcode: $("#sign-up-passcode").val(),
    };
    var requestPayload = getEncryptedPayload(payload);
    $.ajax({
      url: SERVER + SIGNUP_ROUTE,
      method: "POST",
      data: requestPayload,
      async: false,
      dataType: "json",
      success: function (response) {
        resetSignUpFormProperties();
        var html_file = `<strong>Success!</strong> ${response.reasons[0]}`;
        $("#popup-msg").fadeIn(0).html(html_file).fadeOut(8000);
      },
      error: function (response) {
        response = $.parseJSON(response.responseText);
        resetSignUpFormProperties();
        var html_file = getErrorPopUpHTML(response);
        $("#popup-msg").fadeIn(0).html(html_file).fadeOut(8000);
      },
    });
    return false;
  });
};

var submitSignInForm = async function () {
  $(document).off("click", "#sign-in-btnn");
  $("form").submit(function (evt) {
    var SIGNIN_ROUTE = getSignInEndpoint();
    evt.preventDefault();
    var payload = {
      email: $("#sign-in-email").val(),
      password: $("#sign-in-password").val(),
    };
    var requestPayload = getEncryptedPayload(payload);
    $.ajax({
      url: SERVER + SIGNIN_ROUTE,
      method: "POST",
      data: requestPayload,
      async: false,
      dataType: "json",
      success: function (response) {
        resetSignInFormProperties();
        if (
          response.statusCode === 200 &&
          response.values[0].auth &&
          response.values[0].token
        ) {
          localStorage.setItem("x-access-token", response.values[0].token);
          window.location = response.values[0].link;
        }
      },
      error: function (response) {
        resetSignInFormProperties();
        response = $.parseJSON(response.responseText);
        var html_file = getErrorPopUpHTML(response);
        $("#popup-msg").fadeIn(0).html(html_file).fadeOut(8000);
      },
    });
    return false;
  });
};

$(document).on("click", "#sign-up-btnn", submitSignUpForm);
$(document).on("click", "#sign-in-btnn", submitSignInForm);

$(document).ready(function () {
  loadLandingPage(); // Loading LoginPage [or, Landing Page]
  $.getScript(
    "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js"
  );
  const signUpButton = document.getElementById("signUp");
  const signInButton = document.getElementById("signIn");
  const container = document.getElementById("container");

  if (signUpButton) {
    signUpButton.addEventListener("click", () => {
      container.classList.add("right-panel-active");
    });
  }

  if (signInButton) {
    signInButton.addEventListener("click", () => {
      container.classList.remove("right-panel-active");
    });
  }
});
