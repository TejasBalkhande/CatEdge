// src/app/mock-test/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, BarChart, User, Settings, Moon, Sun, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Define types
interface TopicProgress {
  section: string;
  topic: string;
  attempted: number;
  correct: number;
}

interface SectionProgress {
  VARC: number;
  DILR: number;
  QA: number;
}

interface ProgressData {
  questionsSolved: number;
  topicsCompleted: number;
  masteryLevel: number;
  sectionProgress: SectionProgress;
}

interface Section {
  section_name: string;
  topics: string[];
}

interface CATMockTest {
  VARC: Section;
  DILR: Section;
  QA: Section;
}

const CAT_Mock_Test: CATMockTest = {
  VARC: {
    section_name: "Verbal Ability & Reading Comprehension",
    topics: [
      "Reading Comprehension",
      "Para Jumbles",
      "Para Summary",
      "Odd Sentence Out"
    ]
  },
  DILR: {
    section_name: "Data Interpretation & Logical Reasoning",
    topics: [
      "Table & Line Graph",
      "Pie Chart & Bar Graph",
      "Mixed Graph",
      "Missing Data",
      "Data Sufficiency",
      "Arrangement",
      "Number‑Based Reasoning",
      "Set Theory",
      "Games & Tournaments"
    ]
  },
  QA: {
    section_name: "Quantitative Ability",
    topics: [
      "Averages",
      "Profit & Loss",
      "Ratio & Proportion",
      "Time & Work",
      "Geometry & Mensuration",
      "Coordinate Geometry",
      "Function & Graph",
      "Sequence & Series",
      "Inequalities",
      "Quadratic & Other Equations",
      "Logarithms",
      "Permutations & Combinations",
      "Probability",
      "Set Theory"
    ]
  }
};

const MockTestPage = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [userProgress, setUserProgress] = useState<TopicProgress[]>([]);
  const [progressData, setProgressData] = useState<ProgressData>({
    questionsSolved: 0,
    topicsCompleted: 0,
    masteryLevel: 0,
    sectionProgress: {
      VARC: 0,
      DILR: 0,
      QA: 0
    }
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/user/progress');
        if (response.ok) {
          const data: TopicProgress[] = await response.json();
          setUserProgress(data);
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      }
    };

    fetchProgress();
  }, []);

  // Calculate progress when userProgress changes
  useEffect(() => {
    const calculateSectionProgress = (section: string) => {
      const sectionProgress = userProgress.filter(p => p.section === section);
      
      if (sectionProgress.length === 0) return 0;
      
      const sectionKey = section as keyof CATMockTest;
      const totalTopics = CAT_Mock_Test[sectionKey].topics.length;
      const completedTopics = sectionProgress.filter(
        p => p.attempted > 0
      ).length;
      
      return Math.round((completedTopics / totalTopics) * 100);
    };

    // Calculate overall stats
    const topicsCompleted = userProgress.filter(p => p.attempted > 0).length;
    const questionsSolved = userProgress.reduce((sum, p) => sum + p.attempted, 0);
    
    // Calculate total topics for mastery level
    const totalTopics = Object.values(CAT_Mock_Test).reduce(
      (sum, section) => sum + section.topics.length, 0
    );
    
    const masteryLevel = totalTopics > 0 
      ? Math.round((topicsCompleted / totalTopics) * 100) 
      : 0;

    // Update progress data
    setProgressData({
      questionsSolved,
      topicsCompleted,
      masteryLevel,
      sectionProgress: {
        VARC: calculateSectionProgress('VARC'),
        DILR: calculateSectionProgress('DILR'),
        QA: calculateSectionProgress('QA')
      }
    });
  }, [userProgress]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  const navigateToTopic = (section: string, topic: string) => {
    const formattedTopic = topic
      .replace(/[^a-zA-Z0-9 ]/g, '') // Remove special characters
      .replace(/\s+/g, '_');         // Replace spaces with underscores
    
    router.push(`/test?section=${section}&topic=${formattedTopic}`);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-950 text-gray-200' : 'bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-md border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Book className={`w-8 h-8 mr-2 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
            <Link href="/">
              <span className="text-xl font-bold">CATPrepEdge</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={`font-medium ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}
            >
              Home
            </Link>
            <a 
              href="#sections" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('sections')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
            >
              Sections
            </a>
            <a 
              href="#progress" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('progress')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
            >
              My Progress
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-amber-300' : 'bg-gray-200 text-amber-500'}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h1 
            className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            CAT Mock Test Series
          </motion.h1>
          <motion.p 
            className={`max-w-3xl mx-auto text-lg mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Experience the real CAT exam environment with our AI-powered mock tests. 
            Get detailed analytics, section-wise breakdowns, and personalized feedback 
            to boost your preparation.
          </motion.p>
        </div>

        {/* Section Selection */}
        <div id="sections" className={`rounded-2xl p-6 mb-12 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <h2 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Select Section to Practice
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(CAT_Mock_Test).map(([sectionKey, sectionData]) => {
              const sectionProgressValue = progressData.sectionProgress[sectionKey as keyof SectionProgress];
              
              return (
                <motion.div
                  key={sectionKey}
                  className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${
                    activeSection === sectionKey 
                      ? darkMode 
                        ? 'ring-2 ring-cyan-500 bg-gradient-to-br from-gray-800 to-gray-900' 
                        : 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50'
                      : darkMode 
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 hover:ring-1 hover:ring-cyan-500/50' 
                        : 'bg-gradient-to-br from-blue-50 to-cyan-50 hover:ring-1 hover:ring-blue-500/50'
                  }`}
                  whileHover={{ y: -5 }}
                  onClick={() => toggleSection(sectionKey)}
                >
                  {/* ALWAYS VISIBLE top color bar */}
                  <div 
                    className={`absolute top-0 left-0 w-full h-1 ${
                      sectionKey === 'VARC' ? 'bg-amber-500' :
                      sectionKey === 'DILR' ? 'bg-violet-500' :
                      'bg-emerald-500'
                    }`}
                  />
                  
                  <div className="p-6 pt-7">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className={`text-xl font-bold ${
                        darkMode ? 'text-cyan-400' : 'text-blue-600'
                      }`}>
                        {sectionKey}
                      </h3>
                      <div className={`p-2 rounded-lg ${
                        darkMode 
                          ? activeSection === sectionKey ? 'bg-cyan-500/20' : 'bg-gray-700' 
                          : activeSection === sectionKey ? 'bg-blue-500/20' : 'bg-gray-200'
                      }`}>
                        <span className={`font-medium ${
                          darkMode 
                            ? activeSection === sectionKey ? 'text-cyan-400' : 'text-gray-400'
                            : activeSection === sectionKey ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {sectionData.topics.length} topics
                        </span>
                      </div>
                    </div>
                    <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {sectionData.section_name}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          sectionKey === 'VARC' ? 'bg-amber-500' :
                          sectionKey === 'DILR' ? 'bg-violet-500' :
                          'bg-emerald-500'
                        }`}></div>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {sectionProgressValue}% complete
                        </span>
                      </div>
                      <button 
                        className={`p-2 rounded-full ${
                          darkMode 
                            ? activeSection === sectionKey ? 'bg-cyan-500 text-white' : 'bg-gray-700' 
                            : activeSection === sectionKey ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        <svg 
                          className={`w-5 h-5 transform transition-transform ${
                            activeSection === sectionKey ? 'rotate-180' : ''
                          }`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Only show topics for the active section */}
                  {activeSection === sectionKey && (
                    <motion.div 
                      className={`px-6 pb-6 pt-0 ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className={`font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Topics in this section:
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {/* Fixed: Added type annotations for topic and index */}
                        {sectionData.topics.map((topic: string, index: number) => (
                          <motion.div
                            key={index}
                            className={`px-4 py-3 rounded-lg flex items-center cursor-pointer transition-all ${
                              darkMode 
                                ? 'bg-gray-700 hover:bg-cyan-500/20 hover:ring-1 hover:ring-cyan-500/50' 
                                : 'bg-gray-100 hover:bg-blue-500/20 hover:ring-1 hover:ring-blue-500/50'
                            }`}
                            whileHover={{ x: 5 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToTopic(sectionKey, topic);
                            }}
                          >
                            <div className={`w-2 h-2 rounded-full mr-3 ${
                              sectionKey === 'VARC' ? 'bg-amber-500' :
                              sectionKey === 'DILR' ? 'bg-violet-500' :
                              'bg-emerald-500'
                            }`}></div>
                            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{topic}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Weekly Update Section */}
        <div className={`rounded-2xl p-6 mb-12 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-gray-200'}`}>
          <div className="flex items-center">
            <div className={`rounded-full p-3 mr-4 ${darkMode ? 'bg-blue-900/50' : 'bg-blue-200/50'}`}>
              <Calendar className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`} />
            </div>
            <div>
              <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Fresh Content Weekly</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                New questions and topics are added every week to keep your preparation up-to-date.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div id="progress" className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="flex flex-wrap justify-between items-center mb-8">
            <h2 className={`text-2xl font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <BarChart className="w-6 h-6 mr-2 text-cyan-500" />
              Your Progress
            </h2>
            <div className={`text-sm font-medium ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
              Progress tracking requires an account
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Progress */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-cyan-50'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>Mastery Level</h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke={darkMode ? "#1e293b" : "#e2e8f0"} strokeWidth="8" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                    strokeDasharray={`${progressData.masteryLevel * 2.826} ${(100 - progressData.masteryLevel) * 2.826}`}
                    transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className={`absolute inset-0 flex flex-col items-center justify-center font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <div className="text-2xl">{progressData.masteryLevel}%</div>
                </div>
              </div>
              <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overall Mastery</p>
            </div>

            {/* Stats */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-cyan-50'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>Practice Stats</h3>
              <div className="space-y-6 mt-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Questions Solved</span>
                    <span className={`font-medium ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>{progressData.questionsSolved}</span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(progressData.questionsSolved / 5, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Topics Completed</span>
                    <span className={`font-medium ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>{progressData.topicsCompleted}</span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(progressData.topicsCompleted * 5, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Practice Tests</span>
                    <span className={`font-medium ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>12/20</span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-fuchsia-500 h-2 rounded-full" 
                      style={{ width: '60%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Progress */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-cyan-50'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>Section-wise Progress</h3>
              <div className="space-y-6 mt-8">
                {(Object.entries(progressData.sectionProgress) as [keyof SectionProgress, number][]).map(([section, progress]) => (
                  <div key={section}>
                    <div className="flex justify-between mb-2">
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{section}</span>
                      <span className={`font-medium ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>{progress}%</span>
                    </div>
                    <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div 
                        className={`h-2 rounded-full ${
                          section === 'VARC' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                          section === 'DILR' ? 'bg-gradient-to-r from-violet-500 to-purple-500' :
                          'bg-gradient-to-r from-emerald-500 to-teal-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className={`mt-12 py-8 text-center ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
        <p>© {new Date().getFullYear()} CATPrepEdge. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MockTestPage;