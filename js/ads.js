// ads.js - Advanced version
function loadAdBanner(position, key) {
  const adDiv = document.createElement('div');
  adDiv.id = 'ad-container-' + position;
  adDiv.style.textAlign = 'center';
  adDiv.style.margin = '1rem auto';
  adDiv.style.maxWidth = '728px';

  const optionsScript = document.createElement('script');
  optionsScript.type = 'text/javascript';
  optionsScript.text = `
    atOptions = {
      'key' : '${key}',
      'format' : 'iframe',
      'height' : 90,
      'width' : 728,
      'params' : {}
    };
  `;

  const invokeScript = document.createElement('script');
  invokeScript.type = 'text/javascript';
  invokeScript.src = '//www.highperformanceformat.com/${key}/invoke.js';
  invokeScript.async = true;

  adDiv.appendChild(optionsScript);
  adDiv.appendChild(invokeScript);

  return adDiv;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    // Top ad (after body opens)
    document.body.insertAdjacentElement('afterbegin', loadAdBanner(1, '0f30d8d002656d29a062c88d9dd54fa9'));
    
    // Middle ad (after first paragraph)
    const firstP = document.querySelector('p');
    if (firstP) {
      firstP.insertAdjacentElement('afterend', loadAdBanner(2, '0f30d8d002656d29a062c88d9dd54fa9'));
    }
    
    // Bottom ad (before body closes)
    document.body.appendChild(loadAdBanner(3, '0f30d8d002656d29a062c88d9dd54fa9'));
  });
} else {
  document.body.insertAdjacentElement('afterbegin', loadAdBanner(1, '0f30d8d002656d29a062c88d9dd54fa9'));
  const firstP = document.querySelector('p');
  if (firstP) {
    firstP.insertAdjacentElement('afterend', loadAdBanner(2, '0f30d8d002656d29a062c88d9dd54fa9'));
  }
  document.body.appendChild(loadAdBanner(3, '0f30d8d002656d29a062c88d9dd54fa9'));
}
