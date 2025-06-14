import express from 'express'
import { createProduct , getUserProducts  , editProduct , getAllProducts, getProductById} from '../controllers/productcontroller.js'
import { addToCart, showCart } from '../controllers/cartcontroller.js';
const productRouter = express.Router();

productRouter.post('/sell', createProduct);
productRouter.get('/shop', getAllProducts);
productRouter.get('/myproduct', getUserProducts);
productRouter.post('/addtocart', addToCart);
productRouter.get('/cart', showCart);
productRouter.put('/:id', editProduct);
productRouter.get('/:id', getProductById);

export default productRouter;