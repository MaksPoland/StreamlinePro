// API functions for Kardio Health website

// Function to submit contact form
async function submitContactForm(formData) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { 
      success: false, 
      error: 'Failed to submit form. Please try again later.' 
    };
  }
}

// Function to submit product review
async function submitProductReview(reviewData) {
  try {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting review:', error);
    return { 
      success: false, 
      error: 'Failed to submit review. Please try again later.' 
    };
  }
}

// Function to get product reviews
async function getProductReviews(productId) {
  try {
    const response = await fetch(`/api/products/${productId}/reviews`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return [];
  }
}

// Function to get all products
async function getAllProducts() {
  try {
    const response = await fetch('/api/products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Function to get product by ID
async function getProductById(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}