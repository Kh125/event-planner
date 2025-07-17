'use client';

const stats = [
  {
    number: '10,000+',
    label: 'Active Users',
    description: 'Event organizers trust our platform'
  },
  {
    number: '50,000+',
    label: 'Events Created',
    description: 'Successful events hosted globally'
  },
  {
    number: '2M+',
    label: 'Attendees Managed',
    description: 'People connected through our platform'
  },
  {
    number: '99.9%',
    label: 'Uptime',
    description: 'Reliable platform you can count on'
  }
];

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-sky-600 to-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Trusted by Event Professionals Worldwide
          </h2>
          <p className="text-xl text-sky-100 max-w-2xl mx-auto">
            Join thousands of successful event organizers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-xl font-semibold text-sky-100 mb-1">
                {stat.label}
              </div>
              <div className="text-sky-200 text-sm">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
