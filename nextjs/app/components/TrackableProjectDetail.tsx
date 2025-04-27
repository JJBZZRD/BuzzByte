'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAnalytics } from '../hooks/useAnalytics';

// Define interfaces for project data
interface Tag {
  id: string | number;
  name: string;
}

interface Technology {
  id: string | number;
  name: string;
  description: string;
}

interface ProjectLink {
  id: string | number;
  url: string;
  type: string;
}

interface ProjectType {
  id: string | number;
  title: string;
  description: string;
  tags: Tag[];
  technologies: Technology[];
  links: ProjectLink[];
  videoEmbed?: string;
  // Add other properties as needed
}

// Props interface with project data
interface TrackableProjectDetailProps {
  project: ProjectType;
  slug: string;
}

export default function TrackableProjectDetail({ project, slug }: TrackableProjectDetailProps) {
  const { trackClick } = useAnalytics();
  
  // Track video interactions
  useEffect(() => {
    const trackVideoInteraction = () => {
      if (project.videoEmbed) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.addEventListener('load', () => {
            trackClick('project-video-loaded', { 
              projectId: project.id,
              projectSlug: slug 
            });
          });
        }
      }
    };
    
    trackVideoInteraction();
  }, [project, trackClick, slug]);
  
  const handleLinkClick = (linkType: string) => {
    trackClick('project-link-click', { 
      projectId: project.id,
      projectSlug: slug,
      linkType
    });
  };
  
  const handleTechnologyClick = (techName: string) => {
    trackClick('project-technology-click', { 
      projectId: project.id,
      projectSlug: slug,
      technology: techName 
    });
  };
  
  const handleTagClick = (tagName: string) => {
    trackClick('project-tag-click', { 
      projectId: project.id,
      projectSlug: slug,
      tag: tagName 
    });
  };
  
  return (
    <>
      {/* Back button with tracking */}
      <div className="mb-6">
        <Link
          href="/projects"
          className="inline-flex items-center text-foreground/70 hover:text-blue-600 transition-colors"
          onClick={() => trackClick('project-back-button')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Projects
        </Link>
      </div>
      
      {/* Tags with tracking */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tags.map((tag: Tag) => (
          <span
            key={tag.id}
            className="text-sm bg-foreground/5 rounded-full px-4 py-1.5 cursor-pointer hover:bg-foreground/10"
            onClick={() => handleTagClick(tag.name)}
          >
            {tag.name}
          </span>
        ))}
      </div>
      
      {/* Technologies section with tracking */}
      {project.technologies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {project.technologies.map((tech: Technology) => (
            <div
              key={tech.id}
              className="bg-foreground/5 rounded-xl p-6 hover:bg-foreground/10 transition-colors cursor-pointer"
              onClick={() => handleTechnologyClick(tech.name)}
            >
              <h3 className="text-xl font-semibold mb-2">{tech.name}</h3>
              <p className="text-foreground/70">{tech.description}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Links section with tracking */}
      {project.links.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {project.links.map((link: ProjectLink) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
              onClick={() => handleLinkClick(link.type)}
            >
              <span>{link.type}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ))}
        </div>
      )}
      
      {/* Navigation between projects with tracking */}
      <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-6">
        <Link
          href="/projects"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors"
          onClick={() => trackClick('project-all-projects-button')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <span>All Projects</span>
        </Link>
        <Link
          href="/contact"
          className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-300"
          onClick={() => trackClick('project-contact-button')}
        >
          <span>Get In Touch</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </>
  );
} 