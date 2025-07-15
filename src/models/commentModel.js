import mongoose, {Schema} from 'mongoose'

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    }, 
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    }
}, {timeStamps: true})

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema)
export default Comment