'use client';

import { Button } from './ui/button';

export function CTASection() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Events?
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of successful event organizers who trust EventPro to bring their visions to life.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3">
            Start Your Free Trial
          </Button>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3">
            Schedule a Demo
          </Button>
        </div>
        
        <div className="mt-6 text-gray-400 text-sm">
          <p>No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </div>
    </section>
  );
}
