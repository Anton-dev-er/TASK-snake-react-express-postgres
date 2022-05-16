require("dotenv").config();

const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.USERNAME_DB,
  password: process.env.PASSWORD_DB,
  host: process.env.HOST_DB,
  port: process.env.PORT_DB,
  database: process.env.NAME_DB
})

module.exports = pool