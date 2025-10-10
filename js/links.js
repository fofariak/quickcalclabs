// Product Links Configuration
// Store all your external product links here

const productLinks = {
  // Time & Age Related Products
  'star-maps': 'https://amzn.to/4ofq491',
  'time-capsule': 'https://amzn.to/48ngX1k',
  'hourglass': 'https://amzn.to/4nIMSy5',
  'digital-food-scale': 'https://amzn.to/432Pkaa',
  'meal-prep-containers': 'https://amzn.to/46HSOkL',
  'smart-weight-body-scale': 'https://amzn.to/3KHaJj1',
  'fitbit-charge': 'https://amzn.to/3WuDrGh',
  'smartring': 'https://amzn.to/4mUwXLK',
  'walking-shoes':  'https://amzn.to/4obuUnA',
  'skincare': 'https://amzn.to/46VwIKj',
  'books-on-aging': 'https://amzn.to/3Wt0dOL',
  'baby-monitor': 'https://amzn.to/4h3GHCa',
  'play-kits': 'https://amzn.to/48na8gc',
  'dream-sock': 'https://amzn.to/46T8SQV',
  'prenatal-vitamin': 'https://amzn.to/4pZQSf7',
  'cookbooks': 'https://amzn.to/4n4EDuZ',
  'water-bottle': 'https://amzn.to/4ohHulq',
  'portion-control': 'https://amzn.to/4736PIP',
  'fat-clippers': 'https://amzn.to/3WwRcEp',
  'fitness-trackers': 'https://amzn.to/3ITyow8',
  'smoothie-blender': 'https://amzn.to/479TtKW',
  'protein-powder': 'https://amzn.to/43d6jqe',
  'macro-guide': 'https://amzn.to/42Clg53',
  'nursing-pillow': 'https://amzn.to/4nMasde',
  'feeding-bottle': 'https://amzn.to/3L3rS6s',
  'opk-kit': 'https://amzn.to/48pYSzB',
  'basal-thermometer': 'https://amzn.to/4obGM8W',
  'insulated-bottle': 'https://amzn.to/4odoBQs',
  'infused-pitcher': 'https://amzn.to/3WtWG2O',
  'electrolyte-powder': 'https://amzn.to/3KLMsbu',
  'healthy-cookbook': 'https://amzn.to/4h9if2e',
  'adjustable-dumbbell': 'https://amzn.to/4nUJkZx',
  'resistance-bands': 'https://amzn.to/4h2ylum',
  'high-chair': 'https://amzn.to/3KMzlGY',
  'baby-spoon': 'https://amzn.to/4o6BADi',
  'silicone-bibs': 'https://amzn.to/42wi379',
  'pregnancy-pillow': 'https://amzn.to/46WzPSh',
  'pregnancy-book': 'https://amzn.to/3ISmB14',
  'women-footwear': 'https://amzn.to/473ASA7',
  'support-belt': 'https://amzn.to/46OB6fC',
  'blackout-curtains': 'https://amzn.to/48UhxUj',
  'sleep-gummies': 'https://amzn.to/4n9O8t2',
  'pregnancy-clothes': 'https://amzn.to/4oe9whw',
  'stretch-mark': 'https://amzn.to/3J5CSQc',
  'water-filter': 'https://amzn.to/3J15RVd',
  
  
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
