const redis = require("redis");
const session = require("express-session");
const redisStore = require("connect-redis")(session);

module.exports = {
  CORE: {
    PORT: process.env.APP_PORT,
    SESSION_PARAMETERS: {
      secret: process.env.REDIS_SECRET,
      rolling: true,           //Reset the cookie Max-Age on every request
      resave: true,            //Save the session to store if it has changed
      saveUninitialized: true, //Don't create a session for anonymous users
      cookie: { maxAge: 30 * 60 * 1000 }, // 30 min
      store: new redisStore({
        client: redis.createClient({
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
          password: process.env.REDIS_PASSWORD
        }),
      }),
    },
    STATIC_VIEW_PATH: "/Frontend",
    VIEW_ENGINE_NAME: "ejs",
    VIEW_ENGINE_ID: "view engine",
    VIEWS_NAME: "./Frontend/",
    VIEWS_ID: "views",
    URL_ENCODED_BODY: { extended: true },
  },
  LOGGER: {
    TIMESTAMP: "DD-MM-YY HH:MM:SS",
    LOG_PATH: "logs/app.log",
    LEVEL: "info",
    LOG_SIZE: 5242880, // 5 MB
  },
  DATABASE: {
    FETCH_ALL: 1,
    FETCH_SPECIFIC: 2,
    CREDENTIALS: 1,
    CUSTOMER: 3,
    CONVERSATION: 4,
    USERS_MAP: 2
  },
  CSS: {
    CHAT_TIME_LOC: "time_loc",
    CHAT_COL: "color",
    CHAT_FLOAT_RIGHT: "time-right",
    CHAT_FLOAT_LEFT: "time-left",
    CHAT_SENDER_COL: "",
    CHAT_RECEIVER_COL: "darker",
  },
  CYPHER: {
    ENCRYPTION_KEY: "#",
    DECRYPTION_KEY: "#",
  },
  ResponseIds: {
    RI_001: "Conversations between userId: {0} and userId: {1} are successfully retrieved",
    RI_002: "Error from database while saving conversation between userId: {0} and userId: ${1}",
    RI_003: "Conversations between userId: {0} and userId: {1} are successfully inserted in Database",
    RI_004: "Invalid payload/request_body",
    RI_005: "Execution of {0} {1} finished in {2} msecs, which has generated {3} MB of memory",
    RI_006: "Successfully fetched the {0} with value = {1}",
    RI_007: "Successfully removed {0} of user having userId: {1}",
    RI_008: "Failed to remove {0} of user having userId: {1}",
    RI_009: "Successfully updated {0} of user having userId: {1}",
    RI_010: "Failed to update {0} of user having userId: {1}",
    RI_011: "Successfully inserted {0} of user having userId: {1}",
    RI_012: "Failed to insert {0} of user having userId: {1}",
    RI_013: "Successfully sent email to user with userId: {0}",
    RI_014: "Failed to send email to user with userId: {0}"
  },
  URL: {
    defaultProfilePictureUrl: "https://www.w3schools.com/howto/img_avatar.png",
    defaultQuoteCreditUrl: "https://theysaidso.com/quote/marva-collins-dont-try-to-fix-the-students-fix-ourselves-first-the-good-teacher",
    defaultQuoteBGImg: "https://theysaidso.com/img/qod/qod-students.jpg",
    defaultGETCategoryUrl: "https://quotes.rest/qod/categories?language=en"
  },
  StringConstant: {
    defaultQuote: "Don't try to fix the students, fix ourselves first. The good teacher makes the poor student good and the good student superior. When our students fail, we, as teachers, too, have failed.",
    defaultAuthor: "Marva Collins",
    defaultTitle: "Quote of the day for students",
  }
};
