'use client'

import { useEffect, useState } from 'react'
import {
  fetchCertificates,
  fetchProjects,
  fetchTechStacks,
} from '@/lib/portfolioService'
import { supabase } from '@/lib/supabase'

export default function usePortfolio() {
  const [projects, setProjects] = useState<any[]>([])
  const [certificates, setCertificates] =
    useState<any[]>([])
  const [techStacks, setTechStacks] =
    useState<any[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPortfolio()

    // Real-time listener for projects
    const projectsChannel = supabase
      .channel('projects-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        async () => {
          const data = await fetchProjects()
          setProjects(data || [])
          sessionStorage.setItem('portfolioProjects', JSON.stringify(data || []))
        }
      )
      .subscribe()

    // Real-time listener for certificates
    const certsChannel = supabase
      .channel('certificates-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'certificates' },
        async () => {
          const data = await fetchCertificates()
          setCertificates(data || [])
          sessionStorage.setItem('portfolioCertificates', JSON.stringify(data || []))
        }
      )
      .subscribe()

    // Real-time listener for tech_stack
    const techChannel = supabase
      .channel('tech-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tech_stack' },
        async () => {
          const data = await fetchTechStacks()
          setTechStacks(data || [])
          sessionStorage.setItem('portfolioTechStacks', JSON.stringify(data || []))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(projectsChannel)
      supabase.removeChannel(certsChannel)
      supabase.removeChannel(techChannel)
    }
  }, [])

  const loadPortfolio = async () => {
    const cachedProjects =
      sessionStorage.getItem(
        'portfolioProjects'
      )

    const cachedCertificates =
      sessionStorage.getItem(
        'portfolioCertificates'
      )

    const cachedTechStacks =
      sessionStorage.getItem(
        'portfolioTechStacks'
      )

    if (cachedProjects) {
      setProjects(JSON.parse(cachedProjects))
    }

    if (cachedCertificates) {
      setCertificates(JSON.parse(cachedCertificates))
    }

    if (cachedTechStacks) {
      setTechStacks(JSON.parse(cachedTechStacks))
    }

    const [
      projectsData,
      certificatesData,
      techStacksData,
    ] = await Promise.all([
      fetchProjects(),
      fetchCertificates(),
      fetchTechStacks(),
    ])

    setProjects(projectsData || [])
    setCertificates(certificatesData || [])
    setTechStacks(techStacksData || [])

    sessionStorage.setItem(
      'portfolioProjects',
      JSON.stringify(projectsData || [])
    )

    sessionStorage.setItem(
      'portfolioCertificates',
      JSON.stringify(certificatesData || [])
    )

    sessionStorage.setItem(
      'portfolioTechStacks',
      JSON.stringify(techStacksData || [])
    )

    setLoading(false)
  }

  return {
    projects,
    certificates,
    techStacks,
    loading,
  }
}