const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'pereira',
    database: 'blog',
    password: 'blog2024',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

module.exports = pool;