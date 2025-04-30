/**
 * API Service
 * This file contains functions for communicating with the backend API
 */

/**
 * Submit contact form data to the server
 * @param {Object} formData - The contact form data
 * @param {string} formData.name - The user's name
 * @param {string} formData.email - The user's email address
 * @param {string} formData.subject - The subject of the message
 * @param {string} formData.message - The message content
 * @returns {Promise<Object>} - The server response
 */
async function submitContactForm(formData) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Submit a product review to the server
 * @param {Object} reviewData - The review data
 * @param {number} reviewData.product_id - The ID of the product being reviewed
 * @param {string} reviewData.name - The name of the reviewer
 * @param {number} reviewData.rating - The rating (1-5)
 * @param {string} reviewData.comment - The review comment
 * @returns {Promise<Object>} - The server response
 */
async function submitProductReview(reviewData) {
  try {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Get reviews for a specific product
 * @param {number} productId - The ID of the product
 * @returns {Promise<Array>} - Array of review objects
 */
async function getProductReviews(productId) {
  try {
    const response = await fetch(`/api/products/${productId}/reviews`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

/**
 * Get all products
 * @returns {Promise<Array>} - Array of product objects
 */
async function getAllProducts() {
  try {
    const response = await fetch('/api/products');
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Get a product by ID
 * @param {number} productId - The ID of the product
 * @returns {Promise<Object|null>} - The product object or null if not found
 */
async function getProductById(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch product');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}