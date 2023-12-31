import express from 'express';
import morgan from 'morgan';
import productsRouter from './routes/products.router.js'
import cartRouter from './routes/carts.router.js'
const PORT = 8080;

const app = express();

app.use(morgan('dev'));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)

const startServer = async () => {
    app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
    })
}

startServer();