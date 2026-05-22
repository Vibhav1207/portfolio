'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, User, FolderGit2, Mail } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [mounted, setMounted] = useState(false)

  // 🔥 navbar muncul sekali aja
  const [showNavbar, setShowNavbar] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // Detect if user has scrolled to the absolute bottom of the page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20) {
        setActiveSection('contact')
        return
      }

      const sections = ['home', 'about', 'portfolio', 'contact']

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId)
        if (!section) continue

        const rect = section.getBoundingClientRect()

        if (rect.top <= 140 && rect.bottom >= 140) {
          setActiveSection(sectionId)
          break
        }
      }
    }

    handleResize()
    handleScroll()

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 🔥 navbar animasi cuma pas refresh
  useEffect(() => {
    const navbarPlayed = sessionStorage.getItem('navbarPlayed')

    if (navbarPlayed) {
      setShowNavbar(true)
      return
    }

    const timer = setTimeout(() => {
      setShowNavbar(true)
      sessionStorage.setItem('navbarPlayed', 'true')
    }, 3800)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  const smoothScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault()

    const id = targetId.startsWith('#') ? targetId.slice(1) : targetId
    const target = document.getElementById(id)
    if (!target) return

    const elementPosition = target.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - 20
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
    setOpen(false)
  }

  const navItems = [
    { label: 'Home', id: 'home', icon: Home },
    { label: 'About', id: 'about', icon: User },
    { label: 'Portfolio', id: 'portfolio', icon: FolderGit2 },
    { label: 'Contact', id: 'contact', icon: Mail },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: 40, x: '-50%' }}
      animate={{
        opacity: showNavbar ? 1 : 0,
        y: showNavbar ? 0 : 40,
        x: '-50%',
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        zIndex: 50,
        width: 'max-content',
        pointerEvents: 'auto',
      }}
    >
      <div
        className="relative flex items-center gap-1.5 sm:gap-2 px-3 py-2 bg-black/70 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
        style={{
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        }}
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id
          const Icon = item.icon

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => smoothScrollTo(e, `#${item.id}`)}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-300 group"
              style={{
                fontFamily: "'DM Mono', monospace",
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)',
                textDecoration: 'none',
                letterSpacing: '0.05em',
                cursor: 'pointer',
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="activeNavbarPill"
                  className="absolute inset-0 bg-white/10 border border-white/5 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  style={{ zIndex: 0 }}
                />
              )}

              <span className="relative z-10 flex items-center gap-2">
                <Icon size={14} className="group-hover:scale-110 transition duration-300" />
                {(!isMobile || isActive) && (
                  <span>{item.label}</span>
                )}
              </span>
            </a>
          )
        })}
      </div>
    </motion.nav>
  )
}