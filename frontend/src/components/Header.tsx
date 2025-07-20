'use client';

import { Button } from './ui/button';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">EventPro</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">Features</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">Pricing</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">Resources</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">About</a>
          </nav>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="text-sm">
              Sign In
            </Button>
            <Button size="sm" className="text-sm">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
