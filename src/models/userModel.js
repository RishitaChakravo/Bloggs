import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true
    },
    profileImage: {
        type: String,
        required: true
    },
    coverImage: {
        type: String
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isLoggedIn : {
        type: Boolean,
        default: false
    },
    verifyToken: String,
    verifyTokenExpiry: Date
}, {timestamps: true})

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User