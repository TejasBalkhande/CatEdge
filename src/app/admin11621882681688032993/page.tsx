'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminBlogForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: '',
    authorImage: '',
    image: '',
    category: '',
    featured: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert newlines to HTML line breaks in content
      const formattedContent = form.content.replace(/\n/g, '<br/>');
      
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          content: formattedContent
        }),
      });

      if (!res.ok) throw new Error('Failed to add blog post');

      const data = await res.json();
      alert('Blog added successfully!');
      router.push(`/blog/${data.slug}`);
    } catch (err) {
      console.error(err);
      alert('Error adding blog');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Title', name: 'title' },
          { label: 'Slug', name: 'slug' },
          { label: 'Content', name: 'content', textarea: true },
          { label: 'Excerpt', name: 'excerpt' },
          { label: 'Author', name: 'author' },
          { label: 'Author Image URL', name: 'authorImage' },
          { label: 'Image URL', name: 'image' },
          { label: 'Category', name: 'category' },
        ].map(({ label, name, textarea }) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            {textarea ? (
              <textarea
                name={name}
                value={(form as any)[name]}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                rows={6}
                required={name === 'content'}
              />
            ) : (
              <input
                type="text"
                name={name}
                value={(form as any)[name]}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required={['title', 'slug', 'author'].includes(name)}
              />
            )}
          </div>
        ))}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleCheckbox}
            className="w-4 h-4"
          />
          <label className="text-sm">Mark as featured</label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Publish Blog
        </button>
      </form>
    </div>
  );
}