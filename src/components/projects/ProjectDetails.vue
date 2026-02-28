<template>
  <div class="project-details">
    <div class="details-header">
      <div class="title-row">
        <h2 class="project-title">{{ project.name }}</h2>
        <div class="info-chip release-date-chip" v-if="project['release-date']">
          <span class="chip-label">{{ releaseDateLabel }}:</span>
          {{ project['release-date'] }}
        </div>
      </div>
      <div class="info-chip description-chip">
        <span class="chip-label">{{ descriptionLabel }}:</span>
        <span v-html="project.description"></span>
      </div>
    </div>

    <div class="carousel-wrapper">
      <v-carousel
        v-model="currentSlide"
        height="400"
        show-arrows="hover"
        hide-delimiter-background
        theme="dark"
        aria-label="Project screenshots"
      >
        <v-carousel-item
          v-for="(detail, i) in details"
          :key="i"
          :src="getImageUrl(detail.image)"
          :alt="detail.description"
        >
          </v-carousel-item>
      </v-carousel>
    </div>

    <div class="slide-info">
      <transition name="fade" mode="out-in">
        <p :key="currentSlide" class="slide-description" v-html="currentDetail?.description"></p>
      </transition>

      <div class="slide-counter" aria-live="polite" aria-atomic="true">
        {{ currentSlide + 1 }} / {{ details.length }}
      </div>
    </div>

    <div class="info-chip" v-if="project.technologies">
      <span class="chip-label">{{ stackLabel }}:</span>
      {{ project.technologies }}
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getImageUrl } from '@/services/imageService'

const props = defineProps({
  project: { type: Object, required: true },
  stackLabel: { type: String, default: 'Stack' },
  releaseDateLabel: { type: String, default: 'Release date' },
  descriptionLabel: { type: String, default: 'Description' }
})

const currentSlide = ref(0)
const details = computed(() => props.project.details || [])
const currentDetail = computed(() => details.value[currentSlide.value])
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

.title-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.project-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #000;
  margin: 0;
  grid-column: 2;
  text-align: center;
}

.release-date-chip {
  margin: 0;
  white-space: nowrap;
  grid-column: 3;
  justify-self: end;
}

.description-chip {
  margin: 0.5rem auto;
}

.info-chip {
  font-size: 0.95rem;
  color: #555;
  background: rgba(0, 0, 0, 0.05);
  display: inline-block;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  margin: 0.5rem auto;
  text-align: center;
  line-height: 1.5;
}

.chip-label {
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
  margin-bottom: 1rem;
}

.slide-description {
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 90%;
  margin-bottom: 1rem;
  min-height: 3.2rem;
  color: #555;
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

  .title-row {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    gap: 0.5rem;
  }

  .project-title {
    grid-column: 1;
    grid-row: 1;
  }

  .release-date-chip {
    grid-column: 1;
    grid-row: 2;
    justify-self: center;
  }

  :deep(.v-carousel) {
    height: 250px !important;
  }
}
</style>
