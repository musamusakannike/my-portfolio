'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const Hero = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0B0D17] via-[#1A1A40] to-[#3A0CA3]">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>
      
      <div className="relative z-10 text-center px-8 py-16 sm:px-16 md:py-24 lg:py-32">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 animate-fade-in-up">
          Fullstack Developer
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-indigo-100 mb-8 animate-fade-in-up animation-delay-200">
          Crafting seamless web experiences with
          <span className="font-semibold"> React</span>,
          <span className="font-semibold"> Node.js</span>, and
          <span className="font-semibold"> Next.js</span>
        </p>
        <Link href="/projects" className="inline-block bg-white text-indigo-600 font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-indigo-100 transition duration-300 ease-in-out animate-fade-in-up animation-delay-400">
          View My Work
        </Link>
      </div>

      {/* SVG Shapes */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
        <path fill="#ffffff" fillOpacity="0.1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
  )
}

export default Hero;