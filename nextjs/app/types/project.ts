import { ProjectImageWithId } from './project-image';

export interface ProjectType {
  id: number;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  role?: string;
  imageGradient?: string;
  videoEmbed?: string;
  tags: { id?: number; name: string }[];
  technologies: { id?: number; name: string; description?: string }[];
  challenges: { id?: number; title?: string; description: string }[];
  outcomes: { id?: number; description: string }[];
  links: { id?: number; type: string; url: string; title?: string }[];
  images: ProjectImageWithId[];
  highlights?: { id?: number; text: string }[];
  createdAt?: string;
  updatedAt?: string;
} 