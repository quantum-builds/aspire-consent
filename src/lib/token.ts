import { randomBytes } from "crypto";

export function generateToken(length: number = 32): string {
  if (length < 16) {
    throw new Error("Token length must be at least 16 characters");
  }

  // Generate cryptographically secure random bytes
  const buffer = randomBytes(length);

  // Convert to Base64URL format (URL-safe)
  return buffer
    .toString("base64")
    .replace(/\+/g, "-") // Replace '+' with '-'
    .replace(/\//g, "_") // Replace '/' with '_'
    .replace(/=/g, ""); // Remove padding
}

export function generateUUIDToken(): string {
  return crypto.randomUUID();
}
