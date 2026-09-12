const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

export const EMPTY_SETTINGS = {
  fullName: "",
  username: "",
  email: "",
  bio: "",
  password: "",
  confirmPassword: "",
  emailNotifications: true,
};

export function validateSettings(values) {
  const errors = {};
  const fullName = values.fullName.trim();
  const username = values.username.trim();
  const email = values.email.trim();
  const bio = values.bio.trim();
  const password = values.password;
  const confirmPassword = values.confirmPassword;

  if (!fullName) {
    errors.fullName = "Full name is required.";
  } else if (fullName.length < 2) {
    errors.fullName = "Full name must be at least 2 characters.";
  }

  if (!username) {
    errors.username = "Username is required.";
  } else if (!USERNAME_PATTERN.test(username)) {
    errors.username =
      "Use 3–20 letters, numbers, or underscores with no spaces.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (bio.length > 160) {
    errors.bio = "Bio must be 160 characters or fewer.";
  }

  const changingPassword = password.length > 0 || confirmPassword.length > 0;
  if (changingPassword) {
    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      errors.password = "Password must include a letter and a number.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm your new password.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  }

  return errors;
}

export function isValidSettings(values) {
  return Object.keys(validateSettings(values)).length === 0;
}
