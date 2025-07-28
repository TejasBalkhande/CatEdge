// app/api/posts/[slug]/route.ts
import { NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const postsRef = collection(db, 'posts');
    const postQuery = query(postsRef, where('slug', '==', slug));
    const postSnapshot = await getDocs(postQuery);

    if (postSnapshot.empty) {
      // Updated to JSON error response
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const postDoc = postSnapshot.docs[0];
    const postData = postDoc.data();

    const fullPost = {
      id: postDoc.id,
      ...postData,
      content: postData.fullContent || postData.content || '',
      createdAt: postData.createdAt?.toDate().toISOString() || new Date().toISOString(),
    };

    return NextResponse.json({ post: fullPost });
  } catch (error) {
    console.error('Error fetching post:', error);
    // Updated to JSON error response
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}