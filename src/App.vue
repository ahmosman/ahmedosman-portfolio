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

    <main class="app-content">
      <section id="main-page">
        <CityMainPagePage />
      </section>
      <section id="experience">
        <CityExperiencePage />
      </section>
      <section id="skills">
        <CitySkillsPage />
      </section>
      <section id="projects">
        <CityProjectsPage />
      </section>
      <section id="about">
        <CityAboutPage />
      </section>
      <section id="contact">
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
  z-index: -1; /* Musi być pod wszystkim */
  transition: background 0.1s linear; /* Delikatne wygładzenie */
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
