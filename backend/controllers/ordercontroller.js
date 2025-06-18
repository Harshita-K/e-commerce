import orderModel from '../models/ordermodel.js';
import productModel from '../models/productmodel.js';
import userModel from '../models/usermodel.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const buynow = async (req, res) => {
    try {
        const { productIds } = req.body;
        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.json({ success: false, message: 'Product IDs are required' });
        }
        // Get user ID from token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.json({ success: false, message: 'Authorization token required' });
        }
        let buyerId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            buyerId = decoded.id || decoded._id || decoded.userId || decoded.ID;
        } catch (err) {
            return res.json({ success: false, message: 'Invalid token' });
        }
        if (!buyerId) {
            return res.json({ success: false, message: 'User ID not found in token' });
        }
        const createdOrders = [];
        for (const productId of productIds) {
            const product = await productModel.findById(productId);
            if (!product) {
                continue; // skip if product not found
            }
            const sellerId = product.owner;
            if (!sellerId) {
                continue; // skip if seller not found
            }
            const order = new orderModel({
                transactionId: uuidv4(),
                buyer: buyerId,
                seller: sellerId,
                product: productId,
                price: product.price,
                status: 'pending'
            });
            await order.save();
            createdOrders.push(order);
        }
        if (createdOrders.length === 0) {
            return res.json({ success: false, message: 'No valid orders could be created' });
        }
        res.json({ success: true, message: 'Orders created successfully', orders: createdOrders });
    } catch (error) {
        console.error('Buy now error:', error);
        res.json({ success: false, message: error.message });
    }
};

const myOrders = async (req, res) => {
    try {
        // Get user ID from token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.json({ success: false, message: 'Authorization token required' });
        }
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id || decoded._id || decoded.userId || decoded.ID;
        } catch (err) {
            return res.json({ success: false, message: 'Invalid token' });
        }
        if (!userId) {
            return res.json({ success: false, message: 'User ID not found in token' });
        }
        // Find all orders where the user is the buyer
        let orders = await orderModel.find({ buyer: userId })
            .populate('product')
            .populate('seller', 'name email');
        // Filter out orders where the product does not exist
        const validOrders = [];
        for (const order of orders) {
            if (!order.product) {
                await orderModel.findByIdAndDelete(order._id);
            } else {
                validOrders.push(order);
            }
        }
        res.json({ success: true, orders: validOrders });
    } catch (error) {
        console.error('Fetch my orders error:', error);
        res.json({ success: false, message: error.message });
    }
};

const myDelivery = async (req, res) => {
    try {
        // Get user ID from token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.json({ success: false, message: 'Authorization token required' });
        }
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id || decoded._id || decoded.userId || decoded.ID;
        } catch (err) {
            return res.json({ success: false, message: 'Invalid token' });
        }
        if (!userId) {
            return res.json({ success: false, message: 'User ID not found in token' });
        }
        // Find all orders where the user is the seller and status is pending
        let orders = await orderModel.find({ seller: userId, status: 'pending' })
            .populate('product')
            .populate('buyer', 'name email');
        // Filter out orders where the product does not exist
        const validOrders = [];
        for (const order of orders) {
            if (!order.product) {
                await orderModel.findByIdAndDelete(order._id);
            } else {
                validOrders.push(order);
            }
        }
        res.json({ success: true, orders: validOrders });
    } catch (error) {
        console.error('Fetch my deliveries error:', error);
        res.json({ success: false, message: error.message });
    }
};

const generateOrderOtp = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            return res.json({ success: false, message: 'Order ID is required' });
        }
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Update the order with the OTP
        const order = await orderModel.findByIdAndUpdate(
            orderId,
            { otp },
            { new: true }
        );
        if (!order) {
            return res.json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, message: 'OTP generated successfully', otp, order });
    } catch (error) {
        console.error('Generate OTP error:', error);
        res.json({ success: false, message: error.message });
    }
};

const verifyOrderOtp = async (req, res) => {
    try {
        const { orderId, otp } = req.body;
        if (!orderId || !otp) {
            return res.json({ success: false, message: 'Order ID and OTP are required' });
        }
        // Find the order
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: 'Order not found' });
        }
        if (order.otp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }
        // Update order status to delivered (completed)
        order.status = 'completed';
        order.otp = undefined; // Optionally clear OTP after verification
        await order.save();
        // Also update the product status to delivered
        await productModel.findByIdAndUpdate(order.product, { status: 'delivered' });
        res.json({ success: true, message: 'Order delivered successfully', order });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.json({ success: false, message: error.message });
    }
};


export { buynow, myOrders, myDelivery, generateOrderOtp, verifyOrderOtp };
