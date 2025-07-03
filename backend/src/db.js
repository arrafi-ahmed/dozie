const postgres = require("postgres");
const {DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD, NODE_ENV} =
    process.env;

let sql = postgres({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    transform: {
        ...postgres.camel,
        undefined: null,
    },
    ssl: false,
    // waitForConnections: true,
    // connectionLimit: 10,
    // queueLimit: 0,
});

module.exports = {sql};
