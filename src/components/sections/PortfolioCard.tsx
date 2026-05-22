'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  title: string
  description: string
  index: number
  id?: string
  image?: string
  live_url?: string
  technologies?: string | string[]
}

export default function PortfolioCard({
  title,
  description,
  index,
  id,
  image,
  live_url,
  technologies,
}: Props) {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)

  // Motion values for tilt position
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring animation configuration for ultra-smooth lag-free motion
  const springConfig = { damping: 22, stiffness: 220, mass: 0.5 }
  const tiltX = useSpring(y, springConfig) // Tilt up/down maps to cursor y-axis
  const tiltY = useSpring(x, springConfig) // Tilt left/right maps to cursor x-axis

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    
    // Relative coordinates of cursor inside card
    const posX = e.clientX - rect.left
    const posY = e.clientY - rect.top

    cardRef.current.style.setProperty('--mouse-x', `${posX}px`)
    cardRef.current.style.setProperty('--mouse-y', `${posY}px`)

    // Calculate rotation angles (max 6 degrees tilt)
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateXVal = ((posY - centerY) / centerY) * -6
    const rotateYVal = ((posX - centerX) / centerX) * 6

    x.set(rotateYVal)
    y.set(rotateXVal)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  // Parse technologies string or array into tag capsules
  const tags = Array.isArray(technologies)
    ? technologies.slice(0, 3)
    : typeof technologies === 'string' && technologies
    ? technologies.split(',').map((t) => t.trim()).slice(0, 3)
    : []

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{
        opacity: 0,
        x: index % 2 === 0 ? -30 : 30,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.75,
        delay: index * 0.05,
      }}
      style={{
        rotateX: tiltX,
        rotateY: tiltY,
      }}
      className="card-glow-wrapper group relative p-4 flex flex-col min-h-[300px] border border-white/5 cursor-default transition-all duration-300 hover:bg-white/[0.04]"
    >
      {/* Content */}
      <div className="h-full flex flex-col relative z-10">
        
        {/* Card Image */}
        <div className="w-full h-36 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] mb-3 relative group-hover:border-white/20 transition-all duration-550">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover scale-100 group-hover:scale-[1.05] group-hover:rotate-[0.5deg] transition-all duration-700 ease-out brightness-[0.85] group-hover:brightness-100"
            />
          ) : (
            <div className="w-full h-full bg-white/[0.03]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75 group-hover:opacity-20 transition-opacity duration-550" />
        </div>

        {/* Title */}
        <h3 className="text-[16px] font-bold mb-2 leading-tight text-white/90 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[12.5px] text-white/55 leading-relaxed line-clamp-2 min-h-[38px] mb-3">
          {description}
        </p>

        {/* Technologies */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                style={{ fontFamily: "'DM Mono', monospace" }}
                className="text-[9.5px] text-white/60 bg-white/[0.04] border border-white/5 rounded-md px-1.5 py-0.5 hover:bg-white/10 hover:text-white transition-all duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          {live_url ? (
            <a
              href={live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] text-white/50 hover:text-white transition-all duration-300 group/link"
            >
              <span>Live Demo</span>
              <ArrowUpRight size={13} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-violet-300 transition duration-300" />
            </a>
          ) : (
            <div className="text-[12px] text-white/30">
              No Link
            </div>
          )}

          {id && (
            <button
              onClick={() =>
                router.push(`/portfolio/${id}`)
              }
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/5 hover:border-white/15 hover:text-white transition-all duration-300 flex items-center gap-1.5 text-[12px] cursor-pointer group-hover:scale-[1.03] relative z-20"
            >
              <span>Details</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.75 transition duration-300" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}