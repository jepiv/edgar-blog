// Determine if we're running in production (GitHub Pages)
const isProduction = import.meta.env.MODE === 'production';

// Set the base URL depending on environment
export const BASE_URL = isProduction ? '/EdgarBlog/' : '/';
