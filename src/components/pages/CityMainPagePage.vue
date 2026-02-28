<template>
  <div class="city-bg city-bg--main-page">
    <img
      class="city-bg-svg"
      src="@/assets/svg/1-city-main-page-blank.svg"
      alt="Main Page Background"
    />
    <h2 class="page-heading">{{ pageData.welcome }}</h2>
    <div class="title">
      <h1>{{ pageData.title }}</h1>
      <p>{{ pageData.subtitle }}</p>
    </div>
  </div>
</template>

<script setup>
import '@/assets/pages-common.css'
import { computed, onMounted } from 'vue'
import { useDataStore } from '@/stores'

// --- Pinia Data ---
const dataStore = useDataStore()
const pageData = computed(() => dataStore.getMainPage)


</script>

<style scoped>
.city-bg-svg {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: auto;
  max-width: 100vw;
  z-index: 0;
  pointer-events: none;
  display: block;
}

.page-heading {
  position: absolute;
  top: 4rem;
  left: 2rem;
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  z-index: 1;
}

.title {
  position: absolute;
  z-index: 1;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%);
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.title h1 {
  font-size: 3.5rem;
  font-weight: bold;
}

.title p {
  font-size: 2rem;
}

/* Responsive Design */
@media (min-width: 768px) {
  .page-heading {
    font-size: 1.4rem;
    top: 5rem;
    left: 4rem;
  }
}

@media (min-width: 1024px) {
  .page-heading {
    font-size: 1.8rem;
  }
}

@media (max-width: 1450px) {
  .title {
    transform: translate(-40%, -60%);
  }
}

@media (max-width: 1200px) {
  .title h1 {
    font-size: 2.5rem;
  }
  .title p {
    font-size: 1.5rem;
  }
}

@media (max-width: 900px) {
  .title {
    top: 40%;
    transform: translate(-50%, -50%);
  }
  .title h1 {
    font-size: 2rem;
  }
  .title p {
    font-size: 1.3rem;
  }
}

@media (max-width: 650px) {
  .title h1 {
    font-size: 1.8rem;
  }
  .title p {
    font-size: 1.2rem;
  }
}

@media (max-width: 380px) {
  .title h1 {
    font-size: 1.5rem;
  }
  .title p {
    font-size: 1rem;
  }
}
</style>
