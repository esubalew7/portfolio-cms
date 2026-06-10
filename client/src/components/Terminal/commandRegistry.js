/**
 * Command Registry
 * Centralized command configuration with aliases, metadata, and dynamic responses
 */

export const COMMAND_REGISTRY = {
  // Command aliases mapping
  aliases: {
    h: "help",
    "?": "help",
    cls: "clear",
    rm: "clear",
    exp: "experience",
    edu: "education",
    cv: "resume",
    tech: "techstack",
    skills: "techstack",
    proj: "projects",
    gh: "github",
    in: "linkedin",
    mail: "contact",
    email: "contact",
    whoami: "about",
    info: "about",
  },

  // Command definitions
  commands: {
    help: {
      description: "Show all available commands",
      metadata: {
        category: "System",
        animated: true,
      },
      response: (args, input) => {
        return `
     AVAILABLE COMMANDS                

INFORMATION  
 about, whoami, info      → Learn about me              
 experience, exp          → My professional experience  
 education, edu           → My educational background   
 techstack, tech, skills  → Technical skills & tools    

PORTFOLIO & LINKS 
 projects, proj           → View my projects            
 resume, cv               → Download my CV/Resume       
 github, gh               → Visit GitHub profile        
 linkedin, in             → Visit LinkedIn profile      
 contact, mail, email     → Contact information         

SYSTEM 
 help, h, ?               → Show this help message       
 clear, cls, rm           → Clear terminal history    

Tip: Type any command to execute it. Use Arrow Keys to 
   navigate through your command history.
        `;
      },
    },

    about: {
      description: "Information about me",
      metadata: {
        category: "Information",
        animated: true,
      },
      response: `

                      ABOUT ME                            

Hello! I'm a Full Stack Developer with a passion for creating
exceptional digital experiences. I love building performant,
accessible, and beautifully designed web applications.

What I Do:
   • Design & build responsive web interfaces
   • Create scalable backend systems
   • Optimize performance & user experience

My Approach:
   • Code with clean, maintainable architecture
   • Focus on user experience & accessibility
   • Embrace new technologies & best practices
   • Collaborate effectively with teams
   • Document code like it's a love letter

Current Interests:
   • Advanced React patterns & performance
   • Cloud infrastructure & DevOps
   • AI/ML integration in web apps
   • Accessibility & inclusive design

Let's build something amazing together! 
        `,
    },

    experience: {
      description: "My professional experience",
      metadata: {
        category: "Information",
        animated: true,
      },
      response: `

              PROFESSIONAL EXPERIENCE                        

Full Stack Developer internship ─  Askuala Link (present) 

        `,
    },

    education: {
      description: "My educational background",
      metadata: {
        category: "Information",
        animated: true,
      },
      response: `

                    EDUCATIONAL BACKGROUND                  

Computer Science Student  → at Bahir Dar University  (2024 - Present) 

Notable Coursework  :
• Data Structures & Algorithms
• Web Development & Frameworks
• Mobile Application Development
• Database Design & Management
• Software Engineering Principles
• Cloud Computing & Distributed Systems

Certifications
 • Web Development Certificate @ coddy.tech
 • Advanced Programming (React)  @ BiT Career Development Center
 • CCNA: Introduction to Networks @ Cisco Networking Academy         

        `,
    },

    techstack: {
      description: "View technical skills and tools",
      metadata: {
        category: "Information",
        animated: true,
      },
      response: `

                    TECHNICAL SKILLS                        

FRONTEND 
  React, Tailwind CSS, Bootstrap
  HTML, CSS, JavaScript 
                                   
BACKEND 
   Node.js & Express

Mobile App
  Flutter

DATABASES 
   MongoDB                            
   MySQL                            
   Firebase & Firestore                          

TOOLS & PLATFORMS
   Git & GitHub   
   Postman 
   Vercel & Render Deployment  
        `,
    },

    projects: {
      description: "View my portfolio projects",
      metadata: {
        category: "Portfolio",
        animated: true,
      },
      response: `

                FEATURED PROJECTS                       

Portfolio Website (MERN Stack) 
 Modern, interactive developer portfolio with:             
 • Interactive terminal component                         
 • Smooth animations & glassmorphism effects 
 • Admin dashboard for project & message management
 • Dark mode with theme switching                         
 • Project showcase with filters                                          
 • Tech: React, Node.js, MongoDB, Tailwind, Framer Motion

Rent Housing Platform
 A full-stack application that connects tenants with landlords 
 • featuring secure authentication 
 • property listings 
 • advanced search and filtering for seamless rental experiences
 • Tech: React, Express, MongoDB, TailwindCSS  

Movie Trailers Website
  React-based movie browsing app integrated with TMDB API
  • allowing users to explore trending films and watch trailers in a dynamic interface.                           
  • Tech: React             

College Website 
 A responsive college website built  
 • featuring clean navigation and structured pages for academic information and campus content.
 • Tech: HTML, CSS, JavaScript ,Node.js & Express

 All projects feature:
   ✓ Responsive design (mobile, tablet, desktop)
   ✓ Performance optimized
   ✓ Accessibility compliant
   ✓ Well-documented code
   ✓ Git version control

Type 'github' to see more projects on GitHub!
        `,
    },

    resume: {
      description: "Download my resume",
      metadata: {
        category: "Portfolio",
        type: "download",
        fileUrl: "/resume.pdf", // Update with your actual resume path
        fileName: "Esubalew_Molla_Resume.pdf",
        animated: false,
      },
      response: `
Downloading resume...
 Esubalew_Molla_Resume.pdf

Your resume has been downloaded. Please check your Downloads folder.
        `,
    },

    contact: {
      description: "Get contact information",
      metadata: {
        category: "Links",
        animated: true,
      },
      response: `

                    GET IN TOUCH                            

I'd love to hear from you! Feel free to reach out through any
of these channels:

EMAIL
   esubalew392@gmail.co

AVAILABILITY
   Status: Open for full-time opportunities and internship

Quick Links:
   github   → See my code repositories
   linkedin → Connect with me professionally
   projects → View my portfolio projects

Let's create something amazing together! 
        `,
    },

    github: {
      description: "Visit GitHub profile",
      metadata: {
        category: "Links",
        type: "link",
        url: "https://github.com/esubalew7",
        animated: false,
      },
      response: `
Opening GitHub profile...
→ github.com/esubalew7

If the browser didn't open, visit:
https://github.com/esubalew7
      `,
    },

    linkedin: {
      description: "Visit LinkedIn profile",
      metadata: {
        category: "Links",
        type: "link",
        url: "https://www.linkedin.com/in/esubalew-molla-7a584739b",
        animated: false,
      },
      response: `
Opening LinkedIn profile...
→ linkedin.com/in/esubalew-molla-7a584739b

If the browser didn't open, visit:
https://www.linkedin.com/in/esubalew-molla-7a584739b
      `,
    },

    clear: {
      description: "Clear terminal history",
      metadata: {
        category: "System",
        type: "clear",
        animated: false,
      },
      response: null, // Special handling - clears history
    },
  },
};

export const WELCOME_MESSAGE = `
        WELCOME TO MY INTERACTIVE DEVELOPER TERMINAL        

Hi, I'm an interactive terminal that lets you
   explore my portfolio, projects, and professional journey.

Getting Started:
   • Type 'help' to see all available commands
   • Use Arrow Keys ↑↓ to navigate command history
   • Click links to open external profiles

Quick Commands:
   • about        → Learn about me
   • experience   → View my work history
   • projects     → Browse portfolio projects
   • techstack    → See my technical skills
   • contact      → Get in touch

Ready to explore? Let's go!
`;

export const COMMAND_HISTORY_LIMIT = 100;
