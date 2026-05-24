import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageCircle, HelpCircle, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { faqs, contactInfo } from '../config/faqConfig';
import { contactAPI } from '../services/api-extended';
import { toast } from 'sonner';

interface ContactPageProps {
  onBack: () => void;
}

export function ContactPage({ onBack }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);

      // Call the contact API
      const response = await contactAPI.submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject,
        message: formData.message,
      });

      console.log('Contact form submitted successfully:', response);
      
      // Show success toast
      toast.success('Message sent!', {
        description: 'Thank you for contacting APPLIASSIST. We will get back to you soon.',
      });
      
      // Show success message
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      console.error('Contact form error:', err);
      
      // Show error toast
      toast.error('Failed to send message', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1E2F4F] to-[#2a4066] text-white py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Get in Touch
            </h1>
            <p className="text-xl text-gray-200" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Have questions? Need support? We're here to help. Reach out to the APPLIASSIST team and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Information Cards */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Phone className="w-7 h-7 text-[#1E2F4F]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Phone
            </h3>
            <p className="text-[#6B7280] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Call us for immediate assistance
            </p>
            <a
              href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
              className="text-[#1E2F4F] font-semibold hover:underline"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {contactInfo.phone}
            </a>
            <p className="text-sm text-[#6B7280] mt-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {contactInfo.phoneHours}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Mail className="w-7 h-7 text-green-700" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Email
            </h3>
            <p className="text-[#6B7280] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Send us an email anytime
            </p>
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-[#1E2F4F] font-semibold hover:underline"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {contactInfo.email}
            </a>
            <p className="text-sm text-[#6B7280] mt-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {contactInfo.emailResponse}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <MapPin className="w-7 h-7 text-[#FF6B35]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Location
            </h3>
            <p className="text-[#6B7280] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Visit our main office
            </p>
            <p className="text-gray-900 font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {contactInfo.location}
            </p>
            <p className="text-sm text-[#6B7280] mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {contactInfo.address}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Send us a Message
            </h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Message Sent!
                </h3>
                <p className="text-green-800" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Thank you for contacting us. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      placeholder="09XX XXX XXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Error sending message
                      </p>
                      <p className="text-sm text-red-700 mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    isSubmitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-[#1E2F4F] text-white hover:bg-[#2a4066]'
                  }`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <HelpCircle className="w-8 h-8 text-[#1E2F4F]" />
            <h2 className="text-3xl font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {faq.question}
                </h3>
                <p className="text-[#6B7280]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Support Section */}
        <div className="bg-[#1E2F4F] rounded-2xl shadow-xl p-12 text-center text-white">
          <MessageCircle className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Need Immediate Assistance?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Our customer support team is ready to help you with any questions or concerns about our services.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:+639171234567"
              className="bg-white text-[#1E2F4F] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <Phone className="w-5 h-5" />
              <span>Call Now</span>
            </a>
            <a
              href="mailto:support@appliassist.ph"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#1E2F4F] transition-colors inline-flex items-center space-x-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <Mail className="w-5 h-5" />
              <span>Email Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
