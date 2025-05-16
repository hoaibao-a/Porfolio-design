document.addEventListener('DOMContentLoaded', () => {
  // Lưu text gốc (tiếng Việt) của tất cả phần tử data-lang
  const elements = document.querySelectorAll('[data-lang]');
  const originalTexts = {};
  elements.forEach(el => {
    originalTexts[el.getAttribute('data-lang')] = el.textContent.trim();
  });

  // Bảng dịch sang tiếng Anh dựa trên key data-lang
  const translations = {
    nav_home: 'Home',
    nav_about: 'About',
    nav_projects: 'Projects',
    nav_contact: 'Contact',
    projects_title: 'My Projects',
    footer_name: 'Designer Name',
  };

  // Hàm đổi ngôn ngữ
  function switchLanguage(lang) {
    elements.forEach(el => {
      const key = el.getAttribute('data-lang');
      if (lang === 'vi') {
        el.textContent = originalTexts[key];
      } else if (lang === 'en') {
        el.textContent = translations[key] || originalTexts[key];
      }
    });
  }

  // Lấy ngôn ngữ hiện tại từ localStorage
  const currentLang = localStorage.getItem('language') || 'vi';
  
  // Gán sự kiện click cho icon cờ
  document.getElementById('lang-en').addEventListener('click', () => {
    // Gọi setLanguage của file đầu tiên (nếu có) và switchLanguage
    if (typeof setLanguage === 'function') {
      setLanguage('en');
    } else {
      localStorage.setItem('language', 'en');
      switchLanguage('en');
    }
  });
  
  document.getElementById('lang-vi').addEventListener('click', () => {
    if (typeof setLanguage === 'function') {
      setLanguage('vi');
    } else {
      localStorage.setItem('language', 'vi');
      switchLanguage('vi');
    }
  });

  // Gọi switchLanguage với ngôn ngữ hiện tại
  switchLanguage(currentLang);

  // Xuất switchLanguage để file đầu tiên có thể gọi (nếu cần)
  window.switchLanguage = switchLanguage;
});