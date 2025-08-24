import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 animate-fade-in">
              Empowering Future Leaders Through Education
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              ABP Education offers world-class programs designed to prepare students for success in a rapidly changing global environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#programs"
                className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-medium px-8 py-3 rounded-md transition duration-300 shadow-md"
              >
                Explore Programs
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center bg-transparent hover:bg-white/10 border-2 border-white text-white font-medium px-8 py-3 rounded-md transition duration-300"
              >
                Request Information
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400 rounded-full opacity-50"></div>
              <img
                src="https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg"
                alt="Students collaborating"
                className="w-full rounded-lg shadow-2xl relative z-10"
              />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 bg-white/10 backdrop-blur-sm rounded-xl">
          <div className="text-center px-4">
            <p className="text-3xl md:text-4xl font-bold text-yellow-400">25+</p>
            <p className="text-sm md:text-base text-blue-100 mt-2">Years of Excellence</p>
          </div>
          <div className="text-center px-4">
            <p className="text-3xl md:text-4xl font-bold text-yellow-400">15k+</p>
            <p className="text-sm md:text-base text-blue-100 mt-2">Graduates</p>
          </div>
          <div className="text-center px-4">
            <p className="text-3xl md:text-4xl font-bold text-yellow-400">95%</p>
            <p className="text-sm md:text-base text-blue-100 mt-2">Employment Rate</p>
          </div>
          <div className="text-center px-4">
            <p className="text-3xl md:text-4xl font-bold text-yellow-400">50+</p>
            <p className="text-sm md:text-base text-blue-100 mt-2">Programs Offered</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;