import productModel from "../models/productmodel.js";
import jwt from "jsonwebtoken";

const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, owner } = req.body;

        // Check if all fields are provided
        if (!name || !price ) {
            return res.json({ success: false, message: "price and name are required" });
        }
        if ( !owner ) {
            return res.json({ success: false, message: "Owner is required" });
        }
        // Validate price
        if (typeof price !== 'number' || price < 0) {
            return res.json({ success: false, message: "Price must be a non negitive number" });
        }

        // Create a new product
        const newProduct = new productModel({
            name,
            description,
            price,
            image,
            category,
            owner
        });

        // Save the product to the database
        await newProduct.save();
        res.json({ success: true, message: "Product created successfully", product: newProduct });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

const getAllProducts = async (req, res) => {
    try {
        let userId = null;
        
        // Try to get user ID from token
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log("Decoded JWT in getAllProducts:", decoded); // Debug log
                userId = decoded.id || decoded._id || decoded.userId || decoded.ID;
                console.log("Extracted userId:", userId); // Debug log
            } catch (err) {
                // If token is invalid, continue without userId (show all products)
                console.log("Invalid token, showing all products");
            }
        }
        
        // Find products that don't belong to the current user
        const products = userId 
            ? await productModel.find({ owner: { $ne: userId } })
            : await productModel.find({});
            
        console.log(`Found ${products.length} products for userId: ${userId}`); // Debug log
        res.json({ success: true, products });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

const getUserProducts = async (req, res) => {
    try {
        let userId = req.query.userId;
        if (!userId) {
            // fallback to token if userId not in query
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.json({ success: false, message: "Authorization token missing" });
            }
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id || decoded._id || decoded.userId;
            } catch (err) {
                return res.json({ success: false, message: "Invalid token" });
            }
        }
        if (!userId) {
            return res.json({ success: false, message: "User ID is required in token or query." });
        }
        const products = await productModel.find({ owner: userId });
        res.json({ success: true, products });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

const editProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, image, category } = req.body;
        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            { name, description, price, image, category },
            { new: true }
        );
        if (!updatedProduct) {
            return res.json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        
        if (!productId) {
            return res.json({ success: false, message: "Product ID is required" });
        }
        
        const product = await productModel.findById(productId);
        
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }
        
        res.json({ success: true, product });
    } catch (error) {
        console.error("Get product by ID error:", error);
        res.json({ success: false, message: error.message });
    }
}

export { createProduct, getAllProducts, getUserProducts, editProduct, getProductById }
