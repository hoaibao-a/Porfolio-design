document.addEventListener('DOMContentLoaded', () => {
  // Lưu text gốc (tiếng Việt) của tất cả phần tử data-lang
  const elements = document.querySelectorAll('[data-lang]');
  const originalTexts = {};
  elements.forEach(el => {
    originalTexts[el.getAttribute('data-lang')] = el.textContent.trim();
  });

  // Bảng dịch sang tiếng Anh
  const translations = {
    nav_home: 'Home',
    nav_about: 'About',
    nav_projects: 'Projects',
    nav_contact: 'Contact',
    projects_title: 'My Projects',
    footer_name: 'Designer Name'
  };

  // Hàm đổi ngôn ngữ
  function switchLanguage(lang) {
    console.log('Switching to language:', lang); // Debug
    elements.forEach(el => {
      const key = el.getAttribute('data-lang');
      if (lang === 'vi') {
        el.textContent = originalTexts[key];
      } else if (lang === 'en') {
        el.textContent = translations[key] || originalTexts[key];
      }
    });
    localStorage.setItem('language', lang); // Lưu ngôn ngữ
  }

  // Lấy ngôn ngữ hiện tại từ localStorage
  const currentLang = localStorage.getItem('language') || 'vi';
  console.log('Current language on load:', currentLang); // Debug

  // Gắn sự kiện click và touchstart cho icon cờ
  const langVi = document.getElementById('lang-vi');
  const langEn = document.getElementById('lang-en');

  if (langVi) {
    ['click', 'touchstart'].forEach(event => {
      langVi.addEventListener(event, e => {
        e.preventDefault(); // Ngăn reload
        console.log('Vietnamese flag clicked/touched'); // Debug
        if (typeof setLanguage === 'function') {
          setLanguage('vi');
        } else {
          switchLanguage('vi');
        }
      });
    });
  }

  if (langEn) {
    ['click', 'touchstart'].forEach(event => {
      langEn.addEventListener(event, e => {
        e.preventDefault(); // Ngăn reload
        console.log('English flag clicked/touched'); // Debug
        if (typeof setLanguage === 'function') {
          setLanguage('en');
        } else {
          switchLanguage('en');
        }
      });
    });
  }

  // Xử lý hamburger menu
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const navUl = document.querySelector('nav ul');
      if (navUl) {
        navUl.classList.toggle('active');
      }
    });
  }

  // Gọi switchLanguage với ngôn ngữ hiện tại
  switchLanguage(currentLang);

  // Xuất switchLanguage để file khác có thể gọi
  window.switchLanguage = switchLanguage;
});