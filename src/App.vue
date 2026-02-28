<script setup>
import { useScrollBackground } from './composables/useScrollColor'
import CityMainPagePage from './components/pages/CityMainPagePage.vue'
import CityExperiencePage from './components/pages/CityExperiencePage.vue'
import CitySkillsPage from './components/pages/CitySkillsPage.vue'
import CityProjectsPage from './components/pages/CityProjectsPage.vue'
import CityAboutPage from './components/pages/CityAboutPage.vue'
import CityContactPage from './components/pages/CityContactPage.vue'
import AppBar from './components/AppBar.vue'

const { backgroundColor } = useScrollBackground()
</script>

<template>
  <v-app>
    <AppBar />

    <div class="global-sky" :style="{ background: backgroundColor }"></div>

    <main class="app-content" aria-label="Portfolio content">
      <section id="main-page" aria-label="Introduction">
        <CityMainPagePage />
      </section>
      <section id="experience" aria-label="Experience">
        <CityExperiencePage />
      </section>
      <section id="skills" aria-label="Skills">
        <CitySkillsPage />
      </section>
      <section id="projects" aria-label="Projects">
        <CityProjectsPage />
      </section>
      <section id="about" aria-label="About me">
        <CityAboutPage />
      </section>
      <section id="contact" aria-label="Contact">
        <CityContactPage />
      </section>
    </main>
  </v-app>
</template>

<style scoped>
.global-sky {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1; /* Must be below everything */
  will-change: background-color;
  transition: background-color 0.15s linear;
}

.app-content {
  position: relative;
  z-index: 1;
  background: transparent;
}

main {
  width: 100vw;
  overflow-x: hidden;
}
section {
  min-height: 100vh;
  position: relative;
}
</style>
