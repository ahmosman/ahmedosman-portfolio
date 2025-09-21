<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Section definitions and their background colors
const sections = [
  { id: 'main-page', label: 'Main Page', color: 'rgba(220, 216, 215, 0.7)' },
  { id: 'experience', label: 'Experience', color: 'rgba(213, 222, 232, 0.7)' },
  { id: 'skills', label: 'Skills', color: 'rgba(216, 238, 241, 0.7)' },
  { id: 'projects', label: 'Projects', color: 'rgba(219, 206, 211, 0.7)' },
  { id: 'about', label: 'About', color: 'rgba(218, 205, 170, 0.7)' },
  { id: 'contact', label: 'Contact', color: 'rgba(203, 195, 183, 0.7)' },
]

const currentSection = ref(sections[0].id)

// Get color for the current section
const appBarColor = computed(() => {
  const section = sections.find((s) => s.id === currentSection.value)
  return section ? section.color : sections[0].color
})

// Scroll to a section and update currentSection
function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    currentSection.value = id
  }
}

// Find which section is most visible in the viewport
function getMostVisibleSection() {
  let found = sections[0].id
  let maxVisibleHeight = -1
  for (const { id } of sections) {
    const el = document.getElementById(id)
    if (el) {
      const rect = el.getBoundingClientRect()
      const visibleTop = Math.max(0, rect.top)
      const visibleBottom = Math.min(window.innerHeight, rect.bottom)
      const visibleHeight = Math.max(0, visibleBottom - visibleTop)
      if (visibleHeight > maxVisibleHeight) {
        maxVisibleHeight = visibleHeight
        found = id
      }
    }
  }
  return found
}

// Debounced scroll handler
let scrollTimeout
function debouncedScroll() {
  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    const visibleSection = getMostVisibleSection()
    if (visibleSection !== currentSection.value) {
      currentSection.value = visibleSection
    }
  }, 100)
}

onMounted(() => {
  window.addEventListener('scroll', debouncedScroll)
  setTimeout(() => {
    currentSection.value = getMostVisibleSection()
  }, 200)
})

onUnmounted(() => {
  window.removeEventListener('scroll', debouncedScroll)
})
</script>

<template>
  <v-app-bar app :style="{ background: appBarColor }" elevation="0" class="app-bar">
    <v-spacer />
    <template v-for="section in sections" :key="section.id">
      <v-btn variant="text" @click="scrollToSection(section.id)" style="color: #111">
        {{ section.label }}
      </v-btn>
    </template>
  </v-app-bar>
</template>

<style scoped>
.app-bar {
  transition: background-color 0.5s ease;
}
</style>
