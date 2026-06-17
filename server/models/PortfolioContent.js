import mongoose from "mongoose";

const statSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  suffix: { type: String, default: "" },
}, { _id: false });

const ctaSchema = new mongoose.Schema({
  text: { type: String, default: "" },
  link: { type: String, default: "" },
}, { _id: false });

const heroSchema = new mongoose.Schema({
  greeting: { type: String, default: "Hello, I am" },
  name: { type: String, default: "" },
  titles: [{ type: String }],
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  cta: {
    primary: { type: ctaSchema, default: () => ({}) },
    secondary: { type: ctaSchema, default: () => ({}) },
  },
}, { _id: false });

const aboutSchema = new mongoose.Schema({
  title: { type: String, default: "About Me" },
  subtitle: { type: String, default: "" },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  stats: [statSchema],
  cta: { type: ctaSchema, default: () => ({}) },
}, { _id: false });

const skillItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, min: 0, max: 100, default: 0 },
}, { _id: false });

const skillCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [skillItemSchema],
}, { _id: false });

const skillsSchema = new mongoose.Schema({
  title: { type: String, default: "Core Skills" },
  subtitle: { type: String, default: "" },
  categories: [skillCategorySchema],
}, { _id: false });

const experienceItemSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, default: "" },
  duration: { type: String, default: "" },
  location: { type: String, default: "" },
  tags: [{ type: String }],
  bullets: [{ type: String }],
  logo: { type: String, default: "" },
}, { _id: false });

const experienceCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [experienceItemSchema],
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  title: { type: String, default: "Experience" },
  subtitle: { type: String, default: "" },
  categories: [experienceCategorySchema],
}, { _id: false });

const testimonialItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: "" },
  company: { type: String, default: "" },
  image: { type: String, default: "" },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  feedback: { type: String, default: "" },
}, { _id: false });

const testimonialsSchema = new mongoose.Schema({
  title: { type: String, default: "Client Feedback" },
  subtitle: { type: String, default: "" },
  items: [testimonialItemSchema],
}, { _id: false });

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  title: { type: String, default: "Resume" },
  url: { type: String, default: "" },
  buttonText: { type: String, default: "Download Resume" },
}, { _id: false });

const contactInfoSchema = new mongoose.Schema({
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  location: { type: String, default: "" },
  formTitle: { type: String, default: "Get in touch" },
  formDescription: { type: String, default: "" },
  formButtonText: { type: String, default: "Send Message" },
  successMessage: { type: String, default: "Thank you! Your message has been sent successfully." },
}, { _id: false });

const portfolioContentSchema = new mongoose.Schema({
  hero: { type: heroSchema, default: () => ({}) },
  about: { type: aboutSchema, default: () => ({}) },
  skills: { type: skillsSchema, default: () => ({}) },
  experience: { type: experienceSchema, default: () => ({}) },
  testimonials: { type: testimonialsSchema, default: () => ({}) },
  socialLinks: [socialLinkSchema],
  resume: { type: resumeSchema, default: () => ({}) },
  contactInfo: { type: contactInfoSchema, default: () => ({}) },
}, {
  timestamps: true,
});

const PortfolioContent = mongoose.model("PortfolioContent", portfolioContentSchema);

export default PortfolioContent;
