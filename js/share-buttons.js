// Share Buttons Functionality
// Copyright (c) 2025 QuickCalcLabs. All Rights Reserved.

// Store result data for sharing - use window to ensure global access
window.shareResultData = {
  title: '',
  result: '',
  category: '',
  pageUrl: ''
};

/**
 * Initialize share buttons with result data
 * @param {string} title - Calculator title (e.g., "BMI Calculator")
 * @param {string} result - The calculated result (e.g., "25.4")
 * @param {string} category - Result category/rating (e.g., "Normal Weight")
 * @param {string} pageUrl - URL of the calculator page (optional, defaults to current page)
 */
function initShareButtons(title, result, category, pageUrl) {
  window.shareResultData.title = title || 'Calculator';
  window.shareResultData.result = String(result || '');
  window.shareResultData.category = category || '';
  window.shareResultData.pageUrl = pageUrl || window.location.href.split('?')[0];
  
  // Show share buttons container if hidden
  const shareContainer = document.getElementById('shareButtonsContainer');
  if (shareContainer) {
    shareContainer.style.display = 'block';
  }
  
  // Debug log to verify data is set
  console.log('Share buttons initialized with:', window.shareResultData);
}

/**
 * Generate share text with result included
 */
function getShareText() {
  const data = window.shareResultData;
  let text = `I just used the ${data.title}! `;
  
  if (data.result && data.category) {
    text += `My result: ${data.result} (${data.category}). `;
  } else if (data.result) {
    text += `My result: ${data.result}. `;
  }
  
  text += `Try it yourself:`;
  return text;
}

/**
 * Get the page URL for sharing
 */
function getShareUrl() {
  return window.shareResultData.pageUrl || window.location.href.split('?')[0];
}

/**
 * Share to Twitter/X
 */
function shareToTwitter() {
  const url = getShareUrl();
  const text = getShareText();
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
}

/**
 * Share to Facebook
 */
function shareToFacebook() {
  const url = getShareUrl();
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(getShareText())}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
}

/**
 * Share to LinkedIn
 */
function shareToLinkedIn() {
  const url = getShareUrl();
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
}

/**
 * Share to WhatsApp
 */
function shareToWhatsApp() {
  const url = getShareUrl();
  const text = `${getShareText()} ${url}`;
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(shareUrl, '_blank');
}

/**
 * Share to Reddit
 */
function shareToReddit() {
  const url = getShareUrl();
  const text = getShareText();
  const shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
  window.open(shareUrl, '_blank', 'width=800,height=600');
}

/**
 * Share via Email
 */
function shareToEmail() {
  const url = getShareUrl();
  const subject = `Check out my ${window.shareResultData.title} result!`;
  let body = getShareText();
  body += `\n\n${url}\n\nQuickCalcLabs offers free calculators to help you understand your health and wellness.`;
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Copy result and link to clipboard
 */
function copyToClipboard() {
  const url = getShareUrl();
  const text = `${getShareText()} ${url}`;
  
  navigator.clipboard.writeText(text).then(() => {
    // Show success feedback
    const copyBtn = document.getElementById('shareCopyBtn');
    if (copyBtn) {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span>✓</span> Copied!';
      copyBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = '';
      }, 2000);
    }
  }).catch(err => {
    console.error('Failed to copy:', err);
    alert('Failed to copy to clipboard. Please try again.');
  });
}

/**
 * Generate share buttons HTML
 * Call this function to get the HTML for share buttons
 */
function getShareButtonsHTML() {
  return `
    <div id="shareButtonsContainer" class="share-buttons-container" style="display: none;">
      <p class="share-title">📤 Share Your Results</p>
      <div class="share-buttons">
        <button type="button" class="share-btn twitter" onclick="shareToTwitter()" title="Share on X/Twitter"><span>𝕏</span></button>
        <button type="button" class="share-btn facebook" onclick="shareToFacebook()" title="Share on Facebook"><span>f</span></button>
        <button type="button" class="share-btn linkedin" onclick="shareToLinkedIn()" title="Share on LinkedIn"><span>in</span></button>
        <button type="button" class="share-btn whatsapp" onclick="shareToWhatsApp()" title="Share on WhatsApp"><span>💬</span></button>
        <button type="button" class="share-btn reddit" onclick="shareToReddit()" title="Share on Reddit"><span>↗</span></button>
        <button type="button" class="share-btn email" onclick="shareToEmail()" title="Share via Email"><span>✉️</span></button>
        <button type="button" class="share-btn copy" id="shareCopyBtn" onclick="copyToClipboard()" title="Copy to Clipboard"><span>📋</span></button>
      </div>
    </div>
  `;
}

