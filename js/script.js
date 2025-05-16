document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = 'data';
  let currentLang = localStorage.getItem("language") || "vi";

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
  }

  // Load tất cả nội dung
  async function loadAll() {
    document.documentElement.lang = currentLang;
    document.title = currentLang === "vi" ? "Portfolio Thiết Kế" : "Design Portfolio";
    switchLanguage(currentLang); // Cập nhật data-lang
    await loadPersonalInfo();
    await loadProjects();
  }

  // Đổi ngôn ngữ và tải lại nội dung
  async function setLanguage(lang) {
    if (lang === currentLang) return;
    currentLang = lang;
    localStorage.setItem('language', lang);
    console.log('Language set to:', lang);
    await loadAll();
  }

  // Fetch thông tin cá nhân
  async function loadPersonalInfo() {
    const heroSection = document.getElementById("hero");
    if (!heroSection) {
      console.error("Hero section not found!");
      return;
    }
    heroSection.innerHTML = `<p>${currentLang === "vi" ? "Đang tải thông tin..." : "Loading information..."}</p>`;

    try {
      const response = await fetch(`${API_BASE_URL}/${currentLang}/personal_info.json`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      // Hero Section
      let heroContent = `
        <div class="hero-content">
          <img src="${data.profile_picture_url || 'images/placeholder.jpg'}" alt="${data.name || 'Profile'}" id="profile-pic">
          <h1>${data.name || (currentLang === "vi" ? "Tên Người Dùng" : "User Name")}</h1>
          <ul class="social-links-contact">
            ${(data.social_links || []).map(link => `
              <li>
                <a href="${link.url || '#'}" target="_blank" title="${link.platform || 'Social'}" aria-label="Liên kết tới ${link.platform || 'mạng xã hội'}">
                  ${
                    /\.(png|jpe?g|svg|gif)$/i.test(link.icon_class || '') 
                      ? `<img src="${link.icon_class}" alt="${link.platform || 'icon'} icon" class="social-icon-img" style="height: 30px; vertical-align: middle; margin-left: 10px;">` 
                      : `<i class="${link.icon_class || 'fa fa-link'}" style="font-size: 30px; margin-left: 10px;"></i>`
                  }
                </a>
              </li>
            `).join("")}
          </ul>
          <p id="hero-tagline">${data.tagline || (currentLang === "vi" ? "Dòng giới thiệu" : "Tagline")}</p>
          <p id="hero-bio-short">${data.bio_short || (currentLang === "vi" ? "Tiểu sử ngắn" : "Short bio")}</p>
          <a href="#projects" class="cta-button">${data.cta_button || (currentLang === "vi" ? "Xem Dự Án" : "View Projects")}</a>
        </div>`;
      heroSection.innerHTML = heroContent;

      // About Section
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        let aboutContent = `
          <div class="container">
            <h2>${data.about_title || (currentLang === "vi" ? "Về Tôi" : "About Me")}</h2>
            <p id="bio-long">${data.bio_long || (currentLang === "vi" ? "Thông tin chi tiết" : "Detailed information")}</p>
            <div class="skills-container">
              <h3>${data.skills_technical_title || (currentLang === "vi" ? "Kỹ Năng Chuyên Môn" : "Technical Skills")}</h3>
              <ul class="skills-list" id="technical-skills">
                ${(data.skills_technical || []).map(skill => `<li>${skill}</li>`).join("")}
              </ul>
            </div>
            <div class="skills-container">
              <h3>${data.skills_software_title || (currentLang === "vi" ? "Phần Mềm Thành Thạo" : "Proficient Software")}</h3>
              <ul class="skills-list" id="software-skills">
                ${(data.skills_software || []).map(skill => `<li>${skill}</li>`).join("")}
              </ul>
            </div>
            <div class="experience-container">
              <h3>${data.experience_title || (currentLang === "vi" ? "Kinh Nghiệm Làm Việc" : "Work Experience")}</h3>
              <div id="work-experience">
                ${(data.work_experience || []).map(exp => `
                  <div class="experience-item">
                    <h4>${exp.job_title || (currentLang === "vi" ? "Chức vụ" : "Position")}</h4>
                    <p class="company">${exp.company_name || (currentLang === "vi" ? "Công ty" : "Company")} ${
                      exp.company_logo_url ? `<img src="${exp.company_logo_url}" alt="${exp.company_name || 'company'} logo" style="height:20px; vertical-align:middle; margin-left:5px;">` : ""
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
        aboutSection.innerHTML = aboutContent;
      }

      // Contact Section
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        let contactContent = `
          <div class="container">
            <h2>${data.contact_title || (currentLang === "vi" ? "Liên Hệ" : "Contact")}</h2>
            <div id="contact-info">
              <p style="color: #c12767;">
                ${data.contact_message || (currentLang === "vi" ? "Nếu bạn có bất kỳ câu hỏi nào hoặc muốn hợp tác, đừng ngần ngại liên hệ với tôi:" : "If you have any questions or would like to collaborate, feel free to reach out:")}
              </p>
              <p>
                <strong style="color: #c12767;">${data.contact_email_label || (currentLang === "vi" ? "Email:" : "Email:")}</strong> 
                <a href="mailto:${data.contact_email || ''}" aria-label="Gửi email tới ${data.contact_email || 'contact'}">${data.contact_email || "email@example.com"}</a>
              </p>
              ${
                data.phone_number
                  ? `<p>
                    <strong style="color: #c12767;">${data.contact_PHONE_label || (currentLang === "vi" ? "Điện thoại:" : "Phone:")}</strong>
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
                          ? `<img src="${link.icon_class}" alt="${link.platform || 'icon'} icon" class="social-icon-img" />`
                          : `<i class="${link.icon_class || 'fa fa-link'}"></i>`
                      }
                    </a>
                  </li>
                `).join("")}
              </ul>
            </div>
          </div>`;
        contactSection.innerHTML = contactContent;
      }

      // Footer Name
      const footerName = document.getElementById("footer-name");
      if (footerName) footerName.textContent = data.name || translations.footer_name;
    } catch (error) {
      console.error("Could not load personal info:", error);
      if (heroSection) {
        heroSection.innerHTML = `<p>${currentLang === "vi" ? "Lỗi tải thông tin cá nhân." : "Error loading personal information."}</p>`;
      }
    }
  }

  // Fetch dự án
  async function loadProjects() {
    const projectGrid = document.querySelector(".project-grid");
    if (!projectGrid) {
      console.error("Project grid not found!");
      return;
    }
    projectGrid.innerHTML = `<p>${currentLang === "vi" ? "Đang tải dự án..." : "Loading projects..."}</p>`;

    try {
      const response = await fetch(`${API_BASE_URL}/${currentLang}/projects.json`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const projects = await response.json();

      projectGrid.innerHTML = "";
      projects.forEach(project => {
        const projectCard = document.createElement("div");
        projectCard.classList.add("project-card");
        projectCard.dataset.projectId = project.id;
        projectCard.innerHTML = `
          <img src="${project.project_thumbnail_url || 'images/placeholder.jpg'}" alt="${project.project_name || 'Project'}" class="project-thumbnail"
               style="width: 360px; height: 240px; object-fit: cover; display: block; margin: 0 auto; border-radius: 8px;"
               loading="lazy">
          <div class="project-info">
            <h3>${project.project_name || (currentLang === "vi" ? "Tên Dự Án" : "Project Name")}</h3>
            <span class="project-category">${project.project_category || (currentLang === "vi" ? "Thể loại" : "Category")}</span>
            <p class="project-summary">${project.project_summary || (currentLang === "vi" ? "Tóm tắt dự án" : "Project summary")}</p>
          </div>
        `;
        projectCard.addEventListener("click", () => openProjectModal(project.id, projects));
        projectGrid.appendChild(projectCard);
      });
    } catch (error) {
      console.error("Could not load projects:", error);
      if (projectGrid) {
        projectGrid.innerHTML = `<p>${currentLang === "vi" ? "Lỗi tải danh sách dự án." : "Error loading project list."}</p>`;
      }
    }
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
                 style="border: 2px solid black !important; ${imageStyle}">
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
            <iframe src="${videoEmbedUrl}" frameborder="0" allowfullscreen></iframe>
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
          ? `<p><a href="${project.project_case_study_url}" target="_blank" class="cta-button" aria-label="Xem case study">${project.case_study_label || (currentLang === "vi" ? "Xem Case Study" : "View Case Study")}</a></p>`
          : ""
      }
      <h3>${project.media_title || (currentLang === "vi" ? "Hình Ảnh/Video Dự Án" : "Project Images/Videos")}</h3>
      ${mediaHTML}
    `;
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
      if (modal) modal.style.display = "none";
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
      console.log("Image overlay opened");
    } else if (e.target === overlay || e.target === overlayImage) {
      overlay.style.display = "none";
      console.log("Image overlay closed");
    }
  });

  // Xử lý cờ ngôn ngữ
  const langVi = document.getElementById("lang-vi");
  const langEn = document.getElementById("lang-en");
  if (langVi && langEn) {
    ['click', 'touchstart'].forEach(event => {
      langVi.addEventListener(event, e => {
        e.preventDefault();
        console.log('Vietnamese flag triggered');
        setLanguage("vi");
      });
      langEn.addEventListener(event, e => {
        e.preventDefault();
        console.log('English flag triggered');
        setLanguage("en");
      });
    });
  } else {
    console.error("Language icon elements not found!");
  }

  // Khởi tạo
  loadAll();
});