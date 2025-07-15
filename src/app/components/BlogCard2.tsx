import { Blog, User } from "../search/page";

export interface Comment {
    content: string;
    author: User;
    createdAt: Date
}

export default function BlogCard2({blog}: {blog: Blog}) {
    return(<></>)
}