// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  authorImage: string;
  image: string;
  category: string;
  featured: boolean;
  createdAt: Date | string;
}

interface PostInput {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  authorImage: string;
  image: string;
  category: string;
  featured: boolean;
  createdAt?: any; // Firestore FieldValue for serverTimestamp
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10);
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'newest';
    const category = searchParams.get('category') || '';

    const postsRef = collection(db, 'posts');
    const constraints: QueryConstraint[] = [];

    if (category) {
      constraints.push(where('category', '==', category));
    }

    if (search) {
      constraints.push(where('title', '>=', search));
      constraints.push(where('title', '<=', search + '\uf8ff'));
    }

    if (sort === 'oldest') {
      constraints.push(orderBy('createdAt', 'asc'));
    } else {
      constraints.push(orderBy('createdAt', 'desc'));
    }

    const q = query(postsRef, ...constraints);
    const snapshot = await getDocs(q);
    const allPosts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        slug: data.slug || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        author: data.author || '',
        authorImage: data.authorImage || '',
        image: data.image || '',
        category: data.category || 'General',
        featured: data.featured || false,
        createdAt: data.createdAt?.toDate?.() || new Date()
      } as Post;
    });

    // Get unique categories
    const categories = Array.from(
      new Set(allPosts.map(p => p.category || 'General'))
    );

    // Fixed: Featured posts filtering logic
    const featuredPosts = allPosts
      .filter(p => p.featured === true)
      .slice(0, 3);

    const start = (page - 1) * limit;
    const paginated = allPosts.slice(start, start + limit);

    return NextResponse.json({
      posts: paginated,
      total: allPosts.length,
      page,
      limit,
      categories,
      featuredPosts
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      content,
      excerpt,
      author,
      authorImage,
      image,
      category,
      featured = false
    } = body;

    if (!title || !slug || !content || !author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newPost: PostInput = {
      title,
      slug,
      content,
      excerpt: excerpt || `${content.substring(0, 100)}...`,
      author,
      authorImage: authorImage || '',
      image: image || '',
      category: category || 'General',
      featured,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'posts'), newPost);

    return NextResponse.json(
      { id: docRef.id, slug: newPost.slug },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}