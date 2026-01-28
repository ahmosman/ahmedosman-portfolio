<template>
  <div class="city-bg city-bg--image">
    <div class="experience-wrapper">
      <header class="header-section">
        <h1 class="title-main">{{ pageData.title }}</h1>
        <p class="subtitle-main">{{ pageData.subtitle }}</p>
      </header>

      <div class="experience-flex-container" ref="containerRef">
        <div class="left-column">
          <div
            v-for="section in sections"
            :key="section.id"
            class="content-block"
            :style="{ backgroundColor: blockColor }"
          >
            <h3 class="block-heading">{{ section.name }}</h3>

            <div
              v-for="institution in section.institutions"
              :key="institution.id"
              class="institution-group"
            >
              <h4 class="institution-name">{{ institution.name }}</h4>

              <div class="items-list">
                <div
                  v-for="item in institution.items"
                  :key="item.id"
                  class="item-row"
                  :class="{ active: selectedItemId === item.id }"
                  @click="selectItem(item.id, institution.name)"
                >
                  <span class="item-period">{{ item.period }}</span>
                  <span class="item-title">{{ item.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="right-column" v-if="!isMobile">
          <div
            class="content-block detail-block-content"
            ref="floatingBlockRef"
            :style="{
              transform: `translate3d(0, ${floatingY}px, 0)`,
              backgroundColor: blockColor,
            }"
          >
            <div v-if="selectedItem">
              <h3 class="detail-institution">{{ selectedInstitutionName }}</h3>
              <h4 class="detail-job-title">{{ selectedItem.title }}</h4>
              <div class="detail-body">
                <p>{{ selectedItem.description }}</p>
              </div>
            </div>
            <div v-else class="placeholder-state">
              <p>Select an item from the left to view details</p>
            </div>
          </div>
        </div>
      </div>

      <Teleport to="body">
        <Transition name="fade">
          <div v-if="isMobile && showModal" class="modal-overlay" @click="closeModal">
            <div
              class="modal-content content-block"
              :style="{ backgroundColor: blockColor }"
              @click.stop
            >
              <button class="close-btn" @click="closeModal">&times;</button>

              <div v-if="selectedItem">
                <h3 class="detail-institution">{{ selectedInstitutionName }}</h3>
                <h4 class="detail-job-title">{{ selectedItem.title }}</h4>
                <div class="detail-body">
                  <p>{{ selectedItem.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getAllSections, getItemById } from '@/services/experienceService'
import experienceData from '@/data/experience.json'
import { useScrollBackground } from '@/composables/useScrollColor'

// ============================
// State Management
// ============================
const pageData = ref({ title: '', subtitle: '' })
const sections = ref([])
const selectedItemId = ref(null)
const selectedItem = ref(null)
const selectedInstitutionName = ref('')

// Mobile State
const isMobile = ref(false)
const showModal = ref(false)
const MOBILE_BREAKPOINT = 1100

// ============================
// Dynamic Background Color
// ============================
const { backgroundColor } = useScrollBackground()

const blockColor = computed(() => {
  const hex = backgroundColor.value
  if (!hex) return 'rgba(164, 200, 221, 0.85)'

  let cleanHex = hex.substring(1)
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((char) => char + char)
      .join('')
  }

  const num = parseInt(cleanHex, 16)
  let r = (num >> 16) & 255
  let g = (num >> 8) & 255
  let b = num & 255

  const darkenFactor = 0.9
  r = Math.floor(r * darkenFactor)
  g = Math.floor(g * darkenFactor)
  b = Math.floor(b * darkenFactor)

  return `rgba(${r}, ${g}, ${b}, 0.85)`
})

// ============================
// Floating Block Animation
// ============================
const containerRef = ref(null)
const floatingBlockRef = ref(null)
const floatingY = ref(0)

let targetY = 0
let animationFrameId = null
const EASE_FACTOR = 0.02

function animateFloatingBlock() {
  if (isMobile.value) return

  if (!containerRef.value || !floatingBlockRef.value) {
    animationFrameId = requestAnimationFrame(animateFloatingBlock)
    return
  }

  const containerRect = containerRef.value.getBoundingClientRect()
  const blockRect = floatingBlockRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight

  let idealY = -containerRect.top + windowHeight / 2 - blockRect.height / 2

  const maxY = containerRect.height - blockRect.height
  if (idealY < 0) idealY = 0
  if (idealY > maxY) idealY = maxY
  if (containerRect.height < blockRect.height) idealY = 0

  targetY = idealY

  const diff = targetY - floatingY.value
  if (Math.abs(diff) > 0.1) {
    floatingY.value += diff * EASE_FACTOR
  } else {
    floatingY.value = targetY
  }

  animationFrameId = requestAnimationFrame(animateFloatingBlock)
}

// ============================
// Lifecycle & Responsiveness
// ============================
function checkMobile() {
  isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT

  if (!isMobile.value && !animationFrameId) {
    animationFrameId = requestAnimationFrame(animateFloatingBlock)
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  pageData.value = experienceData.page || {
    title: 'My experience',
    subtitle: 'Pick one to see some details',
  }
  sections.value = getAllSections()

  if (!isMobile.value) {
    if (sections.value.length > 0 && sections.value[0].institutions.length > 0) {
      const firstInstitution = sections.value[0].institutions[0]
      if (firstInstitution.items.length > 0) {
        const firstItem = firstInstitution.items[0]
        selectItem(firstItem.id, firstInstitution.name)
      }
    }
  }

  animationFrameId = requestAnimationFrame(animateFloatingBlock)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

// ============================
// Event Handlers
// ============================
function selectItem(itemId, institutionName) {
  selectedItemId.value = itemId
  selectedItem.value = getItemById(itemId)
  selectedInstitutionName.value = institutionName

  if (isMobile.value) {
    showModal.value = true
  }
}

function closeModal() {
  showModal.value = false
  selectedItemId.value = null
}
</script>

<style scoped>
/* ============================
   Background & Layout
   ============================ */
.city-bg--image {
  background: url('@/assets/svg/2-city-experience-blank.svg') no-repeat bottom center;
  background-size: cover;
  width: 100vw;
  display: flex;
  justify-content: center;
}

.experience-wrapper {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 140px 3rem 4rem 3rem;
  display: flex;
  flex-direction: column;
}

/* ============================
   Header Section
   ============================ */
.header-section {
  margin-bottom: 3rem;
  text-align: left;
}

.title-main {
  font-size: 4.5rem;
  font-weight: 800;
  color: #000;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.subtitle-main {
  font-size: 1.8rem;
  color: #222;
  margin: 0;
}

/* ============================
   Two Column Layout
   ============================ */
.experience-flex-container {
  display: flex;
  flex-direction: row;
  gap: 4rem;
  position: relative;
}

.left-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding-bottom: 150px;
}

.right-column {
  flex: 1;
  position: relative;
}

/* ============================
   Content Blocks
   ============================ */
.content-block {
  padding: 3.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s ease;
}

.detail-block-content {
  will-change: transform;
  transform-origin: center top;
  min-height: 500px;
}

/* ============================
   Section Typography
   ============================ */
.block-heading {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #000;
}

.institution-group {
  margin-bottom: 3rem;
}

.institution-name {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  color: #111;
}

/* ============================
   Item List
   ============================ */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-row {
  display: flex;
  align-items: baseline;
  padding: 1rem 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.item-row:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

.item-row.active {
  background-color: rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

.item-period {
  flex: 0 0 180px;
  font-size: 1.1rem;
  color: #111;
  font-weight: 500;
}

.item-title {
  font-size: 1.3rem;
  color: #000;
}

/* ============================
   Detail Block Content
   ============================ */
.detail-institution {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #000;
  line-height: 1.2;
}

.detail-job-title {
  font-size: 1.8rem;
  font-weight: 500;
  margin-bottom: 2.5rem;
  color: #222;
  font-style: italic;
}

.detail-body {
  font-size: 1.3rem;
  line-height: 1.8;
  color: #111;
  white-space: pre-line;
}

.placeholder-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #444;
  font-size: 1.4rem;
  font-style: italic;
  min-height: 300px;
}

/* ============================
   MODAL STYLES (Mobile)
   ============================ */
/* Teleport przenosi to do body, więc fixed działa względem okna, a nie rodzica */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;

  /* Blur Effect */
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 12px;
  padding: 2.5rem;
  /* Zapewniamy cień dla lepszej widoczności na rozmytym tle */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  background: transparent;
  border: none;
  font-size: 2rem;
  color: #333;
  cursor: pointer;
  line-height: 1;
  padding: 5px;
  z-index: 10;
}

/* Fade Transition for Modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ============================
   Responsive Design
   ============================ */

/* Screens up to 1800px - Reduce sizes */
@media (max-width: 1800px) {
  .experience-wrapper {
    padding: 100px 2.5rem 3rem 2.5rem;
  }

  .title-main {
    font-size: 3.5rem;
  }

  .subtitle-main {
    font-size: 1.5rem;
  }

  .content-block {
    padding: 2.5rem;
  }

  .block-heading {
    font-size: 2rem;
  }

  .institution-name {
    font-size: 1.3rem;
  }

  .item-period {
    flex: 0 0 160px;
    font-size: 0.95rem;
  }

  .item-title {
    font-size: 1.1rem;
  }

  .detail-institution {
    font-size: 2rem;
  }

  .detail-job-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  .detail-body {
    font-size: 1.1rem;
  }

  .detail-block-content {
    min-height: 400px;
  }
}

/* Screens up to 1400px - Further reduce */
@media (max-width: 1400px) {
  .experience-wrapper {
    padding: 80px 2rem 2rem 2rem;
  }

  .title-main {
    font-size: 3rem;
  }

  .subtitle-main {
    font-size: 1.3rem;
  }

  .experience-flex-container {
    gap: 3rem;
  }

  .content-block {
    padding: 2rem;
  }

  .block-heading {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  .institution-name {
    font-size: 1.2rem;
  }

  .institution-group {
    margin-bottom: 2rem;
  }

  .item-row {
    padding: 0.8rem 1rem;
  }

  .item-period {
    flex: 0 0 140px;
    font-size: 0.9rem;
  }

  .item-title {
    font-size: 1rem;
  }

  .detail-institution {
    font-size: 1.8rem;
  }

  .detail-job-title {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }

  .detail-body {
    font-size: 1rem;
  }
}

/* Tablets and below */
@media (max-width: 1100px) {
  .experience-flex-container {
    flex-direction: column;
  }

  .title-main {
    font-size: 2.5rem;
  }

  .subtitle-main {
    font-size: 1.2rem;
  }

  .experience-wrapper {
    padding: 80px 1.5rem 2rem 1.5rem;
  }

  .content-block {
    padding: 1.8rem;
  }

  .item-period {
    flex: 0 0 120px;
    font-size: 0.85rem;
  }

  .item-title {
    font-size: 0.95rem;
  }

  .left-column {
    padding-bottom: 50px;
  }

  .detail-block-content {
    min-height: 300px;
  }
}
</style>
