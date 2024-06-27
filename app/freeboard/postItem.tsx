import React from 'react';
import { Post } from './types';
import Link from 'next/link';

interface PostItemProps {
    post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
    return (
        <div className="post-item border p-4 mb-4">
            <h2 className="text-xl font-bold">
                <Link href={`/freeboard/${post.id}`}>{post.title}</Link>
            </h2>
            <p>{post.content}</p>
            <div className="flex justify-between items-center mt-2">
                <span> 좋아요 {post.likes}</span>
                <span> 북마크 {post.bookmarks}</span>
                <span> 댓글 {post.comments.length}</span>
            </div>
        </div>
    );
};

export default PostItem;
