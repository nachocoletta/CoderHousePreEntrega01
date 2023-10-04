import  fs from "fs";
import { getNewId } from '../utils/utils.js'

export class ProductManager {
  constructor(path) {
    this.path = path;
  }
  async addProduct({ title, description, code, price, status, stock, category, thumbnails}) {
    if (!(title && description && price && thumbnails && code && stock)) {
      console.log(`Some data is missing, please check your input`);
      return;
    }
    try {
      const products = await getJSONFromFile(this.path);

      let findedCode = products.find((product) => product.code === code);
      // console.log("findedCode", findedCode)
      if (!findedCode) {
        let newProduct = {
          id: getNewId(),
          title, 
          description, 
          code, 
          price, 
          status, 
          stock, 
          category, 
          thumbnails
        }
        products.push(newProduct);
        await saveJSONToFile(this.path, products);
        return newProduct;
      }else {
        let error = `The code '${findedCode.code}' already exists`
        return error;
      }
    } catch {
      // console.log(`The code ${findedCode.code} already exists`);
      throw new Error(`Something is wrong`);
    }
  }
  async getProducts() {
    return getJSONFromFile(this.path);
  }

  async getProductById(id) {
    const products = await getJSONFromFile(this.path);
    const findedProduct = products.find((product) => product.id === id);

    return findedProduct
      ? findedProduct
      : `Product with id ${id} doesn't exists`;
  }

  async updateProduct({
    id,
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
  }) {
    if (!id) {
      // console.log(`You must provide an ID`);
      throw new Error(`You must provide an ID`);
    }

    // si el codigo que quiere actualizar ya existe en el archivo
    const products = await getJSONFromFile(this.path);
    let findedCode = products.find(
      (product) => product.code === code && product.id !== id
    );

    if (findedCode) {
      throw new Error(
        `Provided code ${findedCode.code} already exists, can't update`
      );
    }

    let product = await this.getProductById(id);
    if (typeof product !== "string") {
      // si devuelve un string es porque no encontro el producto
      product.title = title || product.title;
      product.description = description || product.description;
      product.price = price || product.price;
      product.thumbnail = thumbnail || product.thumbnail;
      product.code = code || product.code;
      product.stock = stock || product.stock;

      const data = await getJSONFromFile(this.path);
      const productIndex = data.findIndex((product) => product.id === id);
      data[productIndex] = product;
      await saveJSONToFile(this.path, data);
    } else {
      console.log("no entra");
    }
  }

  async deleteProduct(id) {
    if (!id) {
      console.log(`You must provide an ID`);
      // throw new Error(`You must provide an ID`);
    }

    let product = await this.getProductById(id);

    if (typeof product !== "string") {
      let products = await getJSONFromFile(this.path);
      products = products.filter((pro) => pro.id !== id);
      saveJSONToFile(this.path, products);
      console.log(`Product with id ${id} was deleted`);
      return products;
    } else {
      console.log(`Product with id ${id} doesn't exists`);
      // throw new Error(`Product with id ${id} doesn't exists`);
    }
  }
}

const existFile = async (path) => {
  try {
    await fs.promises.access(path);
    return true;
  } catch (error) {
    return false;
  }
};

export const getJSONFromFile = async (path) => {
  if (!(await existFile(path))) {
    return [];
  }

  let content;

  try {
    content = await fs.promises.readFile(path, "utf-8");
  } catch (error) {
    throw new Error(`El archivo ${path} no pudo ser leido.`);
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`El archivo ${path} no tiene un formato JSON válido.`);
  }
};

export const saveJSONToFile = async (path, data) => {
  // console.log(path, data)
  // return
  const content = JSON.stringify(data, null, "\t");
  try {
    await fs.promises.writeFile(path, content, "utf-8");
  } catch (error) {
    throw new Error(`El archivo ${path} no pudo ser escrito.`);
  }
};

