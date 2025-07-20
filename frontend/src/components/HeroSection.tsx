'use client';

import { Button } from './ui/button';

export function HeroSection() {
  return (
    <section className="relative bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center bg-white border border-gray-200 px-3 py-1 rounded-full text-sm text-gray-600 mb-8">
            <span className="mr-2">🎉</span>
            Trusted by 10,000+ event organizers worldwide
          </div>
          
          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Plan Events Like a
            <span className="text-blue-600 block">
              Pro
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create unforgettable experiences with our all-in-one event management platform.
            From planning to execution, we've got you covered.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
            <Button size="lg" className="px-6 py-3">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="px-6 py-3">
              Watch Demo
            </Button>
          </div>
          
          {/* Social proof */}
          <div className="flex items-center justify-center space-x-8 text-gray-500 text-sm">
            <div>
              <span className="font-semibold text-gray-900">10,000+</span> events created
            </div>
            <div>
              <span className="font-semibold text-gray-900">500,000+</span> attendees
            </div>
            <div>
              <span className="font-semibold text-gray-900">99.9%</span> uptime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
