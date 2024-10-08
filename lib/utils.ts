import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import SHA256 from 'crypto-js/sha256';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hashSecret = (secret: string) => {
  // Hash the secret using SHA-256
  const hash = SHA256(secret).toString();
  return hash;
};
