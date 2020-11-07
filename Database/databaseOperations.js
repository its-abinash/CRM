const { Pool, Client } = require('pg')
var fs = require('fs')
var logger = require('../Backend/Logger/log')
var ENV = JSON.parse(fs.readFileSync("./Configs/db.config.json", "utf8"));

const pool = new Pool({
    connectionString: `${ENV.connectionString}`
})

var insertAtCred = async function(data) {
    try {
        logger.info("Connecting to \'credentials\' database")
        const db = await pool.connect();
        logger.info('***************************************')
        logger.info("Connection established to \'credentials\' database")
        const query = `INSERT INTO credentials (email, password, passcode) VALUES ($1, $2, $3)`;
        logger.info("Executing query in \'credentials\' database")
        await db.query(query, data);
        logger.info("Execution successful, so disconnecting database")
        db.release()
        return true;
    } catch(ex) {
        logger.info('***************************************')
        logger.error(`Tracked error in \'credentials\' database ===> ${JSON.stringify(ex)}`)
        return false;
    } finally {
        console.log("Task in \'credentials\' database has been done. Now it Quits")
        logger.info('***************************************')
    }
}

var insertAtCustomer = async function(data) {
    try {
        logger.info("Connecting to \'customer\' database")
        const db = await pool.connect();
        logger.info('***************************************')
        logger.info("Connection established to \'customer\' database")
        const query = `INSERT INTO customer (name, email, phone, gst, remfreq) VALUES ($1, $2, $3, $4, $5)`;
        logger.info("Executing query in \'customer\' database")
        await db.query(query, data);
        logger.info("Execution successful, so disconnecting database")
        db.release()
        return true;
    } catch(ex) {
        logger.info('***************************************')
        logger.error(`Tracked error in \'customer\' database ===> ${JSON.stringify(ex)}`)
        return false;
    } finally {
        console.log("Task in \'customer\' database has been done. Now it Quits")
        logger.info('***************************************')
    }
}

var fetchAllFromCred = async function() {
    try {
        logger.info("Connecting to \'credentials\' database")
        const db = await pool.connect();
        logger.info('***************************************')
        logger.info("Connection established to \'credentials\' database")
        const query = `SELECT * FROM credentials`;
        logger.info("Executing query in \'credentials\' database")
        var res = await db.query(query);
        logger.info("Execution successful, so disconnecting database")
        db.release();
        console.log(res.rows)
        return res.rows;
    } catch(ex) {
        logger.info('***************************************')
        logger.error(`Tracked error in \'credentials\' database ===> ${JSON.stringify(ex)}`)
        return [];
    } finally {
        console.log("Task in \'credentials\' database has been done. Now it Quits")
        logger.info('***************************************')
    }
}

var fetchAllFromCustomer = async function() {
    try {
        logger.info("Connecting to \'customer\' database")
        const db = await pool.connect();
        logger.info('***************************************')
        logger.info("Connection established to \'customer\' database")
        const query = `SELECT * FROM customer`;
        logger.info("Executing query in \'customer\' database")
        var res = await db.query(query);
        logger.info("Execution successful, so disconnecting database")
        db.release();
        console.log(res.rows)
        return res.rows;
    } catch(ex) {
        logger.info('***************************************')
        logger.error(`Tracked error in \'customer\' database ===> ${JSON.stringify(ex)}`)
        return [];
    } finally {
        console.log("Task in \'customer\' database has been done. Now it Quits")
        logger.info('***************************************')
    }
}

var fetchSpecificFromCustomer = async function(pk_name, pk_value) {
    try {
        logger.info("Connecting to \'customer\' database")
        const db = await pool.connect();
        logger.info('***************************************')
        logger.info("Connection established to \'customer\' database")
        const query = `SELECT * FROM customer WHERE ${pk_name} = $1`;
        logger.info("Executing query in \'customer\' database")
        var res = await db.query(query, [pk_value]);
        logger.info("Execution successful, so disconnecting database")
        db.release()
        return res.rows;
    } catch(ex) {
        logger.info('***************************************')
        logger.error(`Tracked error in \'customer\' database ===> ${JSON.stringify(ex)}`)
        return [];
    } finally {
        console.log("Task in \'customer\' database has been done. Now it Quits")
        logger.info('***************************************')
    }
}

var fetchSpecificFromCred = async function(pk_name, pk_value) {
    try {
        logger.info("Connecting to \'credentials\' database")
        const db = await pool.connect();
        logger.info('***************************************')
        logger.info("Connection established to \'credentials\' database")
        const query = `SELECT * FROM credentials WHERE ${pk_name} = $1`;
        logger.info("Executing query in \'credentials\' database")
        var res = await db.query(query, [pk_value]);
        logger.info("Execution successful, so disconnecting database")
        db.release()
        return res.rows;
    } catch(ex) {
        logger.info('***************************************')
        logger.error(`Tracked error in \'credentials\' database ===> ${JSON.stringify(ex)}`)
        return [];
    } finally {
        console.log("Task in \'credentials\' database has been done. Now it Quits")
        logger.info('***************************************')
    }
}

var updateAtCred = async function(pk_name, pk_value, fields, data) {
    try {
        logger.info("Connecting to \'credentials\' database")
        const db = await pool.connect();
        logger.info('***************************************')
        logger.info("Connection established to \'credentials\' database")
        logger.info("Executing query in \'credentials\' database")
        for(var i = 0; i < fields.length; i++) {
            const query = `UPDATE credentials SET ${fields[i]} = $1 WHERE ${pk_name} = $2`;
            await db.query(query, [data[i], pk_value]);
        }
        logger.info("Execution successful, so disconnecting database")
        db.release();
        return true;
    } catch(ex) {
        logger.info('***************************************')
        logger.error(`Tracked error in \'credentials\' database ===> ${JSON.stringify(ex)}`)
        return false;
    } finally {
        console.log("Task in \'credentials\' database has been done. Now it Quits")
        logger.info('***************************************')
    }
}

var updateAtCustomer = async function(pk_name, pk_value, fields, data) {
    try {
        logger.info("Connecting to \'customer\' database")
        const db = await pool.connect();
        logger.info('***************************************')
        logger.info("Connection established to \'customer\' database")
        logger.info("Executing query in \'customer\' database")
        for(var i = 0; i < fields.length; i++) {
            const query = `UPDATE customer SET ${fields[i]} = $1 WHERE ${pk_name} = $2`;
            await db.query(query, [data[i], pk_value]);
        }
        logger.info("Execution successful, so disconnecting database")
        db.release();
        return true;
    } catch(ex) {
        logger.info('***************************************')
        logger.error(`Tracked error in \'customer\' database ===> ${JSON.stringify(ex)}`)
        return false;
    } finally {
        console.log("Task in \'customer\' database has been done. Now it Quits")
        logger.info('***************************************')
    }
}

var removeAtCred = async function(pk_name, pk_value) {
    try {
        logger.info("Connecting to \'credentials\' database")
        const db = await pool.connect();
        logger.info('***************************************')
        logger.info("Connection established to \'credentials\' database")
        const query = `DELETE FROM credentials WHERE ${pk_name} = $1`;
        logger.info("Executing query in \'credentials\' database")
        await db.query(query, [pk_value]);
        logger.info("Execution successful, so disconnecting database")
        db.release();
        return true;
    } catch(ex) {
        logger.info('***************************************')
        logger.error(`Tracked error in \'credentials\' database ===> ${JSON.stringify(ex)}`)
        return false;
    } finally {
        console.log("Task in \'credentials\' database has been done. Now it Quits")
        logger.info('***************************************')
    }
}

var removeAtCustomer = async function(pk_name, pk_value) {
    try {
        logger.info("Connecting to \'customer\' database")
        const db = await pool.connect();
        logger.info('***************************************')
        logger.info("Connection established to \'customer\' database")
        const query = `DELETE FROM customer WHERE ${pk_name} = $1`;
        logger.info("Executing query in \'customer\' database")
        await db.query(query, [pk_value]);
        logger.info("Execution successful, so disconnecting database")
        db.release();
        return true;
    } catch(ex) {
        logger.info('***************************************')
        logger.error(`Tracked error in \'customer\' database ===> ${JSON.stringify(ex)}`)
        return false;
    } finally {
        console.log("Task in \'customer\' database has been done. Now it Quits")
        logger.info('***************************************')
    }
}

var insertAtConversation = async function(data) {
    try {
        logger.info("Connecting to \'conversation\' database")
        const db = await pool.connect();
        logger.info('***************************************')
        logger.info("Connection established to \'conversation\' database")
        const query = `INSERT INTO conversation (sender, receiver, msg, timestamp) values ($1, $2, $3, current_timestamp)`;
        logger.info("Executing query in \'conversation\' database")
        await db.query(query, data);
        logger.info("Execution successful, so disconnecting database")
        db.release();
        return true;
    } catch(ex) {
        logger.info('***************************************')
        logger.error(`Tracked error in \'conversation\' database ===> ${JSON.stringify(ex)}`)
        return false;
    } finally {
        console.log("Task in \'conversation\' database has been done. Now it Quits")
        logger.info('***************************************')
    }
}

var fetchConversations = async function(sender, receiver) {
    try {
        logger.info("Connecting to \'conversation\' database")
        const db = await pool.connect();
        logger.info('***************************************')
        logger.info("Connection established to \'conversation\' database")
        const query = `select sender, receiver, msg, timestamp from conversation where sender = $1 and receiver = $2 order by timestamp`;
        logger.info("Executing query in \'conversation\' database")
        var data = await db.query(query, [sender, receiver]);
        logger.info("Execution successful, so disconnecting database")
        db.release();
        return data.rows;
    } catch(ex) {
        logger.info('***************************************')
        logger.error(`Tracked error in \'conversation\' database ===> ${JSON.stringify(ex)}`)
        return [];
    } finally {
        console.log("Task in \'conversation\' database has been done. Now it Quits")
        logger.info('***************************************')
    }
}

var fetchLimitedConversations = async function(sender, receiver) {
    try {
        logger.info("Connecting to \'conversation\' database")
        const db = await pool.connect();
        logger.info('***************************************')
        logger.info("Connection established to \'conversation\' database")
        const query = `select sender, receiver, msg, timestamp from (
            select * from conversation 
            where sender = $1 and receiver = $2 or sender = $2 and receiver = $1) sub
            order by timestamp;`;
        logger.info("Executing query in \'conversation\' database")
        var data = await db.query(query, [sender, receiver]);
        logger.info("Execution successful, so disconnecting database")
        db.release();
        return data.rows;
    } catch(ex) {
        logger.info('***************************************')
        logger.error(`Tracked error in \'conversation\' database ===> ${JSON.stringify(ex)}`)
        return [];
    } finally {
        console.log("Task in \'conversation\' database has been done. Now it Quits")
        logger.info('***************************************')
    }
}

exports.fetch = async function(database_id, fetch_type, pk_name=null, pk_value=null, key=null) {
    /* param :: database_ids are 1(Credentials), 2(Admin), 3(Customer) or 4(conversation).
       param :: fetch_type are 1 or 2, where 1 is to fetch all data and 2 is to fetch specific data
       param :: pk_name = primary key name (eg: email)
       param :: pk_value = primary key value (eg: abc@domain.com)
       param :: key required while fetching specific data from a row of the table.
       -> NOTE : for `fetchConversation` (pk_name, pk_value) = (sender, receiver), as no primary key set for conversation table
    */
    switch(database_id) {
        case 1:
            return fetch_type === 1 ? await fetchAllFromCred() : await fetchSpecificFromCred(pk_name, pk_value);
        case 3:
            return fetch_type === 1 ? await fetchAllFromCustomer() : await fetchSpecificFromCustomer(pk_name, pk_value);
        case 4:
            return fetch_type === 1 ? await fetchConversations(pk_name, pk_value) : await fetchLimitedConversations(pk_name, pk_value);
    }
}

exports.insert = async function(database_id, data) {
    /* param :: database_ids are 1(Credentials), 2(Admin), 3(Customer). 4(conversation) */
    switch(database_id) {
        case 1:
            return await insertAtCred(data);
        case 3:
            return await insertAtCustomer(data);
        case 4:
            return await insertAtConversation(data)
    }
}

exports.update = async function(database_id, pk_name, pk_value, fields, data) {
    /* param :: database_ids are 1(Credentials), 2(Admin), or 3(Customer).
       param :: pk_name = primary key name (eg: email)
       param :: pk_value = primary key value (eg: abc@domain.com)
       param :: fields = list of columns
       param :: list of json to be updated in corresponding field
    */
    switch(database_id) {
        case 1:
            return await updateAtCred(pk_name, pk_value, fields, data);
        case 3:
            return await updateAtCustomer(pk_name, pk_value, fields, data);
    }
}

exports.remove = async function(database_id, pk_name, pk_value) {
    /* param :: database_ids are 1(Credentials), 2(Admin), or 3(Customer).
       param :: pk_name = primary key name (eg: email)
       param :: pk_value = primary key value (eg: abc@domain.com)
    */
    switch(database_id) {
        case 1:
            return await removeAtCred(pk_name, pk_value);
        case 3:
            return await removeAtCustomer(pk_name, pk_value);
    }
}

exports.isExistingUser = async function(pk_name, pk_value) {
    try {
        logger.info("Connecting to \'credentials\' database")
        const db = await pool.connect();
        logger.info('***************************************')
        logger.info("Connection established to \'credentials\' database")
        const query = `select exists (select * from credentials where ${pk_name} = $1)`;
        logger.info("Executing query in \'credentials\' database")
        var res = await db.query(query, [pk_value]);
        logger.info("Execution successful, so disconnecting database")
        db.release()
        return res.rows[0].exists;
    } catch(ex) {
        logger.info('***************************************')
        logger.error(`Tracked error in \'credentials\' database ===> ${JSON.stringify(ex)}`)
        return false;
    } finally {
        console.log("Task in \'credentials\' database has been done. Now it Quits")
        logger.info('***************************************')
    }
}

exports.isValidUser = async function(pk_name, pk_value, password) {
    try {
        logger.info("Execution begins for \'isValidUser\' method")
        var userData = await fetchSpecificFromCred(pk_name, pk_value, "email", "password");
        logger.info("Execution ends for \'isValidUser\' method")
        logger.info(`Fetched data = ${JSON.stringify(userData)}`)
        return userData[0].email === pk_value && userData[0].password === password;
    } catch(ex) {
        logger.error(`Error in verifying user. Captured Error ===> ${JSON.stringify(ex)}`)
        return false;
    } finally {
        logger.info("finally finished validating user")
    }
}