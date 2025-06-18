import express from 'express'
import { buynow, myDelivery, myOrders , generateOrderOtp, verifyOrderOtp} from '../controllers/ordercontroller.js';
const orderRouter = express.Router();

orderRouter.get('/myorders', myOrders);
orderRouter.post('/buynow',buynow);
orderRouter.get('/mydelivery', myDelivery);
orderRouter.post('/generateotp', generateOrderOtp); // Uncomment if you want to use OTP generation
orderRouter.post('/verifyotp', verifyOrderOtp); // Uncomment if you want to use OTP verification
export default orderRouter;
