#!/usr/bin/env bun
/**
 * Node.js Example: Using DIE for environment variable validation
 *
 * This example demonstrates how to use DIE to validate required environment
 * variables in a Node.js application with proper error handling.
 */

import DIE from "../index.ts";

// Example 1: Basic environment variable validation
function connectToDatabase() {
  const dbHost = process.env.DB_HOST ?? DIE("Missing DB_HOST environment variable");
  const dbPort = process.env.DB_PORT ?? DIE("Missing DB_PORT environment variable");
  const dbName = process.env.DB_NAME ?? DIE("Missing DB_NAME environment variable");

  console.log(`Connecting to database at ${dbHost}:${dbPort}/${dbName}`);
  return { dbHost, dbPort, dbName };
}

// Example 2: Using tagged templates with interpolated values
function validateApiConfig() {
  const apiKey = process.env.API_KEY;
  const apiUrl = process.env.API_URL;

  if (!apiKey) {
    DIE`Missing required environment variable: ${"API_KEY"}`;
  }

  if (!apiUrl) {
    DIE`Missing required environment variable: ${"API_URL"}`;
  }

  console.log(`API configured: ${apiUrl}`);
  return { apiKey, apiUrl };
}

// Example 3: Multiple validations with descriptive errors
function initializeApp() {
  const config = {
    port: process.env.PORT ?? DIE("PORT not set - please provide a port number"),
    nodeEnv: process.env.NODE_ENV ?? DIE("NODE_ENV not set - use 'development' or 'production'"),
    logLevel: process.env.LOG_LEVEL ?? "info", // Optional with default
  };

  // Validate port is a number
  const portNum = parseInt(config.port);
  if (isNaN(portNum)) {
    DIE`Invalid PORT value: ${config.port} - must be a number`;
  }

  console.log(`App initialized on port ${portNum} in ${config.nodeEnv} mode`);
  return { ...config, port: portNum };
}

// Example 4: Error object usage
function loadSecrets() {
  const secret = process.env.SECRET_KEY;

  if (!secret) {
    DIE("SECRET_KEY environment variable is required for security");
  }

  console.log("Secrets loaded successfully");
  return secret;
}

// Example 5: Conditional validation with tagged templates
function setupCloudProvider() {
  const provider = process.env.CLOUD_PROVIDER ?? "aws";

  if (provider === "aws") {
    const accessKey =
      process.env.AWS_ACCESS_KEY_ID ?? DIE`AWS provider requires ${"AWS_ACCESS_KEY_ID"}`;
    const secretKey =
      process.env.AWS_SECRET_ACCESS_KEY ?? DIE`AWS provider requires ${"AWS_SECRET_ACCESS_KEY"}`;

    console.log("AWS credentials configured");
    return { provider, accessKey, secretKey };
  }

  if (provider === "gcp") {
    const projectId = process.env.GCP_PROJECT_ID ?? DIE`GCP provider requires ${"GCP_PROJECT_ID"}`;

    console.log(`GCP project configured: ${projectId}`);
    return { provider, projectId };
  }

  DIE`Unsupported cloud provider: ${provider}`;
}

// Run examples
if (import.meta.main) {
  console.log("=== Node.js DIE Examples ===\n");

  try {
    console.log("Example 1: Database connection");
    // Set some env vars for demo
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5432";
    process.env.DB_NAME = "myapp";
    connectToDatabase();
    console.log("✓ Success\n");
  } catch (error) {
    console.error("✗ Error:", error, "\n");
  }

  try {
    console.log("Example 2: API config validation");
    process.env.API_KEY = "test-key-123";
    process.env.API_URL = "https://api.example.com";
    validateApiConfig();
    console.log("✓ Success\n");
  } catch (error) {
    console.error("✗ Error:", error, "\n");
  }

  try {
    console.log("Example 3: App initialization");
    process.env.PORT = "3000";
    process.env.NODE_ENV = "development";
    initializeApp();
    console.log("✓ Success\n");
  } catch (error) {
    console.error("✗ Error:", error, "\n");
  }

  try {
    console.log("Example 4: Secret loading (will fail - SECRET_KEY not set)");
    loadSecrets();
    console.log("✓ Success\n");
  } catch (error) {
    console.error("✗ Error:", error, "\n");
  }

  try {
    console.log("Example 5: Cloud provider setup");
    process.env.CLOUD_PROVIDER = "aws";
    process.env.AWS_ACCESS_KEY_ID = "AKIA...";
    process.env.AWS_SECRET_ACCESS_KEY = "secret";
    setupCloudProvider();
    console.log("✓ Success\n");
  } catch (error) {
    console.error("✗ Error:", error, "\n");
  }
}
