import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

// Define cookie attributes interface
interface CookieAttributes {
  expires?: number;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

// Default cookie options
const defaultOptions: CookieAttributes = {
  expires: 30, // 30 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict'
};

/**
 * Sets a cookie with the provided name, value, and options
 */
export function setCookie(name: string, value: string, options: CookieAttributes = {}) {
  Cookies.set(name, value, { ...defaultOptions, ...options });
}

/**
 * Gets a cookie value by name
 */
export function getCookie(name: string) {
  return Cookies.get(name);
}

/**
 * Removes a cookie by name
 */
export function removeCookie(name: string) {
  Cookies.remove(name);
}

/**
 * Sets the admin token cookie
 */
export function setAdminToken(token: string) {
  setCookie('admin_token', token, { 
    expires: 30, // 30 days 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  });
}

/**
 * Gets the admin token from cookies
 */
export function getAdminToken() {
  return getCookie('admin_token');
}

/**
 * Removes the admin token cookie
 */
export function removeAdminToken() {
  removeCookie('admin_token');
}

/**
 * Generates a new CSRF token and stores it in a cookie
 */
export function generateCsrfToken() {
  const token = uuidv4();
  setCookie('csrf_token', token, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  });
  return token;
}

/**
 * Gets the current CSRF token, generating a new one if it doesn't exist
 */
export function getCsrfToken() {
  let token = getCookie('csrf_token');
  
  if (!token) {
    token = generateCsrfToken();
  }
  
  return token;
}

/**
 * Removes the CSRF token cookie
 */
export function removeCsrfToken() {
  removeCookie('csrf_token');
} 