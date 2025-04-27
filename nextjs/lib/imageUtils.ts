/**
 * Utility functions for handling images in the portfolio
 */

/**
 * Get a placeholder image URL for a project based on its ID
 * This allows for local fallbacks when external images aren't available
 */
export function getProjectImageUrl(project: { id: number, images?: { url: string, alt?: string | null }[] | undefined }) {
  // If the project has images in the database, use the first one
  if (project.images && project.images.length > 0) {
    const imageUrl = project.images[0].url;
    
    // Check if the URL is valid (not empty, null, or undefined)
    if (imageUrl && imageUrl.trim() !== '') {
      // If the URL is external and starts with http/https, use it directly
      if (imageUrl.startsWith('http')) {
        console.log(`[Debug] Using DB image URL (external): ${imageUrl} for project ID: ${project.id}`);
        return imageUrl;
      }
      
      // If it's a local URL (starting with / or without http), use it directly
      console.log(`[Debug] Using DB image URL (local): ${imageUrl} for project ID: ${project.id}`);
      return imageUrl;
    }
  }
  
  // Calculate the placeholder index (1-4)
  const placeholderIndex = ((project.id - 1) % 4) + 1;
  
  // Fallback to local placeholder based on project ID
  const placeholderUrl = `/images/projects/project${placeholderIndex}-placeholder.jpg`;
  console.log(`[Debug] Using placeholder image: ${placeholderUrl} for project ID: ${project.id}`);
  return placeholderUrl;
}

/**
 * Get the alt text for a project image
 */
export function getProjectImageAlt(project: { title: string, images?: { url: string, alt?: string | null }[] | undefined }) {
  if (project.images && project.images.length > 0 && project.images[0].alt) {
    return project.images[0].alt;
  }
  
  return `${project.title} project image`;
} 