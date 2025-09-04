(function(){
  function isMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!isMobile()) return;

    const header = document.querySelector('.site-header') || document.querySelector('header');
    if (!header) return;

    // find or create hamburger button
    let hamburger = header.querySelector('#fym-hamburger');
    if (!hamburger) {
      hamburger = document.createElement('button');
      hamburger.id = 'fym-hamburger';
      hamburger.className = 'fym-hamburger';
      hamburger.setAttribute('aria-label', 'Open menu');
      hamburger.innerHTML = '&#9776;';
      const navBefore = header.querySelector('nav');
      header.insertBefore(hamburger, navBefore || header.firstChild);
    }

    // create mobile menu
    let mobileMenu = document.getElementById('fym-mobile-menu');
    if (!mobileMenu) {
      mobileMenu = document.createElement('div');
      mobileMenu.id = 'fym-mobile-menu';
      header.appendChild(mobileMenu);
    }

    Object.assign(mobileMenu.style, {
      display: 'none',
      position: 'absolute',
      top: (header.offsetHeight) + 'px',
      left: '0',
      right: '0',
      background: '#fff',
      zIndex: 9999,
      padding: '6px 0',
      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
      maxHeight: (window.innerHeight - header.offsetHeight - 10) + 'px',
      overflowY: 'auto'
    });

    Object.assign(hamburger.style, {
      fontSize: '22px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '6px 10px',
      color: '#111'
    });

    function createMenuItemFrom(el) {
      if (el.tagName === 'A') {
        const a = document.createElement('a');
        a.href = el.getAttribute('href') || '#';
        a.textContent = el.textContent.trim() || 'Link';
        Object.assign(a.style, {
          display: 'block',
          padding: '12px 16px',
          color: '#111',
          textDecoration: 'none'
        });
        a.addEventListener('click', () => { mobileMenu.style.display = 'none'; });
        return a;
      }
      if (el.tagName === 'BUTTON') {
        const btn = document.createElement('button');
        btn.textContent = el.textContent.trim();
        Object.assign(btn.style, {
          display: 'block',
          padding: '12px 16px',
          width: '100%',
          textAlign: 'center',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer'
        });
        btn.addEventListener('click', () => {
          el.click();
          mobileMenu.style.display = 'none';
        });
        return btn;
      }
      return null;
    }

    function fillMenu() {
      mobileMenu.innerHTML = '';
      const origNav = header.querySelector('nav');
      if (!origNav) return;
      Array.from(origNav.children).forEach(child => {
        const item = createMenuItemFrom(child);
        if (item) mobileMenu.appendChild(item);
      });
    }

    hamburger.addEventListener('click', function () {
      if (mobileMenu.style.display === 'none') {
        fillMenu();
        mobileMenu.style.display = 'block';
      } else {
        mobileMenu.style.display = 'none';
      }
    });

    document.addEventListener('click', function (e) {
      if (mobileMenu.style.display === 'block' && !header.contains(e.target)) {
        mobileMenu.style.display = 'none';
      }
    });
  });
})();
