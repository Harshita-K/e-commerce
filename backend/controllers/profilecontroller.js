import userModel from "../models/usermodel.js";
import bcrypt from "bcrypt";

const getUserDetails = async (req, res) => {
    try {
        const userId = req.user.ID; // This comes from the middleware
        console.log("User ID from token:", userId); // Debug log
        
        const user = await userModel.findById(userId).select('-password'); // Exclude password
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        res.json({ success: true, message: "user found" ,user });
    }
    catch (error) {
        console.log("Get user details error:", error);
        res.json({ success: false, message: error.message });
    }
}

const updateUserDetails = async (req, res) => {
    try {
        const userId = req.user.ID; // This comes from the middleware
        const { name, email, phoneNumber } = req.body;

        // Update user details
        const updatedUser = await userModel.findByIdAndUpdate(userId, { name, email, phoneNumber }, { new: true }).select('-password');

        if (!updatedUser) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user: updatedUser });
    }
    catch (error) {
        console.log("Update user details error:", error);
        res.json({ success: false, message: error.message });
    }
}

const changeUserPassword = async (req, res) => {
    try {
        const userId = req.user.ID;
        const { oldPassword, newPassword } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        // Check if old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Old password is incorrect" });
        }
        // Hash the new password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.log("Change password error:", error);
        res.json({ success: false, message: error.message });
    }
}

export { getUserDetails , updateUserDetails, changeUserPassword };