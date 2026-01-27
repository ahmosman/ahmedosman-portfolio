<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

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
 * Custom Smooth Scroll Function
 */
const smoothScrollToElement = (target, duration = 1000) => {
  const targetPosition = target.getBoundingClientRect().top + window.scrollY
  const startPosition = window.scrollY
  const distance = targetPosition - startPosition
  let startTime = null

  // Easing function: easeInOutCubic
  const ease = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

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
 * MODIFIED NAVIGATION FUNCTION
 * Triggers menu closing and scrolling simultaneously
 */
const scrollToSection = (sectionId) => {
  // 1. If menu is open, close it
  if (drawer.value) {
    closeMenu()
  }

  // 2. Find element and start scrolling IMMEDIATELY (no waiting/delay)
  const element = document.getElementById(sectionId)
  if (element) {
    // Scroll for 1000ms. Since the menu is semi-transparent,
    // user will see the moving background under the disappearing menu.
    smoothScrollToElement(element, 1000)
  }
}

const openMenu = () => {
  drawer.value = true
  setTimeout(() => {
    isOpen.value = true
  }, 20)
}

const closeMenu = () => {
  isOpen.value = false
  const totalDuration = sections.length * 80 + 400
  setTimeout(() => {
    drawer.value = false
  }, totalDuration)
}

const toggleMenu = () => {
  if (isOpen.value) {
    closeMenu()
  } else {
    openMenu()
  }
}

const getItemStyle = (index) => {
  const delay = isOpen.value ? index * 0.08 : (sections.length - 1 - index) * 0.08

  return {
    transitionDelay: `${delay}s`,
  }
}

/**
 * Detect which section is currently visible
 */
const updateActiveSection = () => {
  const scrollPosition = window.scrollY + window.innerHeight / 3

  for (let i = sections.length - 1; i >= 0; i--) {
    const element = document.getElementById(sections[i].id)
    if (element) {
      const offsetTop = element.offsetTop
      if (scrollPosition >= offsetTop) {
        activeSection.value = sections[i].id
        return
      }
    }
  }
}

onMounted(() => {
  updateActiveSection()
  window.addEventListener('scroll', updateActiveSection)
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

  <div v-if="drawer" class="mobile-menu" :class="{ active: isOpen }" @click="closeMenu">
    <div class="mobile-menu-content" @click.stop>
      <div class="mobile-menu-list">
        <div
          v-for="(section, index) in sections"
          :key="section.id"
          @click="scrollToSection(section.id)"
          class="mobile-menu-item"
          :class="{ active: isOpen, 'is-current': activeSection === section.id }"
          :style="getItemStyle(index)"
        >
          {{ section.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===================================
   APP BAR STYLES
   =================================== */

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

/* Larger navigation buttons for tablets */
@media (min-width: 768px) {
  .nav-btn {
    font-size: 1rem;
  }
}

/* Even larger navigation buttons for desktops */
@media (min-width: 1024px) {
  .nav-btn {
    font-size: 1.1rem;
  }
}

/* ===================================
   HAMBURGER ICON ANIMATION
   =================================== */

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

/* Initial positions */
.hamburger span:nth-child(1) {
  top: 0px;
}
.hamburger span:nth-child(2) {
  top: 8px;
}
.hamburger span:nth-child(3) {
  top: 16px;
}

/* Transform to X when active */
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

/* ===================================
   MOBILE FULL-SCREEN MENU
   =================================== */

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

  /* Initial state (closed): Transparent, no blur */
  background: rgba(255, 255, 255, 0);
  backdrop-filter: blur(0px);
  pointer-events: none;

  /* Smooth transitions for background and blur */
  transition:
    background 0.4s ease,
    backdrop-filter 0.4s ease;

  /* Delay on closing so background fades last */
  transition-delay: 0.4s;
}

/* Active state (open): Semi-transparent with blur effect */
.mobile-menu.active {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  pointer-events: auto;

  /* No delay when opening - background appears immediately */
  transition-delay: 0s;
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

/* ===================================
   MENU ITEMS WITH STAIR ANIMATION
   =================================== */

.mobile-menu-item {
  padding: 24px 32px;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111;
  text-align: center;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 12px;

  /* Initial state (closed): Hidden above viewport */
  opacity: 0;
  transform: translateY(-30px);

  /* Smooth transitions for all properties */
  transition:
    opacity 0.4s cubic-bezier(0.25, 0.8, 0.5, 1),
    transform 0.4s cubic-bezier(0.25, 0.8, 0.5, 1),
    background-color 0.3s ease,
    box-shadow 0.3s ease;

  /* Note: Individual transition delays are set inline via :style */
}

/* Active state (open): Visible at original position */
.mobile-menu-item.active {
  opacity: 1;
  transform: translateY(0);
}

/* Current section highlighting */
.mobile-menu-item.is-current {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Hover effect */
.mobile-menu-item:hover {
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transform: scale(1.02) translateY(0);
}

/* ===================================
   RESPONSIVE BREAKPOINTS
   =================================== */

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
