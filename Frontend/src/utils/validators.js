/**
 * Strict Form Validation Utilities for MartPulse
 */

// Email regex matching standard RFC format
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password regex: 8-16 characters, >=1 uppercase, >=1 special character
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

/**
 * Validate full name / store name (20 to 60 characters)
 */
export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, message: 'Name is required' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 20) {
    return {
      isValid: false,
      message: `Name must be at least 20 characters (current: ${trimmed.length})`,
      currentLength: trimmed.length,
    };
  }
  if (trimmed.length > 60) {
    return {
      isValid: false,
      message: `Name cannot exceed 60 characters (current: ${trimmed.length})`,
      currentLength: trimmed.length,
    };
  }
  return { isValid: true, message: '', currentLength: trimmed.length };
};

/**
 * Validate address (Max 400 characters)
 */
export const validateAddress = (address, isRequired = true) => {
  if (!address && isRequired) {
    return { isValid: false, message: 'Address is required', currentLength: 0 };
  }
  if (!address && !isRequired) {
    return { isValid: true, message: '', currentLength: 0 };
  }
  const trimmed = address.trim();
  if (trimmed.length > 400) {
    return {
      isValid: false,
      message: `Address cannot exceed 400 characters (current: ${trimmed.length})`,
      currentLength: trimmed.length,
    };
  }
  return { isValid: true, message: '', currentLength: trimmed.length };
};

/**
 * Validate email address
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { isValid: false, message: 'Email address is required' };
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return { isValid: false, message: 'Please enter a valid email address (e.g. name@domain.com)' };
  }
  return { isValid: true, message: '' };
};

/**
 * Validate password (8-16 chars, at least 1 uppercase and 1 special char)
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 8 || password.length > 16) {
    return { isValid: false, message: 'Password must be between 8 and 16 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*...)' };
  }
  return { isValid: true, message: '' };
};

/**
 * Validate Rating (Integer 1 to 5)
 */
export const validateRating = (rating) => {
  const num = Number(rating);
  if (!Number.isInteger(num) || num < 1 || num > 5) {
    return { isValid: false, message: 'Rating must be an integer between 1 and 5' };
  }
  return { isValid: true, message: '' };
};
