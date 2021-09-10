const { DB_OWNER, DB_PASSWORD, DB_SERVER, DB_PORT } = process.env;
const DB_MAIN = "crm";

module.exports = {
  connectionString: `postgresql://${DB_OWNER}:${DB_PASSWORD}@${DB_SERVER}:${DB_PORT}/${DB_MAIN}`,
};
