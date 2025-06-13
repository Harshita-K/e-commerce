import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: Array },
    category: { type: String },
    owner: { type: String, required: true }
})

const productModel = mongoose.model.product || mongoose.model('product', productSchema)
export default productModel;
