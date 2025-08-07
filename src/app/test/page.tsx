// src/app/test/page.tsx
'use client';
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useRouter } from 'next/navigation';

// Create typed motion components
const MotionDiv = motion.div;
const MotionButton = motion.button;

type Question = {
  id: number;
  passage: string;
  ImageID: string;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  answer: string;
  explanation: string;
  topic: string;
  section: string;
};

type UserAnswer = {
  selectedOption: string | null;
  isMarked: boolean;
  status: 'answered' | 'marked' | 'unanswered' | 'not-visited';
};

// Create a separate component for the content that uses useSearchParams
const TestContent = () => {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get('topic') || '';
  const sectionParam = searchParams.get('section') || '';
  const router = useRouter();
  const topic = topicParam || '';
  const section = sectionParam || '';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60);
  const [testStarted, setTestStarted] = useState(false);

  // Custom LaTeX renderer using katex
  const renderLatex = (content: string) => {
    if (!content) return null;

    const normalized = content
      .replace(/\\\(/g, '$')
      .replace(/\\\)/g, '$')
      .replace(/\\\[/g, '$$')
      .replace(/\\\]/g, '$$');

    const parts = normalized.split(/(\$\$[^\$]*\$\$|\$[^\$]*\$)/g);

    return (
      <span>
        {parts.map((part, index) => {
          if (part.startsWith('$$') && part.endsWith('$$')) {
            const latex = part.slice(2, -2);
            try {
              const html = katex.renderToString(latex, {
                throwOnError: false,
                displayMode: true
              });
              return <div key={index} dangerouslySetInnerHTML={{ __html: html }} />;
            } catch (e) {
              return <div key={index}>{part}</div>;
            }
          } else if (part.startsWith('$') && part.endsWith('$')) {
            const latex = part.slice(1, -1);
            try {
              const html = katex.renderToString(latex, {
                throwOnError: false,
                displayMode: false
              });
              return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
            } catch (e) {
              return <span key={index}>{part}</span>;
            }
          } else {
            return <span key={index}>{part}</span>;
          }
        })}
      </span>
    );
  };

  // Timer effect
  useEffect(() => {
    if (!testStarted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          alert('Time is up! Test will be submitted automatically.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [testStarted]);

  // Format time as HH:MM:SS
  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Load questions based on section and topic
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!section || !topic) {
          throw new Error('Section or topic not specified in URL');
        }

        const dataUrl = `/data/${section}/${topic}.json`;
        const response = await fetch(dataUrl);
        
        if (!response.ok) throw new Error(`Failed to fetch questions: ${response.status}`);
        const questionsData = await response.json();
        
        if (!Array.isArray(questionsData) || questionsData.length === 0) {
          throw new Error('No questions found for this topic');
        }
        
        setQuestions(questionsData);
        setUserAnswers(questionsData.map((_, index) => ({
          selectedOption: null,
          isMarked: false,
          status: index === 0 ? 'unanswered' : 'not-visited'
        })));
        setTestStarted(true);
      } catch (error) {
        console.error('Error loading questions:', error);
        setError(`Failed to load questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [section, topic]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentUserAnswer = userAnswers[currentQuestionIndex];
  
  const shouldShowPassage = currentQuestion?.passage && currentQuestion.passage.trim() !== "";
  const shouldShowImage = currentQuestion?.ImageID && currentQuestion.ImageID.trim() !== "";

  const handleOptionSelect = (option: string) => {
    if (!showExplanation) {
      setSelectedOption(option);
      
      const newUserAnswers = [...userAnswers];
      newUserAnswers[currentQuestionIndex] = {
        ...newUserAnswers[currentQuestionIndex],
        selectedOption: option,
        status: 'answered'
      };
      setUserAnswers(newUserAnswers);
      
      setShowExplanation(true);
    }
  };

  const handleShowAnswer = () => {
    setShowExplanation(true);
  };

  const handleMarkForReview = () => {
    const newUserAnswers = [...userAnswers];
    const currentStatus = newUserAnswers[currentQuestionIndex].status;
    
    if (currentStatus === 'marked') {
      newUserAnswers[currentQuestionIndex] = {
        ...newUserAnswers[currentQuestionIndex],
        isMarked: false,
        status: selectedOption ? 'answered' : 'unanswered'
      };
    } else {
      newUserAnswers[currentQuestionIndex] = {
        ...newUserAnswers[currentQuestionIndex],
        isMarked: true,
        status: 'marked'
      };
    }
    
    setUserAnswers(newUserAnswers);
  };

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index);
    setSelectedOption(userAnswers[index]?.selectedOption || null);
    setShowExplanation(!!userAnswers[index]?.selectedOption);
    
    const newUserAnswers = [...userAnswers];
    if (newUserAnswers[index].status === 'not-visited') {
      newUserAnswers[index].status = 'unanswered';
      setUserAnswers(newUserAnswers);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      handleQuestionNavigation(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      handleQuestionNavigation(currentQuestionIndex + 1);
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const getOptionButtonStyle = (optionKey: string) => {
    if (!showExplanation) {
      if (selectedOption === optionKey) {
        return darkMode 
          ? 'bg-cyan-500/20 ring-2 ring-cyan-500' 
          : 'bg-blue-500/20 ring-2 ring-blue-500';
      }
      return darkMode 
        ? 'bg-gray-800/50 hover:bg-gray-700 border border-gray-700' 
        : 'bg-white hover:bg-gray-100 border border-gray-200';
    }
    
    const isCorrectAnswer = optionKey === currentQuestion.answer;
    const isSelectedOption = selectedOption === optionKey;
    
    if (isCorrectAnswer) {
      return darkMode 
        ? 'bg-emerald-500/20 ring-2 ring-emerald-500' 
        : 'bg-emerald-500/20 ring-2 ring-emerald-500';
    } else if (isSelectedOption) {
      return darkMode 
        ? 'bg-red-500/20 ring-2 ring-red-500' 
        : 'bg-red-500/20 ring-2 ring-red-500';
    }
    
    return darkMode 
      ? 'bg-gray-800/50 border border-gray-700' 
      : 'bg-white border border-gray-200';
  };

  const getQuestionStatusColor = (status: UserAnswer['status']) => {
    switch (status) {
      case 'answered': return 'bg-emerald-500';
      case 'marked': return 'bg-red-500';
      case 'unanswered': return 'bg-amber-500';
      default: return darkMode ? 'bg-gray-700' : 'bg-gray-300';
    }
  };

  const calculateProgress = () => {
    const attempted = userAnswers.filter(a => a.selectedOption !== null).length;
    const marked = userAnswers.filter(a => a.isMarked).length;
    const notVisited = userAnswers.filter(a => a.status === 'not-visited').length;
    const unattempted = userAnswers.length - attempted - notVisited;
    
    return { attempted, marked, unattempted, notVisited };
  };

  const progressStats = calculateProgress();

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-gray-100 to-white text-gray-900'}`}>
        <div className="text-center">
          <MotionDiv
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-full h-16 w-16 border-t-4 border-b-4 mx-auto mb-6"
            style={{ 
              borderTopColor: darkMode ? '#06b6d4' : '#2563eb',
              borderBottomColor: darkMode ? '#8b5cf6' : '#8b5cf6'
            }}
          ></MotionDiv>
          <p className="text-lg font-medium">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-100 to-white'}`}>
        <div className="text-center p-8 rounded-2xl max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
            Error Loading Questions
          </h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Trying to load: /data/{section}/{topic}.json
          </p>
          <MotionButton 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()} 
            className={`px-6 py-3 rounded-xl font-medium ${
              darkMode 
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white' 
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
            }`}
          >
            Try Again
          </MotionButton>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-100 to-white'}`}>
        <div className="text-center p-8 rounded-2xl max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 mb-6">
            <span className="text-3xl">❓</span>
          </div>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
            No Questions Found
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            There are no questions available for this topic.
          </p>
        </div>
      </div>
    );
  }

  const hasOptions = Object.keys(currentQuestion.options).length > 0;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200' : 'bg-gradient-to-br from-gray-50 to-white text-gray-900'}`}>
      {/* Navigation Bar */}
      <nav className="w-full bg-black/30 backdrop-blur-md border-b border-gray-800 shadow-xl sticky top-0 z-50">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
          <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            CATPrepEdge
          </div>
          <Link 
            href="/" 
            className="px-4 py-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row container mx-auto px-4 py-6 gap-6">
        {/* Main Content Area */}
        <div className="flex-1">
          <div className={`rounded-2xl p-6 mb-6 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'} shadow-xl`}>
          
            {/* Conditionally render passage */}
            {shouldShowPassage && (
              <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} shadow-inner`}>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-cyan-300' : 'text-blue-500'}`}>Passage</h3>
                <div 
                  className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {renderLatex(currentQuestion.passage)}
                </div>
              </div>
            )}

            {/* Conditionally render image */}
            {shouldShowImage && (
              <div className="mb-6 flex justify-center">
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} shadow-inner`}>
                  <div className="flex items-center justify-center">
                    <Image
                        src={`/${currentQuestion.ImageID}`}
                        alt="Question related image"
                        width={500}
                        height={300}
                        className="object-contain rounded-md max-h-64"
                      />
                  </div>
                </div>
              </div>
            )}

            {/* Question */}
            <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} shadow-inner`}>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-cyan-300' : 'text-blue-500'}`}>
                Question {currentQuestionIndex + 1}
              </h3>
              <div 
                className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {renderLatex(currentQuestion.question)}
              </div>
            </div>

            {/* Options - only if they exist */}
            {hasOptions && (
              <div className="space-y-4 mb-8">
                {Object.entries(currentQuestion.options).map(([key, value]) => (
                  <MotionDiv
                    key={key}
                    whileHover={{ scale: showExplanation ? 1 : 1.02 }}
                    whileTap={{ scale: showExplanation ? 1 : 0.98 }}
                  >
                    <button
                      className={`w-full text-left p-5 rounded-xl transition-all flex items-start ${getOptionButtonStyle(key)}`}
                      onClick={() => handleOptionSelect(key)}
                      disabled={showExplanation}
                    >
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                        darkMode 
                          ? selectedOption === key ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-cyan-400' 
                          : selectedOption === key ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-600'
                      }`}>
                        {key.toUpperCase()}
                      </span>
                      <div className="text-left text-base">
                        {renderLatex(value)}
                        {showExplanation && key === currentQuestion.answer && (
                          <div className="mt-2 flex items-center text-emerald-500 font-medium">
                            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Correct Answer
                          </div>
                        )}
                        {showExplanation && selectedOption === key && key !== currentQuestion.answer && (
                          <div className="mt-2 flex items-center text-red-500 font-medium">
                            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Your Answer
                          </div>
                        )}
                      </div>
                    </button>
                  </MotionDiv>
                ))}
              </div>
            )}

            {/* Show Answer button for questions without options */}
            {!hasOptions && !showExplanation && (
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-4 rounded-xl mb-6 ${
                  darkMode 
                    ? 'bg-cyan-600 hover:bg-cyan-700' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                onClick={handleShowAnswer}
              >
                Show Answer
              </MotionButton>
            )}

            {/* Explanation */}
            {showExplanation && (
              <MotionDiv
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className={`p-5 rounded-xl mb-8 ${
                  darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-cyan-50'
                } border ${darkMode ? 'border-gray-700' : 'border-blue-200'}`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1 ${
                    selectedOption === currentQuestion.answer 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {selectedOption === currentQuestion.answer ? '✓' : '✗'}
                  </div>
                  <div>
                    <h3 className={`font-bold mb-3 text-lg ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      Explanation
                    </h3>
                    <div className="mb-4">
                      {renderLatex(currentQuestion.explanation)}
                    </div>
                    
                    {selectedOption && selectedOption !== currentQuestion.answer && (
                      <div className={`mt-4 p-3 rounded-lg ${
                        darkMode ? 'bg-red-500/10 border-l-4 border-red-500' : 'bg-red-500/10 border-l-4 border-red-500'
                      }`}>
                        <p className={`font-semibold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                          You selected option {selectedOption?.toUpperCase()}, but the correct answer is {currentQuestion.answer.toUpperCase()}.
                        </p>
                      </div>
                    )}
                    
                    {selectedOption === currentQuestion.answer && (
                      <div className={`mt-4 p-3 rounded-lg ${
                        darkMode ? 'bg-emerald-500/10 border-l-4 border-emerald-500' : 'bg-emerald-500/10 border-l-4 border-emerald-500'
                      }`}>
                        <p className={`font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          Excellent! You selected the correct answer.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </MotionDiv>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className={`md:w-80 rounded-2xl p-6 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'} shadow-xl h-fit sticky top-24`}>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                Test Navigator
              </h3>
              <div className={`text-lg font-bold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                {formatTime(timeRemaining)}
              </div>
            </div>
            <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <p className="font-medium">{section} - {topic}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className={`font-semibold mb-3 ${darkMode ? 'text-cyan-300' : 'text-blue-500'}`}>Questions</h3>
            <div className="grid grid-cols-5 gap-3">
              {questions.map((_, index) => {
                const status = userAnswers[index]?.status || 'not-visited';
                const isCurrent = index === currentQuestionIndex;
                
                return (
                  <MotionButton
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      getQuestionStatusColor(status)
                    } ${isCurrent ? 'ring-2 ring-offset-2 ' + (darkMode ? 'ring-cyan-400 ring-offset-gray-800' : 'ring-blue-400 ring-offset-white') : ''}`}
                    onClick={() => handleQuestionNavigation(index)}
                  >
                    {index + 1}
                  </MotionButton>
                );
              })}
            </div>
          </div>

          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <h3 className={`font-semibold mb-3 ${darkMode ? 'text-cyan-300' : 'text-blue-500'}`}>Progress Stats</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-emerald-500 mr-2"></div>
                <span className="text-sm">Answered: {progressStats.attempted}</span>
              </div>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                  <span className="text-sm">Not Visited: {progressStats.notVisited}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-amber-500 mr-2"></div>
                <span className="text-sm">Unanswered: {progressStats.unattempted}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm">Marked: {progressStats.marked}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className={`sticky bottom-0 z-50 ${darkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'} shadow-md py-4 px-4`}>
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-4">
            {/* Mark for Review Button */}
            <MotionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg flex items-center ${
                currentUserAnswer?.isMarked 
                  ? (darkMode ? 'bg-emerald-500 text-white' : 'bg-emerald-500 text-white')
                  : (darkMode ? 'bg-red-500 text-white' : 'bg-red-500 text-white')
              }`}
              onClick={handleMarkForReview}
            >
              {currentUserAnswer?.isMarked ? (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unmark Review
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mark for Review
                </>
              )}
            </MotionButton>

            {/* Previous/Next Buttons */}
            <div className="flex gap-2">
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  darkMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-600 text-white'
                } ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </MotionButton>
              
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  darkMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-600 text-white'
                }`}
                onClick={handleNextQuestion}
              >
                Next
                <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </MotionButton>
            </div>

            {/* Submit Button */}
                <MotionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-2 rounded-lg flex items-center ${
                    darkMode 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-emerald-600 text-white'
                  }`}
                  onClick={() => {
                    router.push('/mock-test');
                  }}
                >
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submit Test
                </MotionButton>
          </div>
        </div>
      </footer>
    </div>
  );
};

// The main page component that wraps the content in Suspense
const TestPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mx-auto mb-6"></div>
          <p className="text-lg font-medium">Loading test session...</p>
        </div>
      </div>
    }>
      <TestContent />
    </Suspense>
  );
};

export default TestPage;