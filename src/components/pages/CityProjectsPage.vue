<template>
  <div class="city-bg city-bg--image">
    <div class="page-wrapper">
      <header class="header-section">
        <h1 class="title-main">{{ pageData.title }}</h1>
        <p class="subtitle-main">{{ pageData.subtitle }}</p>
      </header>

      <div class="carousel-display-area">
        <ProjectCarousel 
          :projects="projects"
          :blockColor="blockColor"
          @open-details="openModal"
        />
      </div>

      <DetailModal 
        :is-open="isModalOpen" 
        :background-color="blockColor"
        @close="closeModal"
      >
        <ProjectDetails 
          v-if="selectedProject" 
          :project="selectedProject" 
        />
      </DetailModal>
    </div>
  </div>
</template>

<script setup>
import '@/assets/pages-common.css'
import { ref, computed, onMounted } from 'vue'
import { useDataStore } from '@/stores'
import { useScrollBackground } from '@/composables/useScrollColor'
import DetailModal from '@/components/common/DetailModal.vue'
import ProjectCarousel from '@/components/projects/ProjectCarousel.vue'
import ProjectDetails from '@/components/projects/ProjectDetails.vue'

const dataStore = useDataStore()
const pageData = computed(() => dataStore.getProjectsPage)
const projects = computed(() => dataStore.getProjectsList)

const { backgroundColor } = useScrollBackground()
const blockColor = computed(() => {
  const hex = backgroundColor.value
  if (!hex) return 'rgba(219, 206, 211, 0.95)'
  let cleanHex = hex.substring(1)
  if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(c=>c+c).join('')
  const num = parseInt(cleanHex, 16)
  let r = (num >> 16) & 255
  let g = (num >> 8) & 255
  let b = num & 255
  const factor = 0.95
  return `rgba(${Math.floor(r*factor)}, ${Math.floor(g*factor)}, ${Math.floor(b*factor)}, 0.95)`
})

const isModalOpen = ref(false)
const selectedProject = ref(null)

function openModal(project) {
  selectedProject.value = project
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  setTimeout(() => { selectedProject.value = null }, 300)
}

onMounted(() => {
  if (!dataStore.isDataLoaded) dataStore.loadAllData()
})
</script>

<style scoped>
.city-bg--image {
  background: url('@/assets/svg/4-city-projects-blank.svg') no-repeat bottom center;
  background-size: cover;
  width: 100vw;
  min-height: 100vw;
  display: flex;
  justify-content: center;
}

.page-wrapper {
  padding: 140px 0 4rem 0; 
  width: 100%;
  max-width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.header-section {
  padding: 0 3rem;
  margin-bottom: 2rem;
  text-align: left;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.carousel-display-area {
  flex: 1;
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden; 
}

/* Responsive */
@media (max-width: 1100px) {
  .page-wrapper {
    padding-top: 100px;
  }
  .header-section {
    padding: 0 1.5rem;
  }
}
</style>