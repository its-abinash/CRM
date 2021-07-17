[![Build Status](https://app.travis-ci.com/AbinashB1997/CRM.svg?branch=master)](https://app.travis-ci.com/AbinashB1997/CRM)

## Recent Updates [July 2021]

**NOTE:**

- `/Frontend` directory has been removed from this repository.
- Code in `/Frontend` is not being managed or used in the app now.
- It has been migrated to another <u>[repository](https://github.com/AbinashB1997/crm-client-plain-js)</u>. If anyone is interested to learn the crm-client code written in plain-javascript, they can refer to `/Frontend` directory of that repository.
- The brand new crm-client/UI is being developed using **React JS**. Please find the repository link <u>[here](https://github.com/AbinashB1997/crm-client)</u>.

## About CRM
- Customer Relationship Management (CRM) app is a tool which provides customer service, and support. Most CRM platforms involve businesses analysing customer interactions and improving the customer relationship.

- This application projects a very basic picture of customere service and support.

- Let's understand few scenarios. Suppose there is a company **X**, and it has 2 clients/customers which are companies **Y**, and **Z**. So the members from company **Y** and **Z** are referred as **CUSTOMERS/CLIENTS** of members from company **X** who are referred as **ADMINS**.

- For 1 admin, there can be N customers and vice-versa.

- With the above relation, there are few challenges to handle,
    - Deleting user/admin from dashboard should not be permanently removing them from db causing other users/admins to be unable to contact that person (Refer [GitHub issue](https://github.com/AbinashB1997/CRM/issues/31))
    
    - Updating any information of the customer should be visible to other Admins.
- Following options are being provided in dashboard
    - Chat with person (Both Admin and Customer)

    - Email with person (Both Admin and Customer)
    
    - Edit Information (Only Admin)
    
    - Delete person (Both Admin and Customer)

## Instructions to install the application
1. Install Node Js in your machine. You can refer to the official website [here](https://nodejs.org/en/download/)

```bash
# Check your node version
$ node --version
```

2. Install Redis-Server in your machine

```bash
$ sudo apt update

$ sudo apt install redis-server

# Check the status of redis-server, it should show 'Running'.
# else try to debug it by restarting the server
$ sudo systemctl status redis-server

# Check if you are able to open redis-cli
$ redis-cli

# Check if you are able to set and get the key from redis
127.0.0.1:6379> set key1 value1
OK

127.0.0.1:6379> get key1
"value1"

# If you are able to see these, then we are done!
```

Refer to [How To Install Redis on Ubuntu Machine](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04) and try to set secure password for using redis.

After completing the steps from above link, follow below commands in command line

```bash
# Open your .bashrc file (You can use 'nano ~/.bashrc' command)
# And export the following information
export REDIS_HOST="localhost"
export REDIS_PASSWORD="YOUR_REDIS_PASSWORD"
export REDIS_PORT=6379
export REDIS_SECRET="YOUR_REDIS_SECRET_KEY"
export APP_PORT=3000
```

3. Clone this repository using below command and move to the project directory

```bash
$ git clone https://github.com/AbinashB1997/CRM.git
$ cd CRM/
```

4. Setup the application using below command

```bash
$ source setup.sh
```

5. Run the app [FINAL STEP]

```bash
$ npm start
```

6. Additional Commands
- To run the unit test cases

```bash
# Go the the project directory
$ npm test
```

- To run specific test, use below command
```bash
$ npm test -- Api/test/{test_file_name} -g {pattern}
# test_file_name - Api/test/test_controllers.js (example)
# pattern - description of test case. We can pick it from describe("pattern", callback) or it("pattern", callback)
```
## Current Limitations (May 2021)

- If admin removes the customer, then he/she will not be able to undo it. [This is a known issue and will be fixed in next ENH]