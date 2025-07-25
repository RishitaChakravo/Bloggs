import mongoose, {Schema} from "mongoose";

const otpSchema = new Schema({
    email: {
        type : String,
        required: true
    },
    otpHash: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: {expires : 0}
    }
}, {timestamps: true})

const OTP = mongoose.models.OTP || mongoose.model('OTP', otpSchema)
export default OTP