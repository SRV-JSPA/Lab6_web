import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'
import {
  getAllPosts, getPost, createPost, updatePost, deletePost, createUser, getUser,
} from './db.js'

import { hashpassword, comparePassword } from './crypto.js'
import {generateToken, validateTokenClient} from './JWT.js'


const app = express()
const port = 3000
app.use(express.json())
app.use(bodyParser.json())
app.use(cors())
app.use(validateTokenClient)


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'Documentación de la API del blog',
    },
  },
  apis: ['src/main.js'],
};

const confSwagger = swaggerJsdoc(options)

const txt = (req, res, next) => {
  const hora = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const info = {
    hora,
    metodo: req.method,
    url: req.url,
    payload: req.body,
    response: null,
  };

  const { json } = res;
  res.json = function (data) {
    info.response = data;
    fs.appendFileSync('log.txt', `${JSON.stringify(info)}\n`);
    json.call(this, data);
  };
  next();
};

const validarEndpoint = (req, res, next) => {
  if (!['/posts', '/posts/:id', '/users', '/user'].includes(req.path)) {
    return res.status(400).json({ error: 'Endpoint no existente' });
  }
  next();
};

const validarEstructura = (req, res, next) => {
  if (['PUT', 'POST'].includes(req.method) && !req.is('application/json')) {
    return res.status(400).json({ error: 'Formato de datos incorrecto, se espera un JSON' });
  }
  next();
};

app.use(txt);
app.use(validarEstructura);
app.use('/posts-docs', swaggerUi.serve, swaggerUi.setup(confSwagger));

/**
 * @swagger
 * /posts:
 *   get:
 *     tags:
 *        - Posts
 *     summary: Obtiene todos los posts
 *     description: Endpoint para obtener todos los posts.
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Error al traer todos los posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.get('/posts', async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error al traer todos los posts' });
  }
})

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     tags:
 *        - Posts
 *     summary: Obtiene un post por su ID
 *     description: Endpoint para obtener un post por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del post
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Error al traer el post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.get('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await getPost(postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error al traer el post con el id: ?'[postId] });
  }
})

/**
 * @swagger
 * /posts:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Crea un nuevo post
 *     description: Endpoint para crear un nuevo post.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               car:
 *                 type: string
 *               brand:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 car:
 *                   type: string
 *                 brand:
 *                   type: string
 *       '500':
 *         description: Error al postear el post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.post('/posts', async (req, res) => {
  req.headers['content-type'] === 'application/json';
  const info = req.body;
  const { titulo } = info;
  const { contenido } = info;
  const creado = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const { carro } = info;
  const { marca } = info;
  const { imagen } = info;
  try {
    const nuevoPost = await createPost(titulo, contenido, creado, carro, marca, imagen);
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ message: 'Error al postear el post' });
    console.log(error);
  }
})

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     tags:
 *       - Posts
 *     summary: Actualiza un post por su ID
 *     description: Endpoint para actualizar un post por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               car:
 *                 type: string
 *               brand:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 car:
 *                   type: string
 *                 brand:
 *                   type: string
 *       '500':
 *         description: Error al actualizar el post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const postActual = getPost(id)
  const nuevaInfo = req.body;
  const titulo = nuevaInfo.title;
  const contenido = nuevaInfo.content;
  const creado = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const carro = nuevaInfo.car;
  const marca = nuevaInfo.brand;
  const imagen = nuevaInfo.imagen
  try {
    const actualizacion = await updatePost(id, titulo, contenido, creado, carro, marca, imagen);
    res.status(200).json(nuevaInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el post' });
    console.log(error)
  }
})

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     tags:
 *       - Posts
 *     summary: Elimina un post por su ID
 *     description: Endpoint para eliminar un post por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del post
 *     responses:
 *       '204':
 *         description: Post eliminado exitosamente
 *       '500':
 *         description: Error al eliminar el post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.delete('/posts/:id', (req, res) => {
  const { id } = req.params;

  try {
    deletePost(id);
    res.status(204)
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el post con el id: ?'[id] });
  }
})

app.post('/user', async (req, res) => {
  const info = req.body
  const { user } = info
  const { password } = info
  const userFound = await getUser(user);
  if (userFound) {
    userFound.map(({ usuario, contrasena }) => {
      if (comparePassword(password, contrasena)) {
        const token = generateToken(usuario);
        res.status(200).json({token: token});
      } else {
        res.status(500).json({ message: 'Contraseña incorrecta' });
      }
    })
  } else {
    res.status(500).json({ message: 'El usuario no existe' });
  }
})

app.post('/users', async (req, res) => {
  req.headers['content-type'] === 'application/json';
  const info = req.body;
  const { user } = info;
  const { password } = info;

  const hashedpassword = hashpassword(password);

  try {
    await createUser(user, hashedpassword);
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario' });
    console.log(error);
  }
})

app.use(validarEndpoint);
app.use((req, res) => {
  res.status(501).json({ message: 'Método HTTP no implementado' });
});



app.listen(port, () => {
  console.log(`Server listening at http://22318.arpanetos.lol:${port}`)
})
