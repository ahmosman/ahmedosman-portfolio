<template>
  <div class="city-bg city-bg--image">
    <div class="page-wrapper">
      <header class="header-section">
        <h1 class="title-main">{{ pageData.title }}</h1>
        <p class="subtitle-main">{{ pageData.subtitle }}</p>
      </header>

      <div class="skills-display-area">
        <div class="skills-flex-container">
          <div
            v-for="section in sections"
            :key="section.id"
            class="skill-section-block"
            :style="{ backgroundColor: blockColor }"
          >
            <h3 class="section-heading">{{ section.name }}</h3>

            <div class="pills-container">
              <div
                v-for="skill in section.skills"
                :key="skill.id"
                class="skill-pill"
                @click="openSkillDetails(skill)"
              >
                <img :src="getIconUrl(skill.icon)" :alt="skill.name" class="skill-icon" />
                <span class="skill-name">{{ skill.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DetailModal :is-open="isModalOpen" :background-color="blockColor" @close="closeModal">
        <div v-if="selectedSkill" class="modal-skill-content">
          <div class="modal-header">
            <img :src="getIconUrl(selectedSkill.icon)" class="modal-icon-large" />
            <h3 class="modal-title">{{ selectedSkill.name }}</h3>
          </div>
          <p class="modal-description">{{ selectedSkill.description }}</p>
        </div>
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

// --- Pinia Data ---
const dataStore = useDataStore()
const pageData = computed(() => dataStore.getSkillsPage)
const sections = computed(() => dataStore.getSkillsSections)

// --- Dynamic Background Color ---
const { backgroundColor } = useScrollBackground()

const blockColor = computed(() => {
  const hex = backgroundColor.value
  if (!hex) return 'rgba(164, 200, 221, 0.9)'

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

  return `rgba(${r}, ${g}, ${b}, 0.9)`
})

// --- Modal Logic ---
const isModalOpen = ref(false)
const selectedSkill = ref(null)

function openSkillDetails(skill) {
  selectedSkill.value = skill
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  selectedSkill.value = null
}

// --- Helpers ---
function getIconUrl(name) {
  return new URL(`../../assets/icons/${name}`, import.meta.url).href
}

onMounted(() => {
  if (!dataStore.isDataLoaded) {
    dataStore.loadAllData()
  }
})
</script>

<style scoped>
/* Background */
.city-bg--image {
  background: url('@/assets/svg/3-city-skills-blank.svg') no-repeat bottom center;
  background-size: cover;
}

.skills-display-area {
  flex: 1;
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
}

/* Flexbox System */
.skills-flex-container {
  display: flex;
  flex-wrap: wrap; /* Allows elements to wrap to a new line */
  gap: 10rem; /* Gap between elements */
  width: 100%;
}

/* Section (Container) */
.skill-section-block {
  /* Calculate width for 2 columns: 50% minus half the gap */
  width: calc(50% - 6rem);

  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s ease;
  display: flex;
  flex-direction: column;
}

.section-heading {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #000;
}

/* Pills Container */
.pills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Pill */
.skill-pill {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1.6rem;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.skill-pill:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.skill-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.skill-name {
  font-weight: 600;
  color: #222;
  font-size: 1.1rem;
}

/* Modal Styling */
.modal-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.modal-icon-large {
  width: 64px;
  height: 64px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.modal-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #000;
}

.modal-description {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #111;
}

/* Responsive Design */
@media (max-width: 1800px) {
  .section-heading {
    font-size: 2rem;
  }

  .skill-pill {
    padding: 0.5rem 1rem;
  }

  .skill-name {
    font-size: 0.95rem;
  }
}

@media (max-width: 1400px) {
  .skills-flex-container {
    gap: 3rem;
  }

  .skill-section-block {
    width: calc(50% - 1.5rem);
  }

  .section-heading {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  .skill-pill {
    padding: 0.5rem 1rem;
    gap: 0.6rem;
  }

  .skill-icon {
    width: 20px;
    height: 20px;
  }

  .skill-name {
    font-size: 0.9rem;
  }
}

@media (max-width: 1100px) {
  .skills-flex-container {
    flex-direction: column;
  }

  .skill-section-block {
    width: 100%;
  }

  .section-heading {
    font-size: 1.6rem;
  }

  .modal-title {
    font-size: 2rem;
  }
  .modal-description {
    font-size: 1rem;
  }
}
</style>
