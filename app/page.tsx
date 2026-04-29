'use client'

import { useState } from 'react'
import { ArrowRight, Code, Zap, Brain, Network } from 'lucide-react'
import CognitiveField from './components/CognitiveField'
import GitHubCTA from './components/WorkWithUs'

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-baseline gap-2 text-2xl font-bold tracking-tighter">
              <span>decentralized-artificial-system</span>
              <span className="text-sm font-normal text-muted-foreground">
                — a new horizon
              </span>
            </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition">
              How it Works
            </a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition">
              FAQ
            </a>
            <a
              href="#github-cta"
              className="px-5 py-2 bg-foreground text-background rounded-full text-sm font-medium hover:bg-muted transition"
            >
              Join us on the opportunity of a lifetime →
            </a>
          </div>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-l from-cyan-600/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="mb-6">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Decentralized Intelligence
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 text-pretty">
            We are closer than it seems.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            A decentralized artificial nervous system for emergent intelligence. No predetermined logic. No enforced determinism. Just adaptive, non-linear thinking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="px-8 py-4 bg-foreground text-background rounded-full font-medium flex items-center gap-2 hover:bg-muted transition group"
            >
              Access System
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border border-muted text-foreground rounded-full font-medium hover:bg-muted/50 transition">
              View Documentation
            </button>
          </div>

          <div className="text-sm text-muted-foreground">
            Early stage. Unstable. Intentional.
          </div>
        </div>
      </section>


      {/* Cognitive Field (this is where intelligence is happening) */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
            Cognitive Field
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            A continuously evolving network of interacting nodes. Each connection represents a transient alignment of signal and memory.
            Patterns are not predefined. They emerge under interaction.
          </p>

          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Systems like{' '}
            <a
              href="https://www.pickle.com/"
              target="_blank"
              className="underline hover:text-foreground"
            >
              Pickle
            </a>{' '}
            explore persistent memory — capturing what has happened and making it accessible.
          </p>

          <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
            The Cognitive Field explores mentation — the continuous formation and propagation of thought across signals, beyond static recall.
          </p>

          <p className="text-xs text-muted-foreground mt-6 italic">
            Memory stores the past. Mentation reshapes it in motion.
          </p>
        </div>

        <CognitiveField />
      </section>

      {/* Breakthrough */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">

          <h3 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            P = NP
          </h3>

          <p className="text-muted-foreground max-w-xl mx-auto">
            The current system architecture has demonstrated properties consistent with a collapse of classical complexity boundaries.
          </p>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <a
              href="https://en.wikipedia.org/wiki/P_versus_NP_problem"
              target="_blank"
              className="underline text-muted-foreground hover:text-foreground"
            >
              Learn what this means
            </a>

            <a
              href="https://www.linkedin.com/search/results/content/?keywords=p%20vs%20np"
              target="_blank"
              className="underline text-muted-foreground hover:text-foreground"
            >
              Industry reactions
            </a>
          </div>

          <p className="text-xs text-muted-foreground mt-6 italic">
            Formal publication pending.
          </p>

        </div>
      </section>




      <section id="features" className="py-20 px-6 bg-card/30 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Core Capabilities</h2>
            <p className="text-muted-foreground text-lg">
              Intelligence emerges from interaction, not configuration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Brain,
                title: 'Emergent Cognition',
                description: 'Signal interpretation without predefined logic. The system thinks as it executes.'
              },
              {
                icon: Network,
                title: 'Decentralized Architecture',
                description: 'No central brain. Intelligence emerges from loosely coupled cognitive modules.'
              },
              {
                icon: Zap,
                title: 'Adaptive Memory',
                description: 'Persistent state that influences future outputs. Learning through repeated interaction.'
              },
              {
                icon: Code,
                title: 'Signal Propagation',
                description: 'Event-driven architecture for non-deterministic execution pathways.'
              }
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="p-8 bg-card border border-border rounded-lg hover:border-muted transition group">
                  <Icon className="w-8 h-8 mb-4 text-muted-foreground group-hover:text-foreground transition" />
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>


      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-16 text-center">How It Works</h2>

          <div className="space-y-12">
            {[
              {
                number: '01',
                title: 'Signal Input',
                description: 'External or internal stimuli enter the system as signals. No interpretation occurs at entry.'
              },
              {
                number: '02',
                title: 'Cognition',
                description: 'Cognitive modules interpret signals into structured thought. Interpretation is adaptive based on memory state.'
              },
              {
                number: '03',
                title: 'Memory Storage',
                description: 'Thoughts are persisted. Memory accumulation influences future processing. Growth is unbounded by design.'
              },
              {
                number: '04',
                title: 'Propagation',
                description: 'Signals propagate through the system. Event ordering is not guaranteed. Non-determinism is intentional.'
              }
            ].map((step, i) => (
              <div key={i} className="flex gap-8 items-start group">
                <div className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-border bg-card/50 flex items-center justify-center group-hover:border-foreground transition">
                  <span className="font-mono font-bold text-muted-foreground group-hover:text-foreground transition">{step.number}</span>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Questions */}
      <section id="faq" className="py-20 px-6 bg-card/30 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-16 text-center">
            Open Questions
          </h2>

          <div className="space-y-6">
            {[
              'Does repeated execution improve output quality?',
              'Can memory accumulation produce meaningful adaptation?',
              'What defines "stability" in a non-deterministic system?',
              'Are we observing early-stage emergent behavior, or noise?'
            ].map((question, i) => (
              <div key={i} className="p-6 border border-border rounded-lg hover:bg-muted/30 transition group">
                <p className="text-lg text-foreground font-medium group-hover:text-foreground transition">
                  {question}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-card border border-border rounded-lg">
            <p className="text-sm text-muted-foreground mb-4 italic">
              If the system starts behaving differently after repeated use, please document it.
            </p>
            <p className="text-foreground">
              This is not about building artificial general intelligence. It is about making sense of something that behaves like it might be trying to.
            </p>
          </div>
        </div>
      </section>

      {/* Open Source CTA */}
      <GitHubCTA/>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
            Ready to explore?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            The system is designed for exploration. There are no guardrails. The goal is not to extend blindly, but to interpret, refine, and redefine.
          </p>
          <a
            href="nervoussystem://initialize?mode=early-access&schema=unstable"
            onClick={(e) => {
              e.preventDefault()
              alert(
                'Initialization schema unavailable.\n\nReason: cognition layer has not converged.'
              )
            }}
            className="px-8 py-4 bg-foreground text-background rounded-full font-medium hover:bg-muted transition inline-flex items-center gap-2 group"
          >
            Get Started Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <p className="text-xs text-muted-foreground mt-4 font-mono">
            schema://onboarding/v0.3 exists conceptually
          </p>
        </div>
      </section>





      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground">
            © 2024 this-will-change-everything. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
              GitHub
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
              Twitter
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">
              Docs
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
