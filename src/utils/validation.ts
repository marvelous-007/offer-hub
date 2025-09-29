import { 
  emailRegex, 
  passwordRegex, 
  isValidEmail, 
  isStrongPassword, 
  requiredField 
} from './validation-rules';

export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  customMessage?: string;
}

export class Validator {
  static validateField(value: any, rules: FieldValidation): ValidationResult {
    const errors: string[] = [];

    // Check required field
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push('This field is required');
      return { isValid: false, errors };
    }

    // Skip further validation if value is empty and not required
    if (!value && value !== 0) {
      return { isValid: true, errors: [] };
    }

    const stringValue = String(value).trim();

    // Check min length
    if (rules.minLength && stringValue.length < rules.minLength) {
      errors.push(`Must be at least ${rules.minLength} characters long`);
    }

    // Check max length
    if (rules.maxLength && stringValue.length > rules.maxLength) {
      errors.push(`Must be less than ${rules.maxLength} characters long`);
    }

    // Check pattern
    if (rules.pattern && !rules.pattern.test(stringValue)) {
      errors.push(rules.customMessage || 'Invalid format');
    }

    // Check custom validation
    if (rules.custom && !rules.custom(value)) {
      errors.push(rules.customMessage || 'Invalid value');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateForm(formData: Record<string, any>, validationSchema: Record<string, FieldValidation>) {
    const results: Record<string, ValidationResult> = {};
    let isValid = true;

    for (const [field, rules] of Object.entries(validationSchema)) {
      const value = formData[field];
      const result = this.validateField(value, rules);
      results[field] = result;
      
      if (!result.isValid) {
        isValid = false;
      }
    }

    return {
      isValid,
      results,
      hasErrors: !isValid
    };
  }
}

// Common validation schemas
export const validationSchemas = {
  email: {
    required: true,
    pattern: emailRegex,
    custom: isValidEmail,
    customMessage: 'Please enter a valid email address'
  } as FieldValidation,

  password: {
    required: true,
    minLength: 8,
    custom: isStrongPassword,
    customMessage: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  } as FieldValidation,

  required: {
    required: true,
    customMessage: 'This field is required'
  } as FieldValidation,

  contractId: {
    required: true,
    minLength: 10,
    maxLength: 64,
    customMessage: 'Contract ID must be between 10 and 64 characters'
  } as FieldValidation,

  address: {
    required: true,
    minLength: 26,
    maxLength: 56,
    customMessage: 'Please enter a valid address'
  } as FieldValidation,

  reason: {
    required: true,
    minLength: 10,
    maxLength: 500,
    customMessage: 'Reason must be between 10 and 500 characters'
  } as FieldValidation
};