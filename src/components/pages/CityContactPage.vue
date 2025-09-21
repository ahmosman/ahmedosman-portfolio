<template>
  <div class="city-bg city-bg--image">
    <h1 class="title">My contact</h1>
    <!-- All overlay content here will be above the SVG background -->
  </div>
</template>

<script setup>
// No logic yet
</script>

<style scoped>
.city-bg--image {
  background: #cbc3b7 url('@/assets/svg/6-city-contact-blank.svg') no-repeat bottom;
  background-size: 100vw auto;
}

.title {
  position: absolute;
  top: 2rem;
  left: 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}
</style>
