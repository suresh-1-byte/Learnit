/**
 * Form Validation Utilities
 * Enterprise-grade validation rules and helpers
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormErrors {
  [fieldName: string]: string;
}

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s-()]{10,}$/,
  url: /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  numeric: /^\d+$/,
  decimal: /^\d*\.?\d+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

// Validation error messages
export const errorMessages = {
  required: 'This field is required',
  minLength: (min: number) => `Minimum ${min} characters required`,
  maxLength: (max: number) => `Maximum ${max} characters allowed`,
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  alphanumeric: 'Only letters and numbers allowed',
  numeric: 'Only numbers allowed',
  decimal: 'Please enter a valid number',
  password: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  custom: 'Invalid value',
};

/**
 * Validate a single field against rules
 */
export const validateField = (value: string, rules: ValidationRule): ValidationResult => {
  const trimmedValue = value.trim();

  // Required check
  if (rules.required && !trimmedValue) {
    return { isValid: false, error: errorMessages.required };
  }

  // Skip other validations if field is empty and not required
  if (!trimmedValue && !rules.required) {
    return { isValid: true };
  }

  // Min length check
  if (rules.minLength && trimmedValue.length < rules.minLength) {
    return { isValid: false, error: errorMessages.minLength(rules.minLength) };
  }

  // Max length check
  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    return { isValid: false, error: errorMessages.maxLength(rules.maxLength) };
  }

  // Pattern check
  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    return { isValid: false, error: errorMessages.custom };
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(trimmedValue);
    if (customError) {
      return { isValid: false, error: customError };
    }
  }

  return { isValid: true };
};

/**
 * Validate an entire form object
 */
export const validateForm = (
  formData: Record<string, string>,
  validationRules: Record<string, ValidationRule>
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};
  let isValid = true;

  Object.keys(validationRules).forEach((fieldName) => {
    const result = validateField(formData[fieldName] || '', validationRules[fieldName]);
    if (!result.isValid) {
      errors[fieldName] = result.error!;
      isValid = false;
    }
  });

  return { isValid, errors };
};

/**
 * Predefined validation rules for common fields
 */
export const commonRules = {
  email: {
    required: true,
    pattern: patterns.email,
  } as ValidationRule,

  password: {
    required: true,
    minLength: 8,
    pattern: patterns.password,
  } as ValidationRule,

  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  } as ValidationRule,

  phone: {
    required: false,
    pattern: patterns.phone,
  } as ValidationRule,

  required: {
    required: true,
  } as ValidationRule,

  optional: {} as ValidationRule,
};
