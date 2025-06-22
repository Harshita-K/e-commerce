import express from 'express'
import { loginUser , registerUser } from '../controllers/usercontroller.js'
import requireAuth from '../middleware/requireAuth.js';
import { changeUserPassword, deleteUser, getUserDetails, updateUserDetails } from '../controllers/profilecontroller.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.get('/profile', requireAuth, getUserDetails);
userRouter.put('/profile', requireAuth, updateUserDetails);
userRouter.post('/profile/changepass',requireAuth, changeUserPassword);
userRouter.delete('/profile/delete',requireAuth,deleteUser);

export default userRouter;
