import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  otp: {
    type: String,
  }
});

const orderModel = mongoose.model('Order', orderSchema);
export default orderModel;
