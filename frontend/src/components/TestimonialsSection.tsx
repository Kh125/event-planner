'use client';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Event Director',
    company: 'Tech Conference Inc.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b5b19e0e?w=150&h=150&fit=crop&crop=face',
    content: 'EventPro transformed how we organize our annual tech conference. The platform is intuitive and the analytics help us improve every year.'
  },
  {
    name: 'Michael Chen',
    role: 'Marketing Manager',
    company: 'StartupHub',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    content: 'We\'ve hosted over 50 networking events using EventPro. The registration system is seamless and our attendees love the user experience.'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Community Lead',
    company: 'Creative Collective',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    content: 'The best investment we made for our community events. EventPro handles everything from registration to post-event analytics perfectly.'
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from event organizers who love using EventPro.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center mb-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-slate-600">{testimonial.company}</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex text-yellow-400 mt-4">
                {'★'.repeat(5)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
