const express = require('express')
const { Router } = express
const Contenedor = require('./contenedor.js')
const Carrito = require('./carrito')
const app = express()

const productsRouter = Router()
const cartRouter = Router()

const contenedor = new Contenedor('products.txt')
const carrito = new Carrito('carrito.txt')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/productos', productsRouter)
app.use('/api/carrito', cartRouter)
app.use('',express.static(__dirname + 'public'))


const PORT = 8080

const server = app.listen(PORT, () => {
  console.log(`Servidor HTTP escuchando en el puerto ${PORT}`)
})

server.on('error', error => console.log(`Error en servidor: ${error}`))



productsRouter.get('', async (req,res) =>{
  const products = await contenedor.getAll()

    return res.json(products)
})

productsRouter.get('/:id', async (req,res) =>{
  const id = Number(req.params.id)
  const product = await contenedor.getById(id)
  
if (product === undefined){
  return res.status(404).json({error: 'Producto no encontrado'})
}
  return res.json(product)
})

productsRouter.post('', async (req, res) => {
  const product = req.body
 
  await contenedor.save(product)

  return res.json(product)
})

productsRouter.put('/:id', async (req, res)=>{

  const id = (Number(req.params.id))
  const products = await contenedor.getAll()
  const productIndex = products.findIndex(product=> product.id === id)

  if(productIndex === -1){
  return res.status(404).json({error : 'Producto no encontrado'})
  }
  const body = req.body

  products[productIndex].title = body.title
  products[productIndex].price = body.price
  products[productIndex].thumbnail = body.thumbnail 
  
  //cree esta funcion en contenedor.js para actualizar y no perder los id
  await contenedor.update(products[productIndex])
    
  return res.json(products)
})

productsRouter.delete('/:id', async (req,res)=>{
  const id = Number(req.params.id)
  const product = await contenedor.getById(id)
  console.log(product)
  if(product === undefined){
  return res.status(404).json({error: 'Producto no encontrado'})
  }
  await contenedor.deleteById(id)
  return res.json(product)
})


carRouter.post('', async (req, res)=> {
  const now =  new Date()
  const prod = []
  const cart =  {
    timestamp: now,
    productos : prod
  }

  await carrito.save(cart)

  return res.jsom(cart.id)
})

cartRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const carrito = await cart.getById(id)
 
  if(carrito === undefined){
  return res.status(404).json({error: 'Carrito no encontrado'})
  }
  await carrito.deleteById(id)
  return res.json(carrito)
})

cartRouter.get('/:id/productos',(req,res) => {
  const id = Number(req.params.id)
  const cart = await carrito.getById(id)
  
if (cart === undefined){
  return res.status(404).json({error: 'Carrito no encontrado'})
}

  return res.json(cart)
})

cartRouter.post('/:id/productos', (req, res) => {
  
})