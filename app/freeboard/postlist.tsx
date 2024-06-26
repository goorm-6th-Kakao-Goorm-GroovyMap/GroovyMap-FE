'use client';
import React from 'react';
import { Post } from './types';
import PostItem from './postItem';

interface PostListProps {
    posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
    return (
        <div>
            {posts.map((post) => (
                <PostItem key={post.id} post={post} />
            ))}
        </div>
    );
};

export default PostList;
