/**
 * Browser Example: Using DIE for error handling with user feedback
 *
 * This example demonstrates how to use DIE in browser contexts
 * with various UI notification methods (alert, console, toast, etc.)
 * DIE now supports calling alert/toast functions directly!
 */

import DIE, { DIES } from "../index.ts";

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

// Example 2: Using DIE with browser alert (new pattern!)
function submitFormWithAlert(formData: { email: string; message: string }) {
  // Validate and show alert before throwing - DIE now supports this directly!
  formData.email.trim() || DIE(alert, "Email is required!");
  formData.message.trim() || DIE(alert, "Message cannot be empty!");

  console.log("Form submitted:", formData);
}

// Example 2b: Using DIES (legacy pattern, still works)
function submitFormWithAlertLegacy(formData: { email: string; message: string }) {
  // DIES is still available but DIE(fn, ...args) is now preferred
  formData.email.trim() || DIES(alert, "Email is required!");
  formData.message.trim() || DIES(alert, "Message cannot be empty!");

  console.log("Form submitted:", formData);
}

// Example 3: Using DIE with console.error (new pattern!)
function loadUserProfile(userId: string | null) {
  userId || DIE(console.error, "User ID is required to load profile");

  // Simulated API call
  const userExists = false; // Simulating user not found
  userExists || DIE(console.error, "User not found:", userId);
}

// Example 4: Using DIE with custom toast function (React/Vue style)
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
  // DIE now supports calling toast.error directly!
  file || DIE(toast.error, "Please select a file to upload");

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    DIE(toast.error, `File size ${Math.round(file.size / 1024 / 1024)}MB exceeds limit of 5MB`);
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    DIE(toast.error, `File type ${file.type} is not allowed`);
  }

  console.log("File upload started:", file.name);
}

// Example 5: Using DIE with custom error handler
function customErrorHandler(message: string, context?: any) {
  console.error("Custom error handler:", message, context);
  // Could send to error tracking service like Sentry
  // sendToSentry({ message, context });
}

function processPayment(amount: number, cardNumber: string) {
  // DIE supports custom error handlers too!
  amount > 0 || DIE(customErrorHandler, "Invalid amount", { amount });
  cardNumber.trim() || DIE(customErrorHandler, "Card number is required", { cardNumber });

  if (cardNumber.length !== 16) {
    DIE(customErrorHandler, `Invalid card number length: ${cardNumber.length}`, {
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

// Example 7: Complex validation with multiple DIE calls
function validateCheckoutForm(formData: {
  name?: string;
  email?: string;
  address?: string;
  zipCode?: string;
  agreeToTerms?: boolean;
}) {
  // DIE makes validation clean and shows toast notifications!
  formData.name?.trim() || DIE(toast.error, "Name is required");
  formData.email?.trim() || DIE(toast.error, "Email is required");
  formData.address?.trim() || DIE(toast.error, "Shipping address is required");
  formData.zipCode?.trim() || DIE(toast.error, "ZIP code is required");
  formData.agreeToTerms || DIE(toast.error, "You must agree to the terms and conditions");

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    DIE(toast.error, `Invalid email format: ${formData.email}`);
  }

  // Validate ZIP code format (US)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(formData.zipCode)) {
    DIE(toast.error, `Invalid ZIP code format: ${formData.zipCode}`);
  }

  console.log("Checkout form validated successfully");
  return formData;
}

// Example 8: Using DIE with arrow function alerts
function deleteAccount(confirmed: boolean) {
  // DIE with arrow functions for complex alert logic
  confirmed || DIE(() => {
    if (typeof window !== "undefined" && window.confirm) {
      window.confirm("Are you sure you want to delete your account? This cannot be undone.");
    }
    console.error("Account deletion requires confirmation");
  });

  console.log("Account deleted");
}

// Example 9: Comparison of DIE vs DIES
function demonstrateComparison() {
  // New DIE pattern (recommended)
  // false || DIE(toast.error, "Failed to load data");

  // Old DIES pattern (still works but deprecated)
  // false || DIES(toast.error, "Failed to load data");

  // Both do the same thing:
  // 1. Call toast.error with the message
  // 2. Throw an error with the message in the cause

  console.log("Both patterns are functionally equivalent!");
}

// Example usage demonstrations
if (typeof window !== "undefined") {
  console.log("=== Browser DIE Examples ===\n");
  console.log("DIE now supports calling alert/toast functions directly!");
  console.log("Examples:");
  console.log("  - DIE(alert, 'Error message')");
  console.log("  - DIE(toast.error, 'Failed to upload')");
  console.log("  - DIE(console.error, 'Network issue:', 500)");
  console.log("\nRun these functions from your browser console:");
  console.log("- validateLoginForm('user', 'pass')");
  console.log("- submitFormWithAlert({ email: '', message: 'test' })");
  console.log("- uploadFile(null)");
  console.log("- processPayment(0, '')");
}

// Export functions for use in browser
export {
  validateLoginForm,
  submitFormWithAlert,
  submitFormWithAlertLegacy,
  loadUserProfile,
  uploadFile,
  processPayment,
  fetchUserData,
  validateCheckoutForm,
  deleteAccount,
  demonstrateComparison,
};
