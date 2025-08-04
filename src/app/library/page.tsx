//src\app\library\page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Search, X, Filter, Download, ArrowRight, LayoutGrid, FileText, BarChart3 } from 'lucide-react';
import metadata from '@/data/metadata.json';
import Link from 'next/link';

interface PDFMetadata {
  title: string;
  section: string;
  source: string;
  tags: string[];
  view_url: string;
}

// Section color mapping
const SECTION_COLOR_MAP: Record<string, string> = {
  'VARC': 'bg-amber-500',
  'DILR': 'bg-violet-500',
  'QA': 'bg-orange-500',
  'PYQs': 'bg-indigo-500',
  'IMP BOOKS': 'bg-rose-500',
  'Quantitative Aptitude': 'bg-blue-500',
  'Verbal Ability': 'bg-orange-500',
  'Data Interpretation': 'bg-purple-500',
  'Logical Reasoning': 'bg-pink-500',
  'Mock Tests': 'bg-cyan-500',
  'Formulas': 'bg-lime-500',
  'Shortcuts': 'bg-yellow-500'
};

// Include all sections
const filteredMetadata = metadata as PDFMetadata[];

// Section name mapping to handle variations
const SECTION_MAP: Record<string, string> = {
  'imp books': 'IMP BOOKS',
  'important books': 'IMP BOOKS',
  'books': 'IMP BOOKS',
  'pyq': 'PYQs',
  'pyqs': 'PYQs',
  'previous year': 'PYQs',
  'past papers': 'PYQs'
};

// Helper function to decode and map URL parameters
function decodeSectionParam(param: string | null): string {
  if (!param) return 'all';
  
  // Decode and normalize
  const decoded = decodeURIComponent(param).replace(/\+/g, ' ').toLowerCase();
  
  // Map to standard section name if needed
  return SECTION_MAP[decoded] || decoded.charAt(0).toUpperCase() + decoded.slice(1);
}

// Helper function to safely decode URI components
function decodeURIComponentSafe(value: string | null): string {
  if (!value) return '';
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function LibraryContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filteredPDFs, setFilteredPDFs] = useState<PDFMetadata[]>(filteredMetadata);
  const [visibleCount, setVisibleCount] = useState(12);

  // Extract unique sections and tags
  const sections = Array.from(new Set(filteredMetadata.map(item => item.section)));
  const tags = Array.from(new Set(filteredMetadata.flatMap(item => item.tags))).sort();

  // Initialize from URL parameters
  useEffect(() => {
    // Get search query from URL
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(decodeURIComponentSafe(searchParam));
    }

    // Get section from URL
    const sectionParam = searchParams.get('section');
    if (sectionParam) {
      const decodedSection = decodeSectionParam(sectionParam);
      setSelectedSection(decodedSection);
    }
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    let result = [...filteredMetadata];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(pdf => 
        pdf.title.toLowerCase().includes(query) ||
        pdf.section.toLowerCase().includes(query) ||
        pdf.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply section filter (case-insensitive)
    if (selectedSection !== 'all') {
      result = result.filter(pdf => 
        pdf.section.toLowerCase() === selectedSection.toLowerCase()
      );
    }
    
    // Apply tag filter
    if (selectedTag !== 'all') {
      result = result.filter(pdf => pdf.tags.includes(selectedTag));
    }
    
    setFilteredPDFs(result);
    setVisibleCount(12);
  }, [searchQuery, selectedSection, selectedTag]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSection('all');
    setSelectedTag('all');
  };

  // Load more PDFs
  const loadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Group PDFs by section for the visible count
  const groupedPDFs = filteredPDFs.slice(0, visibleCount).reduce((acc, pdf) => {
    if (!acc[pdf.section]) {
      acc[pdf.section] = [];
    }
    acc[pdf.section].push(pdf);
    return acc;
  }, {} as Record<string, PDFMetadata[]>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-200">
      {/* Animated background elements */}
      <motion.div 
        className="fixed top-20 left-10 w-64 h-64 rounded-full bg-blue-900 blur-[100px] opacity-20"
        animate={{ 
          scale: [1, 1.1, 1],
          y: [0, 20, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="fixed top-1/3 right-20 w-48 h-48 rounded-full bg-purple-900 blur-[100px] opacity-20"
        animate={{ 
          scale: [1, 1.2, 1],
          y: [0, -15, 0]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <Link href="/">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">CATPrepEdge</span>
            </Link>
          </motion.div>
          
          <div className="hidden md:flex space-x-6">
            <Link 
              href="/"
              className="flex items-center text-gray-400 hover:text-cyan-400 font-medium transition-colors group"
            >
              <span className="mr-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <LayoutGrid className="w-4 h-4" />
              </span>
              Home
            </Link>
            <Link 
              href="#"
              className="flex items-center text-cyan-400 font-medium transition-colors group"
            >
              <span className="mr-2 text-cyan-400">
                <BookOpen className="w-4 h-4" />
              </span>
              Library
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden text-cyan-400 z-50"
            onClick={() => setMobileFiltersOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Filter className="w-8 h-8" />
          </motion.button>
        </nav>
      </motion.header>

      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Page Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">PDF Library</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Section-wise downloadable CAT preparation resources
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-10">
          {/* Search Bar */}
          <motion.div 
            className="relative max-w-3xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-5 h-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder='Search PDFs by title, section or tag (e.g. "Geometry", "CAT 2022")'
              className="w-full p-4 pl-12 rounded-2xl border border-gray-700 bg-gray-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition shadow-lg text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-3 w-full">
              {/* Section Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm text-gray-400 mb-2">Filter by Section</label>
                <div className="relative">
                  <select
                    className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition text-white appearance-none"
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                  >
                    <option value="all">All Sections</option>
                    {sections.map((section) => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Tag Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm text-gray-400 mb-2">Filter by Tag</label>
                <div className="relative">
                  <select
                    className="w-full p-3 rounded-xl border border-gray-700 bg-gray-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition text-white appearance-none"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                  >
                    <option value="all">All Tags</option>
                    {tags.map((tag) => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Clear Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-3 mt-6 bg-gradient-to-r from-gray-800 to-gray-900 text-cyan-400 font-medium rounded-xl shadow-lg border border-cyan-500/30 hover:bg-gray-750 transition-all"
              onClick={clearFilters}
            >
              Clear
            </motion.button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <div className="text-cyan-400 font-medium">
            {filteredPDFs.length} PDF{filteredPDFs.length !== 1 ? 's' : ''} found
          </div>
          <div className="text-sm text-gray-500">
            Showing {Math.min(visibleCount, filteredPDFs.length)} of {filteredPDFs.length}
          </div>
        </div>

        {/* Grouped PDFs by Section */}
        {filteredPDFs.length > 0 ? (
          <div>
            {Object.entries(groupedPDFs).map(([section, pdfs]) => (
              <div key={section} className="mb-12">
                <motion.h2 
                  className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-3 flex items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span 
                    className="w-3 h-3 rounded-full mr-3" 
                    style={{ 
                      backgroundColor: SECTION_COLOR_MAP[section] 
                        ? SECTION_COLOR_MAP[section].replace('bg-', '').replace('-500', '-400') 
                        : '#22c55e' 
                    }}
                  />
                  {section}
                </motion.h2>
                
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {pdfs.map((pdf, index) => {
                    const colorClass = SECTION_COLOR_MAP[pdf.section] || 'bg-emerald-500';
                    
                    return (
                      <motion.div
                        key={index}
                        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-colors flex flex-col relative overflow-hidden"
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                      >
                        {/* Top color bar - section indicator */}
                        <div 
                          className={`absolute top-0 left-0 w-full h-1 ${colorClass}`}
                        />
                        
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-bold text-white">{pdf.title}</h3>
                          <span 
                            className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300"
                            style={{ 
                              backgroundColor: colorClass.replace('bg-', '').replace('-500', '-900/20'),
                              color: colorClass.replace('bg-', '').replace('-500', '-300')
                            }}
                          >
                            {pdf.section}
                          </span>
                        </div>
                        
                        <div className="mb-4 flex-grow">
                          <p className="text-sm text-gray-400 mb-3">Source: {pdf.source}</p>
                          <div className="text-sm text-gray-400 mb-2">Tags:</div>
                          <div className="flex flex-wrap gap-2">
                            {pdf.tags.map((tag, i) => (
                              <span 
                                key={i} 
                                className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <a 
                          href={pdf.view_url} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center justify-between group"
                        >
                          <span className="text-cyan-400 group-hover:text-cyan-300 font-medium transition-colors">
                            View PDF
                          </span>
                          <ArrowRight className="ml-2 w-4 h-4 text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                        </a>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
              <BookOpen className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No PDFs Found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all"
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}

        {/* Load More Button */}
        {filteredPDFs.length > visibleCount && (
          <div className="mt-10 text-center">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all"
              onClick={loadMore}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Load More PDFs
            </motion.button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-400 border-t border-gray-800 mt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <LayoutGrid className="w-6 h-6 text-white" />
                </div>
                <Link href="/">
                  <span className="text-xl font-bold text-white">CATPrepEdge</span>
                </Link>
              </div>
              <p className="text-gray-500 mb-6">
                Free CAT preparation resources, PYQs, and exam guidance to help you ace your exam.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Resources</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/library" className="flex items-center hover:text-cyan-400 transition-colors">
                    <BookOpen className="mr-3 w-4 h-4 text-cyan-400" />
                    PDF Library
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center hover:text-cyan-400 transition-colors">
                    <FileText className="mr-3 w-4 h-4 text-cyan-400" />
                    Previous Papers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="flex items-center hover:text-cyan-400 transition-colors">
                    <BarChart3 className="mr-3 w-4 h-4 text-cyan-400" />
                    Analysis &amp; Reports
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Contact Us</h3>
              <address className="not-italic space-y-4">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 mt-1 w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 22.621l-3.521-6.795c-.008.004-1.974.97-2.064 1.011-2.24 1.086-6.799-7.82-4.609-8.994l2.083-1.026-3.493-6.817-2.106 1.039c-7.202 3.755 4.233 25.982 11.6 22.615.121-.055 2.102-1.029 2.11-1.033z"/>
                  </svg>
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 mt-1 w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
                  </svg>
                  <span>Mumbai, India</span>
                </div>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} CATPrepEdge. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Filters Panel */}
      {mobileFiltersOpen && (
        <motion.div 
          className="fixed inset-0 bg-gray-950 z-50 flex flex-col md:hidden"
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 flex justify-between items-center border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Filters</h2>
            <button 
              className="text-gray-400"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-grow">
            {/* Section Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Section</h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  className={`px-4 py-3 rounded-xl text-left ${
                    selectedSection === 'all'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                  onClick={() => setSelectedSection('all')}
                >
                  All Sections
                </button>
                {sections.map((section) => (
                  <button
                    key={section}
                    className={`px-4 py-3 rounded-xl text-left ${
                      selectedSection === section
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                    onClick={() => setSelectedSection(section)}
                  >
                    {section}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Tag Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className={`px-4 py-3 rounded-xl text-left ${
                    selectedTag === 'all'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                  onClick={() => setSelectedTag('all')}
                >
                  All Tags
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag}
                    className={`px-4 py-3 rounded-xl text-left ${
                      selectedTag === tag
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                className="flex-1 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-cyan-400 font-medium rounded-xl shadow-lg border border-cyan-500/30"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Apply Filters
              </button>
              <button
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl shadow-lg"
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Main component with Suspense boundary
export default function LibraryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    }>
      <LibraryContent />
    </Suspense>
  );
}