import React from "react";
import Image from "next/image";
import Link from "next/link";

const AboutPage = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center">About Me</h1>
          
          <div className="mb-16 flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/3 flex-shrink-0">
              <div className="relative w-64 h-64 mx-auto overflow-hidden rounded-full border-4 border-foreground/10">
                {/* Actual profile image */}
                <Image
                  src="/images/profile_pic.jpg"
                  alt="John Buzzard profile photo"
                  fill
                  sizes="256px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            
            <div className="md:w-2/3">
              <p className="text-lg text-foreground/80 mb-6">
                Software engineer with a Master&apos;s degree in Computer Science from University College London, specialising in 
                software engineering and artificial intelligence. I have proven leadership experience as a team leader 
                on collaborative projects with a focus on system architecture, design, and development.
              </p>
              <p className="text-lg text-foreground/80">
                I&apos;m skilled in full-stack development, machine learning, and database systems, with hands-on 
                experience in Agile methodologies. I&apos;m passionate about driving innovation and optimising 
                performance in software applications.
              </p>
            </div>
          </div>
          
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Technical Skills</h2>
            
            <div className="space-y-8">
              <div className="bg-foreground/5 rounded-xl p-6 border border-foreground/10 hover:border-foreground/20 transition-all shadow-sm hover:shadow">
                <h3 className="text-xl font-semibold mb-4 flex items-center text-foreground/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Programming Languages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { 
                      name: "Python",
                      logo: "/images/skills/python-logo.png",
                      expertise: "Advanced" 
                    },
                    { 
                      name: "JavaScript",
                      logo: "/images/skills/JavaScript-logo.png"
                    },
                    { 
                      name: "PHP",
                      logo: "/images/skills/php-logo.png" 
                    },
                    { 
                      name: "SQL",
                      logo: "/images/skills/sql-logo.png" 
                    },
                    { 
                      name: "MIPS Assembly",
                      logo: "/images/skills/assembly-logo.png" 
                    },
                    { 
                      name: "C#",
                      logo: "/images/skills/csharp-logo.png" 
                    }
                  ].map((skill, index) => (
                    <div key={index} className="bg-background rounded-lg p-4 border border-foreground/5 hover:border-foreground/20 transition-all hover:shadow-sm flex justify-between items-center">
                      <div>
                        <div className="font-medium">{skill.name}</div>
                        {skill.expertise && (
                          <span className="inline-block mt-1 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                            {skill.expertise}
                          </span>
                        )}
                      </div>
                      <div className="relative w-12 h-12 flex items-center justify-center ml-4">
                        <Image
                          src={skill.logo}
                          alt={`${skill.name} logo`}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-foreground/5 rounded-xl p-6 border border-foreground/10 hover:border-foreground/20 transition-all shadow-sm hover:shadow">
                <h3 className="text-xl font-semibold mb-4 flex items-center text-foreground/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Web Development
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    "Next.js", "React", "Node.js", "RESTful APIs", "Responsive Design", "FAST API"
                  ].map((skill, index) => (
                    <div key={index} className="bg-background rounded-lg py-3 px-4 flex items-center justify-center border border-foreground/5 hover:border-foreground/20 transition-all hover:shadow-sm">
                      <span className="text-center font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-foreground/5 rounded-xl p-6 border border-foreground/10 hover:border-foreground/20 transition-all shadow-sm hover:shadow">
                <h3 className="text-xl font-semibold mb-4 flex items-center text-foreground/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Machine Learning & AI
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Model Selection", "Model Deployment", "RAG", "Model Evaluation", 
                    "Optimisation", "Model Chaining", "Quantisation", "LLM Fine-tuning"
                  ].map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-background rounded-full text-sm font-medium border border-foreground/5 hover:border-purple-300/30 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-foreground/5 rounded-xl p-6 border border-foreground/10 hover:border-foreground/20 transition-all shadow-sm hover:shadow">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-foreground/90">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                    Database Systems
                  </h3>
                  <div className="space-y-3">
                    {[
                      "PostgreSQL", "MySQL", "Database Design (3NF)", 
                      "SQL Query Optimisation", "Prisma Schema"
                    ].map((skill, index) => (
                      <div key={index} className="flex items-center px-4 py-3 bg-background rounded-lg border border-foreground/5 hover:border-foreground/20 transition-all">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                        <span className="font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-foreground/5 rounded-xl p-6 border border-foreground/10 hover:border-foreground/20 transition-all shadow-sm hover:shadow">
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-foreground/90">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                    Development Tools & Methods
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Git", "Docker", "Agile", "Visual Studio", 
                      "VS Code", "Figma", "UML", "CI/CD"
                    ].map((skill, index) => (
                      <div key={index} className="bg-background rounded-lg py-3 px-4 text-center border border-foreground/5 hover:border-foreground/20 hover:transform hover:-translate-y-1 transition-all duration-300">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Education</h2>
            <div className="space-y-8">
              <div className="border-l-4 border-foreground/20 pl-6 py-2">
                <h3 className="text-xl font-semibold">MSc Computer Science - Distinction</h3>
                <p className="text-foreground/60 mb-2">University College London • 2023 - 2024</p>
                <p className="text-foreground/80 mb-2">
                  Dissertation: IBM-UCL AI Islands: System Design and Integration of Offline Text-Generation Models
                </p>
                <p className="text-foreground/80">
                  <span className="font-medium">Key Modules:</span> App Engineering, Database Fundamentals, Computer Architecture & Operating Systems, 
                  Software Engineering, Machine Learning For Domain Specialists, Algorithmics, Functional Programming
                </p>
              </div>
              
              <div className="border-l-4 border-foreground/20 pl-6 py-2">
                <h3 className="text-xl font-semibold">BSc Mathematics (Hons) - First Class</h3>
                <p className="text-foreground/60 mb-2">King&apos;s College London • 2016 - 2020</p>
                <p className="text-foreground/80">
                  <span className="font-medium">Key Modules:</span> Space-Time Geometry and General Relativity, Special Relativity and Electromagnetism, 
                  Numerical and Computational Methods, Fourier Analysis
                </p>
              </div>
            </div>
          </section>
          
          <div className="text-center">
            <Link 
              href="/contact" 
              className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 px-8 py-3 font-medium shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
