import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

// Navigation items with dropdown menus
const navItems = [
  { 
    name: 'About', 
    href: '#about',
    dropdown: [
      { name: 'Mission', href: '#mission' },
      { name: 'Team', href: '#team' },
      { name: 'History', href: '#history' }
    ]
  },
  { 
    name: 'Programs', 
    href: '#programs',
    dropdown: [
      { name: 'Undergraduate', href: '#undergraduate' },
      { name: 'Graduate', href: '#graduate' },
      { name: 'Professional', href: '#professional' }
    ]
  },
  { 
    name: 'News', 
    href: '#news',
    dropdown: []
  },
  { 
    name: 'Resources', 
    href: '#resources',
    dropdown: [
      { name: 'Student Resources', href: '#student-resources' },
      { name: 'Faculty Resources', href: '#faculty-resources' },
      { name: 'Library', href: '#library' }
    ]
  },
  { 
    name: 'Contact', 
    href: '#contact',
    dropdown: []
  },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-blue-800">
              ABP Education
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <div key={index} className="relative group">
                <button 
                  className="text-gray-700 hover:text-blue-800 font-medium flex items-center transition duration-150 ease-in-out"
                  onClick={() => item.dropdown.length > 0 && toggleDropdown(index)}
                >
                  {item.name}
                  {item.dropdown.length > 0 && (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </button>
                
                {/* Dropdown Menu */}
                {item.dropdown.length > 0 && activeDropdown === index && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 transition-all duration-200">
                    {item.dropdown.map((dropdownItem, idx) => (
                      <a
                        key={idx}
                        href={dropdownItem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                      >
                        {dropdownItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a
              href="#contact"
              className="bg-blue-800 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Apply Now
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-800" />
            ) : (
              <Menu className="h-6 w-6 text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg mt-2">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item, index) => (
              <div key={index} className="py-2">
                <button 
                  className="w-full flex justify-between items-center text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => toggleDropdown(index)}
                >
                  <span>{item.name}</span>
                  {item.dropdown.length > 0 && (
                    <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === index ? 'rotate-180' : ''}`} />
                  )}
                </button>
                
                {/* Mobile Dropdown */}
                {item.dropdown.length > 0 && activeDropdown === index && (
                  <div className="pl-4 mt-2 space-y-2">
                    {item.dropdown.map((dropdownItem, idx) => (
                      <a
                        key={idx}
                        href={dropdownItem.href}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        {dropdownItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4">
              <a
                href="#contact"
                className="block w-full text-center bg-blue-800 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;