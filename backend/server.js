import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connect } from 'mongoose'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/coudinary.js'
import userRouter from './routes/userroute.js'

//app config
const app = express()
const PORT = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middleware
app.use(cors())
app.use(express.json())

//api edpoints
app.use('/api/users', userRouter)

app.get('/', (req, res) => {
    res.send("API working")
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))