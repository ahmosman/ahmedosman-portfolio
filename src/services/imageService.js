/**
 * Service for loading images from the data folder
 */

/**
 * Get the full URL for an image in the data/images directory
 * @param {string} imageName - The name of the image file
 * @returns {string} The full URL to the image, or empty string on error
 */
export function getImageUrl(imageName) {
  try {
    return new URL(`../data/images/${imageName}`, import.meta.url).href
  } catch (e) {
    console.error('Error loading image:', e)
    return ''
  }
}
