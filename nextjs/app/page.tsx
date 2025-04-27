import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getProjects, type ProjectWithRelations } from "@/lib/projects";

export default async function Home() {
  // Get all projects and select the first 3 for featured display
  const allProjects = await getProjects();
  const featuredProjects = allProjects.slice(0, 3);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-foreground/5 z-10" />
          
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Top-right decorative element */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />
            
            {/* Bottom-left decorative element */}
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-tr-full" />
            
            {/* Center decorative blur */}
            <div className="absolute top-1/3 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 blur-3xl rounded-full" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              <span className="text-foreground">Hello, I&apos;m </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                John Buzzard
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-6 animate-fade-in-delay">
              Software Engineer & AI Specialist
            </p>
            <p className="text-lg text-foreground/70 mb-10 animate-fade-in-delay">
              MSc Computer Science, UCL • Full-Stack Development • Machine Learning • System Architecture
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
              <Link 
                href="/projects" 
                className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 px-8 py-3 font-medium shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
              >
                View My Work
              </Link>
              <Link 
                href="/contact" 
                className="rounded-full bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 hover:border-foreground/20 transition-all duration-300 px-8 py-3 font-medium shadow-sm"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-foreground/50" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section className="py-20 bg-gradient-to-b from-foreground/5 to-foreground/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Featured Projects
            </h2>
            <p className="text-foreground/70 text-lg max-w-3xl mx-auto text-center mb-12">
              Explore my recent work in software engineering, AI integration, and system architecture
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project: ProjectWithRelations) => (
                <div key={project.id} className="bg-background rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-foreground/10 group">
                  <div className="h-48 relative overflow-hidden">
                    {project.images && project.images.length > 0 ? (
                      <Image 
                        src={project.images[0].url}
                        alt={project.images[0].alt || `${project.title} image`}
                        fill
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <Image
                        src={`/images/projects/project${((project.id - 1) % 4) + 1}-placeholder.jpg`}
                        alt={`${project.title} image`}
                        fill
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/30 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <Link href={`/projects/${project.slug}`}>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors hover:underline">{project.title}</h3>
                    </Link>
                    <p className="text-foreground/70 mb-4">
                      {project.description}
                    </p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.tags.slice(0, 5).map((tag) => (
                        <span 
                          key={tag.id} 
                          className="text-xs bg-foreground/5 rounded-full px-3 py-1"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                    <Link 
                      href={`/projects/${project.slug}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium inline-flex items-center group"
                    >
                      <span>View Details</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link 
                href="/projects" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 hover:border-foreground/20 transition-all font-medium"
              >
                View All Projects
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
