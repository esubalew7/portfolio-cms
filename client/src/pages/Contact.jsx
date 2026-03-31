import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../animations/variants';
import axios from 'axios';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    // Check standard email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Check message length
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    // Returns true if no errors exist
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear individual field errors when user starts typing correcting input
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Remove global banners when user attempts to re-submit
    if (submitStatus) setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Makes asynchronous request to backend endpoint defined
      await axios.post('/api/contact', formData);
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' }); // Reset fields
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-16 md:py-24 max-w-4xl relative z-10">
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
          className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 border border-gray-100 dark:border-gray-800 space-y-6"
          noValidate
        >
          {/* Dynamic Status Display Banners */}
          {submitStatus === 'success' && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
              <span className="font-bold">Success!</span> Your message has been sent successfully. I will get back to you soon.
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              <span className="font-bold">Error!</span> Something went wrong while sending your message. Please try again later.
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Name</label>
              <input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text" 
                className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-950 border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-800 focus:ring-blue-500'} text-gray-900 dark:text-white focus:ring-2 outline-none transition-all`} 
                placeholder="John Doe" 
              />
              {errors.name && <p className="text-red-500 text-xs font-medium animate-pulse">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
              <input 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email" 
                className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-950 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-800 focus:ring-blue-500'} text-gray-900 dark:text-white focus:ring-2 outline-none transition-all`} 
                placeholder="john@example.com" 
              />
              {errors.email && <p className="text-red-500 text-xs font-medium animate-pulse">{errors.email}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Message</label>
            <textarea 
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5" 
              className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-950 border ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-800 focus:ring-blue-500'} text-gray-900 dark:text-white focus:ring-2 outline-none transition-all resize-none`} 
              placeholder="How can I help you? Project details, timelines, etc." 
            />
            {errors.message && <p className="text-red-500 text-xs font-medium animate-pulse">{errors.message}</p>}
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-lg flex justify-center items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </motion.form>
      </motion.div>
    </section>
  );
};
