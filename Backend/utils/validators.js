const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, message: 'Full Name is required.' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 20) {
    return {
      isValid: false,
      message: `Full Name must be at least 20 characters (currently ${trimmed.length}).`,
    };
  }
  if (trimmed.length > 60) {
    return {
      isValid: false,
      message: `Full Name must not exceed 60 characters (currently ${trimmed.length}).`,
    };
  }
  return { isValid: true };
};

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, message: 'Email address is required.' };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: 'Please enter a valid email address.' };
  }
  return { isValid: true };
};

const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required.' };
  }
  if (password.length < 8 || password.length > 16) {
    return { isValid: false, message: 'Password must be between 8 and 16 characters.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least 1 uppercase letter.' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least 1 special character.' };
  }
  return { isValid: true };
};

const validateAddress = (address) => {
  if (!address || typeof address !== 'string') {
    return { isValid: false, message: 'Address is required.' };
  }
  if (address.trim().length > 400) {
    return {
      isValid: false,
      message: `Address must not exceed 400 characters (currently ${address.trim().length}).`,
    };
  }
  return { isValid: true };
};

const validateRating = (rating) => {
  const num = Number(rating);
  if (!Number.isInteger(num) || num < 1 || num > 5) {
    return { isValid: false, message: 'Rating must be an integer between 1 and 5.' };
  }
  return { isValid: true };
};

module.exports = {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
  validateRating,
};
