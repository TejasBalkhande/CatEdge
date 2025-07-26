// src/app/page.tsx
'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, BookOpen, ArrowDown, Calendar, BarChart3, Download, ArrowRight, Bell, Book, Award, User, Bookmark, ClipboardList, GraduationCap, MessageSquare, Star, FileText, Clock, Percent, LayoutGrid } from 'lucide-react';
import { useMemo } from 'react'; 
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLFormElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Real dates for CAT exam timeline
  const today = new Date();
  const catRegistrationStart = new Date('2025-08-01');
  const catRegistrationEnd = new Date('2025-09-15');
  const catExamDate = new Date('2025-11-24');
  const catResultDate = new Date('2026-01-05');

  // Calculate days remaining
  const getDaysRemaining = (targetDate: Date) => {
    const diffTime = Math.max(targetDate.getTime() - today.getTime(), 0);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysUntilRegistration = getDaysRemaining(catRegistrationStart);
  const daysUntilRegistrationEnds = getDaysRemaining(catRegistrationEnd);
  const daysUntilExam = getDaysRemaining(catExamDate);

  // Format date to "MMM d, yyyy" without external libraries
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate registration progress percentage
  const registrationProgress = () => {
    const totalDuration = catRegistrationEnd.getTime() - catRegistrationStart.getTime();
    const elapsed = today.getTime() - catRegistrationStart.getTime();
    
    if (today < catRegistrationStart) return 0;
    if (today > catRegistrationEnd) return 100;
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  // Update the timeline stages with real dates
  const timelineStages = [
    {
      title: "Registration Opens",
      date: formatDate(catRegistrationStart),
      description: "CAT application portal opens",
      icon: <ClipboardList className="w-6 h-6 text-white" />,
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Registration Closes",
      date: formatDate(catRegistrationEnd),
      description: "Last day to submit application",
      icon: <Calendar className="w-6 h-6 text-white" />,
      color: "from-purple-600 to-indigo-600"
    },
    {
      title: "Admit Card",
      date: "Oct 25, 2025",
      description: "Download your exam hall ticket",
      icon: <FileText className="w-6 h-6 text-white" />,
      color: "from-amber-600 to-orange-600"
    },
    {
      title: "Exam Day",
      date: formatDate(catExamDate),
      description: "CAT 2025 examination",
      icon: <Award className="w-6 h-6 text-white" />,
      color: "from-emerald-600 to-teal-600"
    },
    {
      title: "Results",
      date: formatDate(catResultDate),
      description: "Scorecard available online",
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      color: "from-rose-600 to-pink-600"
    }
  ];

  const navLinks = [
    { name: 'Home', href: '#', icon: <Book className="w-4 h-4" /> },
    { name: 'Library', href: '/library', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Blog', href: '/blog', icon: <FileText className="w-4 h-4" /> },
    { name: 'Colleges', href: '/colleges', icon: <GraduationCap className="w-4 h-4" /> },
    { name: 'Mock Tests', href: '/mock-test', icon: <Award className="w-4 h-4" /> },
  ];

  const examDates = [
    { exam: 'CAT 2025', registrationStart: 'Aug 5, 2025', registrationEnd: 'Sep 15, 2025', examDate: 'Nov 24, 2025' },
    { exam: 'XAT 2026', registrationStart: 'Aug 15, 2025', registrationEnd: 'Nov 30, 2025', examDate: 'Jan 5, 2026' },
    { exam: 'SNAP 2025', registrationStart: 'Aug 20, 2025', registrationEnd: 'Nov 23, 2025', examDate: 'Dec 10, 2025' },
    { exam: 'NMAT 2025', registrationStart: 'Aug 1, 2025', registrationEnd: 'Oct 10, 2025', examDate: 'Oct 15 - Dec 20, 2025' },
    { exam: 'IIFT 2026', registrationStart: 'Sep 1, 2025', registrationEnd: 'Oct 31, 2025', examDate: 'Dec 8, 2025' },
  ];

  const features = [
    {
      icon: <BookOpen className="w-10 h-10" />,
      title: 'PDF Library',
      description: 'Section-wise CAT prep PDFs',
      color: 'from-blue-500 to-cyan-500',
      href: '/library'
    },
    {
      icon: <FileText className="w-10 h-10" />,
      title: 'IMP Books',
      description: 'Best books for CAT prep',
      color: 'from-purple-500 to-indigo-600',
      href: '/library?section=IMP+Books'
    },
    {
      icon: <Clock className="w-10 h-10" />,
      title: 'PYQ papers',
      description: 'ALL previous years papers',
      color: 'from-teal-500 to-emerald-600',
      href: '/library?section=PYQ'
    },
    {
      icon: <Percent className="w-10 h-10" />,
      title: 'College Cut-Offs',
      description: 'Top B-schools & last-year cut-offs',
      color: 'from-violet-500 to-fuchsia-600',
      href: '/colleges'
    },
  ];

  const pyqCategories = [
    { id: 'all', name: 'All PYQs' },
    { id: 'qa', name: 'Quantitative Aptitude' },
    { id: 'varc', name: 'Verbal Ability' },
    { id: 'lrdi', name: 'Logical Reasoning' },
  ];

  // Define section topics for filtering
  const sectionTopics = {
    qa: [
      'Algebra', 'Geometry', 'Arithmetic', 'Number System', 'Profit & Loss', 
      'Percentage', 'Time, Speed and Distance', 'Time and Work', 'Averages', 
      'Ratio and Proportion', 'Mixtures and Alligations', 'Simple Interest', 
      'Compound Interest', 'Mensuration', 'Trigonometry', 'Coordinate Geometry',
      'Set Theory', 'Logarithms', 'Permutation and Combination', 'Probability'
    ],
    varc: [
      'Reading Comprehension', 'Vocabulary', 'Para Jumbles', 'Grammar', 
      'Sentence Correction', 'Para Completion', 'Para Summary', 
      'Critical Reasoning', 'Fill in the Blanks', 'Idioms and Phrases'
    ],
    lrdi: [
      'Data Interpretation', 'Data Sufficiency', 'Tables', 'Bar Graphs', 
      'Pie Charts', 'Line Graphs', 'Caselets', 'Venn Diagrams', 
      'Seating Arrangement', 'Blood Relations', 'Direction Sense', 
      'Ordering and Ranking', 'Syllogisms', 'Logical Connectives', 
      'Binary Logic', 'Coding and Decoding', 'Clocks and Calendars'
    ]
  };

  const pyqPapers = [
    { 
      year: 'CAT 2023', 
      difficulty: 'Hard', 
      questions: 66,
      time: '120 mins',
      topics: ['Algebra', 'Geometry', 'Reading Comprehension'],
      color: 'bg-gradient-to-r from-blue-600 to-cyan-600',
      tags: ['CAT', '2023', 'Quantitative', 'Verbal']
    },
    { 
      year: 'CAT 2022', 
      difficulty: 'Moderate', 
      questions: 66,
      time: '120 mins',
      topics: ['Profit & Loss', 'Para Jumbles', 'Data Interpretation'],
      color: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      tags: ['CAT', '2022', 'Quantitative', 'Logical']
    },
    { 
      year: 'CAT 2021', 
      difficulty: 'Hard', 
      questions: 66,
      time: '120 mins',
      topics: ['Number System', 'Vocabulary', 'Seating Arrangement'],
      color: 'bg-gradient-to-r from-teal-600 to-emerald-600',
      tags: ['CAT', '2021', 'Quantitative', 'Verbal', 'Logical']
    },
    { 
      year: 'CAT 2020', 
      difficulty: 'Moderate', 
      questions: 76,
      time: '120 mins',
      topics: ['Percentages', 'Grammar', 'Blood Relations'],
      color: 'bg-gradient-to-r from-violet-600 to-fuchsia-600',
      tags: ['CAT', '2020', 'Quantitative', 'Verbal', 'Logical']
    },
  ];

  // Topic resources for each section
  const sectionResources = {
    qa: [
      {
        id: 1,
        title: "Percentage Concepts",
        description: "Complete guide to percentage calculations with practice problems",
        topics: ["Percentage", "Formulas"],
        difficulty: "Intermediate",
        time: "45 mins",
        color: "from-blue-500 to-cyan-500"
      },
      {
        id: 2,
        title: "Algebra Fundamentals",
        description: "Linear equations, quadratic equations and inequalities",
        topics: ["Algebra", "Equations"],
        difficulty: "Beginner",
        time: "60 mins",
        color: "from-purple-500 to-indigo-500"
      },
      {
        id: 3,
        title: "Geometry Masterclass",
        description: "Triangles, circles, polygons and coordinate geometry",
        topics: ["Geometry", "Shapes"],
        difficulty: "Advanced",
        time: "90 mins",
        color: "from-teal-500 to-emerald-500"
      },
      {
        id: 4,
        title: "Probability & Statistics",
        description: "Probability distributions and statistical analysis",
        topics: ["Probability", "Statistics"],
        difficulty: "Intermediate",
        time: "75 mins",
        color: "from-amber-500 to-orange-500"
      }
    ],
    varc: [
      {
        id: 1,
        title: "Reading Comprehension",
        description: "Strategies for different types of RC passages",
        topics: ["Comprehension", "Passages"],
        difficulty: "Intermediate",
        time: "50 mins",
        color: "from-blue-500 to-cyan-500"
      },
      {
        id: 2,
        title: "Vocabulary Builder",
        description: "Essential words, idioms and phrases for CAT",
        topics: ["Vocabulary", "Idioms"],
        difficulty: "Beginner",
        time: "40 mins",
        color: "from-purple-500 to-indigo-500"
      },
      {
        id: 3,
        title: "Grammar Essentials",
        description: "Common grammatical rules and error spotting",
        topics: ["Grammar", "Sentence Correction"],
        difficulty: "Intermediate",
        time: "55 mins",
        color: "from-teal-500 to-emerald-500"
      },
      {
        id: 4,
        title: "Para Jumbles Mastery",
        description: "Techniques to solve para jumble questions quickly",
        topics: ["Para Jumbles", "Sentence Rearrangement"],
        difficulty: "Advanced",
        time: "45 mins",
        color: "from-amber-500 to-orange-500"
      }
    ],
    lrdi: [
      {
        id: 1,
        title: "Data Interpretation",
        description: "Interpreting tables, charts and graphs",
        topics: ["Data Analysis", "Charts"],
        difficulty: "Intermediate",
        time: "60 mins",
        color: "from-blue-500 to-cyan-500"
      },
      {
        id: 2,
        title: "Logical Puzzles",
        description: "Solving complex logical reasoning puzzles",
        topics: ["Puzzles", "Logic"],
        difficulty: "Advanced",
        time: "70 mins",
        color: "from-purple-500 to-indigo-500"
      },
      {
        id: 3,
        title: "Seating Arrangements",
        description: "Circular, linear and matrix arrangements",
        topics: ["Arrangements", "Positions"],
        difficulty: "Intermediate",
        time: "65 mins",
        color: "from-teal-500 to-emerald-500"
      },
      {
        id: 4,
        title: "Venn Diagrams & Sets",
        description: "Set theory applications and venn diagrams",
        topics: ["Sets", "Venn Diagrams"],
        difficulty: "Beginner",
        time: "40 mins",
        color: "from-amber-500 to-orange-500"
      }
    ]
  };

  const colleges = [
    { institute: 'IIM Ahmedabad', category: 'General', percentile: 99.5, fees: '₹23L' },
    { institute: 'IIM Bangalore', category: 'General', percentile: 99.0, fees: '₹24L' },
    { institute: 'IIM Calcutta', category: 'General', percentile: 98.5, fees: '₹23L' },
    { institute: 'FMS Delhi', category: 'General', percentile: 98.0, fees: '₹2L' },
    { institute: 'IIM Lucknow', category: 'General', percentile: 97.0, fees: '₹19L' },
  ];

  const testimonials = [
    { 
      text: "The PYQ section was a game-changer! Solving actual CAT questions helped me understand the exam pattern better than any mock test.", 
      author: "Rahul Sharma", 
      score: "99.2%ile",
      color: "bg-gradient-to-br from-gray-800 to-gray-900"
    },
    { 
      text: "I improved my quant score by 30% after practicing with CATPrepEdge's topic-specific previous year questions.", 
      author: "Priya Verma", 
      score: "98.7%ile",
      color: "bg-gradient-to-br from-gray-800 to-gray-900"
    },
    { 
      text: "The detailed solutions helped me identify my weak areas. I went from 85%ile to 96%ile in just 3 months!", 
      author: "Arjun Patel", 
      score: "96.5%ile",
      color: "bg-gradient-to-br from-gray-800 to-gray-900"
    }
  ];

  // Search suggestions
  const searchSuggestions = [
    'Quantitative Aptitude',
    'Verbal Ability',
    'Logical Reasoning',
    'CAT 2023',
    'CAT 2022',
    'Algebra',
    'Reading Comprehension',
    'Data Interpretation',
    'Profit and Loss',
    'Geometry',
    'Vocabulary',
    'Para Jumbles',
    'Number System',
    'Grammar',
    'Seating Arrangement'
  ];

  // Filtered suggestions based on search input
  const filteredSuggestions = searchSuggestions.filter(suggestion => 
    suggestion.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Handle click outside of search suggestions and mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close mobile menu if clicked outside
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
      
      // Close search suggestions if clicked outside
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/library?search=${encodeURIComponent(searchValue.trim())}`);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    router.push(`/library?search=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  // Handle PYQ download
  const handleDownload = (year: string, tags: string[]) => {
    const query = new URLSearchParams();
    query.append('year', year);
    tags.forEach(tag => query.append('tag', tag));
    router.push(`/library?${query.toString()}`);
  };

  // Handle resource download
  const handleResourceDownload = (section: string, title: string) => {
    router.push(`/library?section=${section}&search=${encodeURIComponent(title)}`);
  };

  // Get category name from ID
  const getCategoryName = (id: string) => {
    const category = pyqCategories.find(cat => cat.id === id);
    return category ? category.name : 'Resources';
  };

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
          {/* Left-aligned Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            import Link from 'next/link';
            <Link href="/">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                CATPrepEdge
              </span>
            </Link>

          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Links with hover icons */}
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="group flex items-center text-gray-400 hover:text-cyan-400 font-medium transition-colors hover:scale-105 active:scale-95"
                >
                  <span className="mr-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {link.icon}
                  </span>
                  {link.name}
                </a>
              ))}
            </div>

            {/* Account Button */}
            <Link href={isAuthenticated ? "/dashboard" : "/signup-login"}>
              <motion.button
                className="flex items-center text-gray-400 hover:text-cyan-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-5 h-5 mr-2" />
                {isAuthenticated ? "Dashboard" : "Account"}
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-cyan-400 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-8 w-8" aria-hidden="true" />
              ) : (
                <Menu className="h-8 w-8" aria-hidden="true" />
              )}
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-gray-900/90 backdrop-blur-sm md:hidden"
          >
            <motion.div
              ref={menuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-full bg-gray-900 shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <LayoutGrid className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      CATPrepEdge
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-cyan-400 rounded-md focus:outline-none"
                  >
                    <X className="h-8 w-8" aria-hidden="true" />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Navigation Links */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/20 pb-2">
                      Navigation
                    </h3>
                    <ul className="space-y-3">
                      {navLinks.map((link) => (
                        <li key={link.name}>
                          <a
                            href={link.href}
                            className="flex items-center p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span className="mr-3 text-cyan-400">
                              {link.icon}
                            </span>
                            <span className="font-medium">{link.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Account Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/20 pb-2">
                      Account
                    </h3>
                    <ul className="space-y-3">
                      <li>
                        <Link
                          href={isAuthenticated ? "/dashboard" : "/signup-login"}
                          className="flex items-center p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="mr-3 w-5 h-5 text-cyan-400" />
                          <span className="font-medium">
                            {isAuthenticated ? "Dashboard" : "Login / Signup"}
                          </span>
                        </Link>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Bookmark className="mr-3 w-5 h-5 text-cyan-400" />
                          <span className="font-medium">Saved Resources</span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/20 pb-2">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="py-2 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg text-sm shadow-lg"
                        onClick={() => {
                          router.push('/library');
                          setMobileMenuOpen(false);
                        }}
                      >
                        Browse Library
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="py-2 px-4 bg-gray-800 text-cyan-400 font-medium rounded-lg text-sm shadow-lg border border-cyan-500/30"
                        onClick={() => {
                          document.getElementById('pyq')?.scrollIntoView({ behavior: 'smooth' });
                          setMobileMenuOpen(false);
                        }}
                      >
                        PYQs
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-800">
                  <p className="text-gray-500 text-sm">
                    CATPrepEdge provides free CAT preparation resources to help you ace your exam.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="block">Master CAT with</span>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Your Progress Analytics
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Download PYQs, solve actual CAT papers, and track your progress—all in one place
            </motion.p>
            
            <motion.form 
              className="relative max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSearch}
              ref={searchRef}
            >
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder='Search by topic or keyword (e.g. "Geometry", "CAT 2022")'
                className="w-full p-4 pl-12 rounded-2xl border border-gray-700 bg-gray-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition shadow-lg text-white"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              
              {/* Search Suggestions */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <motion.div
                  className="absolute z-20 w-full mt-2 bg-gray-800 rounded-xl shadow-lg border border-gray-700 max-h-60 overflow-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {filteredSuggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="px-4 py-3 hover:bg-gray-700 cursor-pointer flex items-center"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Search className="w-4 h-4 text-cyan-400 mr-3" />
                      {suggestion}
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.form>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(56, 189, 248, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all"
                type="submit"
                form="search-form"
              >
                Search
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gray-800 text-cyan-400 font-medium rounded-xl shadow-lg border border-cyan-500/30 transition-all"
                onClick={() =>
                  document
                    .getElementById("cat-timeline")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                View Calendar
              </motion.button>

            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything You Need to Ace CAT</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Comprehensive resources designed by experts to maximize your preparation
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const card = (
                <motion.div
                  key={feature.title}
                  className="bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-700 backdrop-blur-sm relative overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -10, borderColor: 'rgb(103, 232, 249)' }}
                >
                  <div className={`absolute top-0 left-0 w-full h-1 ${feature.color} bg-gradient-to-r`}></div>
                  <div className="text-cyan-400 mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              );

              return feature.href ? (
                <Link href={feature.href} key={feature.title} passHref>
                  {card}
                </Link>
              ) : (
                <div key={feature.title}>{card}</div>
              );
            })}
          </div>
        </section>

        {/* PYQ Section */}
        <section id="pyq" className="container mx-auto px-4 py-12 md:py-20 bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl mb-16 border border-gray-800">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Previous Year Questions</h2>
              <p className="text-gray-400">Actual CAT questions from past exams with detailed solutions</p>
            </div>
            <motion.a 
              href="#" 
              className="flex items-center text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
              whileHover={{ x: 5 }}
            >
              {activeTab === 'all' ? 'See all PYQs' : `See all ${getCategoryName(activeTab)} Resources`} 
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3 mb-10">
            {pyqCategories.map((category) => (
              <button
                key={category.id}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                }`}
                onClick={() => setActiveTab(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Content based on active tab */}
          {activeTab === 'all' ? (
            // Year-wise PYQ Papers
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pyqPapers.map((paper, index) => (
                <motion.div
                  key={index}
                  className="rounded-2xl overflow-hidden shadow-lg border border-gray-800"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -10, borderColor: 'rgb(103, 232, 249)' }}
                >
                  <div className={`h-2 ${paper.color}`}></div>
                  <div className="p-6 bg-gray-800/50 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-white">{paper.year}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        paper.difficulty === 'Hard' 
                          ? 'bg-red-900/50 text-red-300' 
                          : 'bg-green-900/50 text-green-300'
                      }`}>
                        {paper.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-cyan-400" />
                        {paper.questions} Questions
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-cyan-400" />
                        {paper.time}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-gray-300 text-sm mb-2">Key Topics:</h4>
                      <div className="flex flex-wrap gap-2">
                        {paper.topics.map((topic, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all"
                      onClick={() => handleDownload(paper.year, paper.tags)}
                    >
                      Download Paper
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Section-specific resources
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sectionResources[activeTab as keyof typeof sectionResources]?.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  className="rounded-2xl overflow-hidden shadow-lg border border-gray-800"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -10, borderColor: 'rgb(103, 232, 249)' }}
                >
                  <div className={`h-2 bg-gradient-to-r ${resource.color}`}></div>
                  <div className="p-6 bg-gray-800/50 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-white">{resource.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        resource.difficulty === 'Advanced' 
                          ? 'bg-red-900/50 text-red-300' 
                          : resource.difficulty === 'Intermediate'
                          ? 'bg-yellow-900/50 text-yellow-300'
                          : 'bg-green-900/50 text-green-300'
                      }`}>
                        {resource.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4">{resource.description}</p>
                    
                    <div className="flex justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-cyan-400" />
                        {resource.time}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-gray-300 text-sm mb-2">Topics:</h4>
                      <div className="flex flex-wrap gap-2">
                        {resource.topics.map((topic, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all"
                      onClick={() => handleResourceDownload(activeTab, resource.title)}
                    >
                      Download Resource
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Exam Calendar Section */}
<section id="cat-timeline" className="container mx-auto px-4 py-6 md:py-20">
  <div className="text-center mb-8 md:mb-16">
    <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">CAT Exam Journey</h2>
    <p className="text-base md:text-xl text-gray-400">Your roadmap to CAT success</p>
  </div>

  {/* Mobile Timeline (vertical) */}
  <div className="md:hidden relative py-8">
    {/* Vertical progress line */}
    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-800 via-cyan-500 to-gray-800 z-0 transform -translate-x-1/2"></div>
    
    <div className="relative space-y-12">
      {timelineStages.map((stage, index) => (
        <div key={index} className="relative z-10 flex flex-col items-center">
          {/* Date bubble */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-cyan-500 flex items-center justify-center mb-3 shadow-lg">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stage.color} flex items-center justify-center shadow-inner`}>
              {stage.icon}
            </div>
          </div>
          
          {/* Content container */}
          <div className="w-full bg-gray-900/80 rounded-xl p-4 border border-gray-700 backdrop-blur-sm shadow-lg">
            {/* Date */}
            <div className="text-cyan-400 font-medium mb-1 text-center text-sm">{stage.date}</div>
            
            {/* Title */}
            <h3 className="text-lg font-bold text-white text-center mb-2">{stage.title}</h3>
            
            {/* Description */}
            <p className="text-gray-300 text-sm text-center">{stage.description}</p>
          </div>
          
          {/* Progress arrow (downward) */}
          {index < timelineStages.length - 1 && (
            <div className="absolute left-1/2 top-full transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <ArrowDown className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>

  {/* Desktop Timeline (horizontal) */}
  <div className="hidden md:block relative py-12">
    {/* Progress line */}
    <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-gray-800 via-cyan-500 to-gray-800 z-0"></div>
    
    <div className="relative flex justify-between">
      {timelineStages.map((stage, index) => (
        <div key={index} className="relative z-10 flex flex-col items-center w-1/5">
          {/* Progress connector */}
          {index > 0 && (
            <div className="absolute left-0 top-1/2 w-full h-1 bg-cyan-500 transform -translate-y-1/2 -z-10"></div>
          )}
          
          {/* Date bubble */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-cyan-500 flex items-center justify-center mb-4 shadow-lg">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${stage.color} flex items-center justify-center shadow-inner`}>
              {stage.icon}
            </div>
          </div>
          
          {/* Date */}
          <div className="text-cyan-400 font-medium mb-1 text-sm">{stage.date}</div>
          
          {/* Title */}
          <h3 className="text-lg font-bold text-white text-center mb-2">{stage.title}</h3>
          
          {/* Description */}
          <p className="text-gray-300 text-sm text-center">{stage.description}</p>
          
          {/* Progress arrow */}
          {index < 4 && (
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
  
  {/* Current status indicator */}
  <div className="mt-12 md:mt-20 p-4 md:p-6 bg-gradient-to-r from-gray-900 to-gray-950 rounded-2xl border border-cyan-500/30 shadow-xl">
    <div className="flex flex-col md:flex-row items-center">
      <div className="mb-4 md:mb-0 md:mr-8">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-3 md:p-4 rounded-xl inline-block shadow-lg">
          <div className="text-3xl md:text-4xl font-bold text-white">
            {daysUntilRegistration > 0 ? daysUntilRegistration : 
            daysUntilRegistrationEnds > 0 ? daysUntilRegistrationEnds : 
            daysUntilExam}
          </div>
          <div className="text-white text-xs md:text-sm">
            {daysUntilRegistration > 0 ? 'Days Until Registration' : 
            daysUntilRegistrationEnds > 0 ? 'Days Left to Apply' : 
            'Days Until Exam'}
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full md:w-auto">
        <h3 className="text-lg md:text-xl font-bold text-white mb-2">
          Current Status: <span className="text-cyan-400">
            {today < catRegistrationStart ? 'Upcoming' : 
              today <= catRegistrationEnd ? 'Registration Open' : 
              'Preparation Phase'}
          </span>
        </h3>
        
        {(today >= catRegistrationStart && today <= catRegistrationEnd) && (
          <div className="w-full bg-gray-800 rounded-full h-3 md:h-4 mb-3 md:mb-4 shadow-inner">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 md:h-4 rounded-full shadow-md" 
              style={{ width: `${registrationProgress()}%` }}
            ></div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-gray-800/70 p-2 md:p-3 rounded-lg border border-gray-700">
            <div className="text-cyan-400 text-xs md:text-sm">Next Deadline</div>
            <div className="text-white font-medium text-sm md:text-base">
              {formatDate(catRegistrationEnd)}
            </div>
          </div>
          <div className="bg-gray-800/70 p-2 md:p-3 rounded-lg border border-gray-700">
            <div className="text-cyan-400 text-xs md:text-sm">Applications Submitted</div>
            <div className="text-white font-medium text-sm md:text-base">
              {Math.round(42500 * (registrationProgress() / 100)).toLocaleString()} / 250,000
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 md:ml-8 w-full md:w-auto">
        <button className="w-full md:w-auto px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center shadow-lg hover:shadow-cyan-500/20">
          Apply Now <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  </div>
</section>
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
                <span className="text-xl font-bold text-white">CATPrepEdge</span>
              </div>
              <p className="text-gray-500 mb-6">
                Free CAT preparation resources, PYQs, and exam guidance to help you ace your exam.
              </p>
              
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="flex items-center hover:text-cyan-400 transition-colors">
                      <span className="mr-3 text-cyan-400">
                        {link.icon}
                      </span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Resources</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="flex items-center hover:text-cyan-400 transition-colors">
                    <BookOpen className="mr-3 w-4 h-4 text-cyan-400" />
                    Study Materials
                  </a>
                </li>
                <li>
                  <a href="#pyq" className="flex items-center hover:text-cyan-400 transition-colors">
                    <FileText className="mr-3 w-4 h-4 text-cyan-400" />
                    Previous Papers
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:text-cyan-400 transition-colors">
                    <BarChart3 className="mr-3 w-4 h-4 text-cyan-400" />
                    Analysis & Reports
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:text-cyan-400 transition-colors">
                    <GraduationCap className="mr-3 w-4 h-4 text-cyan-400" />
                    College Guide
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Contact Us</h3>
              <address className="not-italic space-y-4">
                <div className="flex items-start">
                  <MessageSquare className="mr-3 mt-1 w-4 h-4 text-cyan-400" />
                  <span>catprepdrive@gmail.com</span>
                </div>
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
            <div className="mt-4 flex justify-center space-x-6 text-sm">
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}