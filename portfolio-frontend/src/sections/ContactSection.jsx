import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import api from '../utils/api';
import { useTrackSection } from '../hooks/useVisitorTracking';
import { useContent } from '../context/ContentContext';

export const ContactSection = () => {
  useTrackSection('contact');
  const { content } = useContent();
  const { contactInfo } = content;

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (submitStatus) setSubmitStatus(null);
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      await api.post('/api/contact', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Unable to send message. Please try again later.';
      setErrorMessage(message);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactLinks = [
    ...(contactInfo?.email ? [{
      icon: Mail,
      label: 'Email',
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
      isClickable: true
    }] : []),
    ...(contactInfo?.phone ? [{
      icon: Phone,
      label: 'Phone',
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone.replace(/\s/g, '')}`,
      isClickable: true
    }] : []),
    ...(contactInfo?.location ? [{
      icon: MapPin,
      label: 'Location',
      value: contactInfo.location,
      href: '#',
      isClickable: false
    }] : [])
  ];

  return (
    <section id="contact" className="relative py-24 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-16 lg:gap-24">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-[40%] space-y-10"
          >
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                {contactInfo?.formTitle || "Get in"} <span className="text-blue-600">touch</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                {contactInfo?.formDescription || ""}
              </p>
            </div>

            <div className="space-y-6">
              {contactLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-5 p-2"
                >
                  <div className="flex-shrink-0 p-3.5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                    <link.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-0.5">{link.label}</span>
                    {link.isClickable ? (
                      <a
                        href={link.href}
                        className="text-lg font-bold text-gray-900 dark:text-gray-200 hover:text-blue-600 transition-colors"
                      >
                        {link.value}
                      </a>
                    ) : (
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-200">
                        {link.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-[55%] pt-8 lg:pt-0"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      {contactInfo?.successMessage || "Thank you! Your message has been sent successfully."}
                    </p>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      {errorMessage || 'Something went wrong. Please try again.'}
                    </p>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500/50 ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                        }`}
                      placeholder="Your Name"
                    />
                    {errors.name && <p className="text-xs text-red-500 font-medium ml-1">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500/50 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                        }`}
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="text-xs text-red-500 font-medium ml-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500/50 resize-none ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                      }`}
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && <p className="text-xs text-red-500 font-medium ml-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" /> {contactInfo?.formButtonText || "Send Message"}</>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
