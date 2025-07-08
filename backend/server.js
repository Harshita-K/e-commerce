import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connect } from 'mongoose'
import morgan from "morgan";
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userroute.js'
import productRouter from './routes/productroute.js';
import orderRouter from './routes/orderroutes.js';

//app config
const app = express()
// const cors = require('cors')
const PORT = process.env.PORT || 8080
connectDB()
connectCloudinary()

// Middleware
app.use(cors()); // Allow requests from your frontend
app.use(express.json())
app.use(morgan('dev'));

//api edpoints
app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)

app.get('/', (req, res) => {
    res.send("API working")
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))