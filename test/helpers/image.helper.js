/**
 * Image Helper Class
 * Provides utility functions for image URL validation and processing
 */
class ImageHelper {
    /**
     * Check if URL is from a specific domain
     * @param {string} url - The URL to check
     * @param {string} domain - The domain to match
     * @returns {boolean} True if URL contains the domain
     */
    static isFromDomain(url, domain) {
        return url.includes(domain);
    }

    /**
     * Extract domain from URL
     * @param {string} url - The URL to parse
     * @returns {string} The hostname from the URL
     */
    static getDomainFromUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (error) {
            return 'unknown';
        }
    }

    /**
     * Validate if URL is a valid image URL
     * @param {string} url - The URL to validate
     * @returns {boolean} True if valid image URL format
     */
    static isValidImageUrl(url) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)/i.test(url) || 
               url.startsWith('https://images.unsplash.com') ||
               url.includes('gstatic.com/shopping');
    }

    /**
     * Get image file extension from URL
     * @param {string} url - The URL to parse
     * @returns {string} The file extension or 'unknown'
     */
    static getImageExtension(url) {
        const match = url.match(/\.(jpg|jpeg|png|gif|webp|svg)/i);
        return match ? match[1] : 'unknown';
    }
}

module.exports = ImageHelper;