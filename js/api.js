/**
 * API Service
 * This file contains functions for communicating with the backend API
 * with localStorage fallback for demonstration purposes
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
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting contact form:', error);
    
    // Fallback to localStorage
    try {
      // Get existing contact submissions from localStorage or initialize empty array
      const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
      
      // Add timestamp to the submission
      const newSubmission = {
        ...formData,
        id: Date.now(),
        created_at: new Date().toISOString()
      };
      
      // Add the new submission to the array
      submissions.push(newSubmission);
      
      // Save the updated array back to localStorage
      localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
      
      return { 
        success: true, 
        message: 'Your message has been submitted successfully!',
        data: newSubmission
      };
    } catch (storageError) {
      console.error('Error using localStorage fallback:', storageError);
      return { success: false, error: 'Network error and localStorage fallback failed' };
    }
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
    const response = await fetch('http://localhost:3000/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting review:', error);
    
    // Fallback to localStorage
    try {
      // Get existing reviews from localStorage or initialize empty array
      const storageKey = `productReviews_${reviewData.product_id}`;
      const reviews = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Add timestamp and ID to the review
      const newReview = {
        ...reviewData,
        id: Date.now(),
        created_at: new Date().toISOString()
      };
      
      // Add the new review to the array
      reviews.push(newReview);
      
      // Save the updated array back to localStorage
      localStorage.setItem(storageKey, JSON.stringify(reviews));
      
      return { 
        success: true, 
        message: 'Your review has been submitted successfully!',
        data: newReview
      };
    } catch (storageError) {
      console.error('Error using localStorage fallback:', storageError);
      return { success: false, error: 'Network error and localStorage fallback failed' };
    }
  }
}

/**
 * Get reviews for a specific product
 * @param {number} productId - The ID of the product
 * @returns {Promise<Array>} - Array of review objects
 */
async function getProductReviews(productId) {
  try {
    const response = await fetch(`http://localhost:3000/api/reviews?productId=${productId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    
    // Fallback to localStorage
    try {
      const storageKey = `productReviews_${productId}`;
      const reviews = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return reviews;
    } catch (storageError) {
      console.error('Error retrieving from localStorage:', storageError);
      return [];
    }
  }
}

/**
 * Get all products
 * @returns {Promise<Array>} - Array of product objects
 */
async function getAllProducts() {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    
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
    const response = await fetch(`/api/products?id=${productId}`);
    
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