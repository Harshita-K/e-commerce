import express from 'express'
import { buynow, myDelivery, myOrders } from '../controllers/ordercontroller.js';
const orderRouter = express.Router();

orderRouter.get('/myorders', myOrders);
orderRouter.post('/buynow',buynow);
orderRouter.get('/mydelivery', myDelivery)

export default orderRouter;
