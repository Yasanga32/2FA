import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['patient', 'admin'],
        default: 'patient'
    },

    appId: {
        type: String,
        required: true,
        index: true
    },

    verifyOtp: {
        type: String,
        default: ''
    },
    verifyOtpExpireAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: String,
        default: ''
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0
    }

});

//Compound index to ensure email is unique per appId
userSchema.index({ email: 1, appId: 1 }, { unique: true });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;