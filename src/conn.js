import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: 'localhost',
    port: 33069,
    user: 'root',
    password: 'pereira',
    database: 'blog'
})

export default pool