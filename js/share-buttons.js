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
 * Generate share buttons HTML with inline styles for maximum compatibility
 */
function getShareButtonsHTML() {
  const containerStyle = "display:none;margin-top:1.5rem;padding-top:1.5rem;border-top:2px solid rgba(139,92,246,0.2);text-align:center;";
  const titleStyle = "font-size:0.95rem;font-weight:700;margin:0 0 1rem;color:#334155;";
  const wrapperStyle = "display:flex;gap:10px;justify-content:center;flex-wrap:wrap;align-items:center;";
  const btnBase = "display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;font-size:1rem;cursor:pointer;border:none;color:white;padding:0;margin:0;box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:transform 0.2s ease;";
  
  return `
    <div id="shareButtonsContainer" style="${containerStyle}">
      <p style="${titleStyle}">📤 Share Your Results</p>
      <div style="${wrapperStyle}">
        <button type="button" onclick="shareToTwitter()" title="Share on X" style="${btnBase}background:#000;"><span style="line-height:1;">𝕏</span></button>
        <button type="button" onclick="shareToFacebook()" title="Share on Facebook" style="${btnBase}background:#1877f2;font-weight:700;"><span style="line-height:1;">f</span></button>
        <button type="button" onclick="shareToLinkedIn()" title="Share on LinkedIn" style="${btnBase}background:#0077b5;font-weight:700;font-size:0.85rem;"><span style="line-height:1;">in</span></button>
        <button type="button" onclick="shareToWhatsApp()" title="Share on WhatsApp" style="${btnBase}background:#25d366;"><span style="line-height:1;">💬</span></button>
        <button type="button" onclick="shareToReddit()" title="Share on Reddit" style="${btnBase}background:#ff4500;"><span style="line-height:1;">↗</span></button>
        <button type="button" onclick="shareToEmail()" title="Share via Email" style="${btnBase}background:#6b7280;"><span style="line-height:1;">✉️</span></button>
        <button type="button" id="shareCopyBtn" onclick="copyToClipboard()" title="Copy Results" style="${btnBase}background:linear-gradient(135deg,#8b5cf6,#3b82f6);"><span style="line-height:1;">📋</span></button>
      </div>
    </div>
  `;
}

