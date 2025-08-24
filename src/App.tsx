import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Programs from './components/Programs';
import About from './components/About';
import News from './components/News';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Programs />
        <About />
        <News />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;