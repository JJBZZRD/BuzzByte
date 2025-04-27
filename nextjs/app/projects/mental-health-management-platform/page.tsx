import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getProjectBySlug } from "../projectsData";
import ImageCarousel from "@/app/components/ImageCarousel";

// Function to generate a consistent colour for a tag based on its name
function getTagColor(tagName: string) {
  // Simple hash function to convert string to number
  const hash = tagName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // List of predefined pastel colours that work well with the design
  const colors = [
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
  ];
  
  // Get a colour from the array based on the hash
  return colors[Math.abs(hash) % colors.length];
}

export default function MentalHealthManagementPlatformPage() {
  // Get project data from centralized data source
  const project = getProjectBySlug("mental-health-management-platform");
  
  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-8">
            <Link
              href="/projects"
              className="inline-flex items-center text-foreground/70 hover:text-blue-600 transition-colors"
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

          {/* Project header with image on right */}
          <div className="mb-16 flex flex-col md:flex-row gap-8 items-center">
            {/* Title and role */}
            <div className="md:w-3/5 lg:w-2/3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{project.title}</h1>
              <p className="text-foreground/60 font-medium mb-6">{project.role}</p>
              
              {/* Tags with dynamic colours */}
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-3">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 text-foreground/40" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" 
                    />
                  </svg>
                  <span className="text-xs uppercase tracking-wider text-foreground/50 font-medium">Technologies</span>
                  <div className="h-px bg-foreground/10 flex-grow"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => {
                    const tagColorClass = getTagColor(tag.name);
                    return (
                      <span
                        key={tag.id}
                        className="text-sm bg-foreground/5 hover:bg-foreground/10 rounded-full px-3 py-1 inline-flex items-center transition-colors border border-foreground/5 hover:border-foreground/15 shadow-sm"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${tagColorClass} mr-2 opacity-70`}></span>
                        {tag.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Project image */}
            <div className="md:w-2/5 lg:w-1/3 h-52 sm:h-64 md:h-72 lg:h-80 w-full rounded-xl overflow-hidden relative bg-gradient-to-br from-foreground/5 to-foreground/10 shadow-sm">
              {project.images && project.images.length > 0 ? (
                <Image
                  src={project.images[0].url}
                  alt={project.images[0].alt}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 500px"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-foreground/5">
                  <span className="text-foreground/30">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Project description - Tags moved to header */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Overview
            </h2>
            <p className="text-foreground/80 text-lg mb-6 whitespace-pre-line">
              {project.longDescription}
            </p>
          </div>

          {/* Image carousel if available */}
          {project.carouselImages && project.carouselImages.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Project Documentation
              </h2>
              <ImageCarousel 
                images={project.carouselImages}
                className="rounded-xl shadow-sm"
              />
            </div>
          )}

          {/* Video section */}
          {project.videoEmbed && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Project Demo
              </h2>
              <div className="relative aspect-w-16 aspect-h-9 rounded-xl overflow-hidden bg-foreground/5">
                <iframe
                  src={project.videoEmbed}
                  title={`${project.title} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                ></iframe>
              </div>
            </div>
          )}

          {/* Technologies section */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Key Technologies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.technologies.map((tech) => (
                  <div
                    key={tech.id}
                    className="bg-foreground/5 rounded-xl p-6 hover:bg-foreground/10 transition-colors"
                  >
                    <h3 className="text-xl font-semibold mb-2">{tech.name}</h3>
                    <p className="text-foreground/70">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges section */}
          {project.challenges && project.challenges.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Challenges & Solutions
              </h2>
              <div className="space-y-6">
                {project.challenges.map((challenge) => (
                  <div key={challenge.id} className="border-l-4 border-blue-600/30 pl-6 py-2">
                    <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
                    <p className="text-foreground/70">{challenge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Outcomes section */}
          {project.outcomes && project.outcomes.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Outcomes & Impact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {project.outcomes.map((outcome) => (
                  <div
                    key={outcome.id}
                    className="bg-gradient-to-br from-foreground/5 to-foreground/10 rounded-xl p-6 shadow-sm"
                  >
                    <h3 className="text-lg font-semibold mb-2">{outcome.text}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project links */}
          {project.links && project.links.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center pt-8 border-t border-foreground/10">
              {project.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                >
                  {link.type}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2"
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
              
              {/* Project Report Download Button */}
              {project.reportUrl && (
                <a
                  href={project.reportUrl}
                  download
                  className="inline-flex items-center px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors shadow-sm"
                >
                  Download Report
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 