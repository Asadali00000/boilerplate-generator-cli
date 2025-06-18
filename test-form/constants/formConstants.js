// Form constants and configuration

export const FORM_CONSTANTS = {
  // Validation rules
  VALIDATION: {
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,
    MIN_MESSAGE_LENGTH: 10,
    MAX_MESSAGE_LENGTH: 1000,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^[+]?[\d\s\-\(\)]{10,}$/,
    PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  },

  // Error messages
  ERROR_MESSAGES: {
    REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
    WEAK_PASSWORD: 'Password must contain at least 8 characters, one uppercase, one lowercase, and one number',
    MIN_LENGTH: (min) => `Must be at least ${min} characters`,
    MAX_LENGTH: (max) => `Must be less than ${max} characters`,
    MATCH_PASSWORD: 'Passwords do not match'
  },

  // Form types
  FORM_TYPES: {
    CONTACT: 'contact',
    LOGIN: 'login',
    REGISTER: 'register',
    PROFILE: 'profile',
    SETTINGS: 'settings'
  },

  // Field types
  FIELD_TYPES: {
    TEXT: 'text',
    EMAIL: 'email',
    PASSWORD: 'password',
    TEXTAREA: 'textarea',
    SELECT: 'select',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
    DATE: 'date',
    NUMBER: 'number',
    TEL: 'tel',
    URL: 'url'
  }
};