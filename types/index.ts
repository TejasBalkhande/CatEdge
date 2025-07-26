//src/types/index.ts
// types/index.ts
export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  authorImage?: string;
  category?: string;
  image?: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  id: string;
  postId: string;
  userId: string;
  name: string;
  content: string;
  createdAt: string;
};