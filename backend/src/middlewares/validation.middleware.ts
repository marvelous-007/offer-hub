import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from '../utils/AppError';

/**
 * Middleware to validate request data using express-validator
 * @param validations - Array of validation chains from express-validator
 */
export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Run all validations
    for (const validation of validations) {
      await validation.run(req);
    }
    
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => ({
        field: error.type === 'field' ? error.path : 'unknown',
        message: error.msg,
        value: error.type === 'field' ? error.value : undefined
      }));
      
      throw new AppError(
        'Validation failed',
        400,
        'VALIDATION_ERROR',
        errorMessages
      );
    }
    
    next();
  };
};

/**
 * Legacy middleware for backward compatibility
 * @param req - Express request object
 * @param res - Express response object  
 * @param next - Express next function
 */
export const validateRequestLegacy = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined
    }));
    
    throw new AppError(
      'Validation failed',
      400,
      'VALIDATION_ERROR',
      errorMessages
    );
  }
  
  next();
};

/**
 * Middleware to validate specific fields
 * @param fields - Array of field names to validate
 */
export const validateFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missingFields: string[] = [];
    
    fields.forEach(field => {
      if (!req.body[field] && req.body[field] !== 0 && req.body[field] !== false) {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      throw new AppError(
        `Missing required fields: ${missingFields.join(', ')}`,
        400,
        'MISSING_FIELDS',
        { missingFields }
      );
    }
    
    next();
  };
};

/**
 * Middleware to validate UUID format
 * @param paramName - Name of the parameter to validate
 */
export const validateUUID = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const uuid = req.params[paramName];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuid || !uuidRegex.test(uuid)) {
      throw new AppError(
        `Invalid ${paramName} format. Must be a valid UUID.`,
        400,
        'INVALID_UUID',
        { field: paramName, value: uuid }
      );
    }
    
    next();
  };
};
