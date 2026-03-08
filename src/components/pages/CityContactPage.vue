<template>
  <div class="city-bg city-bg--image">
    <div class="page-wrapper">
      <header class="header-section">
        <h1 class="title-main">{{ pageData.title }}</h1>
        <p class="subtitle-main">{{ pageData.subtitle }}</p>
      </header>

      <div class="contact-display-area">
        <div class="cards-container">
          <div
            v-for="section in sections"
            :key="section.id"
            class="contact-card"
            :style="{ backgroundColor: cardColor }"
            role="article"
            :aria-label="
              section.id === 'email'
                ? 'Email contact'
                : section.id === 'cv'
                  ? 'Download CV'
                  : section.id === 'linkedin'
                    ? 'LinkedIn profile'
                    : 'GitHub profile'
            "
          >
            <template v-if="section.id === 'email'">
              <v-icon class="card-icon" size="48" aria-hidden="true">mdi-email-outline</v-icon>
              <span class="card-text">{{ section.email }}</span>
              <button
                class="action-btn"
                :class="{ shake: isShaking }"
                :style="{ backgroundColor: buttonColor }"
                :aria-label="copySuccess ? section['copied-label'] : section['copy-label']"
                :aria-live="'polite'"
                :aria-atomic="'true'"
                @click="copyEmail(section)"
              >
                {{ copySuccess ? section['copied-label'] : section['copy-label'] }}
              </button>
            </template>

            <template v-else-if="section.id === 'cv'">
              <v-icon class="card-icon" size="48" aria-hidden="true"
                >mdi-file-document-outline</v-icon
              >
              <span class="card-text">{{ section.name }}</span>
              <div class="btn-group">
                <a
                  :href="getFileUrl(section['english-link'])"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="action-btn half-btn"
                  :style="{ backgroundColor: buttonColor }"
                >
                  {{ section['english-label'] }}
                </a>
                <a
                  :href="getFileUrl(section['polish-link'])"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="action-btn half-btn"
                  :style="{ backgroundColor: buttonColor }"
                >
                  {{ section['polish-label'] }}
                </a>
              </div>
            </template>

            <template v-else-if="section.id === 'linkedin'">
              <v-icon class="card-icon" size="48" aria-hidden="true">mdi-linkedin</v-icon>
              <span class="card-text">{{ section.name }}</span>
              <a
                :href="section.link"
                target="_blank"
                rel="noopener noreferrer"
                class="action-btn"
                :style="{ backgroundColor: buttonColor }"
              >
                {{ section['action-label'] }}
              </a>
            </template>

            <template v-else-if="section.id === 'github'">
              <v-icon class="card-icon" size="48" aria-hidden="true">mdi-github</v-icon>
              <span class="card-text">{{ section.name }}</span>
              <a
                :href="section.link"
                target="_blank"
                rel="noopener noreferrer"
                class="action-btn"
                :style="{ backgroundColor: buttonColor }"
              >
                {{ section['action-label'] }}
              </a>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/pages-common.css'
import { ref, computed, getCurrentInstance } from 'vue'
import { useDataStore } from '@/stores'
import { useScrollBackground } from '@/composables/useScrollColor'
// import cvEnUrl from '@/data/files/cv-ahmed-osman-en.pdf?url'
// import cvPlUrl from '@/data/files/cv-ahmed-osman-pl.pdf?url'

const FILE_URL_MAP = {
  // 'files/cv-ahmed-osman-en.pdf': cvEnUrl,
  // 'files/cv-ahmed-osman-pl.pdf': cvPlUrl,
}

// --- Pinia Data ---
const dataStore = useDataStore()
const pageData = computed(() => dataStore.getContactPage)
const sections = computed(() => dataStore.getContactSections)

// --- Vue Confetti Instance ---
const { proxy } = getCurrentInstance()

// --- Dynamic Background Colors ---
const { backgroundColor } = useScrollBackground()

const getAdjustedColor = (hexValue, darkenFactor, alpha) => {
  const hex = hexValue || '#E3C8AA'
  let cleanHex = hex.substring(1)
  if (cleanHex.length === 3)
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('')

  const num = parseInt(cleanHex, 16)
  let r = Math.floor(((num >> 16) & 255) * darkenFactor)
  let g = Math.floor(((num >> 8) & 255) * darkenFactor)
  let b = Math.floor((num & 255) * darkenFactor)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const cardColor = computed(() => getAdjustedColor(backgroundColor.value, 0.8, 0.6))
const buttonColor = computed(() => getAdjustedColor(backgroundColor.value, 0.8, 0.8))

const copySuccess = ref(false)
const isShaking = ref(false)

const copyEmail = async (sectionData) => {
  try {
    await navigator.clipboard.writeText(sectionData.email)
    copySuccess.value = true
    isShaking.value = true

    proxy.$confetti.start({
      particlesPerFrame: 2,
      defaultDropRate: 15,
    })

    setTimeout(() => {
      isShaking.value = false
    }, 500)

    setTimeout(() => {
      proxy.$confetti.stop()
    }, 2000)

    setTimeout(() => {
      copySuccess.value = false
    }, 3000)
  } catch (err) {
    console.error('Failed to copy email:', err)
  }
}

const getFileUrl = (path) => {
  return FILE_URL_MAP[path] ?? ''
}
</script>

<style scoped>
.city-bg--image {
  background: url('@/assets/svg/6-city-contact-blank.svg') no-repeat bottom center;
  background-size: cover;
  display: flex;
  flex-direction: column;
}

.contact-display-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 4rem;
  width: 100%;
  z-index: 10;
}

/* Cards Layout */
.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  max-width: 1400px;
  width: 100%;
}

.contact-card {
  width: 280px;
  padding: 2.5rem 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition:
    transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
    box-shadow 0.3s ease;
  container-type: inline-size;
}

.contact-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.card-icon {
  color: #333;
  margin-bottom: 1rem;
}

.card-text {
  font-size: clamp(0.7rem, 7cqw, 1.1rem);
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  word-break: keep-all;
  white-space: nowrap;
  max-width: 100%;
  flex-grow: 1;
}

/* Buttons */
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  color: #222;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  filter: brightness(1.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.action-btn:active {
  transform: translateY(0);
}

.btn-group {
  display: flex;
  width: 100%;
  gap: 0.5rem;
}

.half-btn {
  flex: 1;
  font-size: 0.9rem;
  padding: 0.8rem 0.5rem;
}

.shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

/* Responsive */
@media (max-width: 1250px) {
  .contact-card {
    width: calc(50% - 2rem);
    min-width: 260px;
    max-width: 300px;
  }
}

@media (max-width: 700px) {
  .contact-display-area {
    padding-top: 2rem;
  }

  .contact-card {
    width: 90%;
    max-width: 400px;
  }
}
</style>
