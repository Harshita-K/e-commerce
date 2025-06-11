import express from 'express'
import { createProduct , getAllProducts } from '../controllers/productcontroller.js'

const productRouter = express.Router();

productRouter.post('/sell', createProduct);
productRouter.get('/dashboard', getAllProducts);

export default productRouter;