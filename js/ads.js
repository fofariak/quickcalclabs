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

// Social Bar
function renderSocialBar() {
  const loadSocialBar = () => {
    if (document.getElementById('social-bar-script')) {
      return;
    }

    const container = document.createElement('div');
    container.id = 'social-bar-container';
    document.body.appendChild(container);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.id = 'social-bar-script';
    script.src = 'https://pl28110863.effectivegatecpm.com/54/37/8e/54378e3408f52b6ab19929b6dbba5157.js';
    container.appendChild(script);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSocialBar, { once: true });
  } else {
    loadSocialBar();
  }
}
