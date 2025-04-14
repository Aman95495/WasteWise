import User from '../Models/user.model.js';
import { errorHandler } from '../Utils/error.js';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '../Utils/sendEmail.js';

// Get user information
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Update user information
export const updateUserInfo = async (req, res, next) => {
    try {
        // Check if user is updating their own profile
        if (req.user.id !== req.params.id) {
            return next(errorHandler(401, 'You can only update your own profile'));
        }

        // Validate email uniqueness if email is being updated
        if (req.body.email) {
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                return next(errorHandler(400, 'Email already in use'));
            }
        }

        // Validate username uniqueness if username is being updated
        if (req.body.username) {
            const existingUser = await User.findOne({ username: req.body.username });
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                return next(errorHandler(400, 'Username already in use'));
            }
        }

        // Prepare the update object based on the request body
        const updateFields = {};

        if (req.body.username) updateFields.username = req.body.username;
        if (req.body.email) updateFields.email = req.body.email;
        if (req.body.avatar) updateFields.avatar = req.body.avatar;
        if (req.body.location) updateFields.location = req.body.location;
        if (req.body.recyclingPreferences) {
            // Ensure recyclingPreferences is an array of valid enum values
            const validPreferences = ['Plastic', 'Glass', 'Paper', 'Metal', 'E-Waste', 'Organic', 'Hazardous'];
            const preferences = req.body.recyclingPreferences.filter(pref => validPreferences.includes(pref));
            updateFields.recyclingPreferences = preferences;
        }

        // Update user information
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true } // Return the updated document
        ).select('-password'); // Exclude password from the response

        if (!updatedUser) {
            return next(errorHandler(404, 'User not found'));
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};



// Update user password (now supports both regular and Google auth)
export const updateUserPassword = async (req, res, next) => {
    try {
        // Check if user is updating their own password
        if (req.user.id !== req.params.id) {
            return next(errorHandler(401, 'You can only update your own password'));
        }

        const { currentPassword, newPassword, confirmPassword, verificationCode } = req.body;
        const user = await User.findById(req.params.id);

        // For Google-authenticated users
        if (user.authProvider === 'google') {
            if (!verificationCode) {
                return next(errorHandler(400, 'Verification code is required'));
            }

            if (user.verificationCode !== verificationCode) {
                return next(errorHandler(400, 'Invalid verification code'));
            }

            if (user.verificationCodeExpires < new Date()) {
                return next(errorHandler(400, 'Verification code has expired'));
            }
        }
        // For regular users
        else {
            // Validate current password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return next(errorHandler(400, 'Current password is incorrect'));
            }
        }

        // Validate new passwords match
        if (newPassword !== confirmPassword) {
            return next(errorHandler(400, 'New passwords do not match'));
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;

        // Clear verification code if it exists
        if (user.verificationCode) {
            user.verificationCode = undefined;
            user.verificationCodeExpires = undefined;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Delete user account
export const deleteUserInfo = async (req, res, next) => {
    try {
        // Check if user is deleting their own account
        if (req.user.id !== req.params.id) {
            return next(errorHandler(401, 'You can only delete your own account'));
        }

        // Find and delete the user
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return next(errorHandler(404, 'User not found'));
        }

        // Clear the authentication cookie
        res.clearCookie('access_token');

        res.status(200).json({
            message: 'User account deleted successfully',
            success: true,
        });
    } catch (error) {
        next(error);
    }
};

export const test = (req, res) => {
    console.log({ message: 'Test route' });
}


