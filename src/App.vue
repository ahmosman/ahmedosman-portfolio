<script setup>
import CityMainPagePage from './components/pages/CityMainPagePage.vue'
import CityExperiencePage from './components/pages/CityExperiencePage.vue'
import CitySkillsPage from './components/pages/CitySkillsPage.vue'
import CityProjectsPage from './components/pages/CityProjectsPage.vue'
import CityAboutPage from './components/pages/CityAboutPage.vue'
import CityContactPage from './components/pages/CityContactPage.vue'
import AppBar from './components/AppBar.vue'
</script>

<template>
  <v-app>
    <AppBar />
    <main>
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
main {
  width: 100vw;
  overflow-x: hidden;
}
section {
  min-height: 100vh;
  position: relative;
}
</style>
