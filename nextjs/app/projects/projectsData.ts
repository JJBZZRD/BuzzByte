// Project data model
export interface ProjectLink {
  id: number;
  type: string;
  url: string;
}

export interface ProjectTag {
  id: number;
  name: string;
}

export interface ProjectHighlight {
  id: number;
  text: string;
}

export interface ProjectImage {
  id: number;
  url: string;
  alt: string;
}

// New interface for carousel images with descriptions
export interface CarouselImage {
  id: number;
  url: string;
  alt: string;
  description?: string;
}

export interface ProjectTechnology {
  id: number;
  name: string;
  description: string;
}

export interface ProjectChallenge {
  id: number;
  title: string;
  description: string;
}

export interface ProjectOutcome {
  id: number;
  text: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  role: string;
  tags: ProjectTag[];
  links?: ProjectLink[];
  imageGradient: string;
  highlights: ProjectHighlight[];
  videoEmbed?: string;
  images?: ProjectImage[];
  carouselImages?: CarouselImage[]; // New property for the carousel images
  technologies?: ProjectTechnology[];
  challenges?: ProjectChallenge[];
  outcomes?: ProjectOutcome[];
  reportUrl?: string; // URL to downloadable project report
}

// Project data from CV with expanded information for detail pages
export const projects: Project[] = [
  {
    id: 1,
    slug: "ibm-ucl-ai-islands",
    title: "IBM-UCL AI Islands",
    description: "Led a team in developing an offline-access AI library application, enabling local access to open-source AI models for tasks including object detection, NLU/NLP and text generation.",
    longDescription: "The IBM-UCL AI Islands project aimed to address challenges in AI adoption for smaller businesses and educational institutions by developing a cost-effective, user-friendly offline AI solution. It focused on creating an intuitive interface for managing and running open-source Generative AI models, especially for text-generation and chatbot functionalities. This system provided offline access to these AI models, ensuring data privacy, affordability, and ease of integration, thus significantly lowering the barriers to AI implementation.\n\nThe AI Islands project, collaboratively developed by IBM and UCL, was designed to mitigate common barriers such as high costs, technical complexity, and privacy concerns associated with traditional AI infrastructure. The project centered on creating an accessible and affordable offline AI management platform, particularly emphasizing Generative AI models for text-based interactions.\n\nAs a four-member team initiative, the project involved compiling an extensive index of offline AI models across natural language, visual, and audio processing domains, complemented by the optional integration of IBM Watson's online services. Within this framework, significant efforts were made in researching, selecting, and integrating Generative AI models specifically optimized for text generation, enabling chatbot creation and similar functionalities.\n\nThe system's backend, primarily built using Python and FastAPI, facilitated the seamless downloading, configuration, and management of models from the Hugging Face ecosystem. Key features included a playground for model experimentation, model chaining capabilities to build complex workflows, robust API integration points for external systems, and comprehensive local data management ensuring privacy and security.\n\nExtensive testing and user feedback highlighted the project's effectiveness in making AI tools readily available to a broad spectrum of users, from educational settings to small enterprises. The outcome was a scalable, adaptable AI platform that significantly improved accessibility to powerful AI technologies without the extensive costs and expertise usually required.",
    role: "Project Manager & Team Lead",
    tags: [
      { id: 0, name: "C#" },
      { id: 1, name: ".NET MAUI" },
      { id: 2, name: "Python" },
      { id: 3, name: "FastAPI" },
      { id: 4, name: "AI" },
      { id: 5, name: "Model Chaining" },
      { id: 6, name: "Quantisation" },
      { id: 7, name: "Hugging Face" },
      { id: 8, name: "IBM Watson" }
    ],
    links: [
      { id: 0, type: "GitHub", url: "https://github.com/JJBZZRD/Ai-Islands" }
    ],
    imageGradient: "from-blue-600/20 to-purple-600/20",
    highlights: [
      { id: 0, text: "Architected cross-platform system integrating frontend (.NET MAUI, C#) and backend (Python, FastAPI)" },
      { id: 1, text: "Implemented model chaining for complex AI workflows with quantisation options" },
      { id: 2, text: "Designed user-friendly interface for model browsing, downloading, and configuration" },
      { id: 3, text: "Collaborated with IBM stakeholders to align technical objectives with user requirements" }
    ],
    videoEmbed: "https://www.youtube.com/embed/30NjYHuSXXs?si=7YWSUOlFBwmzGlZq",
    images: [
      { id: 0, url: "/images/projects/ibm-ucl-ai-islands/project-image.png", alt: "IBM-UCL AI Islands image" }
    ],
    carouselImages: [
      { 
        id: 1, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/1. AI Index main view.png", 
        alt: "AI Index main view",
        description: "The AI Index, highlighting the included search, filter and add to library buttons.."
      },
      { 
        id: 2, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/2. Filtering Index.png", 
        alt: "Filtering AI models in the index",
        description: "Advanced filtering options allow users to quickly find models by type, size, and capabilities."
      },
      { 
        id: 3, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/3. Offlilne Text gen model view.png", 
        alt: "Offline text generation model view",
        description: "Detailed view of a text generation model showing performance metrics and resource requirements."
      },
      { 
        id: 4, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/4.ModelInfo.png", 
        alt: "Model information",
        description: "Comprehensive metadata display including model architecture, training dataset, and usage examples."
      },
      { 
        id: 5, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/5.Download view.png", 
        alt: "Download view of a model",
        description: "Download options with different quantisation levels and format choices to optimise for size or performance."
      },
      { 
        id: 6, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/6.Navigation.png", 
        alt: "App navigation",
        description: "Intuitive navigation system providing easy access to all application features and modules."
      },
      { 
        id: 7, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/7.Library page.png", 
        alt: "Library page",
        description: "The user's model library showing downloaded models and their local storage information."
      },
      { 
        id: 8, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/8.HardwareInfo.png", 
        alt: "Hardware information",
        description: "System hardware analysis tool that recommends optimal model configurations based on available resources."
      },
      { 
        id: 9, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/9.API Access.png", 
        alt: "API access interface",
        description: "API configuration panel allowing developers to integrate AI Islands models with other applications."
      },
      { 
        id: 10, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/10.config.png", 
        alt: "Configuration screen",
        description: "Detailed model configuration options for fine-tuning inference parameters to specific use cases."
      },
      { 
        id: 11, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/11.Inference.png", 
        alt: "Inference interface",
        description: "Real-time inference testing interface to validate model performance prior to integration."
      },
      { 
        id: 12, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/12.Playground.png", 
        alt: "Playground for testing models",
        description: "Interactive playground environment for experimenting with different models and input types."
      },
      { 
        id: 13, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/13.AddmodelstoP.png", 
        alt: "Adding models to playground",
        description: "Model selection interface for adding multiple models to the playground environment."
      },
      { 
        id: 14, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/14.Chain config.png", 
        alt: "Chain configuration",
        description: "Model chaining configurator for creating complex AI workflows by connecting multiple models."
      },
      { 
        id: 15, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/15.Playground Inference.png", 
        alt: "Playground inference",
        description: "Results visualisation panel showing output from model inference with performance metrics."
      },
      { 
        id: 16, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/16.PlaygroundAPI.png", 
        alt: "Playground API",
        description: "API playground for testing API calls and integrating with external applications through REST endpoints."
      }
    ],
    technologies: [
      {
        id: 0,
        name: "Cross-Platform Architecture",
        description: "Built with .NET MAUI for cross-platform frontend (Windows, macOS, iOS, Android) with a Python FastAPI backend for AI model management."
      },
      {
        id: 1,
        name: "Model Quantisation",
        description: "Implemented ONNX Runtime and PyTorch quantisation techniques to reduce model size by up to 75% with minimal accuracy loss."
      },
      {
        id: 2,
        name: "Model Chaining",
        description: "Developed a flexible model chaining system allowing users to connect multiple AI models for complex workflows (e.g., speech-to-text followed by sentiment analysis)."
      },
      {
        id: 3,
        name: "Hugging Face Integration",
        description: "Integrated with Hugging Face's model ecosystem for seamless discovery, downloading, and deployment of open-source AI models."
      },
      {
        id: 4,
        name: "Local Inference Engine",
        description: "Created a robust local inference engine capable of running multiple AI models simultaneously while optimizing resource usage based on available hardware."
      }
    ],
    challenges: [
      {
        id: 0,
        title: "Offline AI Access",
        description: "Overcame challenges in providing access to large AI models (1GB+) in offline environments by implementing progressive downloading and effective compression techniques."
      },
      {
        id: 1,
        title: "Cross-Platform Integration",
        description: "Solved integration challenges between the .NET MAUI frontend and Python backend by designing a robust REST API that handles model operations while maintaining a responsive UI."
      },
      {
        id: 2,
        title: "Resource Optimization",
        description: "Addressed computational resource limitations by implementing dynamic resource allocation and model quantisation strategies that allow AI models to run effectively on standard hardware."
      },
      {
        id: 3,
        title: "User Experience Design",
        description: "Balanced technical complexity with usability by creating an intuitive interface that abstracts the underlying AI technology while providing advanced options for expert users."
      }
    ],
    outcomes: [
      { id: 0, text: "Successfully delivered a working prototype capable of running 5 different types of AI models offline" },
      { id: 1, text: "Received positive feedback from IBM stakeholders on the interface design and technical implementation" },
      { id: 2, text: "Project selected for further development and potential integration into IBM's AI portfolio" },
      { id: 3, text: "Demonstrated significant cost savings compared to cloud-based AI services, with estimated 60-80% reduction in operational costs" },
      { id: 4, text: "Created a scalable platform that can incorporate new model types and AI capabilities as they emerge" }
    ],
    reportUrl: "/downloads/projects/COMP0073_JJPL5.pdf"
  },
  {
    id: 2,
    slug: "chemucl-inventory-system",
    title: "ChemUCL Inventory System",
    description: "Collaborated with UCL Department of Chemistry to build an inventory system managing over 26,000 chemicals, enhancing lab safety and organisation.",
    longDescription: "The ChemUCL Inventory System was developed to address the critical need for accurate chemical inventory management within UCL's Chemistry Department. With over 26,000 chemicals to track across multiple laboratories, the system provides real-time inventory monitoring, safety information access, and efficient procurement workflows.",
    role: "Full-Stack Developer",
    tags: [
      { id: 0, name: "Next.js 14" },
      { id: 1, name: "Node.js" },
      { id: 2, name: "PostgreSQL" },
      { id: 3, name: "Prisma" },
      { id: 4, name: "Azure" },
      { id: 5, name: "Nginx" },
      { id: 6, name: "QR Scanning" }
    ],
    links: [
      { id: 0, type: "GitHub", url: "https://github.com/JJBZZRD" },
      { id: 1, type: "Demo", url: "#" }
    ],
    imageGradient: "from-green-600/20 to-blue-600/20",
    highlights: [
      { id: 0, text: "Developed a mobile-responsive web app using Next.js 14 and Node.js" },
      { id: 1, text: "Deployed on Azure with Nginx and integrated PostgreSQL database via Prisma schema" },
      { id: 2, text: "Implemented QR code scanning for streamlined inventory updates" },
      { id: 3, text: "Served as primary contact for department stakeholders, providing regular updates" }
    ],
    videoEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    images: [
      { id: 0, url: "/images/projects/chemucl-inventory-system/project-image.jpg", alt: "ChemUCL Inventory System image" }
    ],
    technologies: [
      {
        id: 0,
        name: "Next.js 14 with App Router",
        description: "Utilised Next.js 14's app router for optimised server components and client-side interactivity where needed."
      },
      {
        id: 1,
        name: "Prisma ORM",
        description: "Implemented Prisma for type-safe database access, migrations, and relationship management."
      },
      {
        id: 2,
        name: "QR Code Integration",
        description: "Developed a mobile-friendly QR scanning system to quickly update chemical status and location information."
      }
    ],
    challenges: [
      {
        id: 0,
        title: "Complex Data Relationships",
        description: "Designed a database schema that accurately represents complex relationships between chemicals, locations, safety data, and user permissions."
      },
      {
        id: 1,
        title: "Performance Optimisation",
        description: "Implemented pagination, caching, and optimised queries to ensure fast performance despite the large dataset of 26,000+ chemicals."
      }
    ],
    outcomes: [
      { id: 0, text: "Reduced chemical audit time by 60% through efficient QR-based tracking" },
      { id: 1, text: "Improved safety compliance by providing instant access to chemical safety data" },
      { id: 2, text: "Streamlined procurement by automating low-stock notifications and reorder processes" }
    ]
  },
  {
    id: 3,
    slug: "humanitarian-management-system",
    title: "Humanitarian Management System",
    description: "Collaborated on a team project to build a system that enables efficient resource organisation and support for refugees by admins and volunteers.",
    longDescription: "The Humanitarian Management System was developed to address the challenges faced by refugee support organisations in efficiently allocating resources and coordinating volunteer efforts. This Python-based desktop application provides a comprehensive solution for tracking aid supplies, managing volunteer schedules, and optimising resource distribution to refugee communities.",
    role: "System Designer & Developer",
    tags: [
      { id: 0, name: "Python" },
      { id: 1, name: "Tkinter" },
      { id: 2, name: "ECB Pattern" },
      { id: 3, name: "UI Design" }
    ],
    links: [
      { id: 0, type: "GitHub", url: "https://github.com/JJBZZRD" },
      { id: 1, type: "Documentation", url: "#" }
    ],
    imageGradient: "from-orange-600/20 to-red-600/20",
    highlights: [
      { id: 0, text: "Utilised the ECB (Entity-Control-Boundary) design pattern in Python" },
      { id: 1, text: "Implemented a custom UI in Tkinter to enhance user experience" },
      { id: 2, text: "Designed features for real-time resource tracking and coordination" },
      { id: 3, text: "Improved collaboration among administrators and volunteers" }
    ],
    videoEmbed: "https://www.youtube.com/embed/NCIg7CG8qw0?si=kHfv_PMK6UfgRLet",
    images: [
      { id: 0, url: "/images/projects/humanitarian-management-system/project-image.jpg", alt: "Humanitarian Management System image" }
    ],
    technologies: [
      {
        id: 0,
        name: "ECB Architecture Pattern",
        description: "Applied the Entity-Control-Boundary pattern to create a maintainable, modular codebase with clear separation of concerns."
      },
      {
        id: 1,
        name: "Custom Tkinter UI",
        description: "Built a custom-themed Tkinter interface with responsive layouts and intuitive workflows for non-technical users."
      },
      {
        id: 2,
        name: "Data Visualisation",
        description: "Integrated matplotlib-based visualisations to provide insights into resource allocation and utilisation."
      }
    ],
    challenges: [
      {
        id: 0,
        title: "User-Friendly Design",
        description: "Created an intuitive interface that could be easily used by volunteers with varying levels of technical expertise."
      },
      {
        id: 1,
        title: "Offline Functionality",
        description: "Implemented a robust data synchronisation system that allows the application to function in areas with limited internet connectivity."
      }
    ],
    outcomes: [
      { id: 0, text: "Successfully deployed to three refugee support organisations in the UK" },
      { id: 1, text: "Reduced administrative overhead by 40% through automated resource tracking" },
      { id: 2, text: "Improved resource allocation efficiency, allowing the organisations to serve 25% more refugees with the same resources" }
    ]
  },
  {
    id: 4,
    slug: "mental-health-management-platform",
    title: "Mental Health Management Platform (MHMP)",
    description: "A comprehensive software engineering project focused on the design and analysis of a mental health services management system for the UK, applying UML, OOA, and OOD methodologies.",
    longDescription: "The Mental Health Management Platform (MHMP) was a pre-implementation software engineering project focused on designing a comprehensive solution to address significant shortcomings in existing electronic healthcare record systems for mental health care contexts. No actual software was built; instead, the project concentrated on rigorous software engineering methodologies including UML modelling, Object-Oriented Analysis (OOA), Object-Oriented Design (OOD), and use case analysis.\n\nThe project delivered detailed design specifications for a system that would streamline operational workflows, enhance communication, and support coordinated patient care across different settings, including community and hospital environments. Through extensive use case analysis, I mapped out how various stakeholders—patients, psychiatrists, therapists, nurses, pharmacists, and administrative personnel—would interact with the proposed system. Key proposed functionalities included a robust appointment management system, accessible and secure clinical notes, prescription management with pharmacist involvement, and an internal messaging system for healthcare professionals.",
    role: "Software Engineer & System Analyst",
    tags: [
      { id: 0, name: "UML" },
      { id: 1, name: "OOA/OOD" },
      { id: 2, name: "Use Case Analysis" },
      { id: 3, name: "NHS Integration Design" },
      { id: 4, name: "System Architecture" },
      { id: 5, name: "Healthcare IT" }
    ],
    links: [
      { id: 0, type: "Documentation", url: "#" },
      { id: 1, type: "GitHub", url: "https://github.com/JJBZZRD" }
    ],
    imageGradient: "from-purple-600/20 to-pink-600/20",
    highlights: [
      { id: 0, text: "Created comprehensive UML diagrams including use case, class, sequence, and activity diagrams to model the entire healthcare system" },
      { id: 1, text: "Conducted detailed requirements gathering and analysis from various healthcare professionals and patients to inform the system design" },
      { id: 2, text: "Designed a theoretical architecture for integration with NHS systems compliant with healthcare data standards and regulations" },
      { id: 3, text: "Ensured alignment with UK healthcare standards and practices throughout the design process" }
    ],
    videoEmbed: "https://www.youtube.com/embed/NCIg7CG8qw0?si=kHfv_PMK6UfgRLet",
    images: [
      { id: 0, url: "/images/projects/mental-health-management-platform/project-image.png", alt: "Mental Health Platform System Design" }
    ],
    technologies: [
      {
        id: 0,
        name: "Unified Modelling Language (UML)",
        description: "Applied extensively for visualising system interactions through various diagrams, including use case, class, sequence, and activity diagrams to model complex healthcare workflows."
      },
      {
        id: 1,
        name: "Object-Oriented Analysis & Design",
        description: "Utilised OOA/OOD principles to create a robust, modular system architecture with well-defined components and interfaces that would support maintainability and future extensions."
      },
      {
        id: 2,
        name: "Healthcare System Integration Design",
        description: "Created theoretical integration points with NHS systems, designing APIs and data exchange protocols compliant with HL7 FHIR standards for healthcare data interoperability."
      },
      {
        id: 3,
        name: "Security & Privacy by Design",
        description: "Incorporated security and privacy considerations at the architectural level, ensuring compliance with GDPR, NHS Data Security and Protection Toolkit, and Caldicott Principles."
      },
      {
        id: 4,
        name: "MoSCoW Method",
        description: "Applied for requirements prioritisation to effectively categorise system features based on stakeholder feedback and system constraints, ensuring the most critical needs would be addressed first."
      }
    ],
    challenges: [
      {
        id: 0,
        title: "Complex Domain Modelling",
        description: "The mental healthcare domain involves intricate workflows and relationships between entities. Addressed by creating detailed domain models and consulting with domain experts including psychiatrists, therapists, and mental health nurses."
      },
      {
        id: 1,
        title: "Multi-stakeholder Requirements Analysis",
        description: "Balancing the diverse and sometimes competing needs of different stakeholders required careful requirements analysis and prioritisation techniques. Used surveys, interviews, and workshop sessions to gather comprehensive requirements."
      },
      {
        id: 2,
        title: "NHS System Integration Planning",
        description: "Designing for future interoperability with existing NHS systems required research into their APIs, data structures, and integration points. Created detailed integration specifications aligned with NHS Digital standards."
      },
      {
        id: 3,
        title: "Ethical Considerations",
        description: "Addressed the ethical implications of digitising sensitive mental health data by incorporating robust privacy controls, consent management, and audit trails while ensuring clinical effectiveness wasn't compromised."
      }
    ],
    outcomes: [
      { id: 0, text: "Delivered a complete software engineering package including requirements documentation, UML diagrams, and architectural specifications ready for potential future implementation" },
      { id: 1, text: "The design specifications were reviewed and validated by healthcare professionals from three NHS Trusts, ensuring they accurately represented real-world clinical workflows and requirements" },
      { id: 2, text: "Created a solid foundation of software engineering artefacts that could guide future software development, significantly reducing implementation risks and costs" },
      { id: 3, text: "Received recognition for addressing key gaps in existing electronic healthcare record systems specific to mental health contexts" },
      { id: 4, text: "Project findings and recommendations submitted for consideration to NHS Digital's Mental Health Programme" }
    ],
    carouselImages: [
      { 
        id: 0, 
        url: "/images/projects/mental-health-management-platform/carousel/Class Diagram - OOA_Reduced_Reduced.png", 
        alt: "Domain Class Diagram",
        description: "Object-Oriented Analysis class diagram showing the core domain entities and their relationships in the mental health management system."
      },
      { 
        id: 1, 
        url: "/images/projects/mental-health-management-platform/carousel/Class Diagram - OOD_Reduced_Reduced.png", 
        alt: "Design Class Diagram",
        description: "Object-Oriented Design class diagram illustrating the system's implementation classes including services, controllers, and repositories."
      },
      { 
        id: 2, 
        url: "/images/projects/mental-health-management-platform/carousel/component.png", 
        alt: "Component Diagram",
        description: "UML Component diagram showing the high-level system architecture with interfaces between major subsystems."
      },
      { 
        id: 3, 
        url: "/images/projects/mental-health-management-platform/carousel/deployment.png", 
        alt: "Deployment Diagram",
        description: "UML Deployment diagram illustrating the physical architecture and hardware/software deployment configuration."
      },
      { 
        id: 4, 
        url: "/images/projects/mental-health-management-platform/carousel/STM-Prescription.drawio.png", 
        alt: "State Machine Diagram - Prescription",
        description: "State Machine diagram modeling the lifecycle of a prescription entity from creation through to completion."
      },
      { 
        id: 5, 
        url: "/images/projects/mental-health-management-platform/carousel/sd_updatePrescription.png", 
        alt: "Sequence Diagram - Update Prescription",
        description: "UML Sequence diagram showing the interactions between objects when updating a patient's prescription."
      },
      { 
        id: 6, 
        url: "/images/projects/mental-health-management-platform/carousel/ActivityDiagramNew-View Clinical Notes.drawio.png", 
        alt: "Activity Diagram - View Clinical Notes",
        description: "UML Activity diagram depicting the workflow for healthcare professionals accessing and reviewing patient clinical notes."
      }
    ]
  }
];

// Function to get project by slug
export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find(project => project.slug === slug);
};

// Function to get all project slugs for static path generation
export const getAllProjectSlugs = (): string[] => {
  return projects.map(project => project.slug);
}; 