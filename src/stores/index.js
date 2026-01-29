import { defineStore } from 'pinia'
import experienceData from '@/data/experience.json'
import skillsData from '@/data/skills.json'
import mainData from '@/data/main.json'

export const useDataStore = defineStore('data', {
  state: () => ({
    experience: {},
    skills: {},
    main: {},
    isDataLoaded: false,
  }),
  getters: {
    getExperiencePage: (state) => state.experience.page || {},
    getExperienceSections: (state) => state.experience.sections || [],
    getSkillsPage: (state) => state.skills.page || {},
    getSkillsSections: (state) => state.skills.sections || [],
    getMainPage: (state) => state.main.page || {},
  },
  actions: {
    // Simulate async fetching, in the future you can add fetch() to API here
    loadAllData() {
      this.experience = experienceData
      this.skills = skillsData
      this.main = mainData
      this.isDataLoaded = true
    },
  },
})
