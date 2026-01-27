<template>
  <div class="city-bg">
    <div class="scene">
      <div class="sun"></div>
      <div class="mountain"></div>
      <img
        class="city-bg-svg"
        src="@/assets/svg/5-city-about-blank.svg"
        alt="About Page Background"
      />
    </div>

    <div class="content">
      <!--  Page content -->
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.scene {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
}

.sun {
  position: absolute;
  bottom: 80vh;
  left: -20vw;
  width: 50vw;
  height: 50vw;
  min-width: 300px;
  min-height: 300px;
  max-width: 800px;
  max-height: 800px;
  border-radius: 50%;
  background-color: var(--about-sun-color);
  z-index: 2;
}

.mountain {
  position: absolute;
  bottom: 20vh;
  width: 100%;
  height: 60%;
  background-color: var(--about-mountain-color);
  z-index: 3;
  clip-path: polygon(-215% 100%, 215% 100%, 75% 0%);
}

.city-bg-svg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: auto;
  display: block;
  z-index: 4;
}

.content {
  position: relative;
  z-index: 5;
  width: 100%;
  height: 100%;
}

/* Media queries */
@media (min-width: 1700px) {
  .sun {
    bottom: 110vh;
  }
}

@media (max-width: 1200px) and (max-aspect-ratio: 1/1) {
  .sun {
    bottom: 55vh;
  }
}

@media (max-aspect-ratio: 1/1) {
  .mountain {
    bottom: 10vh;
  }
}

@media (max-width: 600px) {
  .mountain {
    bottom: 0;
  }
  .sun {
    bottom: 40vh;
  }
}
</style>
