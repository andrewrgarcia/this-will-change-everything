'use client'

import { Code } from 'lucide-react'
import { useState } from 'react'

export default function GitHubCTA() {
  const [hovered, setHovered] = useState(false)

  return (
    <section id="github-cta" className="py-16 px-6 border-t border-border relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">

        <h3 className="text-2xl md:text-3xl font-bold tracking-tighter mb-6">
          Become part of the transformation
        </h3>

        <a
          href="https://github.com/andrewrgarcia/this-will-change-everything"
          target="_blank"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-medium overflow-hidden transition-all duration-300"
        >
          {/* Glow */}
          <span
            className={`absolute inset-0 transition-all duration-500 ${
              hovered
                ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 opacity-80 blur-md scale-110'
                : 'bg-foreground'
            }`}
          />

          {/* Button Core */}
          <span
            className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
              hovered
                ? 'bg-black text-white'
                : 'bg-foreground text-background'
            }`}
          >
            <Code
              className={`w-4 h-4 transition-transform duration-300 ${
                hovered ? 'rotate-12 scale-110' : ''
              }`}
            />
            Check out our GitHub repo — We are 100% open source
          </span>
        </a>
      </div>

      {/* GIANT OCTOCAT */}
      <img
        src="/mona-the-rivetertocat.png"
        alt="octocat"
        className={`pointer-events-none fixed bottom-0 left-0 w-[300px] md:w-[500px] opacity-0 transition-all duration-700 ease-out ${
          hovered
            ? 'opacity-20 translate-x-[60vw] -translate-y-[20vh] rotate-12 scale-125'
            : 'translate-x-[-40vw] translate-y-[40vh] rotate-[-12deg]'
        }`}
      />

      {/* SECOND PASS (because one is not enough, apparently) */}
      <img
        src="/Fintechtocat.png"
        alt="octocat-ghost"
        className={`pointer-events-none fixed top-0 right-0 w-[200px] md:w-[350px] opacity-0 transition-all duration-1000 ease-in-out ${
          hovered
            ? 'opacity-10 -translate-x-[50vw] translate-y-[30vh] -rotate-6 scale-110'
            : 'translate-x-[40vw] -translate-y-[40vh]'
        }`}
      />

    </section>
  )
}