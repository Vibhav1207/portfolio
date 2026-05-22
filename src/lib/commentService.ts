import { supabase, isPlaceholder } from '@/lib/supabase'

const DEFAULT_MOCK_COMMENTS = [
  {
    id: 1,
    name: 'Sarah Chen',
    comment: 'This portfolio is stunning! The glassmorphism and smooth Framer Motion micro-animations feel incredibly premium. Fantastic work!',
    image_url: null,
    likes: 12,
    replies: [],
    is_pinned: true,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
  },
  {
    id: 2,
    name: 'David Miller',
    comment: 'The project detail layout is very clean. Love the technical indicator descriptions and the Devicon integrations. Keep it up!',
    image_url: null,
    likes: 5,
    replies: [],
    is_pinned: false,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString() // 5 hours ago
  }
]

const getMockComments = (): any[] => {
  if (typeof window === 'undefined') return DEFAULT_MOCK_COMMENTS
  const stored = localStorage.getItem('portfolio-comments')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return DEFAULT_MOCK_COMMENTS
    }
  }
  localStorage.setItem('portfolio-comments', JSON.stringify(DEFAULT_MOCK_COMMENTS))
  return DEFAULT_MOCK_COMMENTS
}

const saveMockComments = (comments: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('portfolio-comments', JSON.stringify(comments))
  }
}

export const fetchCommentsService = async () => {
  if (isPlaceholder) {
    const comments = getMockComments()
    // Sort: is_pinned (desc), then created_at (desc)
    return [...comments].sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1
      if (!a.is_pinned && b.is_pinned) return 1
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error

  return data || []
}

export const likeCommentService = async (
  id: number,
  currentLikes: number
) => {
  const newLikes = (currentLikes || 0) + 1

  if (isPlaceholder) {
    const comments = getMockComments()
    const updated = comments.map(c => c.id === id ? { ...c, likes: newLikes } : c)
    saveMockComments(updated)
    return newLikes
  }

  const { error } = await supabase
    .from('comments')
    .update({ likes: newLikes })
    .eq('id', id)

  if (error) throw error

  return newLikes
}

export const uploadCommentImageService = async (
  image: File
) => {
  if (isPlaceholder) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
      reader.onerror = reject
      reader.readAsDataURL(image)
    })
  }

  const fileName = `${Date.now()}-${image.name}`

  const { error } = await supabase.storage
    .from('comments')
    .upload(fileName, image)

  if (error) throw error

  const { data } = supabase.storage
    .from('comments')
    .getPublicUrl(fileName)

  return data.publicUrl
}

export const createCommentService = async ({
  name,
  comment,
  imageUrl,
}: {
  name: string
  comment: string
  imageUrl: string | null
}) => {
  if (isPlaceholder) {
    const comments = getMockComments()
    const newComment = {
      id: Date.now(),
      name,
      comment,
      image_url: imageUrl,
      likes: 0,
      replies: [],
      is_pinned: false,
      created_at: new Date().toISOString()
    }
    saveMockComments([newComment, ...comments])
    return newComment
  }

  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        name,
        comment,
        image_url: imageUrl,
        likes: 0,
        replies: [],
        is_pinned: false,
      },
    ])
    .select()
    .single()

  if (error) throw error

  return data
}