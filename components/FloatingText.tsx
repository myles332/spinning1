'use client'

import React, { useEffect, useState } from 'react'

const texts: string[] = [
  "This is background text...",
  "This record is mainly about my childhood in the mid",
  "Are you experienced?",
  "1 2 3 4 this is a text for the background"
] as const

interface Position {
  left: number;
  top: number;
}

const FloatingText: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([])

  useEffect(() => {
    setPositions(texts.map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
    })))

    const interval = setInterval(() => {
      setPositions(prev => prev.map(pos => ({
        left: (pos.left + 0.1) % 100,
        top: pos.top,
      })))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden text-opacity-0">
      {texts.map((text, index) => (
        <span
          key={index}
          className="absolute bg-clip-text text-transparent bg-gradient-to-r from-cyan-500/40 to-blue-500/40 bg-opacity-20 text-lg whitespace-nowrap transition-left duration-50 ease-linear"
          style={{
            left: `${positions[index]?.left ?? 0}%`,
            top: `${positions[index]?.top ?? 0}%`,
          }}
        >
          {text}
        </span>
      ))}
    </div>
  )
}

export default FloatingText