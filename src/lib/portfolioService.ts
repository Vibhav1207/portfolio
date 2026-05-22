import { supabase, isPlaceholder } from '@/lib/supabase'
import { mockProjects, mockCertificates, mockTechStacks } from './mockData'

export const fetchProjects = async () => {
  if (isPlaceholder) {
    return mockProjects
  }
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', {
        ascending: true,
      })

    if (error || !data || data.length === 0) {
      return mockProjects
    }
    return data
  } catch (e) {
    return mockProjects
  }
}

export const fetchCertificates = async () => {
  if (isPlaceholder) {
    return mockCertificates
  }
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('created_at', {
        ascending: true,
      })

    if (error || !data || data.length === 0) {
      return mockCertificates
    }
    return data
  } catch (e) {
    return mockCertificates
  }
}

export const fetchTechStacks = async () => {
  if (isPlaceholder) {
    return mockTechStacks
  }
  try {
    const { data, error } = await supabase
      .from('tech_stack')
      .select('*')
      .order('created_at', {
        ascending: true,
      })

    if (error || !data || data.length === 0) {
      return mockTechStacks
    }
    return data
  } catch (e) {
    return mockTechStacks
  }
}