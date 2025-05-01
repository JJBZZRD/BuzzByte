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
    description: "Developed a cost-effective, user-friendly offline AI platform enabling local management and use of open-source Generative AI models, with a focus on text generation and chatbot functionality for small businesses and educational institutions.",
    longDescription: "The IBM-UCL AI Islands project was a collaborative initiative designed to lower the barriers to AI adoption for smaller businesses and educational institutions. The project delivered a scalable, offline AI management platform that prioritised data privacy, affordability, and ease of integration. The system featured an intuitive interface for managing and running open-source Generative AI models—particularly for text generation and chatbot use cases—ensuring users could access powerful AI capabilities without relying on cloud infrastructure.\n\nDeveloped by a four-member team, the platform compiled an extensive index of offline AI models spanning natural language, visual, and audio domains, with optional integration of IBM Watson's online services for advanced tasks. The backend, built with Python and FastAPI, enabled seamless downloading, configuration, and management of models from the Hugging Face ecosystem. Key features included a model experimentation playground, model chaining for complex workflows, robust API integration for external systems, and comprehensive local data management to guarantee privacy and security.\n\nThrough extensive testing and user feedback, the project demonstrated its effectiveness in making advanced AI tools accessible to a wide range of users, from classrooms to small enterprises. The outcome was a user-centric, adaptable platform that significantly reduced the technical and financial challenges typically associated with AI implementation.",
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
        description: "Advanced filtering options allow users to quickly find models by type and offline status."
      },
      { 
        id: 3, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/3. Offlilne Text gen model view.png", 
        alt: "Offline text generation model view",
        description: "The AI Index showing all available offline text-generation models."
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
        description: "Model download terminal showing the model download progress."
      },
      { 
        id: 6, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/6.Navigation.png", 
        alt: "App navigation",
        description: "Side navigation bar, providing access to the AI Index, Playground, and Library."
      },
      { 
        id: 7, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/7.Library page.png", 
        alt: "Library page",
        description: "The Model Library page, showing all downloaded/added models and actions to manage them."
      },
      { 
        id: 8, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/8.HardwareInfo.png", 
        alt: "Hardware information",
        description: "System hardware usage for a loaded model."
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
        description: "Detailed model configuration options including quantisation and inference parameters."
      },
      { 
        id: 11, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/11.Inference.png", 
        alt: "Inference interface",
        description: "Built-in inference page, allowing direct model testing."
      },
      { 
        id: 12, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/12.Playground.png", 
        alt: "Playground for testing models",
        description: "Playground page, displaying a list of available playgrounds."
      },
      { 
        id: 13, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/13.AddmodelstoP.png", 
        alt: "Adding models to playground",
        description: "Model manager page, allowing users to add/remove models from the playground."
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
        description: "Inference page, showing the results of inferencing a playground chain."
      },
      { 
        id: 16, 
        url: "/images/projects/ibm-ucl-ai-islands/carousel/16.PlaygroundAPI.png", 
        alt: "Playground API",
        description: "Playground API access for integrating with external applications through REST endpoints."
      }
    ],
    technologies: [
      {
        id: 0,
        name: "Python & FastAPI Backend",
        description: "Developed a robust backend using Python and FastAPI, enabling fast, scalable, and user-friendly API interactions for managing AI models."
      },
      {
        id: 1,
        name: "Hugging Face Transformers Integration",
        description: "Integrated the Hugging Face Transformers library to facilitate efficient downloading, configuration, and management of open-source Generative AI models."
      },
      {
        id: 2,
        name: "Local Data Management",
        description: "Implemented comprehensive local data management, ensuring all AI models and user data remain offline to guarantee privacy and security."
      },
      {
        id: 3,
        name: "Model Chaining & Playground",
        description: "Provided a flexible playground and model chaining system, allowing users to experiment with and combine multiple AI models for customized workflows."
      },
      {
        id: 4,
        name: "IBM Watson Services (Optional)",
        description: "Enabled optional integration with IBM Watson's online services to complement offline models for advanced or computationally intensive tasks."
      }
    ],
    challenges: [
      {
        id: 0,
        title: "Infrastructure Costs",
        description: "Addressed high infrastructure costs by developing an efficient offline AI system capable of running on standard hardware, eliminating the need for expensive cloud resources."
      },
      {
        id: 1,
        title: "Technical Complexity",
        description: "Overcame the complexity of AI model integration and management by designing an intuitive user interface and providing comprehensive API endpoints for seamless external integration."
      },
      {
        id: 2,
        title: "Data Privacy",
        description: "Ensured user data privacy and security by keeping all AI models and related data entirely offline, giving users full control over their information."
      }
    ],
    outcomes: [
      { id: 0, text: "Delivered a scalable, user-friendly AI management platform that improves accessibility for educational institutions and small businesses." },
      { id: 1, text: "Received positive feedback from stakeholders, confirming the platform's value in reducing technical and financial barriers to AI adoption." },
      { id: 2, text: "Demonstrated the system's adaptability and potential for integration into broader AI portfolios and diverse user environments." }
    ],
    reportUrl: "/downloads/projects/COMP0073_JJPL5.pdf"
  },
  {
    id: 2,
    slug: "mental-health-management-platform",
    title: "Mental Health Management Platform (MHMP)",
    description: "A comprehensive software engineering project focused on the design and analysis of a mental health services management system for the UK, applying UML, OOA, and OOD methodologies.",
    longDescription: "The Mental Health Management Platform (MHMP) was a pre-implementation software engineering project focused on designing a comprehensive solution to address significant shortcomings in existing electronic healthcare record systems for mental health care contexts. The project concentrated on rigorous software engineering methodologies including UML modelling, Object-Oriented Analysis (OOA), Object-Oriented Design (OOD), and use case analysis.\n\nThe project delivered detailed design specifications for a system that would streamline operational workflows, enhance communication, and support coordinated patient care across different settings, including community and hospital environments. Through extensive use case analysis, I mapped out how various stakeholders (patients, psychiatrists, therapists, nurses, pharmacists, and administrative personnel) would interact with the proposed system. Key proposed functionalities included a robust appointment management system, accessible and secure clinical notes, prescription management with pharmacist involvement, and an internal messaging system for healthcare professionals.",
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
      { id: 0, type: "View Report", url: "/downloads/projects/COMP0070_Software_Engineering_Project .pdf" }
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
        description: "Incorporated security and privacy considerations at the architectural level, ensuring compliance with GDPR and NHS Data Security."
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
      { id: 1, text: "The design specifications were reviewed and validated by healthcare professionals, ensuring they accurately represented real-world clinical workflows and requirements" },
      { id: 2, text: "Created a solid foundation of software engineering artefacts that could guide future software development, significantly reducing implementation risks and costs" },
      { id: 3, text: "Received recognition for addressing key gaps in existing electronic healthcare record systems specific to mental health contexts" },
      ],
    reportUrl: "/downloads/projects/COMP0070_Software_Engineering_Project.pdf",
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
  },
  {
    id: 3,
    slug: "chemucl-inventory-system",
    title: "ChemUCL Inventory System",
    description: "Developed a dedicated chemical inventory management web application for UCL Chemistry Department to track over 26,000 chemicals, implementing QR code technology for streamlined auditing and location tracking.",
    longDescription: "The ChemUCL project developed a dedicated chemical inventory management web application tailored specifically for the UCL Chemistry Department. The goal was to regain control over the inventory data previously hosted externally in Quartzy, improve the efficiency of chemical tracking and auditing processes, and implement QR code technology for easier management.\n\nChemUCL was created to address critical issues such as high costs, data privacy, and inefficient item tracking. The application integrates QR code functionality for streamlined chemical auditing and location tracking, enhancing both usability and efficiency.\n\nThe development involved comprehensive requirements gathering, system design, implementation, testing, and deployment stages. ChemUCL supports multiple user roles including Administrators, Staff, Temporary Staff, and Research Students, each with defined access levels and functionalities, particularly concerning the management and visibility of restricted chemicals.\n\nKey features include chemical inventory lists, location management, user and group administration, QR code scanning, and system logging for regulatory compliance reporting. The application was built using robust and scalable technologies ensuring performance, reliability, and maintainability.",
    role: "Full-Stack Developer",
    tags: [
      { id: 0, name: "Next.js 14" },
      { id: 1, name: "Node.js" },
      { id: 2, name: "PostgreSQL" },
      { id: 3, name: "Prisma" },
      { id: 4, name: "Azure" },
      { id: 5, name: "React" },
      { id: 6, name: "Material UI" },
      { id: 7, name: "QR Code Integration" }
    ],
    links: [
    ],
    imageGradient: "from-green-600/20 to-blue-600/20",
    highlights: [
      { id: 0, text: "Developed a responsive web app using Next.js, Node.js, and React with Material UI" },
      { id: 1, text: "Implemented a PostgreSQL database with Prisma ORM for managing 26,000+ chemicals" },
      { id: 2, text: "Created QR code scanning functionality for streamlined inventory auditing and tracking" },
      { id: 3, text: "Deployed on Azure cloud infrastructure ensuring security and scalability" }
    ],
    images: [
      { id: 0, url: "/images/projects/chemucl-inventory-system/project-image.png", alt: "ChemUCL Inventory System image" }
    ],
    technologies: [
      {
        id: 0,
        name: "Next.js 14 with React",
        description: "Utilized Next.js 14 and React with Material UI to create an intuitive, responsive, and visually coherent user interface, improving overall user experience."
      },
      {
        id: 1,
        name: "PostgreSQL with Prisma ORM",
        description: "Implemented a robust relational database with Prisma for type-safe database access, effectively managing the extensive chemical inventory data with complex relationships."
      },
      {
        id: 2,
        name: "QR Code Integration",
        description: "Developed a flexible QR code system allowing codes to be linked dynamically with multiple types of data, such as chemicals and locations, enabling easy identification and tracking."
      },
      {
        id: 3,
        name: "Azure Cloud Infrastructure",
        description: "Deployed on Azure cloud services to ensure a secure and scalable hosting environment, facilitating smooth operation and reliable access to the inventory system."
      }
    ],
    challenges: [
      {
        id: 0,
        title: "Integration with Previous Dataset",
        description: "Designed an effective migration strategy to import existing chemical data from Quartzy, ensuring data integrity and consistency when transitioning to the new system."
      },
      {
        id: 1,
        title: "Data Schema for Multiuse of QR Codes",
        description: "Implemented a flexible schema allowing QR codes to be linked dynamically with multiple types of data, such as chemicals and locations, creating a versatile tracking system."
      },
      {
        id: 2,
        title: "Adapting to Existing Technician Workflows",
        description: "Conducted extensive user consultation and iterative design cycles, ensuring that the application streamlined and enhanced existing workflows rather than disrupting them."
      },
      {
        id: 3,
        title: "Performance Optimization",
        description: "Implemented pagination, caching, and optimized queries to ensure fast performance despite the large dataset of 26,000+ chemicals across multiple laboratories."
      }
    ],
    outcomes: [
      { id: 0, text: "Successfully created a secure and user-friendly inventory management solution, giving the department control over their chemical data" },
      { id: 2, text: "Enhanced regulatory compliance through comprehensive system logging and improved restricted chemical management" },
      { id: 3, text: "Provided multi-role access control ensuring appropriate data visibility based on user responsibilities" }
    ]
  },
  {
    id: 4,
    slug: "humanitarian-management-system",
    title: "Humanitarian Management System",
    description: "Developed a Python-based application with a Tkinter interface to support humanitarian agencies in efficiently managing refugee data, resource allocation, and volunteer coordination during crisis situations.",
    longDescription: "The Humanitarian Management System was developed as a Python-based application with a user-friendly graphical interface using Tkinter, designed to support humanitarian agencies during crisis situations. Its primary objective was to efficiently manage refugee data, resource allocation, and volunteer coordination across multiple refugee camps.\n\nThe project involved developing a robust and intuitive system enabling a humanitarian agency to effectively manage and distribute essential resources such as food packets and medical supplies. It supported two types of users: administrators and humanitarian volunteers, each with specific roles and permissions within the system.\n\nAdministrators could create, manage, and conclude humanitarian plans, allocate resources based on real-time camp populations, and manage volunteer accounts (activate, deactivate, or delete). Volunteers were empowered to manage refugee data, including creating refugee profiles and updating camp information, thus ensuring accurate and timely distribution of aid.\n\nEnhancing the core functionalities, the application included comprehensive camp statistics, detailed audit logs for activity tracking, and robust data export functionalities. The use of a Tkinter interface significantly improved data visualisation, usability, and overall user experience.\n\nThe system prioritised data integrity and persistence, maintaining realistic and accurate data across sessions, thereby facilitating continuous and reliable operation during emergencies.",
    role: "System Designer & Developer",
    tags: [
      { id: 0, name: "Python" },
      { id: 1, name: "Tkinter" },
      { id: 2, name: "ECB Pattern" },
      { id: 3, name: "UI Design" },
      { id: 4, name: "Data Persistence" },
      { id: 5, name: "Access Control" }
    ],
    links: [
      { id: 0, type: "GitHub", url: "https://github.com/JJBZZRD/Introductory-Programming" },
    ],
    imageGradient: "from-orange-600/20 to-red-600/20",
    highlights: [
      { id: 0, text: "Utilised the ECB (Entity-Control-Boundary) design pattern in Python for a maintainable architecture" },
      { id: 1, text: "Implemented a custom Tkinter UI with enhanced data visualisation capabilities" },
      { id: 2, text: "Designed multi-role access control with distinct permission levels for administrators and volunteers" },
      { id: 3, text: "Created real-time resource allocation and tracking features for dynamic distribution based on needs" }
    ],
    images: [
      { id: 0, url: "/images/projects/humanitarian-management-system/project-image.png", alt: "Humanitarian Management System image" }
    ],
    carouselImages: [
      { 
        id: 0, 
        url: "/images/projects/humanitarian-management-system/carousel/1. Login.png", 
        alt: "Login Screen",
        description: "Secure login interface for administrators and volunteers with role-based access control."
      },
      { 
        id: 1, 
        url: "/images/projects/humanitarian-management-system/carousel/2. Admin_panel.png", 
        alt: "Admin Dashboard",
        description: "Administrative dashboard providing quick access to all system functions and real-time statistics."
      },
      { 
        id: 2, 
        url: "/images/projects/humanitarian-management-system/carousel/3. Manage_Plan.png", 
        alt: "Resource Management",
        description: "Resource allocation planning interface allowing administrators to organise aid distribution efficiently."
      },
      { 
        id: 3, 
        url: "/images/projects/humanitarian-management-system/carousel/4. Manage_Volunteers.png", 
        alt: "Volunteer Management",
        description: "Comprehensive volunteer management screen for tracking availability, skills, and assignments."
      },
      { 
        id: 4, 
        url: "/images/projects/humanitarian-management-system/carousel/5. Edit_Volunteer.png", 
        alt: "Edit Volunteer Profile",
        description: "Interface for updating volunteer information, qualifications, and scheduling preferences."
      },
      { 
        id: 5, 
        url: "/images/projects/humanitarian-management-system/carousel/6. Audit_Logs.png", 
        alt: "System Audit Logs",
        description: "Detailed audit logs providing complete traceability for all system actions and resource movements."
      },
      { 
        id: 6, 
        url: "/images/projects/humanitarian-management-system/carousel/6. View_Stats.png", 
        alt: "Statistics Dashboard",
        description: "Data visualisation tools providing insights into resource utilisation and operational efficiency."
      }
    ],
    technologies: [
      {
        id: 0,
        name: "ECB Architecture Pattern",
        description: "Applied the Entity-Control-Boundary pattern to create a maintainable, modular codebase with clear separation of concerns, facilitating future enhancements and ensuring code quality."
      },
      {
        id: 1,
        name: "Tkinter UI Framework",
        description: "Built a custom-themed Tkinter interface with responsive layouts and intuitive workflows for humanitarian workers, enhancing data visualisation and accessibility even in high-pressure situations."
      },
      {
        id: 2,
        name: "Python Data Persistence",
        description: "Implemented robust data persistence mechanisms using built-in Python libraries, ensuring data integrity and reliability across multiple application sessions during crisis management."
      }
    ],
    challenges: [
      {
        id: 0,
        title: "Data Persistence and Integrity",
        description: "Addressed by implementing robust validation mechanisms and persistent storage solutions, ensuring data accuracy and reliability over multiple sessions in potentially unstable environments."
      },
      {
        id: 1,
        title: "Multi-Role User Access",
        description: "Solved by designing clear and distinct permission levels and access rights for administrators and volunteers, maintaining operational security and data privacy while supporting diverse workflow needs."
      },
      {
        id: 2,
        title: "Efficient Resource Allocation",
        description: "Managed through real-time tracking and dynamic allocation features, allowing resources to be quickly redistributed based on changing camp populations and needs during humanitarian missions."
      },
      {
        id: 3,
        title: "Simplified Refugee Management",
        description: "Overcame by designing a streamlined interface and easy-to-use data entry procedures, accommodating quick updates even under stressful conditions with minimal training requirements."
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