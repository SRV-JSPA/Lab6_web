import conn from './conn.js'

export async function getAllPosts() {
 const [rows] = await conn.query('SELECT * FROM blog_posts')
 return rows
}

export async function getPost(id) {
    const [rows] = await conn.query('SELECT * FROM blog_posts WHERE id = ?', [id]);
    return rows;
}


export async function createPost(title, content) {
    const [result] = await conn.query('INSERT INTO blog_posts (title, content) VALUES (?, ?)', [title, content])
    return result
}