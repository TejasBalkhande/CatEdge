'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BlogForm {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  authorImage: string;
  image: string;
  category: string;
  featured: boolean;
}

type StringKeys = Exclude<keyof BlogForm, 'featured'>;
type BooleanKeys = 'featured';

const stringKeys: StringKeys[] = [
  'title', 'slug', 'content', 'excerpt', 
  'author', 'authorImage', 'image', 'category'
];

const booleanKeys: BooleanKeys[] = ['featured'];

function isStringKey(key: string): key is StringKeys {
  return stringKeys.includes(key as StringKeys);
}

function isBooleanKey(key: string): key is BooleanKeys {
  return booleanKeys.includes(key as BooleanKeys);
}

export default function AdminBlogForm() {
  const router = useRouter();

  const [form, setForm] = useState<BlogForm>({
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (isStringKey(name)) {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (isBooleanKey(name)) {
      setForm(prev => ({ ...prev, [name]: checked }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
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

  type FormField = {
    label: string;
    name: StringKeys;
    textarea?: boolean;
  };

  const fields: FormField[] = [
    { label: 'Title', name: 'title' },
    { label: 'Slug', name: 'slug' },
    { label: 'Content', name: 'content', textarea: true },
    { label: 'Excerpt', name: 'excerpt' },
    { label: 'Author', name: 'author' },
    { label: 'Author Image URL', name: 'authorImage' },
    { label: 'Image URL', name: 'image' },
    { label: 'Category', name: 'category' },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ label, name, textarea }) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            {textarea ? (
              <textarea
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                rows={6}
                required={name === 'content'}
              />
            ) : (
              <input
                type="text"
                name={name}
                value={form[name]}
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
      
      <div className="mt-4">
        <Link href="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}