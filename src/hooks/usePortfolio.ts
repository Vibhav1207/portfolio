'use client'

import { useEffect, useState } from 'react'
import {
  fetchCertificates,
  fetchProjects,
  fetchTechStacks,
} from '@/lib/portfolioService'
import { mockProjects, mockCertificates, mockTechStacks } from '@/lib/mockData'

export default function usePortfolio() {
  const [projects, setProjects] = useState<any[]>([])
  const [certificates, setCertificates] =
    useState<any[]>([])
  const [techStacks, setTechStacks] =
    useState<any[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPortfolio()
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
      const parsed = JSON.parse(cachedProjects)
      setProjects(parsed.length > 0 ? parsed : mockProjects)
    }

    if (cachedCertificates) {
      const parsed = JSON.parse(cachedCertificates)
      setCertificates(parsed.length > 0 ? parsed : mockCertificates)
    }

    if (cachedTechStacks) {
      const parsed = JSON.parse(cachedTechStacks)
      setTechStacks(parsed.length > 0 ? parsed : mockTechStacks)
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

    const finalProjects = (projectsData && projectsData.length > 0) ? projectsData : mockProjects
    const finalCertificates = (certificatesData && certificatesData.length > 0) ? certificatesData : mockCertificates
    const finalTechStacks = (techStacksData && techStacksData.length > 0) ? techStacksData : mockTechStacks

    setProjects(finalProjects)
    setCertificates(finalCertificates)
    setTechStacks(finalTechStacks)

    sessionStorage.setItem(
      'portfolioProjects',
      JSON.stringify(finalProjects)
    )

    sessionStorage.setItem(
      'portfolioCertificates',
      JSON.stringify(finalCertificates)
    )

    sessionStorage.setItem(
      'portfolioTechStacks',
      JSON.stringify(finalTechStacks)
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