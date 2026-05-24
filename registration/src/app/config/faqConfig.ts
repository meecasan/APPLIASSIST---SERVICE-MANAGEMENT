/**
 * FAQ Configuration for ContactPage
 * Centralized FAQ data that can be easily updated or fetched from an API
 */

export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: 'What areas do you serve?',
    answer: 'We currently serve Naga City and surrounding areas in Camarines Sur, Philippines.',
  },
  {
    question: 'How do I book a technician?',
    answer: 'Browse our Services page, select your appliance type, choose a technician, and click Book Now to schedule an appointment.',
  },
  {
    question: 'Do you offer warranty on parts?',
    answer: 'Yes! All genuine parts purchased through our marketplace come with manufacturer warranties.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept cash payments, GCash, PayMaya, and bank transfers for both services and parts.',
  },
];

export const contactInfo = {
  phone: '+63 917 123 4567',
  phoneHours: 'Mon-Sat, 8:00 AM - 6:00 PM',
  email: 'support@appliassist.ph',
  emailResponse: 'We\'ll respond within 24 hours',
  location: 'Naga City',
  address: 'Camarines Sur, Philippines',
};
