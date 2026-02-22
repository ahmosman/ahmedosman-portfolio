<template>
  <div class="city-bg city-bg--image">
    <div class="page-wrapper">
      <header class="header-section">
        <h1 class="title-main">{{ pageData.title }}</h1>
        <p class="subtitle-main">{{ pageData.subtitle }}</p>
      </header>

      <div class="experience-flex-container" ref="containerRef">
        <div class="left-column">
          <div v-for="section in sections" :key="section.id" class="content-block"
            :style="{ backgroundColor: blockColor }">
            <h3 class="block-heading">{{ section.name }}</h3>

            <div v-for="institution in section.institutions" :key="institution.id" class="institution-group">
              <h4 class="institution-name">{{ institution.name }}</h4>

              <div class="items-list" role="list">
                <div
                  v-for="item in institution.items"
                  :key="item.id"
                  class="item-row"
                  :class="{ active: selectedItemId === item.id }"
                  role="button"
                  tabindex="0"
                  :aria-selected="selectedItemId === item.id"
                  :aria-label="item.title + ', ' + item.period"
                  @click="selectItem(item.id, institution.name)"
                  @keydown.enter="selectItem(item.id, institution.name)"
                  @keydown.space.prevent="selectItem(item.id, institution.name)"
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
            role="region"
            aria-label="Experience details"
            aria-live="polite"
          >
            <div v-if="selectedItem">
              <h3 class="detail-institution">{{ selectedInstitutionName }}</h3>
              <h4 class="detail-job-title">{{ selectedItem.title }}</h4>

              <div class="detail-body" ref="detailScrollRef" v-html="selectedItem.description"></div>
            </div>
            <div v-else class="placeholder-state">
              <p>Select an item from the left to view details</p>
            </div>
          </div>
        </div>
      </div>

      <DetailModal :is-open="isMobile && showModal" :background-color="blockColor" @close="closeModal">
        <div v-if="selectedItem">
          <h3 class="detail-institution">{{ selectedInstitutionName }}</h3>
          <h4 class="detail-job-title">{{ selectedItem.title }}</h4>
          <div class="detail-body" v-html="selectedItem.description"></div>
        </div>
      </DetailModal>
    </div>
  </div>
</template>

<script setup>
import '@/assets/pages-common.css'
// DODANO nextTick do importów
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useDataStore } from '@/stores'
import { useScrollBackground } from '@/composables/useScrollColor'
import DetailModal from '@/components/common/DetailModal.vue'

// --- Pinia Store ---
const dataStore = useDataStore()
const pageData = computed(() => dataStore.getExperiencePage)
const sections = computed(() => dataStore.getExperienceSections)

// Local state
const selectedItemId = ref(null)
const selectedItem = ref(null)
const selectedInstitutionName = ref('')
// DODANO ref do kontenera z tekstem
const detailScrollRef = ref(null)

const isMobile = ref(false)
const showModal = ref(false)
const MOBILE_BREAKPOINT = 1100

// --- Color ---
const { backgroundColor } = useScrollBackground()

const blockColor = computed(() => {
  const hex = backgroundColor.value
  if (!hex) return 'rgba(164, 200, 221, 0.85)'
  let cleanHex = hex.substring(1)
  if (cleanHex.length === 3)
    cleanHex = cleanHex.split('').map((c) => c + c).join('')
  const num = parseInt(cleanHex, 16)
  let r = (num >> 16) & 255,
    g = (num >> 8) & 255,
    b = num & 255
  const factor = 0.9
  return `rgba(${Math.floor(r * factor)}, ${Math.floor(g * factor)}, ${Math.floor(b * factor)}, 0.85)`
})

// --- Animation ---
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
  const cRect = containerRef.value.getBoundingClientRect()
  const bRect = floatingBlockRef.value.getBoundingClientRect()
  const wHeight = window.innerHeight

  let idealY = -cRect.top + wHeight / 2 - bRect.height / 2
  const maxY = cRect.height - bRect.height
  if (idealY < 0) idealY = 0
  if (idealY > maxY) idealY = maxY
  if (cRect.height < bRect.height) idealY = 0

  targetY = idealY
  const diff = targetY - floatingY.value
  if (Math.abs(diff) > 0.1) floatingY.value += diff * EASE_FACTOR
  else floatingY.value = targetY

  animationFrameId = requestAnimationFrame(animateFloatingBlock)
}

// --- Helpers ---
function getItemById(id) {
  for (const section of sections.value) {
    for (const inst of section.institutions) {
      const found = inst.items.find((i) => i.id === id)
      if (found) return found
    }
  }
  return null
}

function checkMobile() {
  isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT
  if (!isMobile.value && !animationFrameId) {
    animationFrameId = requestAnimationFrame(animateFloatingBlock)
  }
}

function selectItem(itemId, institutionName) {
  selectedItemId.value = itemId
  selectedItem.value = getItemById(itemId)
  selectedInstitutionName.value = institutionName

  if (isMobile.value) {
    showModal.value = true
  } else {
    nextTick(() => {
      if (detailScrollRef.value) {
        detailScrollRef.value.scrollTop = 0
      }
    })
  }
}

function closeModal() {
  showModal.value = false
  selectedItemId.value = null
}

// --- Lifecycle ---
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  if (!isMobile.value && sections.value.length > 0) {
    const firstInst = sections.value[0].institutions[0]
    if (firstInst && firstInst.items.length > 0) {
      selectItem(firstInst.items[0].id, firstInst.name)
    }
  }

  animationFrameId = requestAnimationFrame(animateFloatingBlock)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<style scoped>
/* Background */
.city-bg--image {
  background: url('@/assets/svg/2-city-experience-blank.svg') no-repeat bottom center;
  background-size: cover;
}

/* Two Column Layout */
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

/* Detail Block */
.detail-block-content {
  will-change: transform;
  transform-origin: center top;
  min-height: 500px;
}

/* Typography */
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

/* Item List */
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

  max-height: calc(75vh - 200px);
  overflow-y: auto;
  overflow-x: hidden;
}

.detail-body :deep(ul) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.detail-body :deep(li) {
  flex: 0 1 auto;
  max-width: 100%;

  padding: 0.3rem 0.8rem;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 1800px) {
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

@media (max-width: 1400px) {
  .experience-flex-container {
    gap: 3rem;
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

@media (max-width: 1100px) {
  .experience-flex-container {
    flex-direction: column;
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
