import { defineStore } from 'pinia'

// English data
import experienceDataEn from '@/data/en/experience.json'
import skillsDataEn from '@/data/en/skills.json'
import mainDataEn from '@/data/en/main.json'
import projectsDataEn from '@/data/en/projects.json'
import aboutDataEn from '@/data/en/about.json'
import contactDataEn from '@/data/en/contact.json'

// Polish data
import experienceDataPl from '@/data/pl/experience.json'
import skillsDataPl from '@/data/pl/skills.json'
import mainDataPl from '@/data/pl/main.json'
import projectsDataPl from '@/data/pl/projects.json'
import aboutDataPl from '@/data/pl/about.json'
import contactDataPl from '@/data/pl/contact.json'

const allData = {
  en: {
    experience: experienceDataEn,
    skills: skillsDataEn,
    main: mainDataEn,
    projects: projectsDataEn,
    about: aboutDataEn,
    contact: contactDataEn,
  },
  pl: {
    experience: experienceDataPl,
    skills: skillsDataPl,
    main: mainDataPl,
    projects: projectsDataPl,
    about: aboutDataPl,
    contact: contactDataPl,
  },
}

export const useDataStore = defineStore('data', {
  state: () => ({
    language: 'en',
  }),
  getters: {
    getExperiencePage: (state) => allData[state.language]?.experience?.page || {},
    getExperienceSections: (state) => allData[state.language]?.experience?.sections || [],
    getSkillsPage: (state) => allData[state.language]?.skills?.page || {},
    getSkillsSections: (state) => allData[state.language]?.skills?.sections || [],
    getMainPage: (state) => allData[state.language]?.main?.page || {},
    getNavSections: (state) => allData[state.language]?.main?.nav || [],
    getProjectsPage: (state) => allData[state.language]?.projects?.page || {},
    getProjectsList: (state) => allData[state.language]?.projects?.sections || [],
    getAboutPage: (state) => allData[state.language]?.about?.page || {},
    getAboutSections: (state) => allData[state.language]?.about?.sections || [],
    getContactPage: (state) => allData[state.language]?.contact?.page || {},
    getContactSections: (state) => allData[state.language]?.contact?.sections || [],
  },
  actions: {
    setLanguage(lang) {
      if (allData[lang]) {
        this.language = lang
      }
    },
  },
})
