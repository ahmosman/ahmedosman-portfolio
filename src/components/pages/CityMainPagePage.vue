<template>
  <div class="city-bg" ref="cityBg">
    <img
      class="city-bg-svg"
      src="@/assets/svg/1-city-main-page-blank.svg"
      alt="Main Page Background"
    />
    <h2 class="page-heading">You are very welcome to my page</h2>
    <div class="title">
      <h1>Ahmed Osman</h1>
      <p>Web Developer</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const cityBg = ref(null)

function updateGradientPercentage() {
  if (!cityBg.value) return
  const w = window.innerWidth
  const minP = 35,
    maxP = 85,
    maxW = 1920
  const p = Math.max(minP, maxP - (w / maxW) * (maxP - minP))
  cityBg.value.style.setProperty('--gradient-split', `${p}%`)
}
onMounted(() => {
  updateGradientPercentage()
  window.addEventListener('resize', updateGradientPercentage)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateGradientPercentage)
})
</script>

<style scoped>
.city-bg {
  position: relative;
  width: 100vw;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow-x: hidden;
}
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
.title {
  position: absolute;
  z-index: 1;
  left: 50%;
  top: var(--gradient-split, 50%);
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
  .title h1 {
    font-size: 1.5rem;
  }
  .title p {
    font-size: 1.1rem;
  }
}
@media (max-width: 650px) {
  .title h1 {
    font-size: 1.2rem;
  }
  .title p {
    font-size: 1rem;
  }
}
@media (max-width: 380px) {
  .title h1 {
    font-size: 0.9rem;
  }
  .title p {
    font-size: 0.7rem;
  }
}
</style>
