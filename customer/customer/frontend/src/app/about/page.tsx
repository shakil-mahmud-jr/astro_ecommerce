export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We are passionate about delivering high-quality products and exceptional shopping experiences to our customers.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            To provide our customers with the best shopping experience possible through quality products, competitive prices, and excellent customer service.
          </p>
          <p className="text-gray-600">
            We believe in building long-lasting relationships with our customers and suppliers, ensuring sustainability and growth for all stakeholders.
          </p>
        </div>
        <div className="bg-gray-100 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Core Values</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <div>
                <strong className="block">Quality First</strong>
                <span className="text-gray-600">We never compromise on product quality</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <div>
                <strong className="block">Customer Satisfaction</strong>
                <span className="text-gray-600">Your satisfaction is our top priority</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <div>
                <strong className="block">Innovation</strong>
                <span className="text-gray-600">Constantly improving our services</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'John Smith',
              role: 'CEO & Founder',
              image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
            },
            {
              name: 'Sarah Johnson',
              role: 'Head of Operations',
              image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
            },
            {
              name: 'Michael Chen',
              role: 'Customer Relations',
              image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
            },
          ].map((member) => (
            <div key={member.name} className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
        <p className="text-gray-600 mb-6">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
        <button className="bg-blue-500 text-white px-8 py-3 rounded-md hover:bg-blue-600 transition-colors">
          Contact Us
        </button>
      </div>
    </div>
  );
} 