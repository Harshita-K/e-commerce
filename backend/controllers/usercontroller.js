import userModel from "../models/usermodel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (ID) => {
    return jwt.sign({ID}, process.env.JWT_SECRET)
}
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        // checking user exists
        const user = await userModel.findOne({email});
        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password); 
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }
        else { 
            // generating token
            const token = createToken(user._id);
            res.json({ success: true, token}); 
        }
           
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }

}

const registerUser = async (req, res) => {
    try {
        const { name, email, password , phoneNumber } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password || !phoneNumber) {
            return res.json({ success: false, message: "All fields are required" });
        }

        // checking already exists
        const exists = await userModel.findOne({ email});
        if (exists) {
            return res.json({ success:false ,  message: "User already exists" });
        }

        // validating user data
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }
        if (password.length < 6) {
            return res.json({ success: false, message: "Password must be at least 6 characters long" });
        }
        if (!validator.isMobilePhone(phoneNumber, 'any', { strictMode: false })) {
            return res.json({ success: false, message: "Invalid phone number" });
        }

        // hashing password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
        });
        const user = await newUser.save();

        const token = createToken(user._id);
        res.json({success:true ,token})

    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

export { loginUser, registerUser }
