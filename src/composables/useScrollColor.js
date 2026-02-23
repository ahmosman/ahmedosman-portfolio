import { ref, onMounted, onUnmounted } from 'vue'

// Helper function for blending HEX colors
function interpolateColor(color1, color2, factor) {
  if (arguments.length < 3) return color1

  const result = color1
    .slice(1)
    .match(/.{2}/g)
    .map((hex) => parseInt(hex, 16))
  const end = color2
    .slice(1)
    .match(/.{2}/g)
    .map((hex) => parseInt(hex, 16))

  const r = Math.round(result[0] + factor * (end[0] - result[0]))
  const g = Math.round(result[1] + factor * (end[1] - result[1]))
  const b = Math.round(result[2] + factor * (end[2] - result[2]))

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// ---- Singleton state shared across all consumers ----
const backgroundColor = ref('#dcd8d7')
let listenerCount = 0
let rafPending = false

const stops = [
  { pos: 0, color: '#dcd8d7' },    // Main Page Start
  { pos: 0.15, color: '#f1e1e8' }, // Main Page End / Transition
  { pos: 0.3, color: '#d5dee8' },  // Experience
  { pos: 0.5, color: '#d8eef1' },  // Skills
  { pos: 0.6, color: '#e6d5e5' },  // Projects
  { pos: 0.8, color: '#dacdaa' },  // About (Sunset)
  { pos: 1.0, color: '#cbc3b7' },  // Contact (Dusk)
]

function handleScroll() {
  const scrollY = window.scrollY
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const scrollPercentage = Math.min(Math.max(scrollY / maxScroll, 0), 1)

  for (let i = 0; i < stops.length - 1; i++) {
    const start = stops[i]
    const end = stops[i + 1]

    if (scrollPercentage >= start.pos && scrollPercentage <= end.pos) {
      const factor = (scrollPercentage - start.pos) / (end.pos - start.pos)
      backgroundColor.value = interpolateColor(start.color, end.color, factor)
      break
    }
  }
}

function throttledHandleScroll() {
  if (rafPending) return
  rafPending = true
  requestAnimationFrame(() => {
    handleScroll()
    rafPending = false
  })
}

/**
 * Singleton composable — no matter how many components call it,
 * only ONE scroll listener is registered on the window.
 * Returns the same shared reactive ref to all consumers.
 */
export function useScrollBackground() {
  onMounted(() => {
    if (listenerCount === 0) {
      handleScroll() // Initial color calculation
      window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    }
    listenerCount++
  })

  onUnmounted(() => {
    listenerCount--
    if (listenerCount === 0) {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  })

  return { backgroundColor }
}
