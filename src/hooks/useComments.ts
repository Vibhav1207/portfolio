'use client'

import { useEffect, useState } from 'react'
import { supabase, isPlaceholder } from '@/lib/supabase'
import {
  fetchCommentsService,
  createCommentService,
  likeCommentService,
  uploadCommentImageService,
} from '@/lib/commentService'

export default function useComments() {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set())

  // Initialize likedIds from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const ids = new Set<number>()
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('liked-')) {
        ids.add(Number(key.replace('liked-', '')))
      }
    }
    setLikedIds(ids)
  }, [])

  useEffect(() => {
    fetchInitialComments()

    if (isPlaceholder) {
      return
    }

    const channel = supabase
      .channel('comments-live')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
        },
        async () => {
          const data = await fetchCommentsService()
          setComments(data)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchInitialComments = async () => {
    try {
      const data = await fetchCommentsService()
      setComments(data)
    } catch (err) {
      console.log(err)
    }
  }

  const addComment = async ({
    name,
    comment,
    image,
  }: {
    name: string
    comment: string
    image: File | null
  }) => {
    if (!name.trim()) return
    if (!comment.trim()) return

    setLoading(true)

    try {
      let imageUrl: string | null = null

      if (image) {
        imageUrl = await uploadCommentImageService(image)
      }

      const newComment = await createCommentService({
        name,
        comment,
        imageUrl,
      })

      // instant UI update (tanpa nunggu realtime)
      setComments((prev) => [newComment, ...prev])
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const likeComment = async (
    id: number,
    currentLikes: number
  ) => {
    const alreadyLiked = likedIds.has(id)

    if (alreadyLiked) {
      // Unlike: decrement
      try {
        const newLikes = Math.max(0, (currentLikes || 0) - 1)
        if (!isPlaceholder) {
          const { error } = await supabase
            .from('comments')
            .update({ likes: newLikes })
            .eq('id', id)
          if (error) throw error
        } else {
          // Update mock storage
          const stored = localStorage.getItem('portfolio-comments')
          if (stored) {
            const parsed = JSON.parse(stored)
            const updated = parsed.map((c: any) => c.id === id ? { ...c, likes: newLikes } : c)
            localStorage.setItem('portfolio-comments', JSON.stringify(updated))
          }
        }

        localStorage.removeItem(`liked-${id}`)
        setLikedIds((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })

        setComments((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, likes: newLikes }
              : item
          )
        )
      } catch (err) {
        console.log(err)
      }
    } else {
      // Like: increment
      try {
        const newLikes = await likeCommentService(
          id,
          currentLikes
        )

        localStorage.setItem(`liked-${id}`, 'true')
        setLikedIds((prev) => {
          const next = new Set(prev)
          next.add(id)
          return next
        })

        setComments((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, likes: newLikes }
              : item
          )
        )
      } catch (err) {
        console.log(err)
      }
    }
  }

  return {
    comments,
    loading,
    likedIds,
    addComment,
    likeComment,
  }
}