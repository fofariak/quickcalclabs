// Auto-insert Adsterra ads on page load
document.addEventListener('DOMContentLoaded', function() {
  
  // Top Banner Ad (after header)
  const header = document.querySelector('header.header');
  if (header) {
    const topAdDiv = document.createElement('div');
    topAdDiv.style.cssText = 'text-align: center; margin: 1rem auto; max-width: 728px;';
    topAdDiv.innerHTML = `
      <script type="text/javascript">
        atOptions = {
          'key' : '0de91e75ba228521bd7fab6f364aa7be',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      </scr` + `ipt>
      <script type="text/javascript" src="https://www.effectivegatecpm.com/0de91e75ba228521bd7fab6f364aa7be/invoke.js"></scr` + `ipt>
    `;
    header.insertAdjacentElement('afterend', topAdDiv);
  }
  
  // Footer Banner Ad (before footer)
  const footer = document.querySelector('footer');
  if (footer) {
    const footerAdDiv = document.createElement('div');
    footerAdDiv.style.cssText = 'text-align: center; margin: 2rem auto; max-width: 728px;';
    footerAdDiv.innerHTML = `
      <script type="text/javascript">
        atOptions = {
          'key' : '0de91e75ba228521bd7fab6f364aa7be',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      </scr` + `ipt>
      <script type="text/javascript" src="https://www.effectivegatecpm.com/0de91e75ba228521bd7fab6f364aa7be/invoke.js"></scr` + `ipt>
    `;
    footer.insertAdjacentElement('beforebegin', footerAdDiv);
  }
});
