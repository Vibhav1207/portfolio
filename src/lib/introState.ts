export const hasPlayedIntro = () => {
  if (typeof window === 'undefined') return false

  return localStorage.getItem('introPlayed') === 'true'
}

export const setIntroPlayed = () => {
  if (typeof window === 'undefined') return

  localStorage.setItem('introPlayed', 'true')
}

export const resetIntro = () => {
  if (typeof window === 'undefined') return

  localStorage.removeItem('introPlayed')
}