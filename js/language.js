// Đối tượng translations
const translations = {
  vi: {
    nav_home: "Trang Chủ",
    nav_about: "Giới Thiệu",
    nav_projects: "Dự Án",
    nav_contact: "Liên Hệ",
    projects_title: "Dự Án Của Tôi"
  },
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_projects: "Projects",
    nav_contact: "Contact",
    projects_title: "My Projects"
  }
};

// Lấy ngôn ngữ từ localStorage hoặc mặc định là 'vi'
let currentLang = localStorage.getItem("language") || "vi";

// Hàm cập nhật các phần tử có data-lang
function updateTranslations() {
  const elements = document.querySelectorAll("[data-lang]");
  elements.forEach(element => {
    const key = element.getAttribute("data-lang");
    element.textContent = translations[currentLang][key] || element.textContent;
  });
}

// Hàm xử lý thay đổi ngôn ngữ
function changeLanguage() {
  const select = document.getElementById("language-select");
  if (select) {
    currentLang = select.value;
    localStorage.setItem("language", currentLang);
    updateTranslations();
  }
}

// Xử lý hamburger menu
const hamburger = document.getElementById("hamburger");
const navUl = document.querySelector("nav ul");
if (hamburger && navUl) {
  hamburger.innerHTML = "☰";
  hamburger.addEventListener("click", () => {
    navUl.classList.toggle("active");
  });
}

// Khởi tạo khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("language-select");
  if (select) {
    select.value = currentLang;
    updateTranslations();
  }
});
