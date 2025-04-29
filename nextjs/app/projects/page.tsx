import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/lib/projects";

export default async function ProjectsPage() {
  const projects = await getProjects();
  
  // Debug: Log project image data to help diagnose the issue
  console.log('Projects data:', projects.map(project => ({
    id: project.id,
    title: project.title,
    hasImages: !!project.images?.length,
    imageCount: project.images?.length || 0,
    firstImageUrl: project.images?.[0]?.url || 'none'
  })));

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center">Projects</h1>
          <p className="text-foreground/70 max-w-3xl mx-auto text-center mb-16">
            Explore my recent projects that showcase my expertise in software engineering, 
            system architecture, and full-stack development. Each project represents unique 
            challenges and innovative solutions.
          </p>
          
          <div className="space-y-16">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="bg-background rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-foreground/10 dark:border-foreground/20 group"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Project image */}
                  <div className="h-64 md:h-auto relative overflow-hidden">
                    <Image 
                      src={project.images?.[0]?.url || `/images/projects/project${project.id}-placeholder.jpg`}
                      alt={project.images?.[0]?.alt || `${project.title} image`}
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/30 dark:from-blue-500/0 dark:to-blue-500/30 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex flex-col h-full">
                      <div>
                        <Link href={`/projects/${project.slug}`} className="inline-block">
                          <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors hover:underline">
                            {project.title}
                          </h2>
                        </Link>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">
                          {project.role}
                        </p>
                        <p className="text-foreground/70 mb-4">
                          {project.description}
                        </p>
                        
                        <div className="mb-6">
                          <h3 className="text-lg font-medium mb-2">Key Highlights:</h3>
                          <ul className="list-disc pl-5 space-y-1 text-foreground/70">
                            {project.highlights.map((highlight) => (
                              <li key={highlight.id}>{highlight.text}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="mb-4 flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span 
                              key={tag.id} 
                              className="text-xs bg-foreground/5 dark:bg-foreground/10 rounded-full px-3 py-1 border border-foreground/5 dark:border-foreground/20"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                          {/* Project detail link */}
                          <Link
                            href={`/projects/${project.slug}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm inline-flex items-center"
                          >
                            <span>View Project Details</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                          
                          {/* External links */}
                          {project.links?.map((link) => (
                            <a 
                              key={link.id}
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-foreground/60 hover:text-blue-600 dark:hover:text-blue-400 text-sm inline-flex items-center ml-4"
                            >
                              <span>{link.type}</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white transition-all duration-300 font-medium shadow-lg shadow-blue-600/20 dark:shadow-blue-500/10 hover:shadow-blue-600/30 dark:hover:shadow-blue-500/20"
            >
              Contact Me
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 