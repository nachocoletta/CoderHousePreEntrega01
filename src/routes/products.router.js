import { Router } from 'express';
import { ProductManager } from '../classes/productManager.js'
// import { getNewId } from '../utils/utils.js';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const absolutePath = path.resolve(__dirname, '../data/products.json');

const router = Router();

const productManager = new ProductManager(absolutePath)

router.post('/', async (req, res) => {

    const {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails } = req.body
    try {
        if (!(title && description && code && price
            && stock && category)) {
            return res.status(400).json({ error: `Some data is missing` })
            // throw new Error(`Some data is missing`)
        }
        if (!(typeof title === 'string' && typeof description === 'string'
            && typeof code === 'string' && typeof price === 'number'
            && typeof stock === 'number' && typeof category === 'string')) {
            return res.status(400).json({ error: `Any type recibed doesn't match` })
            // throw new Error(`Any type recibed doesn't match`)
        }
        const newProduct = {
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
        if (typeof result !== 'string') {
            res.status(201).send(result);
        }
        else {
            return res.status(400).json({ error: result })
        }

    } catch (error) {
        // console.log(error.message)
        console.log("error", error)
        return res.status(500).send(error)
    }
})
router.get('/', async (req, res) => {
    const { limit } = req.query;

    const products = await productManager.getProducts();
    return !limit ? res.status(200).json(products) : res.json(products.slice(0, parseInt(limit)));

})

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;

    const findedProduct = await productManager.getProductById(pid);
    return findedProduct ? res.json(findedProduct) : res.send(`Product with id ${pid} doesn't exist.`);
})

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, status, price, stock, category, thumbnails } = req.body;
    try {
        // return res.status(200).send(status)
        // console.log("status", status)
        let product = await productManager.getProductById(pid)
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' })
        }

        if (title && !(typeof title === 'string'))
            return res.status(400).json({ error: `Title must be a string` })
        if (description && !(typeof description === 'string'))
            return res.status(400).json({ error: `Description must be a string` })
        if (code && !(typeof code === 'string'))
            return res.status(400).json({ error: `Code must be a string` })
        if (price && !(typeof price === 'number'))
            return res.status(400).json({ error: `Price must be a number` })
        if (stock && !(typeof stock === 'number'))
            return res.status(400).json({ error: `Stock must be a number` })
        if (category && !(typeof category === 'string'))
            return res.status(400).json({ error: `Category must be a string` })
        // throw new Error(`Any type recibed doesn't match`)
        if (thumbnails && !(Array.isArray(thumbnails)))
            return res.status(400).json({ error: `Thumbnails must be an array` })

        product.title = title || product.title;
        product.description = description || product.description;
        product.code = code || product.code;
        product.price = price || product.price;
        product.status = status !== undefined ? status : product.status;
        product.stock = stock || product.stock;
        product.category = category || product.category;
        product.thumbnails = thumbnails || product.thumbnails

        await productManager.updateProduct(product)
        return res.status(200).send(product)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})



router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        let product = await productManager.deleteProduct(pid)
        if (product)
            return res.status(200).json({ data: pid, message: `Product succesfuly deleted` })
        return res.status(400).json({ error: `Product with id ${pid} doesn't exists` })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

export default router;


