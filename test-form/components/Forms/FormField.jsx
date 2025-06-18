import React from 'react';
import styles from './FormField.module.css';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  disabled = false,
  options = [], // For select fields
  rows = 4, // For textarea
  ...props
}) => {
  const fieldId = `field-${name}`;

  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            name={name}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={`${styles.input} ${styles.textarea} ${error ? styles.error : ''}`}
            {...props}
          />
        );

      case 'select':
        return (
          <select
            id={fieldId}
            name={name}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={`${styles.input} ${styles.select} ${error ? styles.error : ''}`}
            {...props}
          >
            <option value="">{placeholder || 'Select an option'}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <input
            id={fieldId}
            name={name}
            type="checkbox"
            checked={value || false}
            onChange={onChange}
            disabled={disabled}
            className={`${styles.checkbox} ${error ? styles.error : ''}`}
            {...props}
          />
        );

      default:
        return (
          <input
            id={fieldId}
            name={name}
            type={type}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={`${styles.input} ${error ? styles.error : ''}`}
            {...props}
          />
        );
    }
  };

  return (
    <div className={styles.fieldContainer}>
      {label && (
        <label htmlFor={fieldId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      {renderField()}

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
    </div>
  );
};

export default FormField;