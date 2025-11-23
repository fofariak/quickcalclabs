const adRenderQueue = [];
let isProcessingAdQueue = false;

function enqueueAdSlot(slotConfig) {
  adRenderQueue.push(slotConfig);
  processAdQueue();
}

function processAdQueue() {
  if (isProcessingAdQueue) {
    return;
  }

  const nextSlot = adRenderQueue.shift();
  if (!nextSlot) {
    return;
  }

  isProcessingAdQueue = true;
  renderAdSlot(nextSlot).finally(() => {
    isProcessingAdQueue = false;
    processAdQueue();
  });
}

function renderAdSlot({ containerId, options, scriptSrc }) {
  return new Promise((resolve) => {
    const container = document.getElementById(containerId);
    if (!container) {
      resolve();
      return;
    }

    container.innerHTML = '';
    window.atOptions = options;

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = scriptSrc;
    invokeScript.onload = () => {
      delete window.atOptions;
      resolve();
    };
    invokeScript.onerror = () => {
      delete window.atOptions;
      resolve();
    };

    container.appendChild(invokeScript);
  });
}

// Banner 728x90
function renderAdBanner728x90(containerId) {
  enqueueAdSlot({
    containerId,
    options: {
      key: '0f30d8d002656d29a062c88d9dd54fa9',
      format: 'iframe',
      height: 90,
      width: 728,
      params: {}
    },
    scriptSrc: '//www.highperformanceformat.com/0f30d8d002656d29a062c88d9dd54fa9/invoke.js'
  });
}

// Banner 320x50
function renderAdBanner320x50(containerId) {
  enqueueAdSlot({
    containerId,
    options: {
      key: '1bd80cb650cefb9e21bdb1bb21def2c7',
      format: 'iframe',
      height: 50,
      width: 320,
      params: {}
    },
    scriptSrc: '//www.highperformanceformat.com/1bd80cb650cefb9e21bdb1bb21def2c7/invoke.js'
  });
}

// Banner 300x250
function renderAdBanner300x250(containerId) {
  enqueueAdSlot({
    containerId,
    options: {
      key: '21c3bdcbb595adb2c550f8c8d41ef140',
      format: 'iframe',
      height: 250,
      width: 300,
      params: {}
    },
    scriptSrc: '//www.highperformanceformat.com/21c3bdcbb595adb2c550f8c8d41ef140/invoke.js'
  });
}

// Social Bar - Auto-load
function loadSocialBar() {
  if (document.getElementById('social-bar-container') || !document.body) {
    return;
  }

  const container = document.createElement('div');
  container.id = 'social-bar-container';

  const iframe = document.createElement('iframe');
  iframe.id = 'social-bar-iframe';
  iframe.src = 'social-bar.html';
  iframe.title = 'Promoted social links';
  iframe.loading = 'lazy';

  container.appendChild(iframe);
  document.body.appendChild(container);
}

// Adsterra Referral Banner - Side sticky banner
function createReferralBanner() {
  if (document.getElementById('adsterra-referral-banner-top') || !document.body) {
    return;
  }

  const banner = document.createElement('div');
  banner.id = 'adsterra-referral-banner-top';
  banner.innerHTML =
    '<a href="https://publishers.adsterra.com/referral/yMDebIPSeq" target="_blank" rel="nofollow"><img alt="Adsterra referral" src="https://landings-cdn.adsterratech.com/referralBanners/gif/720x90_adsterra_reff.gif" /></a>';

  const topAd = document.getElementById('ad-banner-top');
  if (topAd && topAd.parentNode) {
    topAd.parentNode.insertBefore(banner, topAd);
  } else {
    document.body.insertBefore(banner, document.body.firstChild);
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    loadSocialBar();
    createReferralBanner();
  });
} else {
  // DOM already loaded
  loadSocialBar();
  createReferralBanner();
}
