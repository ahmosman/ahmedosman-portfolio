<template>
  <div class="project-card" :class="{ 'is-active': isActive, 'is-inactive': !isActive }"
    :style="{ backgroundColor: blockColor }" role="article" :aria-label="project.name">
    <div class="card-inner">
      <div class="card-header">
        <h3 class="project-name">{{ project.name }}</h3>
        <span class="project-subtitle">{{ project.subtitle }}</span>
      </div>

      <div class="image-wrapper">
        <img :src="getImageUrl(project.image)" :alt="project.name" class="project-img" />
        <div class="img-overlay"></div>
      </div>

      <p class="project-description">{{ project.description }}</p>

      <button class="show-btn" :class="{ 'btn-visible': isActive }" :aria-label="`Show details: ${project.name}`"
        @click.stop="$emit('open', project)">
        {{ showText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { getImageUrl } from '@/services/imageService'

defineProps({
  project: { type: Object, required: true },
  isActive: { type: Boolean, default: false },
  blockColor: { type: String, default: 'rgba(255,255,255,0.8)' },
  showText: { type: String, default: 'Show' }
})

defineEmits(['open'])
</script>

<style scoped>
.project-card {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1),
    opacity 0.5s ease,
    box-shadow 0.5s ease,
    filter 0.5s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.project-card.is-active {
  transform: scale(1);
  opacity: 0.9;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  z-index: 10;
  cursor: default;
}

.project-card.is-inactive {
  transform: scale(0.85);
  opacity: 0.5;
  filter: grayscale(40%);
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.card-inner {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-header {
  margin-bottom: 1rem;
  text-align: center;
}

.project-name {
  font-size: 2rem;
  font-weight: 800;
  color: #000;
  margin-bottom: 0.3rem;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-subtitle {
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.image-wrapper {
  width: 100%;
  height: 170px;
  background: #eee;
  margin-bottom: 1rem;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-description {
  font-size: 0.9rem;
  color: #222;
  line-height: 1.5;
  margin-bottom: 1rem;
  text-align: center;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.show-btn {
  margin-top: auto;
  align-self: center;
  padding: 0.8rem 2.5rem;
  background: transparent;
  border: 2px solid #606187;
  color: #606187;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  font-size: 0.9rem;
  opacity: 0;
  transition: all 0.4s ease;
}

.show-btn.btn-visible {
  opacity: 1;
  visibility: visible;
}

.show-btn:hover {
  background: #606187;
  color: #fff;
}

@media (max-width: 600px) {
  .card-inner {
    padding: 1.2rem;
  }

  .project-name {
    font-size: 1.3rem;
  }

  .image-wrapper {
    height: 140px;
  }

  .project-description {
    -webkit-line-clamp: 2;
  }

}
</style>
