function debounce(func, threshold) {
  var timeout;

  return function () {
    var context = this,
      args = arguments;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(function () {
      func.apply(context, args);
      timeout = null;
    }, threshold || 250);
  };
}

var removeSessionData = function () {
  localStorage.removeItem("x-access-token");
  localStorage.removeItem("routes");
  localStorage.removeItem("loginUser");
  localStorage.removeItem("allUsersInDash")
};

SessionTimeout = (function () {
  var session_duration = 600,
    session_timeout_id,
    logout_duration = 30,
    session_timeout_duration = (session_duration - logout_duration) * 1000,
    logout_id,
    logout_timeout_duration = logout_duration * 1000,
    events = "keydown mousedown",
    notification_element;

  return {
    init: function () {
      var that = this;

      $(document).on(
        $.trim((events + " ").split(" ").join(".sessiontimer ")),
        debounce(function () {
          that.handler.apply(that);
        }, 500)
      );

      this.startIdleTimeout();
    },

    handler: function () {
      // reset session timeout
      clearTimeout(session_timeout_id);

      this.startIdleTimeout();
    },

    startIdleTimeout: function () {
      var that = this;

      session_timeout_id = setTimeout(function () {
        that.idle.apply(that);
      }, session_timeout_duration);
    },

    idle: function () {
      // create bar
      notification_element = this.createTimeoutNotification();

      // display bar
      notification_element.slideDown();

      // remove events
      $(document).unbind(".sessiontimer");

      // start logout timeout
      this.startLogoutTimeout();

      // start logout countdown
      this.startLogoutCountdown();

      // add logout events
      this.attachTimeoutNotificationEvents();
    },

    createTimeoutNotification: function () {
      var notification_element = $(
        '<div class="session-timeout-notification">'
      ).html(function () {
        return [
          '<strong>Warning!</strong> You will be logged off in <strong class="time">' +
            logout_duration +
            "</strong> seconds due to inactivity. ",
          '<a href="#">Click to continue session</a>',
        ].join("");
      });

      notification_element.prependTo("body");

      return notification_element;
    },

    removeTimeoutNotification: function () {
      notification_element.slideUp(400, function () {
        $(this).remove();
      });
    },

    attachTimeoutNotificationEvents: function () {
      var that = this,
        dismiss_element = notification_element.find("a");

      dismiss_element.on("click", function () {
        // reset timer to prevent logout
        clearTimeout(logout_id);

        that.removeTimeoutNotification();

        that.init();
      });
    },

    startLogoutTimeout: function () {
      var that = this;

      logout_id = setTimeout(function () {
        removeSessionData();
        alert("REDIRECT:LOGOUT");
        window.location = `http://localhost:3000/login`;
        that.removeTimeoutNotification.apply(that);
      }, logout_timeout_duration);
    },

    startLogoutCountdown: function (time) {
      var that = this,
        time = time || logout_duration - 1;

      setTimeout(function () {
        notification_element.find(".time").html(time);

        time--;

        if (time > 0) {
          that.startLogoutCountdown.call(that, time);
        }
      }, 1000);
    },
  };
})();
