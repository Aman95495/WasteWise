import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() {
            return this.authProvider === 'local';
        }
    },
    avatar: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2021/01/04/10/41/icon-5887126_1280.png'
    },
    location: {
        type: String,
        default: ''
    },
    recyclingPreferences: {
        type: [{
            type: String,
            enum: ['Plastic', 'Glass', 'Paper', 'Metal', 'E-Waste', 'Organic', 'Hazardous']
        }],
        default: []
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    userType: {
        type: String,
        default: 'user'
    },
    verificationCode: String,
    verificationCodeExpires: Date
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;