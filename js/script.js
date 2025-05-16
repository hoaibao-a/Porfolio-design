document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = 'data';
  let currentLang = localStorage.getItem("language") || "vi";
  let cachedData = { personalInfo: null, projects: null };

  // Lưu text gốc (tiếng Việt) của phần tử data-lang
  const elements = document.querySelectorAll('[data-lang]');
  const originalTexts = {};
  elements.forEach(el => {
    originalTexts[el.getAttribute('data-lang')] = el.textContent.trim();
  });

  // Bảng dịch tiếng Anh
  const translations = {
    nav_home: 'Home',
    nav_about: 'About',
    nav_projects: 'Projects',
    nav_contact: 'Contact',
    projects_title: 'My Projects',
    footer_name: 'Designer Name'
  };

  // Cập nhật văn bản data-lang
  function switchLanguage(lang) {
    console.log('Switching to language:', lang);
    elements.forEach(el => {
      const key = el.getAttribute('data-lang');
      el.textContent = lang === 'vi' ? originalTexts[key] : translations[key] || originalTexts[key];
    });
    document.documentElement.lang = lang;
    document.title = lang === "vi" ? "Portfolio Thiết Kế" : "Design Portfolio";
  }

  // Fetch với retry
  async function fetchWithRetry(url, retries = 2, delay = 1000) {
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}, URL: ${url}`);
        return await response.json();
      } catch (error) {
        if (i < retries) {
          console.warn(`Retrying fetch (${i + 1}/${retries}) for ${url}`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
  }

  // Load tất cả nội dung
  async function loadAll() {
    console.log('Loading content for language:', currentLang);
    localStorage.setItem('language', currentLang);
    switchLanguage(currentLang);
    try {
      await loadPersonalInfo(); // Ưu tiên hero section
      await loadProjects();
    } catch (error) {
      console.error('Failed to load content:', error);
    }
  }

  // Debounce để tránh lặp sự kiện
  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Đổi ngôn ngữ
  const setLanguage = debounce(lang => {
    if (lang === currentLang) {
      console.log('Language unchanged:', lang);
      return;
    }
    console.log('Setting language to:', lang);
    currentLang = lang;
    localStorage.setItem('language', lang);
    switchLanguage(lang);
    loadAll();
  }, 200);

  // Preload ảnh
  function preloadImage(url) {
    if (url && url !== 'images/placeholder.jpg') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    }
  }

  // Fetch thông tin cá nhân
  async function loadPersonalInfo() {
    const heroSection = document.getElementById("hero");
    if (!heroSection) {
      console.error("Hero section not found!");
      return;
    }
    heroSection.innerHTML = `<div class="spinner"></div>`;

    try {
      if (cachedData.personalInfo && cachedData.personalInfo.lang === currentLang) {
        renderPersonalInfo(cachedData.personalInfo.data);
        return;
      }
      const data = await fetchWithRetry(`${API_BASE_URL}/${currentLang}/personal_info.json`);
      cachedData.personalInfo = { lang: currentLang, data };
      renderPersonalInfo(data);
    } catch (error) {
      console.error(`Could not load personal info for ${currentLang}:`, error);
      heroSection.innerHTML = `<p>${currentLang === "vi" ? "Lỗi tải thông tin cá nhân. Vui lòng thử lại sau." : "Error loading personal information. Please try again later."}</p>`;
    }
  }

  // Dữ liệu mặc định nếu JSON lỗi
  const defaultPersonalInfo = {
    name: currentLang === "vi" ? "Tên Người Dùng" : "User Name",
    profile_picture_url: "images/placeholder.jpg",
    tagline: currentLang === "vi" ? "Dòng giới thiệu" : "Tagline",
    bio_short: currentLang === "vi" ? "Tiểu sử ngắn" : "Short bio",
    bio_long: currentLang === "vi" ? "Thông tin chi tiết" : "Detailed information",
    cta_button: currentLang === "vi" ? "Xem Dự Án" : "View Projects",
    about_title: currentLang === "vi" ? "Về Tôi" : "About Me",
    skills_technical_title: currentLang === "vi" ? "Kỹ Năng Chuyên Môn" : "Technical Skills",
    skills_technical: [],
    skills_software_title: currentLang === "vi" ? "Phần Mềm Thành Thạo" : "Proficient Software",
    skills_software: [],
    experience_title: currentLang === "vi" ? "Kinh Nghiệm Làm Việc" : "Work Experience",
    work_experience: [],
    contact_title: currentLang === "vi" ? "Liên Hệ" : "Contact",
    contact_message: currentLang === "vi" ? "Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ!" : "Reach out for any questions!",
    contact_email_label: currentLang === "vi" ? "Email:" : "Email:",
    contact_email: "email@example.com",
    social_links: []
  };

  // Render thông tin cá nhân
  function renderPersonalInfo(data) {
    data = { ...defaultPersonalInfo, ...data };
    preloadImage(data.profile_picture_url);
    const heroSection = document.getElementById("hero");
    const aboutSection = document.getElementById("about");
    const contactSection = document.getElementById("contact");
    const footerName = document.getElementById("footer-name");

    // Hero Section
    heroSection.innerHTML = `
      <div class="hero-content">
        <img src="${data.profile_picture_url}" alt="${data.name}" id="profile-pic" fetchpriority="high" onerror="this.src='images/placeholder.jpg'">
        <h1>${data.name}</h1>
        <ul class="social-links-contact">
          ${(data.social_links || []).map(link => `
            <li>
              <a href="${link.url || '#'}" target="_blank" title="${link.platform || 'Social'}" aria-label="Liên kết tới ${link.platform || 'mạng xã hội'}">
                ${
                  /\.(png|jpe?g|svg|gif)$/i.test(link.icon_class || '')
                    ? `<img src="${link.icon_class}" alt="${link.platform || 'icon'} icon" class="social-icon-img" style="height: 30px; vertical-align: middle; margin-left: 10px;" loading="lazy" onerror="this.src='images/placeholder.jpg'">`
                    : `<i class="${link.icon_class || 'fa fa-link'}" style="font-size: 30px; margin-left: 10px;"></i>`
                }
              </a>
            </li>
          `).join("")}
        </ul>
        <p id="hero-tagline">${data.tagline}</p>
        <p id="hero-bio-short">${data.bio_short}</p>
        <a href="#projects" class="cta-button">${data.cta_button}</a>
      </div>`;

    // About Section
    if (aboutSection) {
      aboutSection.innerHTML = `
        <div class="container">
          <h2>${data.about_title}</h2>
          <p id="bio-long">${data.bio_long}</p>
          <div class="skills-container">
            <h3>${data.skills_technical_title}</h3>
            <ul class="skills-list" id="technical-skills">
              ${(data.skills_technical || []).map(skill => `<li>${skill}</li>`).join("")}
            </ul>
          </div>
          <div class="skills-container">
            <h3>${data.skills_software_title}</h3>
            <ul class="skills-list" id="software-skills">
              ${(data.skills_software || []).map(skill => `<li>${skill}</li>`).join("")}
            </ul>
          </div>
          <div class="experience-container">
            <h3>${data.experience_title}</h3>
            <div id="work-experience">
              ${(data.work_experience || []).map(exp => `
                <div class="experience-item">
                  <h4>${exp.job_title || (currentLang === "vi" ? "Chức vụ" : "Position")}</h4>
                  <p class="company">${exp.company_name || (currentLang === "vi" ? "Công ty" : "Company")} ${
                    exp.company_logo_url ? `<img src="${exp.company_logo_url}" alt="${exp.company_name || 'company'} logo" style="height:20px; vertical-align:middle; margin-left:5px;" loading="lazy" onerror="this.src='images/placeholder.jpg'">` : ""
                  }</p>
                  <p class="duration">${exp.duration || ""}</p>
                  <ul>
                    ${(exp.responsibilities || []).map(res => `<li>${res}</li>`).join("")}
                  </ul>
                </div>
              `).join("")}
            </div>
          </div>
        </div>`;
    }

    // Contact Section
    if (contactSection) {
      contactSection.innerHTML = `
        <div class="container">
          <h2>${data.contact_title}</h2>
          <div id="contact-info">
            <p style="color: #c12767;">${data.contact_message}</p>
            <p>
              <strong style="color: #c12767;">${data.contact_email_label}</strong> 
              <a href="mailto:${data.contact_email}" aria-label="Gửi email tới ${data.contact_email}">${data.contact_email}</a>
            </p>
            ${
              data.phone_number
                ? `<p>
                  <strong style="color: #c12767;">${data.contact_phone_label || (currentLang === "vi" ? "Điện thoại:" : "Phone:")}</strong>
                  <span style="color: #c12767;">${data.phone_number}</span>
                </p>`
                : ""
            }
            <ul class="social-links-contact">
              ${(data.social_links || []).map(link => `
                <li>
                  <a href="${link.url || '#'}" target="_blank" title="${link.platform || 'Social'}" aria-label="Liên kết tới ${link.platform || 'mạng xã hội'}">
                    ${
                      /\.(png|jpe?g|svg|gif)$/i.test(link.icon_class || '')
                        ? `<img src="${link.icon_class}" alt="${link.platform || 'icon'} icon" class="social-icon-img" style="height: 30px;" loading="lazy" onerror="this.src='images/placeholder.jpg'">`
                        : `<i class="${link.icon_class || 'fa fa-link'}"></i>`
                    }
                  </a>
                </li>
              `).join("")}
            </ul>
          </div>
        </div>`;
    }

    // Footer Name
    if (footerName) footerName.textContent = data.name || translations.footer_name;
  }

  // Fetch dự án
  async function loadProjects() {
    const projectGrid = document.querySelector(".project-grid");
    if (!projectGrid) {
      console.error("Project grid not found!");
      return;
    }
    projectGrid.innerHTML = `<div class="spinner"></div>`;

    try {
      if (cachedData.projects && cachedData.projects.lang === currentLang) {
        renderProjects(cachedData.projects.data);
        return;
      }
      const projects = await fetchWithRetry(`${API_BASE_URL}/${currentLang}/projects.json`);
      cachedData.projects = { lang: currentLang, data: projects };
      renderProjects(projects);
    } catch (error) {
      console.error(`Could not load projects for ${currentLang}:`, error);
      projectGrid.innerHTML = `<p>${currentLang === "vi" ? "Lỗi tải danh sách dự án." : "Error loading project list."}</p>`;
    }
  }

  // Dữ liệu dự án mặc định
  const defaultProjects = [];

  // Render dự án
  function renderProjects(projects) {
    projects = projects.length ? projects : defaultProjects;
    const projectGrid = document.querySelector(".project-grid");
    projectGrid.innerHTML = "";
    projects.forEach(project => {
      const projectCard = document.createElement("div");
      projectCard.classList.add("project-card");
      projectCard.dataset.projectId = project.id;
      projectCard.innerHTML = `
        <img src="${project.project_thumbnail_url || 'images/placeholder.jpg'}" alt="${project.project_name || 'Project'}" class="project-thumbnail"
             style="width: 360px; height: 240px; object-fit: cover; display: block; margin: 0 auto; border-radius: 8px;"
             loading="lazy" onerror="this.src='images/placeholder.jpg'">
        <div class="project-info">
          <h3>${project.project_name || (currentLang === "vi" ? "Tên Dự Án" : "Project Name")}</h3>
          <span class="project-category">${project.project_category || (currentLang === "vi" ? "Thể loại" : "Category")}</span>
          <p class="project-summary">${project.project_summary || (currentLang === "vi" ? "Tóm tắt dự án" : "Project summary")}</p>
        </div>`;
      projectCard.addEventListener("click", () => openProjectModal(project.id, projects));
      projectGrid.appendChild(projectCard);
    });

    // Lazy-load project thumbnails
    const images = projectGrid.querySelectorAll('img.project-thumbnail');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    images.forEach(img => {
      img.dataset.src = img.src;
      observer.observe(img);
    });
  }

  // Modal chi tiết dự án
  function openProjectModal(projectId, allProjects) {
    const modal = document.getElementById("project-modal");
    const modalContent = document.getElementById("modal-project-content");
    if (!modal || !modalContent) {
      console.error("Modal or modal content not found!");
      return;
    }

    const project = allProjects.find(p => p.id === projectId);
    if (!project) {
      console.error("Project not found:", projectId);
      return;
    }

    const imageCount = (project.media || []).filter(item => item.type === "image").length;
    let mediaHTML = '<div class="media-gallery">';
    (project.media || []).forEach(item => {
      if (item.type === "image") {
        const isMultiple = imageCount > 1;
        const imageStyle = isMultiple
          ? "height: 250px; width: 100%; object-fit: cover;"
          : "width: 100%; height: auto;";
        mediaHTML += `
          <div class="media-item">
            <img class="zoomable-image" src="${item.url || 'images/placeholder.jpg'}" alt="${item.alt_text || 'Media'}"
                 style="border: 2px solid black; ${imageStyle}" loading="lazy" onerror="this.src='images/placeholder.jpg'">
            <p style="text-align: justify;">${item.caption || ""}</p>
          </div>`;
      } else if (item.type === "video") {
        let videoEmbedUrl = item.url || "";
        if (item.url.includes("youtube.com/watch?v=")) {
          videoEmbedUrl = item.url.replace("watch?v=", "embed/");
        } else if (item.url.includes("vimeo.com/")) {
          const videoId = item.url.substring(item.url.lastIndexOf("/") + 1);
          videoEmbedUrl = `https://player.vimeo.com/video/${videoId}`;
        }
        mediaHTML += `
          <div class="media-item">
            <iframe src="${videoEmbedUrl}" frameborder="0" allowfullscreen loading="lazy"></iframe>
            <p>${item.caption || ""}</p>
          </div>`;
      }
    });
    mediaHTML += "</div>";

    modalContent.innerHTML = `
      <h2>${project.project_name || (currentLang === "vi" ? "Tên Dự Án" : "Project Name")}</h2>
      <div class="project-meta">
        <span><strong>${project.project_category_label || (currentLang === "vi" ? "Thể loại:" : "Category:")}</strong> ${project.project_category || (currentLang === "vi" ? "Thể loại" : "Category")}</span><br>
        <span><strong>${project.project_date_label || (currentLang === "vi" ? "Ngày:" : "Date:")}</strong> ${project.project_date || ""}</span>
        ${
          project.client_name
            ? `<span><strong>${project.client_label || (currentLang === "vi" ? "Khách hàng:" : "Client:")}</strong> ${project.client_name}</span>`
            : ""
        }
      </div>
      <div class="description-detailed">${project.project_description_detailed || (currentLang === "vi" ? "Mô tả chi tiết" : "Detailed description")}</div>
      ${
        project.tools_used && project.tools_used.length > 0
          ? `<p><strong>${project.tools_label || (currentLang === "vi" ? "Công cụ sử dụng:" : "Tools Used:")}</strong> ${project.tools_used.join(", ")}</p>`
          : ""
      }
      ${
        project.project_live_url
          ? `<p><a href="${project.project_live_url}" target="_blank" class="cta-button" aria-label="Xem dự án trực tiếp">${project.view_live_label || (currentLang === "vi" ? "Xem trực tiếp" : "View Live")}</a></p>`
          : ""
      }
      ${
        project.project_case_study_url
          ? `\n<p><a href="${project.project_case_study_url}" target="_blank" class="cta-button" aria-label="Xem case study">${project.case_study_label || (currentLang === "vi" ? "Xem Case Study" : "View Case Study")}</a></p>`
          : ""
      }
      <h3>${project.media_title || (currentLang === "vi" ? "Hình Ảnh/Video Dự Án" : "Project Images/Videos")}</h3>
      ${mediaHTML}`;
    modal.style.display = "block";
  }

  // Đóng modal
  const closeButton = document.querySelector(".close-button");
  if (closeButton) {
    closeButton.onclick = () => {
      const modal = document.getElementById("project-modal");
      if (modal) modal.style.display = "none";
    };
  }

  window.onclick = event => {
    const modal = document.getElementById("project-modal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  // Cuộn mượt
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      e.preventDefault();
      const targetId = anchor.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Hamburger menu
  const hamburger = document.getElementById("hamburger");
  const navUl = document.querySelector("nav ul");
  if (hamburger && navUl) {
    hamburger.addEventListener("click", () => {
      navUl.classList.toggle("active");
      console.log("Hamburger menu toggled");
    });
  }

  // Zoom ảnh
  const overlay = document.getElementById("imageOverlay");
  const overlayImage = document.getElementById("overlayImage");
  document.body.addEventListener("click", e => {
    if (e.target.classList.contains("zoomable-image")) {
      overlayImage.src = e.target.src;
      overlay.style.display = "flex";
    } else if (e.target === overlay || e.target === overlayImage) {
      overlay.style.display = "none";
    }
  });

  // Xử lý cờ ngôn ngữ
  const langVi = document.getElementById("lang-vi");
  const langEn = document.getElementById("lang-en");
  if (langVi && langEn) {
    [langVi, langEn].forEach(el => {
      el.addEventListener("pointerdown", e => {
        e.preventDefault();
        e.stopPropagation();
        const lang = el.id === "lang-vi" ? "vi" : "en";
        setLanguage(lang);
      }, { passive: false });
      el.addEventListener("touchstart", e => {
        e.preventDefault();
        e.stopPropagation();
        const lang = el.id === "lang-vi" ? "vi" : "en";
        setLanguage(lang);
      }, { passive: false });
    });
  } else {
    console.error("Language icon elements not found!");
  }

  // Khởi tạo
  loadAll();
});