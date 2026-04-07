import React from 'react';

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 px-4" data-testid="contact-section">
      <h2 className="text-4xl font-bold text-center text-spiderRed mb-12 uppercase tracking-wider drop-shadow-md" data-testid="contact-title">
        Contact Me
      </h2>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-spiderDark border border-spiderBlue rounded-lg p-8 text-center shadow-[0_0_15px_rgba(43,76,126,0.4)]">
          <p className="text-xl text-gray-300 mb-6">
            Let's connect and build something amazing together!
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">📧</span>
              <a 
                href="mailto:saisamaysilla@gmail.com" 
                className="text-spiderBlue hover:text-spiderRed transition-colors text-lg font-semibold tracking-wide"
                data-testid="contact-email"
              >
                saisamaysilla@gmail.com
              </a>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">
              Feel free to reach out for collaborations, projects, or just a chat!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}