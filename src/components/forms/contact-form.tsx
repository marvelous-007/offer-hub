"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ValidatedInput } from './validated-input';
import { validationSchemas, Validator } from '@/utils/validation';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validationSchema = {
    name: validationSchemas.required,
    email: validationSchemas.email,
    subject: validationSchemas.required,
    message: {
      required: true,
      minLength: 10,
      maxLength: 1000,
      customMessage: 'Message must be between 10 and 1000 characters'
    }
  };

  const handleFieldChange = (field: keyof ContactFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldValidation = (field: keyof ContactFormData) => (isValid: boolean) => {
    setFieldErrors(prev => ({
      ...prev,
      [field]: !isValid
    }));
  };

  const isFormValid = () => {
    const validation = Validator.validateForm(formData, validationSchema);
    return validation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      // Mark all fields as touched to show errors
      setFieldErrors({
        name: true,
        email: true,
        subject: true,
        message: true
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle form submission here
      console.log('Form submitted:', formData);
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setFieldErrors({});
      
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent!</h3>
        <p className="text-green-700">
          Thank you for your message. We'll get back to you soon.
        </p>
        <Button 
          onClick={() => setSubmitSuccess(false)}
          className="mt-4"
          variant="outline"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div className="space-y-4">
        <ValidatedInput
          name="name"
          label="Full Name"
          value={formData.name}
          onChange={handleFieldChange('name')}
          onValidation={handleFieldValidation('name')}
          validationRules={validationSchema.name}
          placeholder="Enter your full name"
        />

        <ValidatedInput
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleFieldChange('email')}
          onValidation={handleFieldValidation('email')}
          validationRules={validationSchema.email}
          placeholder="Enter your email address"
        />

        <ValidatedInput
          name="subject"
          label="Subject"
          value={formData.subject}
          onChange={handleFieldChange('subject')}
          onValidation={handleFieldValidation('subject')}
          validationRules={validationSchema.subject}
          placeholder="Enter the subject"
        />

        <ValidatedInput
          name="message"
          label="Message"
          value={formData.message}
          onChange={handleFieldChange('message')}
          onValidation={handleFieldValidation('message')}
          validationRules={validationSchema.message}
          placeholder="Enter your message"
        />
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting || !isFormValid()}
        className="w-full"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}