import PortfolioContent from "../models/PortfolioContent.js";

const getDefaultContent = () => ({
  hero: {
    greeting: "Hello, I am",
    name: "Esubalew",
    titles: [
      "MERN Stack Developer.",
      "Problem Solver.",
      "Creative Thinker.",
      "React Enthusiast.",
    ],
    description:
      "I am a Computer Science student and MERN Stack Developer with a passion for building dynamic web applications. I specialize in creating seamless user experiences and robust backend systems. Let's build something amazing together!",
    image: "/images/esu2.png",
    cta: {
      primary: { text: "View Projects", link: "#projects" },
      secondary: { text: "Download Resume", link: "/resume.pdf" },
    },
  },
  about: {
    title: "About Me",
    subtitle: "Computer Science Student & MERN Stack Developer",
    description:
      "I am a third-year Computer Science student passionate about full-stack development. My expertise lies in the MERN stack, where I focus on building robust applications with clean architecture and scalable design patterns. I thrive on solving complex problems and turning ideas into seamless digital experiences.",
    image: "/images/esu3.png",
    stats: [
      { label: "Years Experience", value: 1, suffix: "+" },
      { label: "Total Projects", value: 5, suffix: "+" },
      { label: "Core Skills", value: 15, suffix: "+" },
    ],
    cta: { text: "Let's Collaborate", link: "#contact" },
  },
  skills: {
    title: "Core Skills",
    subtitle:
      "A comprehensive overview of my technical expertise across modern web development, backend engineering, and foundational tooling.",
    categories: [
      {
        name: "Frontend",
        items: [
          { name: "HTML", level: 95 },
          { name: "CSS", level: 90 },
          { name: "JavaScript", level: 85 },
          { name: "Bootstrap", level: 80 },
          { name: "Tailwind CSS", level: 95 },
          { name: "React", level: 90 },
        ],
      },
      {
        name: "Backend",
        items: [
          { name: "Node.js", level: 80 },
          { name: "Express.js", level: 85 },
        ],
      },
      {
        name: "Database",
        items: [
          { name: "MongoDB", level: 85 },
          { name: "mySQL", level: 50 },
          { name: "Firebase", level: 60 },
        ],
      },
      {
        name: "Programming",
        items: [
          { name: "C++", level: 55 },
          { name: "Java", level: 55 },
          { name: "Flutter", level: 65 },
          { name: "PHP", level: 55 },
        ],
      },
      {
        name: "Tools",
        items: [
          { name: "Git", level: 85 },
          { name: "GitHub", level: 90 },
          { name: "Postman", level: 85 },
        ],
      },
    ],
  },
  experience: {
    title: "Experience",
    subtitle:
      "A professional timeline highlighting internships, education, certifications, and freelance work — concise and recruiter-friendly.",
    categories: [
      {
        name: "Education",
        items: [
          {
            role: "Computer Science Student",
            company: "Bahir Dar University",
            duration: "2024 — Present",
            location: "Bahir Dar, Ethiopia",
            tags: ["Algorithms", "Data Structures", "Databases"],
            bullets: [
              "Relevant coursework: Web Dev, Mobile Dev, Databases, Algorithms, Software Engineering",
            ],
            logo: "images/bdu.jpg",
          },
        ],
      },
      {
        name: "Internship Experience",
        items: [
          {
            role: "Full Stack Developer Intern",
            company: "Askuala Link",
            duration: "Jun 2026 — Aug 2026",
            location: "Bahir Dar/ Ethiopia",
            tags: [],
            bullets: [
              "as a Software Engineer Intern working on multiple web applications",
            ],
            logo: "images/askuala.jpg",
          },
        ],
      },
      {
        name: "Certifications",
        items: [
          {
            role: "Front-End Development Certification",
            company: "Certification Provider",
            duration: "2025",
            location: "",
            tags: ["React", "JavaScript", "CSS", "HTML"],
            bullets: [
              "Web Development Certificate @ coddy.tech",
              "Advanced Programming (React)  @ BiT Career Development Center",
              "CCNA: Introduction to Networks @ Cisco Networking Academy",
            ],
            logo: "",
          },
        ],
      },
    ],
  },
  testimonials: {
    title: "Client Feedback",
    subtitle: "What people say about working with me.",
    items: [
      {
        name: "Abebe Kebede",
        role: "CEO",
        company: "Tech Solutions PLC",
        image: "images/p1.jpg",
        rating: 5,
        feedback:
          "Exceptional developer with a keen eye for design. He delivered our platform ahead of schedule with flawless performance and clean architecture.",
      },
      {
        name: "Sara Mohammed",
        role: "Project Manager",
        company: "Digital Innovations",
        image: "images/p2.jpg",
        rating: 4,
        feedback:
          "Working with him was a breeze. Clear communication, timely deliveries, and a deep understanding of modern web technologies that made our project stand out.",
      },
      {
        name: "Dr. Getachew Alemu",
        role: "Professor",
        company: "Bahir Dar University",
        image: "images/p3.jpg",
        rating: 5,
        feedback:
          "One of the brightest students I have mentored. His ability to grasp complex concepts and implement them into working solutions is truly impressive.",
      },
      {
        name: "Meron Tadesse",
        role: "Team Lead",
        company: "Askuala Link",
        image: "images/p4.jpg",
        rating: 5,
        feedback:
          "He consistently exceeded expectations during his internship. Every pull request was production-ready, well-documented, and required minimal review.",
      },
      {
        name: "Yonas Desta",
        role: "Startup Founder",
        company: "Addis Tech Ventures",
        image: "images/p5.jpg",
        rating: 4,
        feedback:
          "He built our entire MVP in record time. The architecture is rock-solid, the UX is polished, and users have been loving the experience since day one.",
      },
    ],
  },
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/esubalew7" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/esubalew-molla-7a584739b" },
    { platform: "Telegram", url: "https://t.me/Esuman7" },
    { platform: "Facebook", url: "https://facebook.com" },
    { platform: "Twitter", url: "https://twitter.com" },
    { platform: "Instagram", url: "https://instagram.com/esubalew_7_7" },
  ],
  resume: {
    title: "Resume",
    url: "/resume.pdf",
    buttonText: "Download Resume",
  },
  contactInfo: {
    email: "esubalew392@gmail.com",
    phone: "+251 915795794",
    location: "Bahir Dar, Ethiopia",
    formTitle: "Get in touch",
    formDescription:
      "I'm currently available for freelance work or full-time opportunities. Reach out via the form or any of the methods below.",
    formButtonText: "Send Message",
    successMessage:
      "Thank you! Your message has been sent successfully.",
  },
});

export const getContent = async (req, res) => {
  try {
    let content = await PortfolioContent.findOne();

    if (!content) {
      content = await PortfolioContent.create(getDefaultContent());
    }

    res.status(200).json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const updateContent = async (req, res) => {
  try {
    let content = await PortfolioContent.findOne();

    if (!content) {
      content = await PortfolioContent.create(getDefaultContent());
    }

    const allowedFields = [
      "hero", "about", "skills", "experience",
      "testimonials", "socialLinks", "resume", "contactInfo",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        content[field] = req.body[field];
      }
    }

    await content.save();

    res.status(200).json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
