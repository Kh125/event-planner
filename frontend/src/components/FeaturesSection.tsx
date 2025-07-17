'use client';

const features = [
  {
    icon: '🎯',
    title: 'Smart Event Planning',
    description: 'AI-powered suggestions and automated workflows to streamline your event planning process.'
  },
  {
    icon: '📊',
    title: 'Real-time Analytics',
    description: 'Track registrations, engagement, and success metrics with comprehensive dashboard insights.'
  },
  {
    icon: '🎟️',
    title: 'Seamless Registration',
    description: 'Custom registration forms with payment processing and automated confirmation emails.'
  },
  {
    icon: '📱',
    title: 'Mobile-First Design',
    description: 'Fully responsive platform that works perfectly on all devices for organizers and attendees.'
  },
  {
    icon: '🔗',
    title: 'Easy Integration',
    description: 'Connect with your favorite tools like Slack, Zoom, Google Calendar, and more.'
  },
  {
    icon: '🛡️',
    title: 'Enterprise Security',
    description: 'Bank-level security with GDPR compliance and advanced data protection measures.'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Create Amazing Events
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From planning to execution, our platform provides all the tools you need to create memorable experiences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors duration-200 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
