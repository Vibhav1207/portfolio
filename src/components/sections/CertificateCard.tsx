'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

type Props = {
  title: string
  image_url: string
  type?: 'achievement' | 'course'
  proof_url?: string
  index: number
  onPreview: (url: string) => void
}

export default function CertificateCard({
  title,
  image_url,
  type,
  proof_url,
  index,
  onPreview,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 22, stiffness: 220, mass: 0.5 }
  const tiltX = useSpring(y, springConfig)
  const tiltY = useSpring(x, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()

    const posX = e.clientX - rect.left
    const posY = e.clientY - rect.top

    cardRef.current.style.setProperty('--mouse-x', `${posX}px`)
    cardRef.current.style.setProperty('--mouse-y', `${posY}px`)

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
      className="card-glow-wrapper group relative p-4 flex flex-col border border-white/5 cursor-default transition-all duration-300 hover:bg-white/[0.04] overflow-hidden"
    >
      <div className="h-full flex flex-col relative z-10">
        {/* Type Badge */}
        {type && (
          <div className="absolute top-2 right-2 z-20">
            <span
              style={{ fontFamily: "'DM Mono', monospace" }}
              className={`text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border backdrop-blur-md ${
                type === 'achievement'
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                  : 'bg-violet-500/15 border-violet-500/30 text-violet-300'
              }`}
            >
              {type === 'achievement' ? '🏆 Achievement' : '📚 Course'}
            </span>
          </div>
        )}

        {/* Certificate Image */}
        <div className="w-full h-44 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] mb-3 relative group-hover:border-white/20 transition-all duration-550">
          {image_url ? (
            <img
              src={image_url}
              alt={title}
              className="w-full h-full object-cover scale-100 group-hover:scale-[1.05] group-hover:rotate-[0.5deg] transition-all duration-700 ease-out brightness-[0.85] group-hover:brightness-100"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">
              <span
                style={{ fontFamily: "'DM Mono', monospace" }}
                className="text-[11px] tracking-wider uppercase"
              >
                No Image
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75 group-hover:opacity-20 transition-opacity duration-550" />
        </div>

        {/* Title */}
        <h3 className="text-[16px] font-bold mb-2 leading-tight text-white/90 group-hover:text-white transition-colors duration-300 line-clamp-2 min-h-[44px]">
          {title}
        </h3>

        {/* Proof Button */}
        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
          {proof_url ? (
            <a
              href={proof_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] text-white/50 hover:text-white transition-all duration-300 group/link"
            >
              <span>Proof</span>
              <ArrowUpRight
                size={13}
                className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-violet-300 transition duration-300"
              />
            </a>
          ) : image_url ? (
            <button
              onClick={() => onPreview(image_url)}
              className="flex items-center gap-1.5 text-[12px] text-white/50 hover:text-white transition-all duration-300 group/link cursor-pointer"
            >
              <span>Proof</span>
              <ArrowUpRight
                size={13}
                className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-violet-300 transition duration-300"
              />
            </button>
          ) : (
            <div className="text-[12px] text-white/30">No Proof</div>
          )}

          {type && (
            <span
              style={{ fontFamily: "'DM Mono', monospace" }}
              className="text-[9px] text-white/25 tracking-wider uppercase"
            >
              {type}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
