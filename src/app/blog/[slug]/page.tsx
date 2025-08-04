// src/app/blog/[slug]/page.tsx

import { Post } from '../../../../types';
import Link from 'next/link';

// Simplified base URL detection
function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return `http://localhost:${process.env.PORT || 3000}`;
}

async function getPost(slug: string): Promise<{ post: Post }> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/posts/${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const { post } = await getPost(params.slug);
    return {
      title: post.title,
      description: post.excerpt || post.title,
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        images: [post.image],
      },
    };
  } catch (e) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found',
    };
  }
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  let post: Post | null = null;
  
  try {
    const data = await getPost(params.slug);
    post = data.post;
  } catch (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Post Not Found</h1>
          <p className="text-gray-700 mb-8">The requested post could not be loaded.</p>
          <Link href="/" className="text-indigo-600 hover:underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 w-8 h-8 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">CE</span>
            </div>
            <Link href="/">
              <span className="text-xl font-bold text-indigo-800 cursor-pointer">CATPrepEdge</span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium">Home</Link>
            <Link href="/mock-test" className="text-gray-700 hover:text-indigo-600 font-medium">Mock Tests</Link>
            <Link href="/mock-test" className="text-gray-700 hover:text-indigo-600 font-medium">Analytics</Link>
            <Link href="/colleges" className="text-gray-700 hover:text-indigo-600 font-medium">IIM Info</Link>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
            Get Started
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <article className="flex-1 bg-white rounded-xl shadow-md p-6 mb-8 lg:mb-0">
            <div className="mb-4">
              <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                CAT Preparation
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="flex items-center text-gray-600 mb-8">
              <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <span className="text-indigo-800 font-medium">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <span className="block font-medium text-gray-900">By {post.author}</span>
                <span className="text-gray-600">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
            
            {post.image && (
              <div className="aspect-video rounded-lg mb-8 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div
              className="prose prose-lg max-w-none !text-gray-800 prose-headings:font-bold prose-a:text-indigo-600 hover:prose-a:text-indigo-800 prose-img:rounded-lg prose-ul:list-disc prose-ol:list-decimal"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Complete Preparation Ecosystem</h2>
              <p className="mb-6 opacity-90">
                Master the Common Admission Test with confidence through comprehensive analytics, 
                personalized mock tests, and strategic insights.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-emerald-300 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Track progress with advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-emerald-300 mt=0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Curated practice questions</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-emerald-300 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>IIM college cutoffs & placements</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-emerald-300 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free exclusive CAT preparation book</span>
                </li>
              </ul>
              
              <Link 
                href="/"
                className="mt-6 w-full bg-white text-indigo-700 font-semibold py-3 rounded-lg hover:bg-indigo-50 transition-colors text-center block"
              >
                Join Now - It's Free!
              </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why CATPrepEdge?</h3>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Personalized analytics to identify strengths and weaknesses</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Free downloadable CAT strategy book</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Comprehensive IIM college profiles with cutoff trends</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Placement statistics and package details</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}