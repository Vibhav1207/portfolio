import { supabase } from '@/lib/supabase'

export const fetchProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', {
        ascending: true,
      })

    if (error) {
      console.error('Error fetching projects:', error)
      return []
    }
    return data || []
  } catch (e) {
    console.error('Error in fetchProjects:', e)
    return []
  }
}

export const fetchCertificates = async () => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('created_at', {
        ascending: true,
      })

    if (error) {
      console.error('Error fetching certificates:', error)
      return []
    }
    return data || []
  } catch (e) {
    console.error('Error in fetchCertificates:', e)
    return []
  }
}

export const fetchTechStacks = async () => {
  try {
    const { data, error } = await supabase
      .from('tech_stack')
      .select('*')
      .order('created_at', {
        ascending: true,
      })

    if (error) {
      console.error('Error fetching tech stack:', error)
      return []
    }
    return data || []
  } catch (e) {
    console.error('Error in fetchTechStacks:', e)
    return []
  }
}