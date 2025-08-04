// src/app/api/posts/[slug]/route.ts

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
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const postDoc = postSnapshot.docs[0];
    const data = postDoc.data();

    return NextResponse.json({
      post: {
        id: postDoc.id,
        ...data,
        content: data.fullContent ?? data.content ?? '',
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      }
    });
  } catch (e) {
    console.error('Error fetching post:', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}