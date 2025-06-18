import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { validateForm } from '../../utils/formValidation';
import FormField from './FormField';
import FormButton from './FormButton';
import styles from './ContactForm.module.css';

const ContactForm = ({ onSubmit, initialData = {} }) => {
  const { formData, handleChange, handleBlur, errors, setErrors, resetForm } = useForm(initialData);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData, 'contact');
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      resetForm();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Contact Form</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <FormField
          label="Name"
          name="name"
          type="text"
          value={formData.name || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          required
        />

        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          required
        />

        <FormField
          label="Message"
          name="message"
          type="textarea"
          value={formData.message || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.message}
          required
        />

        <FormButton
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </FormButton>
      </form>
    </div>
  );
};

export default ContactForm;