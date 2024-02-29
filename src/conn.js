import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: 'mysql',
    port: 3306,
    user: 'root',
    password: 'pereira',
    database: 'blog'
})

export default pool