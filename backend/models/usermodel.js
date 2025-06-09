import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    cartdata: { type: Array, default: {} }
},{minimize: false})

const userModel = mongoose.model('user', userSchema) || mongoose.model.user;
export default userModel;