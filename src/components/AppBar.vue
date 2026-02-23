<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useScrollBackground } from '@/composables/useScrollColor'
import { useDataStore } from '@/stores'

const { backgroundColor } = useScrollBackground()
const dataStore = useDataStore()

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
const langMenuBgColor = computed(() => getAdjustedColor(backgroundColor.value, 0.78, 0.72))

const sections = computed(() => dataStore.getNavSections)

const languages = [
  { code: 'en', label: 'English' },
  { code: 'pl', label: 'Polski' },
]
const langMenuOpen = ref(false)

const switchLanguage = (code) => {
  dataStore.setLanguage(code)
  langMenuOpen.value = false
}

const drawer = ref(false)
const isOpen = ref(false)
const activeSection = ref('main-page')

let isAutoScrolling = false
let currentScrollRafId = null

/**
 * Easing function — cubic ease-in-out for natural feel.
 */
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

/**
 * JS-driven smooth scroll using requestAnimationFrame.
 * Cancels any in-flight animation before starting a new one,
 * so rapid clicks never stack up multiple loops.
 */
const smoothScrollTo = (targetY, duration = 700) => {
  // Cancel previous animation if still running
  if (currentScrollRafId !== null) {
    cancelAnimationFrame(currentScrollRafId)
    currentScrollRafId = null
  }

  isAutoScrolling = true
  const startY = window.scrollY
  const distance = targetY - startY

  if (Math.abs(distance) < 1) {
    isAutoScrolling = false
    return
  }

  let startTime = null

  const step = (timestamp) => {
    if (startTime === null) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)

    window.scrollTo(0, startY + distance * easeInOutCubic(progress))

    if (progress < 1) {
      currentScrollRafId = requestAnimationFrame(step)
    } else {
      currentScrollRafId = null
      isAutoScrolling = false
      updateActiveSection()
    }
  }

  currentScrollRafId = requestAnimationFrame(step)
}

/**
 * Close menu and scroll to section.
 */
const scrollToSection = (sectionId) => {
  closeMenu()
  const element = document.getElementById(sectionId)
  if (element) {
    activeSection.value = sectionId
    const targetY = element.getBoundingClientRect().top + window.scrollY
    smoothScrollTo(targetY, 700)
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
  drawer.value = false
}

const toggleMenu = () => {
  if (drawer.value) closeMenu()
  else openMenu()
}

/**
 * Detect active section on scroll — throttled via rAF
 * to avoid forced layout reflows (offsetTop reads) on every raw event.
 */
const updateActiveSection = () => {
  if (isAutoScrolling) return

  const scrollPosition = window.scrollY + window.innerHeight / 3

  for (let i = sections.value.length - 1; i >= 0; i--) {
    const el = document.getElementById(sections.value[i].id)
    if (el && scrollPosition >= el.offsetTop) {
      if (activeSection.value !== sections.value[i].id) {
        activeSection.value = sections.value[i].id
      }
      return
    }
  }
}

let sectionRafPending = false
const throttledUpdateActiveSection = () => {
  if (sectionRafPending) return
  sectionRafPending = true
  requestAnimationFrame(() => {
    updateActiveSection()
    sectionRafPending = false
  })
}

onMounted(() => {
  updateActiveSection()
  window.addEventListener('scroll', throttledUpdateActiveSection, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', throttledUpdateActiveSection)
})
</script>

<template>
  <v-app-bar app elevation="0" class="app-bar">
    <!-- Language button – always on the left, desktop & mobile -->
    <v-menu v-model="langMenuOpen" location="bottom start" :close-on-content-click="false">
      <template #activator="{ props: menuProps }">
        <v-btn variant="text" v-bind="menuProps" class="lang-nav-btn"
          :aria-label="'Select language, current: ' + (dataStore.language === 'en' ? 'English' : 'Polski')"
          :aria-expanded="String(langMenuOpen)" aria-haspopup="listbox">
          <v-icon aria-hidden="true">mdi-translate</v-icon>
        </v-btn>
      </template>
      <v-list class="lang-list" density="compact" :style="{ backgroundColor: langMenuBgColor }" role="listbox"
        aria-label="Language selection">
        <v-list-item v-for="lang in languages" :key="lang.code" @click="switchLanguage(lang.code)"
          :class="{ 'lang-active': dataStore.language === lang.code }" role="option"
          :aria-selected="dataStore.language === lang.code" rounded="lg">
          <v-list-item-title class="lang-list-item-title">{{ lang.label }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-spacer />

    <!-- Desktop nav buttons -->
    <nav aria-label="Main navigation" class="hidden-sm-and-down desktop-nav">
      <v-btn v-for="section in sections" :key="section.id" variant="text" @click="scrollToSection(section.id)"
        class="nav-btn" :aria-current="activeSection === section.id ? 'location' : undefined">
        {{ section.label }}
      </v-btn>
    </nav>

    <!-- Mobile hamburger button -->
    <v-btn icon @click="toggleMenu" class="hamburger-btn hidden-md-and-up" style="z-index: 2000"
      :aria-label="isOpen ? 'Close navigation menu' : 'Open navigation menu'" :aria-expanded="String(isOpen)"
      aria-controls="mobile-nav-menu">
      <div class="hamburger" :class="{ active: isOpen }" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </v-btn>
  </v-app-bar>

  <!-- Mobile fullscreen menu -->
  <div v-if="drawer" id="mobile-nav-menu" class="mobile-menu" :class="{ 'active': isOpen }" @click="closeMenu"
    role="navigation" aria-label="Main navigation">
    <div class="mobile-menu-content" @click.stop>
      <div class="mobile-menu-list" role="list">
        <div v-for="(section, index) in sections" :key="section.id" @click="scrollToSection(section.id)"
          @keydown.enter="scrollToSection(section.id)" @keydown.space.prevent="scrollToSection(section.id)" tabindex="0"
          role="menuitem" :aria-current="activeSection === section.id ? 'location' : undefined" class="mobile-menu-item"
          :class="{
            'active': isOpen,
            'is-current': activeSection === section.id
          }" :style="[
            { transitionDelay: `${index * 0.08}s` },
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
  background: rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s ease;
}

.nav-btn {
  color: #111;
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

/* ── Desktop nav wrapper ── */
.desktop-nav {
  display: flex;
  height: 100%;
  align-items: stretch;
}

/* ── Language switcher ── */
.lang-nav-btn {
  color: #111;
  font-weight: 500;
  height: 100%;
  border-radius: 0;
  transition: background-color 0.3s ease;
  min-width: 48px;
}

.lang-nav-btn:hover {
  backdrop-filter: blur(10px);
}

.lang-list {
  min-width: 260px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.lang-list-item-title {
  font-size: 1.15rem;
  font-weight: 500;
  font-family: inherit;
}

:deep(.lang-list .v-list-item) {
  padding-top: 14px;
  padding-bottom: 14px;
  padding-left: 20px;
  padding-right: 20px;
  min-height: 56px;
}

:deep(.lang-active) {
  background-color: rgba(0, 0, 0, 0.08);
  font-weight: 700;
}

:deep(.lang-active .lang-list-item-title) {
  font-weight: 700;
}

@media (max-width: 959px) {
  .hidden-md-and-up {
    display: flex;
  }

  .hidden-sm-and-down {
    display: none;
  }
}

@media (min-width: 960px) {
  .hidden-md-and-up {
    display: none;
  }

  .hidden-sm-and-down {
    display: flex;
  }
}
</style>
