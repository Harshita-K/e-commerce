import express from 'express'
import { getUserDetails, loginUser , registerUser } from '../controllers/usercontroller.js'
import requireAuth from '../middleware/requireAuth.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.get('/profile', requireAuth, getUserDetails);

export default userRouter;
