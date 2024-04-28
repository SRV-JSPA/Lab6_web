import conn from './conn.js'

export async function getAllPosts() {
  const [rows] = await conn.query('SELECT * FROM blog_posts')
  return rows
}

export async function getPost(id) {
  const [rows] = await conn.query('SELECT * FROM blog_posts WHERE id = ?', [id]);
  return rows;
}

export async function updatePost(id, title, content, created_at, car_name, company) {
  const [rows] = await conn.query('UPDATE blog_posts SET title = ?, content = ?, created_at = ?, car_name = ?, company = ? WHERE id = ?', [title, content, created_at, car_name, company, id]);
  return rows;
}

export async function deletePost(id) {
  const [rows] = await conn.query('DELETE FROM blog_posts WHERE id = ?', [id]);
  return rows;
}

export async function createPost(title, content, created_at, car_name, company, imagen) {
  const [result] = await conn.query('INSERT INTO blog_posts (title, content, created_at, car_name, company, imagen) VALUES (?, ?, ?, ?, ?, ?)', [title, content, created_at, car_name, company, imagen])
  return result
}

export async function createUser(user, password) {
  const [result] = await conn.query('INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)', [user, password])
  return result
}

export async function getUser(user) {
  const [rows] = await conn.query('SELECT * FROM usuarios WHERE usuario = ?', [user]);
  return rows;
}
