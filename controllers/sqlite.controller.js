var path = require('path');

var dbpath = path.join(__dirname, '/../data/branchespos.db');
var sqlite3 = require('sqlite3').verbose(),
db = new sqlite3.Database(dbpath);

module.exports = db;
