import { defineStore } from 'pinia'
import experienceData from '@/data/experience.json'
import skillsData from '@/data/skills.json'
import mainData from '@/data/main.json'
import projectsData from '@/data/projects.json'
import aboutData from '@/data/about.json'

export const useDataStore = defineStore('data', {
  state: () => ({
    experience: {},
    skills: {},
    main: {},
    projects: {},
    about: {},
    isDataLoaded: false,
  }),
  getters: {
    getExperiencePage: (state) => state.experience.page || {},
    getExperienceSections: (state) => state.experience.sections || [],
    getSkillsPage: (state) => state.skills.page || {},
    getSkillsSections: (state) => state.skills.sections || [],
    getMainPage: (state) => state.main.page || {},
    getProjectsPage: (state) => state.projects.page || {},
    getProjectsList: (state) => state.projects.sections || [],
    getAboutPage: (state) => state.about.page || {},
    getAboutSections: (state) => state.about.sections || [],
  },
  actions: {
    loadAllData() {
      this.experience = experienceData
      this.skills = skillsData
      this.main = mainData
      this.projects = projectsData
      this.about = aboutData
      this.isDataLoaded = true
    },
  },
})
