const SERVER = "http://localhost:3000/";

var loadPage = async function () {
  var profileImgString = "";
  var userName = "";
  $.ajax({
    url: SERVER + "getProfilePicture",
    method: "GET",
    async: false,
    dataType: "json",
    success: function (response) {
      profileImgString = response.values[0].url;
      userName = response.values[0].name;
    },
  });
  var html_file = `
    <div class="sidebar">
        <div class avatar_positioning>
        <img src="${profileImgString}" alt="Avatar" class="avatar">
        <h4>${userName}</h4>
        </div>
        <ul>
            <li><a href="#sec1"><i class="fas fa-user"></i>Profile</a></li>
            <li><a href="${SERVER}dashboard"><i class="fas fa-home"></i>Dashboard</a></li>
            <li><a href="#sec2"><i class="fas fa-blog"></i>Blogs</a></li>
            <li><a href="#sec3"><i class="fas fa-address-book"></i>Contact</a></li>
            <li><a href="#sec4"><i class="fas fa-cog"></i>Setting</a></li>
        </ul>
        <div class="social_media">
        <button type="button" class="btn btn-default btn-sm" onclick="location.href='${SERVER}logout'">
            <span class="glyphicon glyphicon-log-out"></span> Log out
        </button>
        </div>
        </div>
        <div class="main_content">
            <div class="info" id="info"></div>
    </div>`;
  $("#wrapper").html(html_file);
};

var getRandomQuote = async function () {
  var quoteResult = {};
  $.ajax({
    url: `${SERVER}` + "getQuotes",
    method: "GET",
    async: false,
    dataType: "json",
    success: function (response) {
      quoteResult = response.values[0];
    },
  });
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
};

function getAddEndpoint() {
  var ADD = "";
  $.ajax({
    url: `${SERVER}` + "constants/routes/upload",
    method: "GET",
    async: false,
    success: function (response) {
      ADD = response.values[0];
    },
  });
  return ADD;
}

$(document).on("click", "#insert-btn", async function () {
  $("form").submit(function (evt) {
    var ADD_ENDPOINT = getAddEndpoint();
    evt.preventDefault();
    var formData = new FormData(document.getElementById("myform"));
    $.ajax({
      url: SERVER + ADD_ENDPOINT,
      method: "POST",
      data: formData,
      async: false,
      cache: false,
      contentType: false,
      enctype: "multipart/form-data",
      processData: false,
      success: function (response) {
        loadPage();
        getRandomQuote();
      },
    });
    return false;
  });
});

$(document).ready(function () {
  loadPage();
  // load the random quote when the page is refreshed or being loaded for the first time
  getRandomQuote();

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
    getRandomQuote();
  }, 360000); // API from https://quotes.rest/ is allowing 10 calls/hr
});
