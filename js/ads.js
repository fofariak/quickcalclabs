function renderAdSlot({ containerId, options, scriptSrc, delay = 0 }) {
  const loadAd = () => {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('Ad container not found:', containerId);
      return;
    }

    container.innerHTML = '';
    
    // Create inline script that sets atOptions
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.text = `window.atOptions = ${JSON.stringify(options)};`;
    container.appendChild(configScript);
    
    // Load the invoke script - it will read atOptions when it executes
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = scriptSrc;
    invokeScript.async = true;
    
    container.appendChild(invokeScript);
  };
  
  if (delay > 0) {
    setTimeout(loadAd, delay);
  } else {
    // Ensure DOM is ready for immediate loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadAd);
    } else {
      loadAd();
    }
  }
}

// Banner 728x90
function renderAdBanner728x90(containerId) {
  renderAdSlot({
    containerId,
    options: {
      key: '0f30d8d002656d29a062c88d9dd54fa9',
      format: 'iframe',
      height: 90,
      width: 728,
      params: {}
    },
    scriptSrc: '//www.highperformanceformat.com/0f30d8d002656d29a062c88d9dd54fa9/invoke.js',
    delay: 0
  });
}

// Banner 320x50
function renderAdBanner320x50(containerId) {
  renderAdSlot({
    containerId,
    options: {
      key: '1bd80cb650cefb9e21bdb1bb21def2c7',
      format: 'iframe',
      height: 50,
      width: 320,
      params: {}
    },
    scriptSrc: '//www.highperformanceformat.com/1bd80cb650cefb9e21bdb1bb21def2c7/invoke.js',
    delay: 1000
  });
}

// Banner 300x250
function renderAdBanner300x250(containerId) {
  renderAdSlot({
    containerId,
    options: {
      key: '21c3bdcbb595adb2c550f8c8d41ef140',
      format: 'iframe',
      height: 250,
      width: 300,
      params: {}
    },
    scriptSrc: '//www.highperformanceformat.com/21c3bdcbb595adb2c550f8c8d41ef140/invoke.js',
    delay: 2000
  });
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
    createReferralBanner();
  });
} else {
  // DOM already loaded
  createReferralBanner();
}
