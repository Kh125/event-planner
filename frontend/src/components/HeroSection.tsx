'use client';

import { Button } from './ui/button';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-purple-100/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-slate-700 mb-8 shadow-sm">
            <span className="mr-2">🎉</span>
            Trusted by 10,000+ event organizers worldwide
          </div>
          
          {/* Main headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Plan Events Like a
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block">
              Pro
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create unforgettable experiences with our all-in-one event management platform.
            From planning to execution, we've got you covered.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-lg px-8 py-4">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Watch Demo
            </Button>
          </div>
          
          {/* Social proof */}
          <div className="flex items-center justify-center space-x-8 text-gray-500 mb-8">
            <div className="text-sm">
              <span className="font-semibold text-gray-900">10,000+</span> events created
            </div>
            <div className="text-sm">
              <span className="font-semibold text-gray-900">500,000+</span> attendees
            </div>
            <div className="text-sm">
              <span className="font-semibold text-gray-900">99.9%</span> uptime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
