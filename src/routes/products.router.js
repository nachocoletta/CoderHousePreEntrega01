import { Router } from 'express';
import { ProductManager, getJSONFromFile, saveJSONToFile } from '../classes/productManager.js'
import { getNewId } from '../utils/utils.js';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const absolutePath = path.resolve(__dirname, '../data/products.json');

// console.log("absolutePath", absolutePath)

const router = Router();

const productManager = new ProductManager(absolutePath)

router.post('/products', async (req, res) => {
    
    const { 
        title, 
        description, 
        code, 
        price, 
        stock, 
        category, 
        thumbnails } = req.body
    try {
        if( !(title && description && code && price
            && stock && category )  ){
            return res.status(400).json({error: `Some data is missing` })
            // throw new Error(`Some data is missing`)
        }
        if(!(typeof title === 'string' && typeof description === 'string' 
            && typeof code === 'string' && typeof price === 'number' 
            && typeof stock === 'number' && typeof category === 'string')){    
            return res.status(400).json({error: `Any type recibed doesn't match`})
                // throw new Error(`Any type recibed doesn't match`)
        }
        const newProduct = {
            id: getNewId(),
            title, 
            description, 
            code, 
            price, 
            status: true, 
            stock, 
            category, 
            thumbnails
        }
    
        let result = await productManager.addProduct(newProduct)

        // console.log(newProduct)
        if(typeof result !== 'string'){
            res.status(201).send(newProduct);
        }
        else{
            return res.status(400).json({error: result})
        }

    }catch(error){
        // console.log(error.message)
        console.log("error", error)
        return res.status(500).send(error)
    }    
})
router.get('/products', async (req, res) => {
    const { limit } = req.query;

    const products = await productManager.getProducts();
    return !limit ? res.status(200).json(products) : res.json(products.slice(0, parseInt(limit)));

})

router.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;

    const findedProduct = await productManager.getProductById(pid);
    return findedProduct ? res.json(findedProduct) : res.send(`Product with id ${pid} doesn't exist.`);
})

export default router;


