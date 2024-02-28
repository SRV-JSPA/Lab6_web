import express from 'express'
import { getAllPosts, getPost, createPost, updatePost, deletePost } from './db.js'
import bodyParser from 'body-parser'

const app = express()
const port = 3000
app.use(express.json())
app.use(bodyParser.json());


app.get('/posts', async (req, res) => {
  const posts = await getAllPosts();
  res.status(200).json(posts);
})

app.get('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  const post = await getPost(postId);
    res.status(200).json(post);
})

app.post('/posts', async (req, res) => {
  req.headers['content-type'] === 'application/json';
  const info = req.body;
  
  const titulo = info.title;
  const contenido = info.content;
  let ahora = new Date();
  const creado = ahora.toLocaleTimeString();
  const carro = info.car;
  const marca = info.brand;

  const nuevoPost = await createPost(titulo, contenido, creado, carro, marca);

  res.status(200).send("Información enviada con éxito: " + JSON.stringify(info));

})

app.put('/posts/:id', async (req, res) => {
  const id = req.params.id;
  const postActual = await getPost(id);
  const nuevaInfo = req.body; 
  const titulo = nuevaInfo.title;
  const contenido = nuevaInfo.content;
  const creado = postActual.created_at;
  const carro = nuevaInfo.car;
  const marca = nuevaInfo.brand;
  try {
    const actualizacion = await updatePost(id, titulo, contenido, creado, carro, marca); 
    res.status(200).json(nuevaInfo); 
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el post" }); 
  }
})

app.delete('/posts/:id', (req, res) => {
  const id = req.params.id;
  deletePost(id);
  res.status(204)
})

app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})

