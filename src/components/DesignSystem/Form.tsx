import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';
import { Input } from './Input';
import { validateField, validateForm, ValidationRule, FormErrors } from '../../utils/validation';

export interface FormField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  validationRules?: ValidationRule;
  helperText?: string;
}

export interface FormProps {
  fields: FormField[];
  onSubmit: (formData: Record<string, string>) => void | Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
  className?: string;
}

export const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  isLoading = false,
  className = '',
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const field = fields.find((f) => f.name === name);
      if (field?.validationRules) {
        const result = validateField(value, field.validationRules);
        setErrors((prev) => {
          const newErrors = { ...prev };
          if (result.isValid) {
            delete newErrors[name];
          } else if (result.error) {
            newErrors[name] = result.error;
          }
          return newErrors;
        });
      }
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    const field = fields.find((f) => f.name === name);
    if (field?.validationRules) {
      const result = validateField(formData[name] || '', field.validationRules);
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (result.isValid) {
          delete newErrors[name];
        } else if (result.error) {
          newErrors[name] = result.error;
        }
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const validationRules: Record<string, ValidationRule> = {};
    fields.forEach((field) => {
      if (field.validationRules) {
        validationRules[field.name] = field.validationRules;
      }
    });
    
    const { isValid, errors: validationErrors } = validateForm(formData, validationRules);
    
    if (!isValid) {
      setErrors(validationErrors);
      setTouched(
        Object.keys(validationErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
      return;
    }
    
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 p-6 rounded-2xl transition-all duration-250 shadow-lg ${className} ${
      theme === 'dark' 
        ? 'bg-[#0A0A0E] border-[rgba(255,255,255,0.08)]' 
        : 'bg-white border-[rgba(0,0,0,0.06)]'
    }`}>
      {fields.map((field) => (
        <Input
          key={field.name}
          label={field.label}
          type={field.type || 'text'}
          placeholder={field.placeholder}
          value={formData[field.name] || ''}
          onChange={(e) => handleChange(field.name, e.target.value)}
          onBlur={() => handleBlur(field.name)}
          error={errors[field.name]}
          helperText={field.helperText}
          required={field.validationRules?.required}
        />
      ))}
      
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isLoading}
      >
        {submitLabel}
      </Button>
    </form>
  );
};
