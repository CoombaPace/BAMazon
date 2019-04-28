const pool = require('./initmysql');
const util = require('util');

pool.query = util.promisify(pool.query);

module.exports = pool