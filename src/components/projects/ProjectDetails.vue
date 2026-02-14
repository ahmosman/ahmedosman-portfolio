<template>
  <div class="project-details">
    <div class="details-header">
      <h2 class="project-title">{{ project.name }}</h2>
      <div class="tech-chips">
        <span class="tech-label">Stack:</span>
        {{ project.technologies }}
      </div>
    </div>

    <div class="carousel-wrapper">
      <v-carousel
        v-model="currentSlide"
        height="400"
        show-arrows="hover"
        hide-delimiter-background
        theme="dark"
      >
        <v-carousel-item
          v-for="(detail, i) in details"
          :key="i"
          :src="getImageUrl(detail.image)"
        >
          </v-carousel-item>
      </v-carousel>
    </div>

    <div class="slide-info">
      <transition name="fade" mode="out-in">
        <p :key="currentSlide" class="slide-description">
          {{ currentDetail?.description }}
        </p>
      </transition>
      
      <div class="slide-counter">
        {{ currentSlide + 1 }} / {{ details.length }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  project: { type: Object, required: true }
})

const currentSlide = ref(0)
const details = computed(() => props.project.details || [])
const currentDetail = computed(() => details.value[currentSlide.value])

function getImageUrl(imageName) {
  try {
    return new URL(`../../data/images/${imageName}`, import.meta.url).href
  } catch (e) {
    return ''
  }
}
</script>

<style scoped>
.project-details {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #111;
}

.details-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.project-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: #000;
}

.tech-chips {
  font-size: 0.95rem;
  color: #555;
  background: rgba(0, 0, 0, 0.05);
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 20px;
}

.tech-label {
  font-weight: 700;
  margin-right: 5px;
  color: #333;
}

.carousel-wrapper {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  margin-bottom: 1.5rem;
  background: rgba(0, 0, 0, 0.1); 
}

:deep(.v-img__img) {
  object-fit: contain !important;
}

.slide-info {
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slide-description {
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 90%;
  margin-bottom: 1rem;
  min-height: 3.2rem;
}

.slide-counter {
  font-size: 0.8rem;
  color: #888;
  font-weight: 600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .project-title { font-size: 1.8rem; }
  
  :deep(.v-carousel) {
    height: 250px !important;
  }
}
</style>