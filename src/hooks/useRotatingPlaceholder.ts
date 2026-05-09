import { useState, useEffect } from 'react'

export function useRotatingPlaceholder(options: string[], interval = 4000) {
  const [index, setIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % options.length)
        setIsVisible(true)
      }, 300)
    }, interval)

    return () => clearInterval(timer)
  }, [options.length, interval])

  return { placeholder: options[index], isVisible }
}
