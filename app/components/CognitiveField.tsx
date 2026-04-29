'use client'

import { useEffect, useRef } from 'react'

type Node = {
  x: number
  y: number
  vx: number
  vy: number
}

export default function CognitiveField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    let width = canvas.offsetWidth
    let height = canvas.offsetHeight

    canvas.width = width
    canvas.height = height

    const nodes: Node[] = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4
    }))

    function draw() {
      ctx.clearRect(0, 0, width, height)

      // draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            ctx.strokeStyle = `rgba(255,255,255,${0.32 * (1 - dist / 120)})`
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // draw nodes
      nodes.forEach((node) => {
        ctx.beginPath()
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        ctx.fill()

        node.x += node.vx
        node.y += node.vy

        // bounce edges
        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1
      })

      requestAnimationFrame(draw)
    }

    draw()

    const resize = () => {
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width
      canvas.height = height
    }

    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <div className="relative w-full h-[400px] border border-border rounded-xl overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Overlay text (this is where you lie to users) */}
      <div className="absolute bottom-4 left-4 text-sm text-muted-foreground font-mono">
        SIGNAL FIELD ACTIVE • NODES: VARIABLE • STATE: CONVERGING
      </div>
    </div>
  )
}