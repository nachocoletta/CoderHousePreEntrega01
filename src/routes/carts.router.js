import { Router } from 'express';
import { CartManager }  from '../classes/cartManager.js'
import { ProductManager } from '../classes/productManager.js';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const absolutePath = path.resolve(__dirname, '../data/carts.json');

// console.log("absolutePath", absolutePath)

const cartManager = new CartManager(absolutePath)

const absolutePathProduct = path.resolve(__dirname, '../data/products.json');
const productManager = new ProductManager(absolutePathProduct)


const router = Router();


router.post('/', async (req, res) => {
    const newCart = await cartManager.addCart();

    // console.log("newCart", newCart)
    try {
        return res.status(201).json({data: newCart, message: `New Cart with id ${newCart.id} added to database`})

    }catch(error){
        return res.status(500).json({error: error.message})
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        let product = await productManager.getProductById(pid)
        // console.log(product)
        if(!product){
            return res.status(404).send(`Product with id ${pid} doesn't exists`)
        }
        let cart = await cartManager.getCartById(cid)
        if(typeof cart === 'string'){
            return res.status(404).send(`Cart with id ${cid} doesn't exists`)
        }

        const fafafa = await cartManager.addProductToCart(cid, {productId: pid, quantity})
        console.log("fafafa", fafafa)
        
        return res.status(200).json({data: cart})
    }catch(error){
        return res.status(500).json({error: error.message})
    }
})


export default router;