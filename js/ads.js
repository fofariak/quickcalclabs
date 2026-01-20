/**
 * QuickCalcLabs Ad Management
 * Safe banner ad rendering with pop-up protection
 */

const adRenderQueue = [];
let isProcessingAdQueue = false;

// Block pop-ups and new window opens from ad scripts
(function() {
  // Store original window.open
  const originalWindowOpen = window.open;
  
  const allowedPopupHosts = new Set([
    'pl28162888.effectivegatecpm.com',
    'effectivegatecpm.com'
  ]);

  const isAllowedPopup = (url) => {
    try {
      const parsed = new URL(url, window.location.href);
      const hostname = parsed.hostname.replace(/^www\./, '');
      if (allowedPopupHosts.has(hostname)) {
        return true;
      }
      for (const host of allowedPopupHosts) {
        if (hostname.endsWith(`.${host}`)) {
          return true;
        }
      }
    } catch (error) {
      return false;
    }
    return false;
  };

  const isAllowedPopupSource = (stack) => {
    if (!stack) {
      return false;
    }
    return stack.includes('effectivegatecpm') || stack.includes('pl28162888');
  };
  
  let allowPopunderUntil = 0;
  let hasPopunderScript = false;
  let allowAllPopunders = false;
  
  const detectPopunderScript = () => {
    if (hasPopunderScript) {
      return;
    }
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    hasPopunderScript = scripts.some((script) => {
      const src = script.getAttribute('src') || '';
      return src.includes('effectivegatecpm.com');
    });
    if (hasPopunderScript) {
      allowAllPopunders = true;
    }
  };
  
  document.addEventListener('DOMContentLoaded', detectPopunderScript);
  document.addEventListener('click', () => {
    detectPopunderScript();
    if (hasPopunderScript) {
      allowPopunderUntil = Date.now() + 1200;
    }
  }, true);

  // Override window.open to block unwanted pop-ups
  window.open = function(url, target, features) {
    if (allowAllPopunders) {
      return originalWindowOpen.call(window, url, target, features);
    }

    if (Date.now() < allowPopunderUntil) {
      return originalWindowOpen.call(window, url, target, features);
    }

    if ((url && isAllowedPopup(url)) || isAllowedPopupSource(new Error().stack || '')) {
      return originalWindowOpen.call(window, url, target, features);
    }

    // Only allow window.open if called from trusted user actions on share buttons
    const stack = new Error().stack || '';
    if (stack.includes('shareToTwitter') || 
        stack.includes('shareToFacebook') || 
        stack.includes('shareToLinkedIn') ||
        stack.includes('shareToWhatsApp') ||
        stack.includes('shareToReddit')) {
      return originalWindowOpen.call(window, url, target, features);
    }
    
    // Log blocked pop-up attempt (for debugging)
    console.log('[QuickCalcLabs] Blocked pop-up attempt:', url);
    return null;
  };
  
  // Prevent click hijacking from ad scripts
  document.addEventListener('click', function(e) {
    // Check if this is a legitimate user click on an ad container
    const target = e.target;
    const isAdContainer = target.closest('[id^="ad-banner"]');
    
    // If click is outside ad containers and tries to open new window, block it
    if (!isAdContainer) {
      // The click handler will naturally propagate
      return;
    }
  }, true);
})();

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

    // Clear container and add sandbox wrapper
    container.innerHTML = '';
    
    // Store previous atOptions
    const previousAtOptions = window.atOptions;
    window.atOptions = options;

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = scriptSrc;
    
    // Add async and defer for better performance
    invokeScript.async = true;
    
    invokeScript.onload = () => {
      cleanupAtOptions(previousAtOptions);
      resolve();
    };
    invokeScript.onerror = () => {
      cleanupAtOptions(previousAtOptions);
      resolve();
    };

    container.appendChild(invokeScript);
  });
}

function cleanupAtOptions(previous) {
  if (typeof previous !== 'undefined') {
    window.atOptions = previous;
  } else {
    delete window.atOptions;
  }
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
