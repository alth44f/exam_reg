let mysql = require('mysql')
let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'examreg',
})

module.exports = conn;
