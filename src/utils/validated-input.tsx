"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Validator, FieldValidation, ValidationResult } from '@/utils/validation';

interface ValidatedInputProps {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onValidation?: (isValid: boolean, errors: string[]) => void;
  validationRules: FieldValidation;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function ValidatedInput({
  name,
  label,
  type = 'text',
  value,
  onChange,
  onValidation,
  validationRules,
  placeholder,
  disabled = false,
  className = ''
}: ValidatedInputProps) {
  const [touched, setTouched] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: []
  });

  useEffect(() => {
    if (touched || value) {
      const result = Validator.validateField(value, validationRules);
      setValidationResult(result);
      onValidation?.(result.isValid, result.errors);
    }
  }, [value, touched, validationRules, onValidation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const showErrors = touched && !validationResult.isValid;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className={showErrors ? 'text-destructive' : ''}>
        {label}
        {validationRules.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={showErrors ? 'border-destructive focus-visible:ring-destructive' : ''}
        aria-invalid={showErrors}
        aria-describedby={showErrors ? `${name}-errors` : undefined}
      />

      {showErrors && (
        <div id={`${name}-errors`} className="space-y-1">
          {validationResult.errors.map((error, index) => (
            <p 
              key={index} 
              className="text-sm text-destructive font-medium"
              role="alert"
            >
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}