import productModel from "../models/prodectmodel.js";

const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, owner } = req.body;

        // Check if all fields are provided
        if (!name || !price ) {
            return res.json({ success: false, message: "price and name are required" });
        }

        // Create a new product
        const newProduct = new productModel({
            name,
            description,
            price,
            image,
            category,
            date: Date.now(),
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
        const { userId } = req.query; // Get the user ID from query parameters
        
        // Find products that don't belong to the current user
        const products = userId 
            ? await productModel.find({ owner: { $ne: userId } })
            : await productModel.find({});
            
        res.json({ success: true, products });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

export { createProduct, getAllProducts }
