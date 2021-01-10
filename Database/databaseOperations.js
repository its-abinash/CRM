const { Pool, Client } = require("pg");
var fs = require("fs");
var logger = require("../Backend/Logger/log");
var ENV = JSON.parse(fs.readFileSync("./Configs/db.config.json", "utf8"));
var { DATABASE } = require("../Configs/constants.config");

const pool = new Pool({
  connectionString: `${ENV.connectionString}`,
});

/**
 * @function insertAtCred
 * @async
 * @description Save the credentials of user in table of db
 * @param {Array} data
 * @returns Acknowledgement of the operation(Boolean)
 */
var insertAtCred = async function (data) {
  try {
    logger.info("Connecting to 'credentials' database");
    const db = await pool.connect();
    logger.info("***************************************");
    logger.info("Connection established to 'credentials' database");
    const query = `INSERT INTO credentials (email, password, passcode) VALUES ($1, $2, $3)`;
    logger.info("Executing query in 'credentials' database");
    await db.query(query, data);
    logger.info("Execution successful, so disconnecting database");
    db.release();
    return true;
  } catch (ex) {
    logger.info("***************************************");
    logger.error(
      `Tracked error in \'credentials\' database ===> ${JSON.stringify(ex)}`
    );
    return false;
  } finally {
    console.log("Task in 'credentials' database has been done. Now it Quits");
    logger.info("***************************************");
  }
};

/**
 * @function insertAtCustomer
 * @async
 * @description Save the data of user in table of db
 * @param {Array} data
 * @returns Acknowledgement of the operation(Boolean)
 */
var insertAtCustomer = async function (data) {
  try {
    logger.info("Connecting to 'customer' database");
    const db = await pool.connect();
    logger.info("***************************************");
    logger.info("Connection established to 'customer' database");
    const query = `INSERT INTO customer (name, email, phone, gst, remfreq, next_remainder) VALUES ($1, $2, $3, $4, $5, $6)`;
    logger.info("Executing query in 'customer' database");
    await db.query(query, data);
    logger.info("Execution successful, so disconnecting database");
    db.release();
    return true;
  } catch (ex) {
    logger.info("***************************************");
    logger.error(
      `Tracked error in \'customer\' database ===> ${JSON.stringify(ex)}`
    );
    return false;
  } finally {
    console.log("Task in 'customer' database has been done. Now it Quits");
    logger.info("***************************************");
  }
};

/**
 * @function fetchAllFromCred
 * @async
 * @description Get all credentials from table in db
 * @returns Credentials
 */
var fetchAllFromCred = async function () {
  try {
    logger.info("Connecting to 'credentials' database");
    const db = await pool.connect();
    logger.info("***************************************");
    logger.info("Connection established to 'credentials' database");
    const query = `SELECT * FROM credentials`;
    logger.info("Executing query in 'credentials' database");
    var res = await db.query(query);
    logger.info("Execution successful, so disconnecting database");
    db.release();
    console.log(res.rows);
    return res.rows;
  } catch (ex) {
    logger.info("***************************************");
    logger.error(
      `Tracked error in \'credentials\' database ===> ${JSON.stringify(ex)}`
    );
    return [];
  } finally {
    console.log("Task in 'credentials' database has been done. Now it Quits");
    logger.info("***************************************");
  }
};

/**
 * @function fetchAllFromCustomer
 * @async
 * @description Gets all data of customers
 * @returns Data of customers
 */
var fetchAllFromCustomer = async function () {
  try {
    logger.info("Connecting to 'customer' database");
    const db = await pool.connect();
    logger.info("***************************************");
    logger.info("Connection established to 'customer' database");
    const query = `SELECT * FROM customer`;
    logger.info("Executing query in 'customer' database");
    var res = await db.query(query);
    logger.info("Execution successful, so disconnecting database");
    db.release();
    console.log(res.rows);
    return res.rows;
  } catch (ex) {
    logger.info("***************************************");
    logger.error(
      `Tracked error in \'customer\' database ===> ${JSON.stringify(ex)}`
    );
    return [];
  } finally {
    console.log("Task in 'customer' database has been done. Now it Quits");
    logger.info("***************************************");
  }
};

/**
 * @function fetchSpecificFromCustomer
 * @async
 * @description Gets specific data of a customer according to the given filter
 * @param {string} pk_name
 * @param {string} pk_value
 */
var fetchSpecificFromCustomer = async function (pk_name, pk_value) {
  try {
    logger.info("Connecting to 'customer' database");
    const db = await pool.connect();
    logger.info("***************************************");
    logger.info("Connection established to 'customer' database");
    const query = `SELECT * FROM customer WHERE ${pk_name} = $1`;
    logger.info("Executing query in 'customer' database");
    var res = await db.query(query, [pk_value]);
    logger.info("Execution successful, so disconnecting database");
    db.release();
    return res.rows;
  } catch (ex) {
    logger.info("***************************************");
    logger.error(
      `Tracked error in \'customer\' database ===> ${JSON.stringify(ex)}`
    );
    return [];
  } finally {
    console.log("Task in 'customer' database has been done. Now it Quits");
    logger.info("***************************************");
  }
};

/**
 * @function fetchSpecificFromCred
 * @async
 * @description Gets specific credential of a user
 * @param {string} pk_name
 * @param {string} pk_value
 * @returns Specific Creds
 */
var fetchSpecificFromCred = async function (pk_name, pk_value) {
  try {
    logger.info("Connecting to 'credentials' database");
    const db = await pool.connect();
    logger.info("***************************************");
    logger.info("Connection established to 'credentials' database");
    const query = `SELECT * FROM credentials WHERE ${pk_name} = $1`;
    logger.info("Executing query in 'credentials' database");
    var res = await db.query(query, [pk_value]);
    logger.info("Execution successful, so disconnecting database");
    db.release();
    return res.rows;
  } catch (ex) {
    logger.info("***************************************");
    logger.error(
      `Tracked error in \'credentials\' database ===> ${JSON.stringify(ex)}`
    );
    return [];
  } finally {
    console.log("Task in 'credentials' database has been done. Now it Quits");
    logger.info("***************************************");
  }
};

/**
 * @function fetchAllUserOfGivenType
 * @async
 * @description Fetches all users of one of the types: [admin or customer]
 * @param {Array} is_admin
 * @returns List of users of given type
 */
exports.fetchAllUserOfGivenType = async function (is_admin=[false]) {
  try {
    logger.info("Connecting to 'credentials' database");
    const db = await pool.connect();
    logger.info("***************************************");
    logger.info("Connection established to 'credentials' database");
    const query = `select customer.email, customer.name
                   from customer
                   inner join credentials
                   on credentials.email = customer.email
                   where credentials.is_admin = $1;`;
    logger.info("Executing query in 'credentials' database");
    var res = await db.query(query, is_admin);
    logger.info("Execution successful, so disconnecting database");
    db.release();
    return res.rows;
  } catch (ex) {
    logger.info("***************************************");
    logger.error(
      `Tracked error in \'credentials\' database ===> ${JSON.stringify(
        ex,
        null,
        3
      )}`
    );
    return [];
  } finally {
    console.log("Task in 'credentials' database has been done. Now it Quits");
    logger.info("***************************************");
  }
};



/**
 * @function updateAtCred
 * @async
 * @description Update credentials of user onclick 'forgot password/email'
 * @param {string} pk_name
 * @param {string} pk_value
 * @param {Array} fields
 * @param {Array} data
 * @returns Acknowledgement of the operation(Boolean)
 */
var updateAtCred = async function (pk_name, pk_value, fields, data) {
  try {
    logger.info("Connecting to 'credentials' database");
    const db = await pool.connect();
    logger.info("***************************************");
    logger.info("Connection established to 'credentials' database");
    logger.info("Executing query in 'credentials' database");
    for (var i = 0; i < fields.length; i++) {
      const query = `UPDATE credentials SET ${fields[i]} = $1 WHERE ${pk_name} = $2`;
      await db.query(query, [data[i], pk_value]);
    }
    logger.info("Execution successful, so disconnecting database");
    db.release();
    return true;
  } catch (ex) {
    logger.info("***************************************");
    logger.error(
      `Tracked error in \'credentials\' database ===> ${JSON.stringify(ex)}`
    );
    return false;
  } finally {
    console.log("Task in 'credentials' database has been done. Now it Quits");
    logger.info("***************************************");
  }
};

/**
 * @function updateAtCustomer
 * @async
 * @description Updates user's detail(s)
 * @param {string} pk_name
 * @param {string} pk_value
 * @param {Array} fields
 * @param {Array} data
 * @returns Acknowledgement of the operation(Boolean)
 */
var updateAtCustomer = async function (pk_name, pk_value, fields, data) {
  try {
    logger.info("Connecting to 'customer' database");
    const db = await pool.connect();
    logger.info("***************************************");
    logger.info("Connection established to 'customer' database");
    logger.info("Executing query in 'customer' database");
    for (var i = 0; i < fields.length; i++) {
      const query = `UPDATE customer SET ${fields[i]} = $1 WHERE ${pk_name} = $2`;
      await db.query(query, [data[i], pk_value]);
    }
    logger.info("Execution successful, so disconnecting database");
    db.release();
    return true;
  } catch (ex) {
    logger.info("***************************************");
    logger.error(
      `Tracked error in \'customer\' database ===> ${JSON.stringify(ex)}`
    );
    return false;
  } finally {
    console.log("Task in 'customer' database has been done. Now it Quits");
    logger.info("***************************************");
  }
};

/**
 * @function removeAtCred
 * @async
 * @description Delete credentials of user
 * @param {string} pk_name
 * @param {string} pk_value
 * @returns Acknowledgement of the operation(Boolean)
 */
var removeAtCred = async function (pk_name, pk_value) {
  try {
    logger.info("Connecting to 'credentials' database");
    const db = await pool.connect();
    logger.info("***************************************");
    logger.info("Connection established to 'credentials' database");
    const query = `DELETE FROM credentials WHERE ${pk_name} = $1`;
    logger.info("Executing query in 'credentials' database");
    await db.query(query, [pk_value]);
    logger.info("Execution successful, so disconnecting database");
    db.release();
    return true;
  } catch (ex) {
    logger.info("***************************************");
    logger.error(
      `Tracked error in \'credentials\' database ===> ${JSON.stringify(ex)}`
    );
    return false;
  } finally {
    console.log("Task in 'credentials' database has been done. Now it Quits");
    logger.info("***************************************");
  }
};

/**
 * @function removeAtCustomer
 * @async
 * @description Removes user and data
 * @param {string} pk_name
 * @param {string} pk_value
 * @returns Acknowledgement of the operation(Boolean)
 */
var removeAtCustomer = async function (pk_name, pk_value) {
  try {
    logger.info("Connecting to 'customer' database");
    const db = await pool.connect();
    logger.info("***************************************");
    logger.info("Connection established to 'customer' database");
    const query = `DELETE FROM customer WHERE ${pk_name} = $1`;
    logger.info("Executing query in 'customer' database");
    await db.query(query, [pk_value]);
    logger.info("Execution successful, so disconnecting database");
    db.release();
    return true;
  } catch (ex) {
    logger.info("***************************************");
    logger.error(
      `Tracked error in \'customer\' database ===> ${JSON.stringify(ex)}`
    );
    return false;
  } finally {
    console.log("Task in 'customer' database has been done. Now it Quits");
    logger.info("***************************************");
  }
};

/**
 * @function removeAtConversation
 * @async
 * @description Removes conversations of a user with any(or all) admin(s)
 * @param {Array} pk_name
 * @param {Array} pk_value
 * @returns Acknowledgement of the operation(Boolean)
 */
var removeAtConversation = async function (pk_name, pk_value) {
  /*
    :param pk_name is an array of keys [sender, receiver]
    :param pk_value is an array of values [sender_email_id, receiver_email_id]
  */
  try {
    logger.info("Connecting to 'conversation' database");
    const db = await pool.connect();
    logger.info("***************************************");
    logger.info("Connection established to 'conversation' database");
    const query = `DELETE FROM conversation WHERE 
                       ${pk_name[0]} = $1 and ${pk_name[1]} = $2 or ${pk_name[0]} = $2 and ${pk_name[1]} = $1`;
    logger.info("Executing query in 'conversation' database");
    await db.query(query, [pk_value[0], pk_value[1]]);
    logger.info("Execution successful, so disconnecting database");
    db.release();
    return true;
  } catch (ex) {
    logger.info("***************************************");
    logger.error(
      `Tracked error in \'conversation\' database ===> ${JSON.stringify(ex)}`
    );
    return false;
  } finally {
    console.log("Task in 'conversation' database has been done. Now it Quits");
    logger.info("***************************************");
  }
};

/**
 * @function insertAtConversation
 * @async
 * @description Inserts chat of user with admin
 * @param {Array} data
 * @returns Acknowledgement of the operation(Boolean)
 */
var insertAtConversation = async function (data) {
  try {
    logger.info("Connecting to 'conversation' database");
    const db = await pool.connect();
    logger.info("***************************************");
    logger.info("Connection established to 'conversation' database");
    const query = `INSERT INTO conversation (sender, receiver, msg, timestamp) values ($1, $2, $3, current_timestamp)`;
    logger.info("Executing query in 'conversation' database");
    await db.query(query, data);
    logger.info("Execution successful, so disconnecting database");
    db.release();
    return true;
  } catch (ex) {
    logger.info("***************************************");
    logger.error(
      `Tracked error in \'conversation\' database ===> ${JSON.stringify(ex)}`
    );
    return false;
  } finally {
    console.log("Task in 'conversation' database has been done. Now it Quits");
    logger.info("***************************************");
  }
};

/**
 * @function fetchConversation
 * @async
 * @description Gets conversations of sender with receiver (Not Vice-Versa)
 * @param {string} sender
 * @param {string} receiver
 * @returns Chats
 */
var fetchConversations = async function (sender, receiver) {
  try {
    logger.info("Connecting to 'conversation' database");
    const db = await pool.connect();
    logger.info("***************************************");
    logger.info("Connection established to 'conversation' database");
    const query = `select sender, receiver, msg, timestamp from conversation where sender = $1 and receiver = $2 order by timestamp`;
    logger.info("Executing query in 'conversation' database");
    var data = await db.query(query, [sender, receiver]);
    logger.info("Execution successful, so disconnecting database");
    db.release();
    return data.rows;
  } catch (ex) {
    logger.info("***************************************");
    logger.error(
      `Tracked error in \'conversation\' database ===> ${JSON.stringify(ex)}`
    );
    return [];
  } finally {
    console.log("Task in 'conversation' database has been done. Now it Quits");
    logger.info("***************************************");
  }
};

/**
 * @function fetchLimitedConversations
 * @async
 * @description Gets conversations between user and admin and Vice-Versa
 * @param {string} sender
 * @param {string} receiver
 * @returns Chats
 */
var fetchLimitedConversations = async function (sender, receiver) {
  try {
    logger.info("Connecting to 'conversation' database");
    const db = await pool.connect();
    logger.info("***************************************");
    logger.info("Connection established to 'conversation' database");
    const query = `select sender, receiver, msg, timestamp from (
            select * from conversation 
            where sender = $1 and receiver = $2 or sender = $2 and receiver = $1) sub
            order by timestamp;`;
    logger.info("Executing query in 'conversation' database");
    var data = await db.query(query, [sender, receiver]);
    logger.info("Execution successful, so disconnecting database");
    db.release();
    return data.rows;
  } catch (ex) {
    logger.info("***************************************");
    logger.error(
      `Tracked error in \'conversation\' database ===> ${JSON.stringify(ex)}`
    );
    return [];
  } finally {
    console.log("Task in 'conversation' database has been done. Now it Quits");
    logger.info("***************************************");
  }
};

/**
 * @function fetchLatestRemainder
 * @async
 * @description Gets emailId of customers according to their remainder_date
 * @returns List of emailIds
 */
exports.fetchLatestRemainder = async function() {
  try {
    logger.info("Connecting to 'customer' database");
    const db = await pool.connect();
    logger.info("***************************************");
    logger.info("Connection established to 'customer' database");
    const query = `select email, remfreq from customer where next_remainder = CURRENT_DATE;`;
    logger.info("Executing query in 'customer' database");
    var data = await db.query(query);
    logger.info("Execution successful, so disconnecting database");
    db.release();
    return data.rows;
  } catch (ex) {
    logger.info("***************************************");
    logger.error(
      `Tracked error in \'customer\' database ===> ${JSON.stringify(ex)}`
    );
    return [];
  } finally {
    console.log("Task in 'customer' database has been done. Now it Quits");
    logger.info("***************************************");
  }
}

/**
 * @function fetch
 * @async
 * @description Gets the data from database at database_id according to fetch_id
 * @param {number} database_id
 * @param {number} fetch_type
 * @param {string} pk_name
 * @param {string} pk_value
 * @param {string} key
 * @returns Queried Data
 */
exports.fetch = async function (
  database_id,
  fetch_type,
  pk_name = null,
  pk_value = null,
  key = null
) {
  /* param :: database_ids are 1(Credentials), 2(Admin), 3(Customer) or 4(conversation).
     param :: fetch_type are 1 or 2, where 1 is to fetch all data and 2 is to fetch specific data
     param :: pk_name = primary key name (eg: email)
     param :: pk_value = primary key value (eg: abc@domain.com)
     param :: key required while fetching specific data from a row of the table.
    -> NOTE : for `fetchConversation` (pk_name, pk_value) = (sender, receiver), as no primary key set for conversation table
  */
  switch (database_id) {
    case DATABASE.CREDENTIALS:
      return fetch_type === DATABASE.FETCH_ALL
        ? await fetchAllFromCred()
        : await fetchSpecificFromCred(pk_name, pk_value);
    case DATABASE.CUSTOMER:
      return fetch_type === DATABASE.FETCH_ALL
        ? await fetchAllFromCustomer()
        : await fetchSpecificFromCustomer(pk_name, pk_value);
    case DATABASE.CONVERSATION:
      return fetch_type === DATABASE.FETCH_ALL
        ? await fetchConversations(pk_name, pk_value)
        : await fetchLimitedConversations(pk_name, pk_value);
  }
};

/**
 * @function insert
 * @async
 * @description Inserts data into database at database_id
 * @param {number} database_id
 * @param {Array} data
 * @returns Queried Data
 */
exports.insert = async function (database_id, data) {
  /* param :: database_ids are 1(Credentials), 2(Admin), 3(Customer). 4(conversation) */
  switch (database_id) {
    case DATABASE.CREDENTIALS:
      return await insertAtCred(data);
    case DATABASE.CUSTOMER:
      return await insertAtCustomer(data);
    case DATABASE.CONVERSATION:
      return await insertAtConversation(data);
  }
};

/**
 * @function update
 * @async
 * @description Updates the data in database at database_id
 * @param {number} database_id
 * @param {string} pk_name
 * @param {string} pk_value
 * @param {Array} fields
 * @param {Array} data
 */
exports.update = async function (database_id, pk_name, pk_value, fields, data) {
  /* param :: database_ids are 1(Credentials), 2(Admin), or 3(Customer).
       param :: pk_name = primary key name (eg: email)
       param :: pk_value = primary key value (eg: abc@domain.com)
       param :: fields = list of columns
       param :: list of json to be updated in corresponding field
    */
  switch (database_id) {
    case DATABASE.CREDENTIALS:
      return await updateAtCred(pk_name, pk_value, fields, data);
    case DATABASE.CUSTOMER:
      return await updateAtCustomer(pk_name, pk_value, fields, data);
  }
};

/**
 * @function remove
 * @async
 * @description Removes data in database at database_id
 * @param {number} database_id
 * @param {string} pk_name
 * @param {string} pk_value
 * @returns Queried Data
 */
exports.remove = async function (database_id, pk_name, pk_value) {
  /* param :: database_ids are 1(Credentials), 2(Admin), 3(Customer), 4(Conversation).
       param :: pk_name = primary key name (eg: email)
       param :: pk_value = primary key value (eg: abc@domain.com)
    */
  switch (database_id) {
    case DATABASE.CREDENTIALS:
      return await removeAtCred(pk_name, pk_value);
    case DATABASE.CUSTOMER:
      return await removeAtCustomer(pk_name, pk_value);
    case DATABASE.CONVERSATION:
      return await removeAtConversation(pk_name, pk_value);
  }
};

/**
 * @function isExistingUser
 * @async
 * @description Checks if the user already exists in database
 * @param {string} pk_name
 * @param {string} pk_value
 * @returns Acknowledgement of the operation(Boolean)
 */
exports.isExistingUser = async function (pk_name, pk_value) {
  try {
    logger.info("Connecting to 'credentials' database");
    const db = await pool.connect();
    logger.info("***************************************");
    logger.info("Connection established to 'credentials' database");
    const query = `select exists (select * from credentials where ${pk_name} = $1)`;
    logger.info("Executing query in 'credentials' database");
    var res = await db.query(query, [pk_value]);
    logger.info("Execution successful, so disconnecting database");
    db.release();
    return res.rows[0].exists;
  } catch (ex) {
    logger.info("***************************************");
    logger.error(
      `Tracked error in \'credentials\' database ===> ${JSON.stringify(ex)}`
    );
    return false;
  } finally {
    console.log("Task in 'credentials' database has been done. Now it Quits");
    logger.info("***************************************");
  }
};

/**
 * @function isValidUser
 * @async
 * @description Authenticating user with given credentials
 * @param {string} pk_name
 * @param {string} pk_value
 * @param {string} password
 * @returns Acknowledgement of the operation(Boolean)
 */
exports.isValidUser = async function (pk_name, pk_value, password) {
  try {
    logger.info("Execution begins for 'isValidUser' method");
    var userData = await fetchSpecificFromCred(
      pk_name,
      pk_value,
      "email",
      "password"
    );
    logger.info("Execution ends for 'isValidUser' method");
    logger.info(`Fetched data = ${JSON.stringify(userData)}`);
    return userData[0].email === pk_value && userData[0].password === password;
  } catch (ex) {
    logger.error(
      `Error in verifying user. Captured Error ===> ${JSON.stringify(ex)}`
    );
    return false;
  } finally {
    logger.info("finally finished validating user");
  }
};
