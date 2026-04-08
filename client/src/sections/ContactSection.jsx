import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../animations/variants';
import api from '../utils/api';

export const ContactSection = () => {
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
      console.error('Submission error:', error);
      const message = error?.response?.data?.message || error.message || 'Unable to send message. Please try again later.';
      setErrorMessage(message);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 max-w-4xl relative z-10">
      <motion.div
        variants={staggerContainer(0.2, 0)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={fadeIn('up', 0.1)} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Get In Touch</h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-400 mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            I'm currently looking for new opportunities. Whether you have a question or just want to say hi, my inbox is always open!
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          variants={fadeIn('up', 0.3)}
          className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-gray-800 space-y-8"
          noValidate
        >
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl flex items-center gap-4"
              role="alert"
            >
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-green-800 dark:text-green-200">Message Sent Successfully!</h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">Thank you for reaching out. I'll get back to you soon.</p>
              </div>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-4"
              role="alert"
            >
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">Failed to Send Message</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{errorMessage || 'Something went wrong. Please try again later.'}</p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                className={`w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-950 border-2 ${errors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'} text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-xs font-medium animate-pulse">{errors.name}</p>}
            </div>

            <div className="space-y-3">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
              <input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className={`w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-950 border-2 ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'} text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs font-medium animate-pulse">{errors.email}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="message" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              className={`w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-950 border-2 ${errors.message ? 'border-red-400 focus:border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'} text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 resize-none placeholder-gray-400 dark:placeholder-gray-500`}
              placeholder="How can I help you? Project details, timelines, etc."
            />
            {errors.message && <p className="text-red-500 text-xs font-medium animate-pulse">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-300 disabled:to-blue-400 dark:disabled:from-blue-800 dark:disabled:to-blue-900 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex justify-center items-center transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                Send Message
                <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </>
            )}
          </button>
        </motion.form>
      </motion.div>
    </section>
  );
};
