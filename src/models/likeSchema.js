import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema({
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    }
}, {timestamps: true})

likeSchema.index({ likedBy: 1, blogId: 1 }, { unique: true });

const Like = mongoose.models.Like || mongoose.model('Like', likeSchema)
export default Like
