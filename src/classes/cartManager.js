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
            // console.log(carts)
            // return true
            let cartToBeUpdated = carts.find((c) => c.id === cartId)
            console.log("cartToBeUpdated", cartToBeUpdated)
            cartToBeUpdated.products.push({productId, quantity})
            await saveJSONToFile(this.path, cartToBeUpdated)
            return {productId, quantity}
        }catch(error){
            throw new Error(`Something is wrong`)
        }
    }
}