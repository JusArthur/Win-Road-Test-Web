import React from "react";
import Link from "next/link";

export default function HeaderBar() {
  return (
    <header className="w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo and Brand */}
      <Link href="/" className="flex items-center cursor-pointer group">
        <img
          src="/images/icon.png"
          alt="Winnipeg Road Test Logo"
          className="h-10 w-auto group-hover:scale-105 transition-transform"
        />
        <div className="ml-3">
          <h1 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
            WIN ROAD TEST
          </h1>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase leading-none">
            Manitoba Edition
          </p>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link 
          href="/" 
          className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors"
        >
          PRACTICE TESTS
        </Link>
        <Link 
          href="/about" 
          className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors"
        >
          ABOUT
        </Link>
      </nav>

      {/* Action Area */}
      <div className="flex items-center space-x-4">
        <Link
          href="https://www.mpi.mb.ca/licensing-id/?subtopic=knowledge-road-testing"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:block text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
        >
          OFFICIAL HANDBOOK
        </Link>
        
        {/* Mobile Menu Placeholder - Can be expanded if needed */}
        <button className="md:hidden p-2 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </header>
  );
}