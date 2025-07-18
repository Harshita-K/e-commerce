import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: Array },
    category: { type: Array,  default: {} },
    owner: { type: String, required: true },
    status: { type: String, enum: ['available', 'sold'], default: 'available' }
})

const productModel = mongoose.model.product || mongoose.model('Product', productSchema)
export default productModel;
