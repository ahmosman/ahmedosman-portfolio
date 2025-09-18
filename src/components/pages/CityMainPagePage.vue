<template>
  <div class="city-bg city-bg--image">
    <h1 class="title title-position">You are very welcome to my page</h1>
    <!-- All overlay content here will be above the SVG background -->
  </div>
</template>

<script setup>
// No logic yet
</script>

<style scoped>
.city-bg--image {
  background: #dcd8d7 url('@/assets/svg/1-city-main-page.svg') no-repeat bottom;
  background-size: 100vw auto;
}

.title {
  position: absolute;
  top: 4rem;
  left: 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}
</style>
