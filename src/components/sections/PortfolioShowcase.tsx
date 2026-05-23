'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import usePortfolio from '@/hooks/usePortfolio'
import PortfolioCard from './PortfolioCard'
import CertificateCard from './CertificateCard'

const smoothEase: [number, number, number, number] = [
  0.22,
  1,
  0.36,
  1,
]

export default function PortfolioShowcase() {
  const {
    projects,
    certificates,
    techStacks,
    loading,
  } = usePortfolio()

  const [activeTab, setActiveTab] =
    useState('projects')

  const [certFilter, setCertFilter] =
    useState<'all' | 'course' | 'achievement' | 'internship'>('all')

  const [showAllCertificates, setShowAllCertificates] =
    useState(false)

  const [previewOpen, setPreviewOpen] =
    useState(false)

  const [previewImage, setPreviewImage] =
    useState('')

  const [showAllProjects, setShowAllProjects] =
    useState(false)

  const displayedProjects = showAllProjects
    ? projects
    : projects.slice(0, 3)

  return (
    <>
      {/* PREVIEW */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex items-center justify-center px-6"
          >
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <X size={18} />
            </button>

            <motion.img
              initial={{
                scale: 0.92,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.92,
                opacity: 0,
              }}
              transition={{ duration: 0.35 }}
              src={previewImage}
              className="max-w-[88vw] max-h-[88vh] rounded-3xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <section
        id="portfolio"
        className="w-full max-w-[1450px] mx-auto px-8 md:px-12 lg:px-20 pt-24 pb-24 text-white"
      >
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <span
            style={{ fontFamily: "'DM Mono', monospace" }}
            className="text-[11px] text-white/40 tracking-[0.2em] uppercase block mb-2"
          >
            ✦ WORKS
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
            Portfolio Showcase
          </h2>

          <p className="text-white/60 max-w-md mx-auto text-xs md:text-sm leading-relaxed">
            Explore my journey through projects, certifications, and technical expertise.
          </p>
        </motion.div>

        {/* TAB */}
        <div className="flex justify-center mb-12">
          <div
            className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/10 rounded-full backdrop-blur-xl"
            style={{
              boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
            }}
          >
            {[
              "projects",
              "certificates",
              "techstack",
            ].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab !== "projects") {
                      setShowAllProjects(false);
                    }
                  }}
                  className="relative px-5 py-2 rounded-full text-[10px] font-semibold tracking-wider uppercase transition-all duration-300 group cursor-pointer"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.45)",
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeShowcaseTab"
                      className="absolute inset-0 bg-white/10 border border-white/5 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      style={{ zIndex: 0 }}
                    />
                  )}
                  <span className="relative z-10">
                    {tab === "projects"
                      ? "Projects"
                      : tab === "certificates"
                      ? "Certificates"
                      : "Tech Stack"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45 }}
          >
            {/* PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-8">
                <motion.div
                  layout
                  transition={{
                    layout: {
                      duration: 0.75,
                      ease: smoothEase,
                    },
                  }}
                  className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 px-1"
                >
                  <AnimatePresence mode="popLayout">
                    {!loading &&
                      displayedProjects.map(
                        (item, i) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{
                              opacity: 0,
                              y: 40,
                              scale: 0.96,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: 1,
                            }}
                            exit={{
                              opacity: 0,
                              y: -30,
                              scale: 0.95,
                            }}
                            transition={{
                              duration: 0.55,
                              delay: i * 0.04,
                              ease: smoothEase,
                            }}
                          >
                            <PortfolioCard
                              index={i}
                              title={item.title}
                              description={
                                item.description
                              }
                              image={item.image_url}
                              live_url={item.live_url}
                              id={item.id}
                              technologies={item.technologies}
                            />
                          </motion.div>
                        )
                      )}
                  </AnimatePresence>
                </motion.div>

                {/* SEE MORE / LESS */}
                {!loading &&
                  projects.length > 3 && (
                    <motion.div
                      layout
                      transition={{
                        duration: 0.6,
                        ease: smoothEase,
                      }}
                      className="flex justify-center"
                    >
                      <motion.button
                        layout
                        whileHover={{
                          scale: 1.04,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        onClick={() =>
                          setShowAllProjects(
                            !showAllProjects
                          )
                        }
                        className="px-6 py-3 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-xl text-sm text-white/75 hover:text-white transition flex items-center gap-2"
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={
                              showAllProjects
                                ? 'less'
                                : 'more'
                            }
                            initial={{
                              opacity: 0,
                              y: 8,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            exit={{
                              opacity: 0,
                              y: -8,
                            }}
                            transition={{
                              duration: 0.25,
                            }}
                            className="flex items-center gap-2"
                          >
                            {showAllProjects ? (
                              <>
                                <ChevronUp
                                  size={16}
                                />
                                See Less
                              </>
                            ) : (
                              <>
                                <ChevronDown
                                  size={16}
                                />
                                See More
                              </>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </motion.button>
                    </motion.div>
                  )}
              </div>
            )}

            {/* CERTIFICATES */}
            {activeTab === 'certificates' && (() => {
              const visibleCerts = certificates.filter((item) => item.is_visible !== false);
              const filteredCertsList = visibleCerts.filter(
                (item) => certFilter === 'all' || item.type === certFilter
              );
              const displayedCerts = showAllCertificates
                ? filteredCertsList
                : filteredCertsList.slice(0, 3);

              return (
                <div className="space-y-8">
                  {/* SUB-FILTER */}
                  <div className="flex justify-center gap-2 mb-8 flex-wrap">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'course', label: 'Courses' },
                      { id: 'achievement', label: 'Awards' },
                      { id: 'internship', label: 'Internships' },
                    ].map((filter) => {
                      const isSelected = certFilter === filter.id;
                      return (
                        <button
                          key={filter.id}
                          onClick={() => {
                            setCertFilter(filter.id as any);
                            setShowAllCertificates(false); // Reset to show 3 when filter changes
                          }}
                          className={`px-4 py-1.5 rounded-full text-[11px] font-semibold transition-all border flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-white/10 border-white/20 text-white'
                              : 'bg-transparent border-white/5 text-white/50 hover:text-white/80 hover:border-white/10'
                          }`}
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                          <span>{filter.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <motion.div
                    layout
                    className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 px-1"
                  >
                    <AnimatePresence mode="popLayout">
                      {!loading &&
                        displayedCerts.map((item, i) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 30, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.4, delay: i * 0.04 }}
                          >
                            <CertificateCard
                              index={i}
                              title={item.title}
                              subtitle={item.subtitle}
                              image_url={item.image_url}
                              type={item.type}
                              proof_url={item.proof_url}
                              start_date={item.start_date}
                              end_date={item.end_date}
                              status={item.status}
                              onPreview={(url) => {
                                setPreviewImage(url)
                                setPreviewOpen(true)
                              }}
                            />
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* SEE MORE / LESS */}
                  {!loading && filteredCertsList.length > 3 && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setShowAllCertificates(!showAllCertificates)}
                        className="px-6 py-3 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-xl text-sm text-white/75 hover:text-white transition flex items-center gap-2 cursor-pointer"
                      >
                        {showAllCertificates ? (
                          <>
                            <ChevronUp size={16} />
                            See Less
                          </>
                        ) : (
                          <>
                            <ChevronDown size={16} />
                            See More
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* TECH STACK */}
            {/* TECH STACK */}
{activeTab === 'techstack' && (
  <div className="min-h-[360px] flex justify-center">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-5xl w-full">
      {!loading &&
        techStacks?.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
              delay: index * 0.04,
            }}
            whileHover={{
              y: -5,
              scale: 1.04,
            }}
            className="group rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur-xl flex flex-col items-center justify-center gap-3 h-[125px] w-[125px] mx-auto"
          >
            <div className="relative flex items-center justify-center">
              {/* GLOW */}
              <div className="absolute w-[70px] h-[70px] rounded-full bg-white/20 blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />

              {item.logo_url ? (
                <img
                  src={item.logo_url}
                  alt={item.name}
                  className="relative z-10 w-[56px] h-[56px] object-contain"
                />
              ) : (
                <div className="relative z-10 w-[56px] h-[56px] rounded-2xl bg-white/10" />
              )}
            </div>

            <p className="text-[11px] text-white/80 text-center leading-tight px-2 line-clamp-1">
              {item.name}
            </p>
          </motion.div>
        ))}
    </div>
  </div>
)}
          </motion.div>
        </AnimatePresence>
      </section>
    </>
  )
}