import express from 'express'
import { createProduct , getUserProducts  , editProduct , getAllProducts} from '../controllers/productcontroller.js'

const productRouter = express.Router();

productRouter.post('/sell', createProduct);
productRouter.get('/dashboard', getAllProducts);
productRouter.get('/myproduct', getUserProducts);
productRouter.put('/:id', editProduct);

export default productRouter;