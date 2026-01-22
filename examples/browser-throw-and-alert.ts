/**
 * Browser Example: Using DIE and DIES for error handling with user feedback
 *
 * This example demonstrates how to use DIE and DIES in browser contexts
 * with various UI notification methods (alert, console, toast, etc.)
 */

import DIE, { DIES } from "phpdie";

// Example 1: Basic form validation with DIE
function validateLoginForm(username: string, password: string) {
  const trimmedUsername = username.trim() || DIE("Username is required");
  const trimmedPassword = password.trim() || DIE("Password is required");

  if (trimmedUsername.length < 3) {
    DIE`Username must be at least ${3} characters`;
  }

  if (trimmedPassword.length < 8) {
    DIE`Password must be at least ${8} characters`;
  }

  return { username: trimmedUsername, password: trimmedPassword };
}

// Example 2: Using DIES with browser alert
function submitFormWithAlert(formData: { email: string; message: string }) {
  // Validate and show alert before throwing
  formData.email.trim() || DIES(alert, "Email is required!");
  formData.message.trim() || DIES(alert, "Message cannot be empty!");

  console.log("Form submitted:", formData);
}

// Example 3: Using DIES with console.error
function loadUserProfile(userId: string | null) {
  userId || DIES(console.error, "User ID is required to load profile");

  // Simulated API call
  const userExists = false; // Simulating user not found
  userExists || DIES(console.error, "User not found:", userId);
}

// Example 4: Using DIES with custom toast function (React/Vue style)
interface ToastFunction {
  error: (message: string) => void;
  success: (message: string) => void;
  info: (message: string) => void;
}

const toast: ToastFunction = {
  error: (msg) => console.log(`[TOAST ERROR] ${msg}`),
  success: (msg) => console.log(`[TOAST SUCCESS] ${msg}`),
  info: (msg) => console.log(`[TOAST INFO] ${msg}`),
};

function uploadFile(file: File | null) {
  file || DIES(toast.error, "Please select a file to upload");

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    DIES(toast.error, `File size ${Math.round(file.size / 1024 / 1024)}MB exceeds limit of 5MB`);
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    DIES(toast.error, `File type ${file.type} is not allowed`);
  }

  console.log("File upload started:", file.name);
}

// Example 5: Using DIES with custom error handler
function customErrorHandler(message: string, context?: any) {
  console.error("Custom error handler:", message, context);
  // Could send to error tracking service like Sentry
  // sendToSentry({ message, context });
}

function processPayment(amount: number, cardNumber: string) {
  amount > 0 || DIES(customErrorHandler, "Invalid amount", { amount });
  cardNumber.trim() || DIES(customErrorHandler, "Card number is required", { cardNumber });

  if (cardNumber.length !== 16) {
    DIES(customErrorHandler, `Invalid card number length: ${cardNumber.length}`, {
      expected: 16,
      actual: cardNumber.length
    });
  }

  console.log("Payment processed:", amount);
}

// Example 6: Using DIE with Error objects in browser
async function fetchUserData(endpoint: string) {
  if (!endpoint) {
    DIE(new Error("API endpoint is required"));
  }

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      DIE`API request failed with status ${response.status}: ${response.statusText}`;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      DIE`Network error: ${error.message}`;
    }
    throw error;
  }
}

// Example 7: Complex validation with multiple DIES calls
function validateCheckoutForm(formData: {
  name?: string;
  email?: string;
  address?: string;
  zipCode?: string;
  agreeToTerms?: boolean;
}) {
  formData.name?.trim() || DIES(toast.error, "Name is required");
  formData.email?.trim() || DIES(toast.error, "Email is required");
  formData.address?.trim() || DIES(toast.error, "Shipping address is required");
  formData.zipCode?.trim() || DIES(toast.error, "ZIP code is required");
  formData.agreeToTerms || DIES(toast.error, "You must agree to the terms and conditions");

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    DIES(toast.error, `Invalid email format: ${formData.email}`);
  }

  // Validate ZIP code format (US)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(formData.zipCode)) {
    DIES(toast.error, `Invalid ZIP code format: ${formData.zipCode}`);
  }

  console.log("Checkout form validated successfully");
  return formData;
}

// Example 8: Using DIES with arrow function alerts
function deleteAccount(confirmed: boolean) {
  confirmed || DIES(() => {
    if (typeof window !== "undefined" && window.confirm) {
      window.confirm("Are you sure you want to delete your account? This cannot be undone.");
    }
    console.error("Account deletion requires confirmation");
  });

  console.log("Account deleted");
}

// Example usage demonstrations
if (typeof window !== "undefined") {
  console.log("=== Browser DIE Examples ===\n");

  // These examples would be triggered by actual user interactions in a real app
  console.log("Run these functions from your browser console:");
  console.log("- validateLoginForm('user', 'pass')");
  console.log("- submitFormWithAlert({ email: '', message: 'test' })");
  console.log("- uploadFile(null)");
  console.log("- processPayment(0, '')");
}

// Export functions for use in browser
export {
  validateLoginForm,
  submitFormWithAlert,
  loadUserProfile,
  uploadFile,
  processPayment,
  fetchUserData,
  validateCheckoutForm,
  deleteAccount,
};
