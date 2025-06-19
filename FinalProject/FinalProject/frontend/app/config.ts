// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
export const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10);

// Auth Configuration
export const AUTH_TOKEN_KEY = 'token';
export const USER_DATA_KEY = 'user';

// File Upload Configuration
export const UPLOAD_MAX_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Pagination Configuration
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100; 