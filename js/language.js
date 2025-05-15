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
    // ... bạn có thể thêm nếu cần
  };

  // Hàm đổi ngôn ngữ
  function switchLanguage(lang) {
    elements.forEach(el => {
      const key = el.getAttribute('data-lang');
      if (lang === 'vi') {
        // Trả về text gốc tiếng Việt
        el.textContent = originalTexts[key];
      } else if (lang === 'en') {
        // Nếu có dịch thì thay, không thì giữ nguyên
        el.textContent = translations[key] || originalTexts[key];
      }
    });
  }

  // Gán sự kiện click cho icon cờ
  document.getElementById('lang-en').addEventListener('click', () => switchLanguage('en'));
  document.getElementById('lang-vi').addEventListener('click', () => switchLanguage('vi'));

  // Mặc định tiếng Việt
  switchLanguage('vi');
});
