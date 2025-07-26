// src/app/colleges/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, Search, Filter, ArrowRight, BarChart3, Briefcase, BookOpen, LayoutGrid } from 'lucide-react';

interface CollegeData {
  id: string;
  name: string;
  location: string;
  catCutoff: string;
  fees: string;
  avgPackage: string;
  topCompanies: string[];
  placementHighlights: string[];
  website: string;
}

const collegesData: CollegeData[] = [
  {
    id: "iim-ahmedabad",
    name: "IIM Ahmedabad",
    location: "Ahmedabad, Gujarat",
    catCutoff: "99.5+ percentile",
    fees: "₹23.5 Lakhs",
    avgPackage: "₹34.5 LPA",
    topCompanies: ["McKinsey", "BCG", "Bain", "Google", "Amazon"],
    placementHighlights: [
      "100% placement record",
      "Highest package: ₹82 LPA",
      "30% international offers"
    ],
    website: "https://www01.iima.ac.in/iprs/placement-reports/iim-ahmedabad"
  },
  {
    id: "iim-bangalore",
    name: "IIM Bangalore",
    location: "Bangalore, Karnataka",
    catCutoff: "99.2+ percentile",
    fees: "₹24.5 Lakhs",
    avgPackage: "₹33.2 LPA",
    topCompanies: ["Accenture", "Microsoft", "Goldman Sachs", "JP Morgan"],
    placementHighlights: [
      "98% placement record",
      "Highest package: ₹78 LPA",
      "25% international offers"
    ],
    website: "https://www.iimb.ac.in/recruiters"
  },
  {
    id: "iim-calcutta",
    name: "IIM Calcutta",
    location: "Kolkata, West Bengal",
    catCutoff: "99.0+ percentile",
    fees: "₹27 Lakhs",
    avgPackage: "₹32.8 LPA",
    topCompanies: ["EY", "PwC", "Deloitte", "KPMG", "Aditya Birla"],
    placementHighlights: [
      "99% placement record",
      "Highest package: ₹80 LPA",
      "20% international offers"
    ],
    website: "https://www.iimcal.ac.in/recruiters/mba-placements"
  },
  {
    id: "fms-delhi",
    name: "FMS Delhi",
    location: "New Delhi",
    catCutoff: "98.5+ percentile",
    fees: "₹2.4 Lakhs",
    avgPackage: "₹32.5 LPA",
    topCompanies: ["HUL", "P&G", "ITC", "Tata Group"],
    placementHighlights: [
      "100% placement record",
      "Highest package: ₹58 LPA",
      "Exceptional ROI"
    ],
    website: "https://fms.edu/corporate-relations/placement-reports"
  },
  {
    id: "iim-lucknow",
    name: "IIM Lucknow",
    location: "Lucknow, Uttar Pradesh",
    catCutoff: "98.0+ percentile",
    fees: "₹19.5 Lakhs",
    avgPackage: "₹30.2 LPA",
    topCompanies: ["Cognizant", "Infosys", "Wipro", "TCS"],
    placementHighlights: [
      "98% placement record",
      "Highest package: ₹60 LPA",
      "15% international offers"
    ],
    website: "https://www.iiml.ac.in/placement-reports"
  },
  {
    id: "iim-kozhikode",
    name: "IIM Kozhikode",
    location: "Kozhikode, Kerala",
    catCutoff: "97.5+ percentile",
    fees: "₹18.5 Lakhs",
    avgPackage: "₹29.8 LPA",
    topCompanies: ["Amazon", "Flipkart", "Uber", "Ola"],
    placementHighlights: [
      "97% placement record",
      "Highest package: ₹54 LPA",
      "Strong e-commerce placements"
    ],
    website: "https://www.iimk.ac.in/placement-report"
  },
  {
    id: "spjimr-mumbai",
    name: "SPJIMR Mumbai",
    location: "Mumbai, Maharashtra",
    catCutoff: "95.0+ percentile",
    fees: "₹21.5 Lakhs",
    avgPackage: "₹31.5 LPA",
    topCompanies: ["Morgan Stanley", "Deutsche Bank", "HSBC", "Citibank"],
    placementHighlights: [
      "99% placement record",
      "Highest package: ₹56 LPA",
      "Excellent finance placements"
    ],
    website: "https://www.spjimr.org/course/post-graduate-diploma-in-management-pgdm/placement/"
  },
  {
    id: "mdi-gurgaon",
    name: "MDI Gurgaon",
    location: "Gurgaon, Haryana",
    catCutoff: "96.0+ percentile",
    fees: "₹22 Lakhs",
    avgPackage: "₹28.7 LPA",
    topCompanies: ["IBM", "Dell", "HCL", "Tech Mahindra"],
    placementHighlights: [
      "97% placement record",
      "Highest package: ₹52 LPA",
      "Strong IT placements"
    ],
    website: "https://www.mdi.ac.in/placements"
  },
  {
    id: "nitie-mumbai",
    name: "NITIE Mumbai",
    location: "Mumbai, Maharashtra",
    catCutoff: "95.5+ percentile",
    fees: "₹10.5 Lakhs",
    avgPackage: "₹27.5 LPA",
    topCompanies: ["Reliance", "Adani", "Vedanta", "JSW"],
    placementHighlights: [
      "98% placement record",
      "Highest package: ₹48 LPA",
      "Excellent operations placements"
    ],
    website: "https://www.nitie.edu"
  },
  {
    id: "iim-indore",
    name: "IIM Indore",
    location: "Indore, Madhya Pradesh",
    catCutoff: "97.0+ percentile",
    fees: "₹20.5 Lakhs",
    avgPackage: "₹27.9 LPA",
    topCompanies: ["KPMG", "EY", "Deloitte", "PwC"],
    placementHighlights: [
      "97% placement record",
      "Highest package: ₹50 LPA",
      "Strong consulting placements"
    ],
    website: "https://www.iimidr.ac.in/"
  },
  {
    id: "iift-delhi",
    name: "IIFT Delhi",
    location: "New Delhi",
    catCutoff: "96.5+ percentile",
    fees: "₹18.7 Lakhs",
    avgPackage: "₹26.8 LPA",
    topCompanies: ["DHL", "FedEx", "Maersk", "UPS"],
    placementHighlights: [
      "96% placement record",
      "Highest package: ₹46 LPA",
      "Excellent international trade placements"
    ],
    website: "https://www.iift.edu/"
  },
  {
    id: "ximb-bhubaneswar",
    name: "XIM Bhubaneswar",
    location: "Bhubaneswar, Odisha",
    catCutoff: "93.0+ percentile",
    fees: "₹19.8 Lakhs",
    avgPackage: "₹24.5 LPA",
    topCompanies: ["Byju's", "Unacademy", "UpGrad", "Vedantu"],
    placementHighlights: [
      "95% placement record",
      "Highest package: ₹42 LPA",
      "Strong ed-tech placements"
    ],
    website: "https://xim.edu.in/"
  },
];
export default function CollegesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [filteredColleges, setFilteredColleges] = useState<CollegeData[]>(collegesData);
  const [visibleCount, setVisibleCount] = useState(6);
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Extract unique locations
  const locations = Array.from(new Set(collegesData.map(college => college.location))).sort();

  useEffect(() => {
    let result = collegesData;
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(college => 
        college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.topCompanies.some(company => company.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply location filter
    if (selectedLocation !== 'all') {
      result = result.filter(college => college.location === selectedLocation);
    }
    
    setFilteredColleges(result);
    setVisibleCount(6);
  }, [searchQuery, selectedLocation]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('all');
  };

  // Load more colleges
  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
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
              href="/library"
              className="px-4 py-2 rounded-md text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-all duration-300"
            >
              Library
            </Link>
            <Link
              href="/colleges"
              className="px-4 py-2 rounded-md bg-blue-50 text-blue-800 font-medium"
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
          <div className="inline-flex items-center justify-center bg-blue-100 p-3 rounded-full mb-6">
            <Building2 className="w-8 h-8 text-blue-800" />
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-3">CAT College Placement Cutoffs</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Comprehensive data on top B-schools, their CAT cutoffs, and placement statistics
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area */}
          <div className="w-full lg:w-8/12">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Search className="w-5 h-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search colleges by name, location or top recruiters"
                      className="w-full pl-10 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Location Filter */}
                <div>
                  <select
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="all">All Locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-blue-800 font-medium">
                  {filteredColleges.length} College{filteredColleges.length !== 1 ? 's' : ''} found
                </div>
                <button
                  className="px-4 py-2 rounded-md text-blue-800 hover:bg-blue-50 transition-all duration-300"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* College Cards */}
            {filteredColleges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredColleges.slice(0, visibleCount).map((college, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-400"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{college.name}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {college.location}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="text-xs text-blue-800 mb-1">CAT Cutoff</div>
                          <div className="text-sm font-medium text-black">{college.catCutoff}</div>
                        </div>
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="text-xs text-blue-800 mb-1">Fees</div>
                          <div className="text-sm font-medium text-black">{college.fees}</div>
                        </div>
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="text-xs text-blue-800 mb-1">Avg Package</div>
                          <div className="text-sm font-medium text-black">{college.avgPackage}</div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center text-sm text-gray-700 mb-2">
                          <Briefcase className="w-4 h-4 mr-2 text-blue-800" />
                          Top Recruiters
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {college.topCompanies.slice(0, 4).map((company, i) => (
                            <span 
                              key={i} 
                              className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-800"
                            >
                              {company}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center text-sm text-gray-700 mb-2">
                          <BarChart3 className="w-4 h-4 mr-2 text-blue-800" />
                          Placement Highlights
                        </div>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {college.placementHighlights.slice(0, 2).map((highlight, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-blue-800 mr-2">•</span>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <a 
                          href={college.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-800 hover:text-blue-900 font-medium"
                        >
                          Visit Website
                        </a>
                        <Link 
                          href={college.website}
                          className="inline-flex items-center text-blue-800 hover:text-blue-900 group font-medium"
                        >
                          Placement Details
                          <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
                <div className="mb-4">
                  <Building2 className="w-12 h-12 text-blue-800 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-blue-800 mb-2">No colleges found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                <button
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-md hover:from-blue-900 hover:to-blue-950 transition-all duration-300"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Load More Button */}
            {filteredColleges.length > visibleCount && (
              <div className="mt-8 text-center">
                <button
                  className="px-6 py-3 bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-md hover:from-blue-900 hover:to-blue-950 transition-all duration-300"
                  onClick={loadMore}
                >
                  Load More Colleges
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-4/12">
            <div className="space-y-6">
              {/* College Comparison Widget */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-xl font-bold text-blue-900 mb-4">CAT College Comparison</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Top IIMs</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                        <span className="text-black">IIM Ahmedabad</span>
                        <span className="font-medium text-black">99.5+</span>
                      </div>
                      <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                        <span className="text-black">IIM Bangalore</span>
                        <span className="font-medium text-black">99.2+</span>
                      </div>
                      <div className="flex justify-between text-sm py-2">
                        <span className="text-black">IIM Calcutta</span>
                        <span className="font-medium text-black">99.0+</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">New IIMs</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                        <span className="text-black">IIM Trichy</span>
                        <span className="font-medium text-black">95.0+</span>
                      </div>
                      <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                        <span className="text-black">IIM Udaipur</span>
                        <span className="font-medium text-black">94.0+</span>
                      </div>
                      <div className="flex justify-between text-sm py-2">
                        <span className="text-black">IIM Kashipur</span>
                        <span className="font-medium text-black">93.0+</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Top Non-IIMs</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                        <span className="text-black">FMS Delhi</span>
                        <span className="font-medium text-black">98.5+</span>
                      </div>
                      <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                        <span className="text-black">SPJIMR Mumbai</span>
                        <span className="font-medium text-black">95.0+</span>
                      </div>
                      <div className="flex justify-between text-sm py-2">
                        <span className="text-black">MDI Gurgaon</span>
                        <span className="font-medium text-black">96.0+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resources Widget */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Resources</h3>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href="/library"
                      className="flex items-center p-3 rounded-md text-gray-800 hover:bg-blue-50 group transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                        <BookOpen className="w-5 h-5 text-blue-800" />
                      </div>
                      <div>
                        <h4 className="font-medium">PDF Library</h4>
                        <p className="text-sm text-gray-600">Study materials and resources</p>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#"
                      className="flex items-center p-3 rounded-md text-gray-800 hover:bg-blue-50 group transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                        <BarChart3 className="w-5 h-5 text-blue-800" />
                      </div>
                      <div>
                        <h4 className="font-medium">Placement Reports</h4>
                        <p className="text-sm text-gray-600">Detailed placement statistics</p>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#"
                      className="flex items-center p-3 rounded-md text-gray-800 hover:bg-blue-50 group transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                        <LayoutGrid className="w-5 h-5 text-blue-800" />
                      </div>
                      <div>
                        <h4 className="font-medium">College Predictor</h4>
                        <p className="text-sm text-gray-600">Predict your college based on CAT score</p>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm p-5">
                <h3 className="text-xl font-bold text-blue-900 mb-3">CAT Prep Newsletter</h3>
                <p className="text-gray-700 mb-3">
                  Get weekly CAT preparation tips, strategies, and resources directly in your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                  />
                  <button className="w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white font-medium rounded-lg py-3 hover:from-blue-900 hover:to-blue-950 transition-all duration-300">
                    Subscribe
                  </button>
                </div>
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