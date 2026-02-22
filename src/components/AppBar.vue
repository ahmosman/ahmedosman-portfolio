<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useScrollBackground } from '@/composables/useScrollColor'

const { backgroundColor } = useScrollBackground()

const getAdjustedColor = (hexValue, darkenFactor, alpha) => {
  const hex = hexValue || '#E3C8AA'
  let cleanHex = hex.substring(1)
  if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(c => c + c).join('')
  const num = parseInt(cleanHex, 16)
  const r = Math.floor(((num >> 16) & 255) * darkenFactor)
  const g = Math.floor(((num >> 8) & 255) * darkenFactor)
  const b = Math.floor((num & 255) * darkenFactor)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const menuItemColor = computed(() => getAdjustedColor(backgroundColor.value, 0.9, 0.55))
const menuItemActiveColor = computed(() => getAdjustedColor(backgroundColor.value, 0.85, 0.75))

const sections = [
  { id: 'main-page', label: 'Main Page' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

const drawer = ref(false)
const isOpen = ref(false)
const activeSection = ref('main-page')

/**
 * Custom Smooth Scroll
 */
const smoothScrollToElement = (target, duration = 800) => {
  const targetPosition = target.getBoundingClientRect().top + window.scrollY
  const startPosition = window.scrollY
  const distance = targetPosition - startPosition
  let startTime = null

  const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)

    window.scrollTo(0, startPosition + distance * ease(progress))

    if (timeElapsed < duration) {
      requestAnimationFrame(animation)
    }
  }
  requestAnimationFrame(animation)
}

/**
 * Natychmiastowe zamykanie menu i przewijanie
 */
const scrollToSection = (sectionId) => {
  closeMenu() // Znika od razu
  const element = document.getElementById(sectionId)
  if (element) {
    smoothScrollToElement(element, 800)
  }
}

const openMenu = () => {
  drawer.value = true // Renderuje element w DOM
  setTimeout(() => {
    isOpen.value = true // Odpala animacje wejścia
  }, 20)
}

const closeMenu = () => {
  // Usuwa menu natychmiastowo
  isOpen.value = false
  drawer.value = false
}

const toggleMenu = () => {
  if (drawer.value) closeMenu()
  else openMenu()
}

/**
 * Uproszczone wykrywanie aktywnej sekcji na żywo
 */
const updateActiveSection = () => {
  const scrollPosition = window.scrollY + window.innerHeight / 3

  // Szukamy od dołu, pierwsza która pasuje jest tą właściwą
  for (let i = sections.length - 1; i >= 0; i--) {
    const el = document.getElementById(sections[i].id)
    if (el && scrollPosition >= el.offsetTop) {
      activeSection.value = sections[i].id
      return
    }
  }
}

onMounted(() => {
  updateActiveSection()
  window.addEventListener('scroll', updateActiveSection, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection)
})
</script>

<template>
  <v-app-bar app elevation="0" class="app-bar">
    <v-spacer class="hidden-sm-and-down" />
    <template v-for="section in sections" :key="section.id">
      <v-btn variant="text" @click="scrollToSection(section.id)" class="nav-btn hidden-sm-and-down">
        {{ section.label }}
      </v-btn>
    </template>

    <v-spacer class="hidden-md-and-up" />

    <v-btn icon @click="toggleMenu" class="hamburger-btn hidden-md-and-up" style="z-index: 2000">
      <div class="hamburger" :class="{ active: isOpen }">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </v-btn>
  </v-app-bar>

  <div v-if="drawer" class="mobile-menu" :class="{ 'active': isOpen }" @click="closeMenu">
    <div class="mobile-menu-content" @click.stop>
      <div class="mobile-menu-list">
        <div v-for="(section, index) in sections" :key="section.id" @click="scrollToSection(section.id)"
          class="mobile-menu-item" :class="{
            'active': isOpen,
            'is-current': activeSection === section.id
          }" :style="[
            { transitionDelay: `${index * 0.08}s` }, /* Tylko proste opóźnienie */
            { backgroundColor: activeSection === section.id ? menuItemActiveColor : menuItemColor }
          ]">
          {{ section.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-bar {
  background: rgba(255, 255, 255, 0.1) !important;
  transition: background-color 0.3s ease;
}

.nav-btn {
  color: #111 !important;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
  font-family: inherit;
  height: 100%;
  border-radius: 0;
  transition: background-color 0.3s ease;
}

.nav-btn:hover {
  backdrop-filter: blur(10px);
}

@media (min-width: 768px) {
  .nav-btn {
    font-size: 1rem;
  }
}

@media (min-width: 1024px) {
  .nav-btn {
    font-size: 1.1rem;
  }
}

.hamburger-btn {
  width: 48px;
  height: 48px;
}

.hamburger {
  width: 24px;
  height: 18px;
  position: relative;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
  cursor: pointer;
}

.hamburger span {
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
  background: #111;
  border-radius: 9px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: 0.25s ease-in-out;
}

.hamburger span:nth-child(1) {
  top: 0px;
}

.hamburger span:nth-child(2) {
  top: 8px;
}

.hamburger span:nth-child(3) {
  top: 16px;
}

.hamburger.active span:nth-child(1) {
  top: 8px;
  transform: rotate(135deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
  left: -60px;
}

.hamburger.active span:nth-child(3) {
  top: 8px;
  transform: rotate(-135deg);
}

.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mobile-menu.active {
  background: rgba(255, 255, 255, 0.15);
  opacity: 1;
}

.mobile-menu-content {
  width: 100%;
  max-width: 600px;
  padding: 20px;
}

.mobile-menu-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mobile-menu-item {
  padding: 24px 32px;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111;
  text-align: center;
  cursor: pointer;
  border-radius: 12px;
  opacity: 0;
  transform: translateY(-30px);

  /* Płynne wejście */
  transition:
    opacity 0.4s cubic-bezier(0.25, 0.8, 0.5, 1),
    transform 0.4s cubic-bezier(0.25, 0.8, 0.5, 1),
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

.mobile-menu-item.active {
  opacity: 1;
  transform: translateY(0);
}

.mobile-menu-item.is-current {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-menu-item:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transform: scale(1.02);
  filter: brightness(1.1);
}

@media (max-width: 959px) {
  .hidden-md-and-up {
    display: flex !important;
  }

  .hidden-sm-and-down {
    display: none !important;
  }
}

@media (min-width: 960px) {
  .hidden-md-and-up {
    display: none !important;
  }

  .hidden-sm-and-down {
    display: flex !important;
  }
}
</style>
