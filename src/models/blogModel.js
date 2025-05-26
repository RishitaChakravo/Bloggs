import mongoose, {Schema} from 'mongoose'

const blogSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    tags: [String]
},{timestamps: true})


const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema)
export default Blog