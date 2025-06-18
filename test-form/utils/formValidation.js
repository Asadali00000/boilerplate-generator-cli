// Form validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

export const validatePattern = (value, pattern) => {
  return pattern.test(value);
};

export const validateForm = (formData, formType = 'default') => {
  const errors = {};

  // Generic validation rules
  const rules = {
    name: [
      { required: true, message: 'Name is required' },
      { minLength: 2, message: 'Name must be at least 2 characters' },
      { maxLength: 50, message: 'Name must be less than 50 characters' }
    ],
    email: [
      { required: true, message: 'Email is required' },
      { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email' }
    ],
    message: [
      { required: true, message: 'Message is required' },
      { minLength: 10, message: 'Message must be at least 10 characters' },
      { maxLength: 1000, message: 'Message must be less than 1000 characters' }
    ]
  };

  // Apply validation rules
  Object.keys(rules).forEach(fieldName => {
    const fieldRules = rules[fieldName];
    const fieldValue = formData[fieldName];

    for (const rule of fieldRules) {
      if (rule.required && !validateRequired(fieldValue)) {
        errors[fieldName] = rule.message;
        break;
      }

      if (rule.minLength && !validateMinLength(fieldValue, rule.minLength)) {
        errors[fieldName] = rule.message;
        break;
      }

      if (rule.maxLength && !validateMaxLength(fieldValue, rule.maxLength)) {
        errors[fieldName] = rule.message;
        break;
      }

      if (rule.pattern && !validatePattern(fieldValue, rule.pattern)) {
        errors[fieldName] = rule.message;
        break;
      }
    }
  });

  return errors;
};

export const validateField = (fieldName, value, rules) => {
  for (const rule of rules) {
    if (rule.required && !validateRequired(value)) {
      return rule.message;
    }

    if (rule.minLength && !validateMinLength(value, rule.minLength)) {
      return rule.message;
    }

    if (rule.maxLength && !validateMaxLength(value, rule.maxLength)) {
      return rule.message;
    }

    if (rule.pattern && !validatePattern(value, rule.pattern)) {
      return rule.message;
    }
  }

  return '';
};