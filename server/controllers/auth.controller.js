import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Please provide name, email and password" });
    }

    try {
        //Check if user already exists
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: "User with this email already exists" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        //creating a new user
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        // Generate JWT token for each new user created in mongodb
        const token = jwt.sign({ id: user._id },
            process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        //Sending welcome Email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Lanka Auth',
            text: `Hello ${name},\n\nWelcome to Lanka Auth! We're glad to have you on board. Your account has been created successfully.\n\nBest regards,\nLanka Auth Team`
        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "User registered successfully" });



    } catch (error) {
        res.json({ success: false, message: error.message });
    }




}

// Login controller
export const login = async (req, res) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalidpassword" });
        }

        const token = jwt.sign({ id: user._id },
            process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.json({ success: true, message: "Login successful" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }


}


// Logout controller
export const logout = (req, res) => {

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

        });
        return res.json({ success: true, message: "Logout successful" });
    } catch (error) {

    }
}


export const sendVerifyOtp = async (req, res) => {

    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account is already verified" });
        }

        // Generate OTP-if not verified
        const otp = String(Math.floor(100000 + Math.random() * 900000));


        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 1000; //24 hours

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            // text: `Hello ${user.name},\n\nYour OTP for account verification is: ${otp}\nIt is valid for 24 hours.\n\nBest regards,\nThe Team`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",
                user.email
            )
        }

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Verification OTP sent to your email" });


    } catch (error) {
        res.json({ success: false, message: error.message });
    }


}


export const verifyEmail = async (req, res) => {

    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({ success: false, message: "Please provide userId and otp" });
    }

    try {

        const user = await userModel.findById(userId);

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account is already verified" });
        }

        if (!user) {
            return res.json({ success: false, message: "Invalid user" });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '',
            user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Email verified successfully' });



    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


//Check if user is authenticated
export const isAuthenticated = async (req, res) => {


    try {
        return res.json({ success: true });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//Send Password Reset OTP
export const sendResetOtp = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email is required' });
    }


    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Generate OTP-if not verified
        const otp = String(Math.floor(100000 + Math.random() * 900000));


        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; //15 minutes

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            // text: `Your OTP for resetting your password is ${otp}.Use
            // this OTP to proceed with resetting your password.`
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",
                user.email
            )
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Verification OTP sent to your email" });





    } catch (error) {
        return res.json({ success: false, message: error.message });
    }

}


//Reset User Password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email,OTP, and New Password are required' });

    }
    try {

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Password has been reset successfully' });



    } catch (error) {
        return res.json({ success: false, error: error.message });
    }

}