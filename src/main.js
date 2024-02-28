const express = require('express');

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/posts', (req, res) => {
  res.send('obteniendo todos los posts')
})

app.get('/posts/:id', (req, res) => {
  res.send('obteniendo el post con el id')
})

app.post('/posts', (req, res) => {
  res.send('ingresando info')
})

app.put('/posts/:id', (req, res) => {
  res.send('actualizando post')
})

app.delete('/posts/:id', (req, res) => {
  res.send('eliminando el post')
})

app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})
