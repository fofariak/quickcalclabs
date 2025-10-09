// Product Links Configuration
// Store all your external product links here

const productLinks = {
  // Time & Age Related Products
  'star-maps': 'https://amzn.to/3IRmdjq',
  'time-capsule': 'https://amzn.to/48ngX1k',
  'hourglass': 'https://amzn.to/3VWSjgt',
  
  // Add more products as needed
  // 'product-key': 'https://www.amazon.com/dp/PRODUCT_ID?tag=YOUR_AFFILIATE_TAG',
};

// Function to get product URL
function getProductUrl(productKey) {
  return productLinks[productKey] || '#';
}

// Function to open product link in new tab
function openProduct(productKey) {
  const url = getProductUrl(productKey);
  if (url !== '#') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

// Initialize product links on page load
document.addEventListener('DOMContentLoaded', function() {
  // Find all product links and attach click handlers
  document.querySelectorAll('[data-product]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const productKey = this.getAttribute('data-product');
      openProduct(productKey);
    });
  });
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { productLinks, getProductUrl, openProduct };
}
