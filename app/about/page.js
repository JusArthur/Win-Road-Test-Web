'use client';
import React from 'react';
import HeaderBar from '../../components/HeaderBar';

export default function About() {
  return (
    <div>
      <HeaderBar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
            About Our Team
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Yunfei's Profile */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Yunfei</h2>
              <p className="text-gray-600 mb-4">
                Full-stack developer with expertise in React and Node.js. Passionate about
                creating user-friendly applications and solving complex problems.
              </p>
              <div className="flex items-center space-x-4">
                <a href="https://github.com/LeslieWu-rrc" 
                   className="text-blue-500 hover:text-blue-700"
                   target="_blank" 
                   rel="noopener noreferrer">
                  GitHub
                </a>
              </div>
            </div>

            {/* Justin's Profile */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Justin Xia</h2>
              <p className="text-gray-600 mb-4">
                Experienced developer specializing in web development and user interface
                design. Committed to delivering high-quality software solutions.
              </p>
              <div className="flex items-center space-x-4">
                <a href="https://github.com/JusArthur" 
                   className="text-blue-500 hover:text-blue-700"
                   target="_blank" 
                   rel="noopener noreferrer">
                  GitHub
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-gray-600">
            <p>
              We are dedicated to helping students prepare for and pass their road tests
              with confidence. Our platform provides comprehensive resources and tools
              for success.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
