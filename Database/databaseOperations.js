const { Pool } = require("pg");
var fs = require("fs");
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
    const db = await pool.connect();
    const query = `INSERT INTO
                   credentials (email, password, passcode, is_admin)
                   VALUES ($1, $2, $3, $4)`;
    await db.query(query, data);
    db.release();
    return true;
  } catch (ex) {
    throw ex;
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
    const db = await pool.connect();
    const query = `INSERT INTO customer (name, email, phone, gst, remfreq, next_remainder, img_data)
                   VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    await db.query(query, data);
    db.release();
    return true;
  } catch (ex) {
    throw ex;
  }
};

/**
 * @function insertAtUsersMap
 * @description map customer with admin and vice-versa
 * @async
 * @param {Array} data list of userIds of both admin and customers
 * @returns Boolean (True/False)
 */
var insertAtUsersMap = async function (data) {
  try {
    const db = await pool.connect();
    const query = `INSERT INTO users_map (user_id1, user_id2)
                   VALUES ($1, $2)`;
    for (const each_data of data) {
      await db.query(query, each_data);
    }
    db.release();
    return true;
  } catch (ex) {
    throw ex;
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
    const db = await pool.connect();
    const query = `SELECT * FROM credentials`;
    var res = await db.query(query);
    db.release();
    return res.rows;
  } catch (ex) {
    throw ex;
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
    const db = await pool.connect();
    const query = `SELECT * FROM customer`;
    var res = await db.query(query);
    db.release();
    return res.rows;
  } catch (ex) {
    throw ex;
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
    const db = await pool.connect();
    const query = `SELECT * FROM customer WHERE ${pk_name} = $1`;
    var res = await db.query(query, [pk_value]);
    db.release();
    return res.rows;
  } catch (ex) {
    throw ex;
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
    const db = await pool.connect();
    const query = `SELECT *
                   FROM credentials
                   WHERE ${pk_name} = $1`;
    var res = await db.query(query, [pk_value]);
    db.release();
    return res.rows;
  } catch (ex) {
    throw ex;
  }
};

/**
 * @async
 * @description Fetches the customers for an admin and vice-versa
 * @param {Array} data
 */
module.exports.fetchAllUsersForGivenUserId = async function (data) {
  try {
    const db = await pool.connect();
    const query = `select customer.email, customer.name, customer.img_data
                   from customer
                   inner join users_map on
                   users_map.user_id2 = customer.email
                   inner join credentials on
                   credentials.email = users_map.user_id2
                   where
                   users_map.user_id1 = $1 and credentials.is_admin=$2;`;
    var res = await db.query(query, data);
    db.release();
    return res.rows;
  } catch (ex) {
    throw ex;
  }
};

/**
 * @function fetchAllUserOfGivenType
 * @async
 * @description Fetches all users of one of the types: [admin or customer]
 * @param {Array} is_admin
 * @returns List of users of given type
 */
module.exports.fetchAllUserOfGivenType = async function (is_admin = [false]) {
  try {
    const db = await pool.connect();
    const query = `select customer.email, customer.name
                   from customer
                   inner join credentials
                   on credentials.email = customer.email
                   where credentials.is_admin = $1;`;
    var res = await db.query(query, is_admin);
    db.release();
    return res.rows;
  } catch (ex) {
    throw ex;
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
    const db = await pool.connect();
    for (var i = 0; i < fields.length; i++) {
      const query = `UPDATE credentials
                     SET ${fields[i]} = $1
                     WHERE ${pk_name} = $2`;
      await db.query(query, [data[i], pk_value]);
    }
    db.release();
    return true;
  } catch (ex) {
    throw ex;
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
    const db = await pool.connect();
    for (var i = 0; i < fields.length; i++) {
      const query = `UPDATE customer
                     SET ${fields[i]} = $1
                     WHERE ${pk_name} = $2`;
      await db.query(query, [data[i], pk_value]);
    }
    db.release();
    return true;
  } catch (ex) {
    throw ex;
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
    const db = await pool.connect();
    const query = `DELETE FROM credentials
                   WHERE ${pk_name} = $1`;
    var res = await db.query(query, [pk_value]);
    db.release();
    return res.rowCount;
  } catch (ex) {
    throw ex;
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
    const db = await pool.connect();
    const query = `DELETE FROM customer
                   WHERE ${pk_name} = $1`;
    var res = await db.query(query, [pk_value]);
    db.release();
    return res.rowCount;
  } catch (ex) {
    throw ex;
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
  try {
    const db = await pool.connect();
    const query = `DELETE FROM conversation
                   WHERE ${pk_name[0]} = $1 and ${pk_name[1]} = $2
                   or ${pk_name[0]} = $2 and ${pk_name[1]} = $1`;
    var res = await db.query(query, [pk_value[0], pk_value[1]]);
    db.release();
    return res.rowCount;
  } catch (ex) {
    throw ex;
  }
};

/**
 * @description Removes the given user from users_map table
 * @param {Array} data array having email_id of person1 and person2
 */
var removeUserFromUserMap = async function (data) {
  try {
    const db = await pool.connect();
    const query = `delete from users_map
                   WHERE user_id1 = $1 and user_id2 = $2`;
    var res = await db.query(query, data);
    db.release();
    return res.rowCount;
  } catch (ex) {
    throw ex;
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
    const db = await pool.connect();
    const query = `INSERT INTO conversation (sender, receiver, msg, timestamp)
                   values ($1, $2, $3, current_timestamp)`;
    await db.query(query, data);
    db.release();
    return true;
  } catch (ex) {
    throw ex;
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
    const db = await pool.connect();
    const query = `select sender, receiver, msg, timestamp
                   from conversation
                   where sender = $1 and receiver = $2
                   order by timestamp`;
    var data = await db.query(query, [sender, receiver]);
    db.release();
    return data.rows;
  } catch (ex) {
    throw ex;
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
    const db = await pool.connect();
    const query = `select sender, receiver, msg, timestamp from (
                    select * from conversation
                    where sender = $1 and receiver = $2
                    or sender = $2 and receiver = $1) sub
                  order by timestamp;`;
    var data = await db.query(query, [sender, receiver]);
    db.release();
    return data.rows;
  } catch (ex) {
    throw ex;
  }
};

/**
 * @function fetchLatestRemainder
 * @async
 * @description Gets emailId of customers according to their remainder_date
 * @returns List of emailIds
 */
module.exports.fetchLatestRemainder = async function () {
  try {
    const db = await pool.connect();
    const query = `select email, remfreq
                   from customer
                   where next_remainder = CURRENT_DATE;`;
    var data = await db.query(query);
    db.release();
    return data.rows;
  } catch (ex) {
    throw ex;
  }
};

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
module.exports.fetch = async function (
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
  try {
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
  }catch(exc) {
    throw exc;
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
module.exports.insert = async function (database_id, data) {
  /* param :: database_ids are 1(Credentials), 2(users_map), 3(Customer). 4(conversation) */
  try {
    switch (database_id) {
      case DATABASE.CREDENTIALS:
        return await insertAtCred(data);
      case DATABASE.CUSTOMER:
        return await insertAtCustomer(data);
      case DATABASE.CONVERSATION:
        return await insertAtConversation(data);
      case DATABASE.USERS_MAP:
        return await insertAtUsersMap(data);
    }
  }catch(exc) {
    throw exc;
  }
};

/**
 * @function update
 * @async
 * @description Updates the data in database at database_id
 * @param {number} database_id database_ids are 1(Credentials), 2(Admin), or 3(Customer).
 * @param {string} pk_name primary key name (eg: email)
 * @param {string} pk_value primary key value (eg: abc@domain.com)
 * @param {Array} fields list of columns
 * @param {Array} data list of json to be updated for above fields
 */
module.exports.update = async function (
  database_id,
  pk_name,
  pk_value,
  fields,
  data
) {
  try {
    switch (database_id) {
      case DATABASE.CREDENTIALS:
        return await updateAtCred(pk_name, pk_value, fields, data);
      case DATABASE.CUSTOMER:
        return await updateAtCustomer(pk_name, pk_value, fields, data);
    }
  }catch(exc) {
    throw exc;
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
module.exports.remove = async function (database_id, pk_name, pk_value) {
  /* param :: database_ids are 1(Credentials), 2(Admin), 3(Customer), 4(Conversation).
       param :: pk_name = primary key name (eg: email)
       param :: pk_value = primary key value (eg: abc@domain.com)
    */
  try {
    switch (database_id) {
      case DATABASE.CREDENTIALS:
        return await removeAtCred(pk_name, pk_value);
      case DATABASE.CUSTOMER:
        return await removeAtCustomer(pk_name, pk_value);
      case DATABASE.CONVERSATION:
        return await removeAtConversation(pk_name, pk_value);
      case DATABASE.USERS_MAP:
        return await removeUserFromUserMap(pk_value);
    }
  }catch (exc) {
    throw exc;
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
module.exports.isExistingUser = async function (pk_name, pk_value) {
  try {
    const db = await pool.connect();
    const query = `select exists (select * from credentials where ${pk_name} = $1)`;
    var res = await db.query(query, [pk_value]);
    db.release();
    return res.rows[0].exists;
  } catch (ex) {
    throw ex;
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
module.exports.isValidUser = async function (pk_name, pk_value, password) {
  try {
    var userData = await fetchSpecificFromCred(pk_name, pk_value);
    return userData[0].email === pk_value && userData[0].password === password;
  } catch (ex) {
    throw ex;
  }
};
