'use client'

import React, { useEffect, useState } from 'react'

const texts: string[] = [
  "5... 6... 5 6 7 8!!",
  "We were flashing headlights at coming cars",
  "Fear will always make you blind... but the answer is in clear view",
  "Are you experienced?",
  "Three out of five, three out of five (it's not enough)",
  "Marching out of time to my own beat now",
  "You drape your wrists over the steering wheel",
  "Oh there ain't no rest for the wicked, money don't grow on trees",

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
    <div className="absolute inset-0 overflow-hidden">
      {texts.map((text, index) => (
        <span
          key={index}
          className="absolute bg-clip-text text-transparent bg-gradient-to-r from-cyan-500/20 to-blue-500/20 bg-opacity-0 text-lg whitespace-nowrap transition-left duration-50 ease-linear"
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