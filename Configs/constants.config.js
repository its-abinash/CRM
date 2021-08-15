const redis = require("redis");
const { promisifyAll } = require("bluebird");

promisifyAll(redis); // This enables async/await functionality with redis

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

module.exports = {
  CORE: {
    PORT: process.env.APP_PORT,
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
    USERS_MAP: 2,
    MAPPING: {
      "image": "media"
    }
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
    RI_006: "Successfully fetched the {0}",
    RI_007: "Successfully removed {0} of user having userId: {1}",
    RI_008: "Failed to remove {0} of user having userId: {1}",
    RI_009: "Successfully updated {0} of user having userId: {1}",
    RI_010: "Failed to update {0} of user having userId: {1}",
    RI_011: "Successfully inserted {0} of user having userId: {1}",
    RI_012: "Failed to insert {0} of user having userId: {1}",
    RI_013: "Successfully sent email to user with userId: {0}",
    RI_014: "Failed to send email to user with userId: {0}",
    RI_015: "User has logged-out or session has expired for the user",
    RI_016: "User: {0} has successfully registered",
    RI_017: "Getting exception: {0} while registering user: {1}",
    RI_018: "Failed to register user: {0}, due to error: {1}",
    RI_019: "User: {0} has successfully logged-in",
    RI_020: "Getting exception: {0} while logging in user: {1}",
    RI_021: "Failed to logging in user: {0}, due to error: {1}",
    RI_022: "User: {0} already exists in our database, try login using your credentials",
    RI_023: "Failed to authenticate token",
    RI_024: "Successfully authenticated token",
    RI_025: "Getting exception: {0} while logout",
    RI_026: "Getting exception: {0} while sending chat messages",
    RI_027: "Getting exception: {0} while updating user data",
    RI_028: "Getting exception: {0} while inserting profile picture",
    RI_029: "Getting exception: {0} while emailing",
    RI_030: "Getting exception: {0} while inserting user data",
    RI_031: "User: {0} has successfully logged-out",
    RI_032: "Invalid Query Parameters Received: {0}",
    RI_033: "Empty properties found in request payload or in query params: {0}"
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
  },
};

module.exports.redisClient = redisClient;
