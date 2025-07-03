interface Blog {
    content: string;
    title: string;
}

interface Props {
    blog: Blog
}
export default function BlogCard({blog}: Props) {
    return(
        <div></div>
    )
}