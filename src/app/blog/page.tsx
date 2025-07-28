'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

interface BlogPost {
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
  createdAt: string | Date | { seconds: number } | { toDate: () => Date };
}

interface BlogData {
  posts: BlogPost[];
  total: number;
  categories: string[];
  featuredPosts: BlogPost[];
}

export default function BlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const { isAuthenticated, logout } = useAuth();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const limit = 8;

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        const query = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...(category && { category }),
          sort,
        }).toString();

        const res = await fetch(`/api/posts?${query}`);
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data: BlogData = await res.json();
        setBlogData(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load blog posts. Please try again later.');
        setBlogData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, [page, search, category, sort]);

  const updateQueryParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (!('page' in newParams)) params.delete('page');
    router.push(`/blog?${params.toString()}`);
  };

  const totalPages = blogData ? Math.ceil(blogData.total / limit) : 0;

  const formatDate = (timestamp: BlogPost['createdAt']) => {
    if (!timestamp) return '';
    
    // Handle Firestore Timestamp objects
    let date;
    if (typeof timestamp === 'object' && 'seconds' in timestamp) {
      date = new Date((timestamp as { seconds: number }).seconds * 1000);
    } 
    // Handle Firestore Timestamp objects with toDate method
    else if (typeof timestamp === 'object' && 'toDate' in timestamp) {
      date = (timestamp as { toDate: () => Date }).toDate();
    } 
    // Handle ISO strings and Date objects
    else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    }
    // Handle Date objects
    else if (timestamp instanceof Date) {
      date = timestamp;
    }
    // Fallback to current date
    else {
      date = new Date();
    }

    // Check for invalid dates
    if (isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleLogout = () => {
    logout();
    router.push('/signup-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm w-full sticky top-0 z-50">
        <div className="w-full flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent">
              CATPrepEdge
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="px-4 py-2 rounded-md text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-all duration-300"
            >
              Home
            </Link>

            <Link
              href="/mock-test"
              className="px-4 py-2 rounded-md text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-all duration-300"
            >
              Mock-Test
            </Link>
            <Link
              href="/colleges"
              className="px-4 py-2 rounded-md text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-all duration-300"
            >
              Colleges
            </Link>
            

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md text-red-700 hover:text-white hover:bg-red-700 transition-all duration-300"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-3">CATPrepEdge Blog</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Expert strategies, study tips, and success stories for CAT preparation
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area */}
          <div className="w-full lg:w-8/12">
            {/* Featured Post */}
            {blogData?.featuredPosts && blogData.featuredPosts.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                <div className="relative h-72">
                  {blogData.featuredPosts[0].image ? (
                    <Image 
                      src={blogData.featuredPosts[0].image} 
                      alt={blogData.featuredPosts[0].title} 
                      fill 
                      className="object-cover" 
                      sizes="(max-width: 1024px) 100vw, 70vw"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 h-full flex justify-center items-center">
                      <span className="text-gray-400">Featured Image</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/90 to-transparent p-5">
                    <span className="text-xs text-blue-800 bg-blue-100 px-2 py-1 rounded-full mb-2 inline-block">
                      Featured
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      <Link 
                        href={`/blog/${encodeURIComponent(blogData.featuredPosts[0].slug)}`} 
                        className="hover:text-blue-800 transition-colors"
                      >
                        {blogData.featuredPosts[0].title}
                      </Link>
                    </h2>
                    <p className="text-gray-700 line-clamp-2">
                      {blogData.featuredPosts[0].excerpt}
                    </p>
                    <div className="flex items-center mt-3">
                      <p className="text-sm text-blue-800 font-medium">{blogData.featuredPosts[0].author}</p>
                      <span className="mx-2 text-gray-400">•</span>
                      <p className="text-xs text-gray-600">
                        {formatDate(blogData.featuredPosts[0].createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-8">
                <p className="text-gray-600">No featured articles available</p>
              </div>
            )}

            {/* Blog List Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-blue-900">Latest Articles</h2>
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => updateQueryParams({ sort: e.target.value })}
                  className="p-2 bg-white border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>

            {/* Posts Grid */}
            {!isLoading && blogData ? (
              blogData.posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogData.posts.map((post) => (
                    <div 
                      key={post.id} 
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-400"
                    >
                      <div className="relative h-44">
                        {post.image ? (
                          <Image 
                            src={post.image} 
                            alt={post.title} 
                            fill 
                            className="object-cover" 
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="bg-gradient-to-r from-gray-100 to-gray-200 h-full flex justify-center items-center">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <span className="text-xs text-blue-800 bg-blue-100 px-2 py-1 rounded-full mb-2 inline-block">
                          {post.category}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          <Link 
                            href={`/blog/${encodeURIComponent(post.slug)}`} 
                            className="hover:text-blue-800 transition-colors"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                          {post.excerpt || `${post.content.substring(0, 150)}...`}
                        </p>
                        <div className="flex items-center pt-3 border-t border-gray-100">
                          {post.authorImage && (
                            <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                              <Image 
                                src={post.authorImage} 
                                alt={post.author} 
                                fill 
                                className="object-cover" 
                                sizes="32px"
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-blue-800">{post.author}</p>
                            <p className="text-xs text-gray-600">{formatDate(post.createdAt)}</p>
                          </div>
                          <Link 
                            href={`/blog/${encodeURIComponent(post.slug)}`}
                            className="ml-auto text-blue-800 hover:text-blue-900 text-sm font-medium"
                          >
                            Read more →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
                  <h3 className="text-xl font-medium text-blue-800 mb-2">No posts found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )
            ) : (
              <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
                </div>
                <p className="mt-4 text-gray-600">Loading posts...</p>
              </div>
            )}

            {/* Pagination */}
            {blogData && blogData.posts.length > 0 && (
              <div className="mt-8 flex justify-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateQueryParams({ page: p.toString() })}
                    className={`px-4 py-2 rounded-lg border ${
                      p === page 
                        ? 'bg-gradient-to-r from-blue-800 to-blue-900 text-white border-blue-800' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-4/12">
            <div className="space-y-6">
              {/* Search Widget */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Search</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={search}
                    onChange={(e) => updateQueryParams({ search: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                  />
                  <svg 
                    className="absolute right-3 top-3.5 w-5 h-5 text-gray-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Categories Widget */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Categories</h3>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => updateQueryParams({ category: '' })}
                      className={`w-full text-left px-3 py-2 rounded-md ${!category ? 'bg-blue-100 text-blue-900' : 'text-gray-800 hover:bg-gray-50'}`}
                    >
                      All Categories
                    </button>
                  </li>
                  {blogData?.categories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => updateQueryParams({ category: cat })}
                        className={`w-full text-left px-3 py-2 rounded-md ${category === cat ? 'bg-blue-100 text-blue-900' : 'text-gray-800 hover:bg-gray-50'}`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Posts */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Popular Articles</h3>
                <div className="space-y-3">
                  {blogData?.featuredPosts.slice(1, 4).map((post, index) => (
                    <Link 
                      key={post.id} 
                      href={`/blog/${encodeURIComponent(post.slug)}`}
                      className="flex items-start space-x-3 group"
                    >
                      <span className="text-lg font-bold text-blue-800 mt-0.5">{index + 1}.</span>
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-800 transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Progress Tracking Widget */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 shadow-sm p-5">
                <div className="flex items-center mb-2">
                  <div className="bg-white/80 border border-indigo-300 rounded-lg p-2 mr-3">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-6 w-6 text-indigo-700" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-indigo-900">Track Your Progress</h3>
                </div>
                
                <ul className="space-y-2 mb-4 pl-1">
                  <li className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-indigo-700 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                    <span className="text-gray-700">Simulate real CAT exam conditions</span>
                  </li>
                  <li className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-indigo-700 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                    <span className="text-gray-700">Detailed performance analytics</span>
                  </li>
                  <li className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-indigo-700 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                    <span className="text-gray-700">Identify strengths & weaknesses</span>
                  </li>
                  <li className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-indigo-700 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                    <span className="text-gray-700">Personalized improvement plans</span>
                  </li>
                </ul>
                
                <Link href="/mock-test">
                  <button className="w-full bg-gradient-to-r from-indigo-700 to-indigo-800 text-white font-medium rounded-lg py-3 hover:from-indigo-800 hover:to-indigo-900 transition-all duration-300 flex items-center justify-center">
                    Start Mock Test
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 ml-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 8l4 4m0 0l-4 4m4-4H3" 
                      />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-700">© {new Date().getFullYear()} CATPrepEdge. All rights reserved.</p>
          <p className="mt-1 text-gray-600 text-sm">Empowering CAT aspirants with premium resources</p>
        </div>
      </footer>
    </div>
  );
}