// Banner 728x90
function renderAdBanner728x90(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    // Set atOptions on window
    window.atOptions = {
      'key' : '0f30d8d002656d29a062c88d9dd54fa9',
      'format' : 'iframe',
      'height' : 90,
      'width' : 728,
      'params' : {}
    };
    
    // Create invoke script
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = '//www.highperformanceformat.com/0f30d8d002656d29a062c88d9dd54fa9/invoke.js';
    container.appendChild(invokeScript);
  }
}

// Banner 320x50
function renderAdBanner320x50(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    // Set atOptions on window
    window.atOptions = {
      'key' : '1bd80cb650cefb9e21bdb1bb21def2c7',
      'format' : 'iframe',
      'height' : 50,
      'width' : 320,
      'params' : {}
    };
    
    // Create invoke script
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = '//www.highperformanceformat.com/1bd80cb650cefb9e21bdb1bb21def2c7/invoke.js';
    container.appendChild(invokeScript);
  }
}

// Banner 300x250
function renderAdBanner300x250(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    // Set atOptions on window
    window.atOptions = {
      'key' : '21c3bdcbb595adb2c550f8c8d41ef140',
      'format' : 'iframe',
      'height' : 250,
      'width' : 300,
      'params' : {}
    };
    
    // Create invoke script
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = '//www.highperformanceformat.com/21c3bdcbb595adb2c550f8c8d41ef140/invoke.js';
    container.appendChild(invokeScript);
  }
}

// Social Bar
function renderSocialBar() {
  const script = document.createElement('script');
  script.src = '//pl28110863.effectivegatecpm.com/54/37/8e/54378e3408f52b6ab19929b6dbba5157.js';
  document.body.appendChild(script);
}
