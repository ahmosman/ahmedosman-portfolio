/**
 * Service for loading and managing experience data
 */
import experienceData from '@/data/experience.json'

/**
 * Get all experience sections
 * @returns {Array} Array of experience sections
 */
export function getAllSections() {
  return experienceData.sections || []
}

/**
 * Get a specific section by ID
 * @param {string} sectionId - The section ID
 * @returns {Object|null} The section object or null if not found
 */
export function getSectionById(sectionId) {
  return experienceData.sections?.find((section) => section.id === sectionId) || null
}

/**
 * Get all institutions from a specific section
 * @param {string} sectionId - The section ID
 * @returns {Array} Array of institutions
 */
export function getInstitutionsBySection(sectionId) {
  const section = getSectionById(sectionId)
  return section?.institutions || []
}

/**
 * Get a specific item by ID from all sections
 * @param {string} itemId - The item ID
 * @returns {Object|null} The item object with institution info or null if not found
 */
export function getItemById(itemId) {
  for (const section of experienceData.sections || []) {
    for (const institution of section.institutions || []) {
      const item = institution.items?.find((i) => i.id === itemId)
      if (item) {
        return {
          ...item,
          institutionName: institution.name,
          sectionName: section.name,
        }
      }
    }
  }
  return null
}
