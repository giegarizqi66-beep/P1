'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved ? saved === 'dark' : prefersDark
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
    setDark(isDark)
  }, [])

  function toggle() {
    const nextDark = !dark
    document.documentElement.dataset.theme = nextDark ? 'dark' : 'light'
    localStorage.setItem('theme', nextDark ? 'dark' : 'light')
    setDark(nextDark)
  }

  return (
    <button
      type="button"
      className="icon-button"
      onClick={toggle}
      aria-label={dark ? 'Gunakan mode terang' : 'Gunakan mode gelap'}
      title={dark ? 'Mode terang' : 'Mode gelap'}
    >
      {dark ? '☀' : '☾'}
    </button>
  )
}
