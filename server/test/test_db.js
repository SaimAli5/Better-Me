const Pool = require("pg").Pool;

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: 'postgres',
  database: 'Better_me_test'
});

module.exports = pool;