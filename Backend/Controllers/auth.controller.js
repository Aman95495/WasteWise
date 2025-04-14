import User from '../Models/user.model.js';
import Vendor from '../Models/vendor.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../Utils/error.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendVerificationEmail } from '../Utils/sendEmail.js';

const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return next(errorHandler(400, 'User or email already exists'));
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();
        res.json(savedUser);
    }
    catch (error) {
        return next(errorHandler(500, 'Server Error'));
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return next(errorHandler(400, 'Invalid Credentials'));
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(errorHandler(400, 'Invalid Credentials'));
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const { password: pass, ...rest } = user._doc; // remove password from user object
        return res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json({ ...rest, 'message': 'Login Successful' });
    }
    catch (error) {
        return next(errorHandler(500, 'Server Error'));
    }
}

const google = async (req, res, next) => {
    try {
        const { name, email, avatar } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // Update authProvider if not already set
            if (!existingUser.authProvider) {
                existingUser.authProvider = 'google';
                // For existing users who previously signed up normally, keep their password
                // but we'll mark them as Google auth users
                await existingUser.save();
            }

            const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const { password: pass, ...rest } = existingUser._doc;

            return res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json({ ...rest, message: 'Login Successful' });
        }
        else {
            // For new Google auth users, we'll set a random password but mark them as Google auth
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatedPassword, 12);

            const newUser = new User({
                username: name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-5),
                email,
                password: hashedPassword,
                avatar,
                authProvider: 'google'  // Explicitly set auth provider
            });

            const savedUser = await newUser.save();
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const { password: pass, ...rest } = savedUser._doc;

            return res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json({ ...rest, message: 'Login Successful' });
        }

    } catch (error) {
        return next(errorHandler(500, 'Server Error'));
    }
};

const github = async (req, res, next) => {
    try {
        const { name, email, avatar } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const { password: pass, ...rest } = existingUser._doc; // remove password from user object

            return res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json({ ...rest, 'message': 'Login Successful' });
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatedPassword, 12);

            const newUser = new User({ username: name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-5), email, password: hashedPassword, avatar });

            const savedUser = await newUser.save();
            const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const { password: pass, ...rest } = savedUser._doc; // remove password from user object
            return res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json({ ...rest, 'message': 'Login Successful' });
        }
    }
    catch (error) {
        return next(errorHandler(500, 'Server Error'));
    }
}


const logout = (req, res) => {
    try {
        res.clearCookie('access_token');
        return res.status(200).json({ message: 'User signed out successfully', success: true });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};


const sendVerificationCode = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        // Generate 6-digit code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Save code to user document
        user.verificationCode = verificationCode;
        user.verificationCodeExpires = expiresAt;
        await user.save();

        // In production, you would send the email here
        await sendVerificationEmail(email, verificationCode);

        res.status(200).json({
            success: true,
            message: 'Verification code sent to your email'
        });
    } catch (error) {
        next(errorHandler(500, 'Server Error'));
    }
};


// now making signup, login and logout for vendors
const vendorSignup = async (req, res, next) => {
    try {
        const { username, email, password, phone } = req.body;

        // Check for existing vendor
        const existingVendor = await Vendor.findOne({ $or: [{ email }, { phone }] });
        if (existingVendor) {
            return next(errorHandler(400, 'Vendor or email already exists'));
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new vendor object
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword,
            phone
        });

        const savedVendor = await newVendor.save();

        return res.json(savedVendor);
    } catch (error) {
        return next(errorHandler(500, 'Server Error'));
    }
};
const vendorLogin = async (req, res, next) => {
    try {
        const { email, phone, password, location } = req.body;

        // Require at least one identifier
        if (!email && !phone) {
            return next(errorHandler(400, 'Email or phone is required'));
        }

        // Require password always
        if (!password) {
            return next(errorHandler(400, 'Password is required'));
        }

        // Find vendor by email or phone
        const vendor = await Vendor.findOne({
            $or: [
                email ? { email } : null,
                phone ? { phone } : null,
            ].filter(Boolean), // removes null values
        });

        if (!vendor) {
            return next(errorHandler(400, 'Invalid Credentials'));
        }

        // Check password
        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) {
            return next(errorHandler(400, 'Invalid Credentials'));
        }

        // Update location if provided
        if (location && location.coordinates && location.type === "Point") {
            vendor.location = {
                type: "Point",
                coordinates: location.coordinates,
            };
            await vendor.save(); // Save the updated vendor document
        }

        // Generate JWT token
        const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Exclude password from response
        const { password: pass, ...rest } = vendor._doc;

        return res
            .cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json({ ...rest, message: "Login Successful" });
    } catch (error) {
        return next(errorHandler(500, "Server Error"));
    }
};

const vendorLogout = (req, res) => {
    try {
        res.clearCookie('access_token');
        return res.status(200).json({ message: 'Vendor signed out successfully', success: true });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};



export { signup, login, google, github, logout, sendVerificationCode, vendorSignup, vendorLogin, vendorLogout };