<template>
  <div 
    class="project-card" 
    :class="{ 'is-active': isActive, 'is-inactive': !isActive }"
    :style="{ backgroundColor: blockColor }"
  >
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

      <button 
        class="show-btn" 
        :class="{ 'btn-visible': isActive }"
        @click.stop="$emit('open', project)"
      >
        Show
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  project: { type: Object, required: true },
  isActive: { type: Boolean, default: false },
  blockColor: { type: String, default: 'rgba(255,255,255,0.8)' }
})

defineEmits(['open'])

function getImageUrl(imageName) {
  try {
    return new URL(`../../data/images/${imageName}`, import.meta.url).href
  } catch (e) {
    return ''
  }
}
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
  opacity: 1;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  z-index: 10;
  cursor: default;
}

.project-card.is-inactive {
  transform: scale(0.85); 
  opacity: 0.6;
  filter: grayscale(40%);
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.card-inner {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.project-name {
  font-size: 2rem;
  font-weight: 800;
  color: #000;
  margin-bottom: 0.2rem;
}

.project-subtitle {
  font-size: 1rem;
  color: #555;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.image-wrapper {
  width: 100%;
  height: 200px;
  background: #eee;
  margin-bottom: 1.5rem;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-description {
  font-size: 0.95rem;
  color: #222;
  line-height: 1.6;
  margin-bottom: auto;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.show-btn {
  margin-top: 1.5rem;
  align-self: center;
  padding: 0.8rem 2.5rem;
  background: transparent;
  border: 2px solid #333;
  color: #333;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  font-size: 0.9rem;
  
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.4s ease;
}

.show-btn.btn-visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.show-btn:hover {
  background: #333;
  color: #fff;
}

@media (max-width: 600px) {
  .card-inner { padding: 1.5rem; }
  .project-name { font-size: 1.5rem; }
  .image-wrapper { height: 160px; }
  .project-description { -webkit-line-clamp: 3; }
}
</style>