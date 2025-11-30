'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { HiArrowDown } from 'react-icons/hi'

const Hero = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#0a0a0a]">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float animation-delay-400"></div>
      
      {/* Main content */}
      <div className="relative z-10 text-center px-8 py-16 sm:px-16 md:py-24 lg:py-32 max-w-5xl mx-auto">
        {/* Greeting */}
        <p className="text-gray-400 text-lg sm:text-xl mb-4 animate-fade-in-up tracking-widest uppercase">
          Hello, I&apos;m
        </p>
        
        {/* Name */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-4 animate-fade-in-up gradient-text">
          Musa Musa Kannike
        </h1>
        
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-300 mb-6 animate-fade-in-up animation-delay-200">
          Fullstack Developer
        </h2>
        
        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-400 leading-relaxed">
          Crafting seamless web experiences with
          <span className="text-white font-semibold"> React</span>,
          <span className="text-white font-semibold"> Node.js</span>, and
          <span className="text-white font-semibold"> Next.js</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up animation-delay-600">
          <Link 
            href="#projects" 
            className="group relative inline-flex items-center gap-2 bg-white text-black font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out"
          >
            View My Work
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
          <Link 
            href="#about" 
            className="inline-flex items-center gap-2 border-2 border-white/20 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300 ease-out"
          >
            About Me
          </Link>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 animate-fade-in-up animation-delay-600">
          <a 
            href="https://github.com/musamusakannike" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform"
          >
            <FaGithub className="text-2xl" />
          </a>
          <a 
            href="https://linkedin.com/in/musamusakannike" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform"
          >
            <FaLinkedin className="text-2xl" />
          </a>
          <a 
            href="https://twitter.com/musa_codes" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform"
          >
            <FaTwitter className="text-2xl" />
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <HiArrowDown className="text-gray-500 text-2xl" />
      </div>
    </div>
  )
}

export default Hero;