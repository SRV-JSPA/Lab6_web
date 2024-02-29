import express from 'express'
import { getAllPosts, getPost, createPost, updatePost, deletePost } from './db.js'
import bodyParser from 'body-parser'
import fs from 'fs'

const app = express()
const port = 3000
app.use(express.json())
app.use(bodyParser.json());

const txt = (req, res, next) => {
  const hora = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const info = {
    hora,
    metodo: req.method,
    url: req.url,
    payload: req.body,
    response: null
  };


  const json = res.json;
  res.json = function(data) {
    info.response = data;
    fs.appendFileSync('log.txt', JSON.stringify(info) + '\n');
    json.call(this, data);
  };
  next();
};

app.use(txt);




app.get('/posts', async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error al traer todos los posts" }); 
  }
})

app.get('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await getPost(postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error al traer el post con el id: ?" [postId] }); 
  }
})

app.post('/posts', async (req, res) => {
  req.headers['content-type'] === 'application/json';
  const info = req.body;
  const titulo = info.title;
  const contenido = info.content;
  const creado = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const carro = info.car;
  const marca = info.brand;
  try {
    const nuevoPost = await createPost(titulo, contenido, creado, carro, marca);
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ message: "Error al postear el post" }); 
    console.log(error)
  }
})

app.put('/posts/:id', async (req, res) => {
  const id = req.params.id;
  const nuevaInfo = req.body; 
  const titulo = nuevaInfo.title;
  const contenido = nuevaInfo.content;
  const creado = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const carro = nuevaInfo.car;
  const marca = nuevaInfo.brand;
   try {
    const actualizacion = await updatePost(id, titulo, contenido, creado, carro, marca); 
    res.status(200).json(nuevaInfo); 
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el post" }); 
    console.log(error)
  }
})

app.delete('/posts/:id', (req, res) => {
  const id = req.params.id;

  try {
    deletePost(id);
    res.status(204)
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el post con el id: ?" [id] }); 
  }
  
})

app.use((req, res) => {
  res.status(501).json({ message: "Método HTTP no implementado" });
});



app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})

