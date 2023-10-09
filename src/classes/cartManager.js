import { getNewId, getJSONFromFile, saveJSONToFile } from '../utils/utils.js'


export class CartManager {
    constructor(path){
        this.path = path;
    }
    
    async addCart(){
        try {
            const cart = await getJSONFromFile(this.path)
            let newCart = {
                id: getNewId(),
                products: []
            }
            cart.push(newCart)
            await saveJSONToFile(this.path, cart)
            return newCart;
        }catch(error){
            throw new Error(`Error ${error.message}`)
        }
    }

    async getCarts() {
        return getJSONFromFile(this.path);
    }
    async getCartById(id){
        try {
        const carts = await getJSONFromFile(this.path);
        // console.log("carts f", carts)
        const findedCart = carts.find((c) => c.id === id)
        
        return findedCart 
            ? findedCart
            : `Cart with id ${id} doesn't exists`
        }catch(error){
            throw new Error(error)
        }
    }

    async addProductToCart(cartId, {productId, quantity}){
        try {
            //  return {cartId, productId, quantity}
            const carts = await getJSONFromFile(this.path)
            let cartIndex = carts.findIndex(c  => c.id === cartId)
            // console.log("cartIndex", cartIndex)
            // return true
            if(cartIndex >= 0){
                let findedProduct = carts[cartIndex].products.find(element => element.productId === productId)
                console.log("findedProduct", findedProduct)
                if(!findedProduct){
                    carts[cartIndex].products.push({productId, quantity})
                }else{
                    let findedIndex = carts[cartIndex].products.findIndex(prod => prod.productId === productId)
                    carts[cartIndex].products[findedIndex].quantity = carts[cartIndex].products[findedIndex].quantity + quantity 
                }
                // console.log(carts[cartIndex])
                await saveJSONToFile(this.path, carts)
            }else {
                console.log(`Cart doesn't exists`)
            }
        }catch(error){
            throw new Error(`Something is wrong ${error.message}`)
        }
    }

    async getCartProducts(cartId){
        try {
            const cart = await this.getCartById(cartId)
            return typeof cart !== 'string' ? cart.products : {error: `Cart doesn't exists`}
        }catch(error){
            throw new Error(`Something is wrong ${error.message}`)
        }
    }
}