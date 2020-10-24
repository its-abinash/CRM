const { Pool, Client } = require('pg')
var fs = require('fs')

var ENV = JSON.parse(fs.readFileSync("./Configs/db.config.json", "utf8"));

const pool = new Pool({
    connectionString: `${ENV.connectionString}`
})

var insertAtCred = async function(data) {
    try {
        const db = await pool.connect();
        const query = `INSERT INTO credentials (email, password, passcode) VALUES ($1, $2, $3)`;
        await db.query(query, data);
        db.release()
        return true;
    } catch(ex) {
        console.log(ex)
        return false;
    } finally {
        console.log("finally finished inserting data")
    }
}

var insertAtCustomer = async function(data) {
    try {
        const db = await pool.connect();
        const query = `INSERT INTO customer (name, email, phone, gst, remfreq) VALUES ($1, $2, $3, $4, $5)`;
        await db.query(query, data);
        db.release()
        return true;
    } catch(ex) {
        console.log(ex)
        return false;
    } finally {
        console.log("finally finished inserting data")
    }
}

var fetchAllFromCred = async function() {
    try {
        const db = await pool.connect();
        const query = `SELECT * FROM credentials`;
        var res = await db.query(query);
        db.release();
        console.log(res.rows)
        return res.rows;
    } catch(ex) {
        console.log("error in fetching all data")
        return [];
    } finally {
        console.log("finally finished fetching data")
    }
}

var fetchAllFromCustomer = async function() {
    try {
        const db = await pool.connect();
        const query = `SELECT * FROM customer`;
        var res = await db.query(query);
        db.release();
        console.log(res.rows)
        return res.rows;
    } catch(ex) {
        console.log("error in fetching all data")
        return [];
    } finally {
        console.log("finally finished fetching data")
    }
}

var fetchSpecificFromCustomer = async function(pk_name, pk_value) {
    try {
        const db = await pool.connect();
        const query = `SELECT * FROM customer WHERE ${pk_name} = $1`;
        var res = await db.query(query, [pk_value]);
        db.release()
        console.log(res.rows)
        return res.rows;
    } catch(ex) {
        console.log("error in fetching specific data")
        return [];
    } finally {
        console.log("finally finished fetching data")
    }
}

var fetchSpecificFromCred = async function(pk_name, pk_value) {
    try {
        const db = await pool.connect();
        const query = `SELECT * FROM credentials WHERE ${pk_name} = $1`;
        var res = await db.query(query, [pk_value]);
        db.release()
        console.log(res.rows)
        return res.rows;
    } catch(ex) {
        console.log("error in fetching specific data")
        return [];
    } finally {
        console.log("finally finished fetching data")
    }
}

var updateAtCred = async function(pk_name, pk_value, fields, data) {
    try {
        const db = await pool.connect();
        for(var i = 0; i < fields.length; i++) {
            const query = `UPDATE credentials SET ${fields[i]} = $1 WHERE ${pk_name} = $2`;
            await db.query(query, [data[i], pk_value]);
        }
        db.release();
        return true;
    } catch(ex) {
        console.log("error in updating data")
        return false;
    } finally {
        console.log("finally finished updating data")
    }
}

var updateAtCustomer = async function(pk_name, pk_value, fields, data) {
    try {
        const db = await pool.connect();
        for(var i = 0; i < fields.length; i++) {
            const query = `UPDATE customer SET ${fields[i]} = $1 WHERE ${pk_name} = $2`;
            await db.query(query, [data[i], pk_value]);
        }
        db.release();
        return true;
    } catch(ex) {
        console.log("error in updating data")
        console.log(ex)
        return false;
    } finally {
        console.log("finally finished updating data operation")
    }
}

var removeAtCred = async function(pk_name, pk_value) {
    try {
        const db = await pool.connect();
        const query = `DELETE FROM credentials WHERE ${pk_name} = $1`;
        await db.query(query, [pk_value]);
        db.release();
        return true;
    } catch(ex) {
        console.log("error in deleting row")
        return false;
    } finally {
        console.log("finally finished removing data")
    }
}

var removeAtCustomer = async function(pk_name, pk_value) {
    try {
        const db = await pool.connect();
        const query = `DELETE FROM customer WHERE ${pk_name} = $1`;
        await db.query(query, [pk_value]);
        db.release();
        return true;
    } catch(ex) {
        console.log("error in deleting row")
        return false;
    } finally {
        console.log("finally finished removing data")
    }
}

var insertAtConversation = async function(data) {
    var jobDone = false;
    try {
        const db = await pool.connect();
        const query = `INSERT INTO conversation (sender, receiver, msg, timestamp) values ($1, $2, $3, current_timestamp)`;
        await db.query(query, data);
        jobDone = true;
        db.release();
        return true;
    } catch(ex) {
        console.log("error in inserting row")
        console.log(ex)
        return false;
    } finally {
        if(jobDone) {
            console.log("finally finished inserting data")
        }else {
            console.log("Couldn't finish inserting data")
        }
    }
}

var fetchConversations = async function(sender, receiver) {
    try {
        const db = await pool.connect();
        const query = `select sender, receiver, msg, timestamp from conversation where sender = $1 and receiver = $2 order by timestamp`;
        var data = await db.query(query, [sender, receiver]);
        db.release();
        return data.rows;
    } catch(ex) {
        console.log("error in fetching row")
        console.log(ex)
        return [];
    } finally {
        console.log("finally finished fetching data")
    }
}

var fetchLimitedConversations = async function(sender, receiver) {
    var result = false;
    try {
        const db = await pool.connect();
        const query = `select sender, receiver, msg, timestamp from (
            select * from conversation 
            where sender = $1 and receiver = $2 or sender = $2 and receiver = $1) sub
            order by timestamp;`;
        var data = await db.query(query, [sender, receiver]);
        db.release();
        result = true;
        return data.rows;
    } catch(ex) {
        console.log("error in fetching row")
        console.log(ex)
        return [];
    } finally {
        if(result) {
            console.log("finally finished fetching data")
        }else {
            console.log("Not able to fetch data")
        }
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
        const db = await pool.connect();
        const query = `select exists (select * from credentials where ${pk_name} = $1)`;
        var res = await db.query(query, [pk_value]);
        db.release()
        return res.rows[0].exists;
    } catch(ex) {
        console.log("error in verifying user")
        return false;
    } finally {
        console.log("finally finished checking existing user")
    }
}

exports.isValidUser = async function(pk_name, pk_value, password) {
    try {
        var userData = await fetchSpecificFromCred(pk_name, pk_value, "email", "password");
        console.log(`data = ${JSON.stringify(userData)}`)
        return userData[0].email === pk_value && userData[0].password === password;
    } catch(ex) {
        console.log("error in verifying user")
        return false;
    } finally {
        console.log("finally finished validating user")
    }
}

/*
async function f() {
    var data = await fetchConversation("a1", "c1");
    console.log(`data = ${JSON.stringify(data)}`)
}
f()
*/
