import userModel from "../models/usermodel.js";
import jwt from "jsonwebtoken";

const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        
        // Get user ID from token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.json({ success: false, message: "Authorization token required" });
        }
        
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id || decoded._id || decoded.userId || decoded.ID;
        } catch (err) {
            return res.json({ success: false, message: "Invalid token" });
        }
        
        if (!userId) {
            return res.json({ success: false, message: "User ID not found in token" });
        }
        
        if (!productId) {
            return res.json({ success: false, message: "Product ID is required" });
        }
        
        // Find the user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        // Initialize cartdata if it doesn't exist or is empty
        if (!user.cartdata) {
            user.cartdata = [];
        }
        
        // Check if product already exists in cart
        const existingItemIndex = user.cartdata.findIndex(item => item.productId === productId);
        
        if (existingItemIndex !== -1) {
            // Update quantity if item already exists
            user.cartdata[existingItemIndex].quantity += parseInt(quantity);
        } else {
            // Add new item to cart
            user.cartdata.push({
                productId: productId,
                quantity: parseInt(quantity)
            });
        }
        
        // Save the updated user
        await user.save();
        
        res.json({ 
            success: true, 
            message: "Product added to cart successfully", 
            cartdata: user.cartdata 
        });
        
    } catch (error) {
        console.error("Add to cart error:", error);
        res.json({ success: false, message: error.message });
    }
};

const showCart = async (req, res) => {
    try {
        // Get user ID from token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.json({ success: false, message: "Authorization token required" });
        }
        
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id || decoded._id || decoded.userId || decoded.ID;
        } catch (err) {
            return res.json({ success: false, message: "Invalid token" });
        }
        
        if (!userId) {
            return res.json({ success: false, message: "User ID not found in token" });
        }
        
        // Find the user
        const user = await userModel.findById(userId).select('cartdata');
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        res.json({ 
            success: true, 
            cartdata: user.cartdata || [] 
        });
        
    } catch (error) {
        console.error("Show cart error:", error);
        res.json({ success: false, message: error.message });
    }
} 

export { addToCart, showCart };