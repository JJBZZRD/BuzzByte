// Import the hardcoded project data
import { projects, Project, getProjectBySlug as getBySlug, getAllProjectSlugs as getAllSlugs } from '../app/projects/projectsData';

// Define the project type with relationships 
// This matches the structure from projectsData.ts
export type ProjectWithRelations = Project;

// Get all projects with related data
export async function getProjects() {
  // The data already has the correct structure, so we can return it directly
  return projects;
}

// Get a single project by ID
export async function getProjectById(id: number) {
  const project = projects.find(p => p.id === id);
  
  if (!project) return null;
  
  return project;
}

// Get a single project by slug
export async function getProjectBySlug(slug: string) {
  const project = getBySlug(slug);
  
  if (!project) return null;
  
  return project;
}

// Get all project slugs (for static path generation)
export async function getAllProjectSlugs() {
  return getAllSlugs();
} 