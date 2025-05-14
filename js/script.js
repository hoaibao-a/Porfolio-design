document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = 'data'; // Assuming JSON files are in a 'data' subdirectory

    // Fetch and display personal information
    async function loadPersonalInfo() {
        try {
            const response = await fetch(`${API_BASE_URL}/personal_info.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            // Hero Section
        const heroSection = document.getElementById("hero");
if (heroSection) {
    let heroContent = `
        <div class="hero-content">
            <img src="${data.profile_picture_url}" alt="${data.name}" id="profile-pic">
            <h1>${data.name}</h1>
            <ul class="social-links-contact">
                ${data.social_links.map(link => `
                    <li>
                        <a href="${link.url}" target="_blank" title="${link.platform}">
                            ${/\.(png|jpe?g|svg|gif)$/i.test(link.icon_class)
                                ? `<img src="${link.icon_class}" alt="${link.platform} icon" class="social-icon-img" style="height: 30px; vertical-align: middle; margin-left: 10px;">`
                                : `<i class="${link.icon_class}" style="font-size: 30px; margin-left: 10px;"></i>`}
                        </a>
                    </li>`).join("")}
            </ul>
            <p id="hero-tagline">${data.tagline}</p>
            <p id="hero-bio-short">${data.bio_short}</p>
            <a href="#projects" class="cta-button">Xem Dự Án</a>
        </div>`;
    heroSection.innerHTML = heroContent;
}

            // About Section
            const aboutSection = document.getElementById("about");
            if (aboutSection) {
                let aboutContent = `<div class="container">
                    <h2>Về Tôi</h2>
                    <p id="bio-long">${data.bio_long}</p>
                    <div class="skills-container">
                        <h3>Kỹ Năng Chuyên Môn</h3>
                        <ul class="skills-list" id="technical-skills">
                            ${data.skills_technical.map(skill => `<li>${skill}</li>`).join("")}
                        </ul>
                    </div>
                    <div class="skills-container">
                        <h3>Phần Mềm Thành Thạo</h3>
                        <ul class="skills-list" id="software-skills">
                            ${data.skills_software.map(skill => `<li>${skill}</li>`).join("")}
                        </ul>
                    </div>
                    <div class="experience-container">
                        <h3>Kinh Nghiệm Làm Việc</h3>
                        <div id="work-experience">
                            ${data.work_experience.map(exp => `
                                <div class="experience-item">
                                    <h4>${exp.job_title}</h4>
                                    <p class="company">${exp.company_name} ${exp.company_logo_url ? `<img src="${exp.company_logo_url}" alt="${exp.company_name} logo" style="height:20px; vertical-align:middle; margin-left:5px;">` : ''}</p>
                                    <p class="duration">${exp.duration}</p>
                                    <ul>
                                        ${exp.responsibilities.map(res => `<li>${res}</li>`).join("")}
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
                let contactContent = `<div class="container">
                    <h2>Liên Hệ</h2>
                    <div id="contact-info">
                        <p style="color: #c12767;">
                            Nếu bạn có bất kỳ câu hỏi nào hoặc muốn hợp tác, đừng ngần ngại liên hệ với tôi:
                        </p>
                        <p>
                        <strong style="color: #c12767;">Email:</strong> 
                             <a href="mailto:${data.contact_email}">${data.contact_email}</a>
                        </p>
                        ${data.phone_number ? `<p>
                            <strong style="color: #c12767;">Điện thoại:</strong>
                            <span style="color: #c12767;">${data.phone_number}</span>
                        </p>` : ''}
                        <!--
                        <ul class="social-links-contact">
                          ${data.social_links.map(link => `<li><a href="${link.url}" target="_blank" title="${link.platform}"><i class="${link.icon_class}"></i></a></li>`).join("")}
                        </ul>
                        -->
                        <ul class="social-links-contact">
                        ${data.social_links.map(link => `
                         <li>
                         <a href="${link.url}" target="_blank" title="${link.platform}">
                         ${/\.(png|jpe?g|svg|gif)$/i.test(link.icon_class)
                        ? `<img src="${link.icon_class}" alt="${link.platform} icon" class="social-icon-img" />`
                        : `<i class="${link.icon_class}"></i>`
                    }
                     </a></li>`).join("")}
                    </ul>
                    </div>
                </div>`;
                contactSection.innerHTML = contactContent;
            }

            // Footer Name
            const footerName = document.getElementById("footer-name");
            if (footerName) footerName.textContent = data.name;

        } catch (error) {
            console.error("Could not load personal info:", error);
            if (document.getElementById("hero")) document.getElementById("hero").innerHTML = "<p>Lỗi tải thông tin cá nhân.</p>";
        }
    }

    // Fetch and display projects
    // async function loadProjects() {
    //     try {
    //         const response = await fetch(`${API_BASE_URL}/projects.json`);
    //         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    //         const projects = await response.json();
    //         const projectGrid = document.querySelector(".project-grid");

    //         if (projectGrid) {
    //             projectGrid.innerHTML = ""; // Clear existing projects
    //             projects.forEach(project => {
    //                 const projectCard = document.createElement("div");
    //                 projectCard.classList.add("project-card");
    //                 projectCard.dataset.projectId = project.id;
    //                 projectCard.innerHTML = `
    //           <img src="${project.project_thumbnail_url}" alt="${project.project_name}" class="project-thumbnail"
    //  style="width: 360px; height: 240px; object-fit: cover; display: block; margin: 0 auto; border-radius: 8px;">

    //                     <div class="project-info">
    //                         <h3>${project.project_name}</h3>
    //                         <span class="project-category">${project.project_category}</span>
    //                         <p class="project-summary">${project.project_summary}</p>
    //                     </div>
                        
    //                 `;
    //                 projectCard.addEventListener("click", () => openProjectModal(project.id, projects));
    //                 projectGrid.appendChild(projectCard);
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Could not load projects:", error);
    //         if (document.querySelector(".project-grid")) document.querySelector(".project-grid").innerHTML = "<p>Lỗi tải danh sách dự án.</p>";
    //     }
    // }


//test
async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const projects = await response.json();
        const projectGrid = document.querySelector(".project-grid");

        if (projectGrid) {
            projectGrid.innerHTML = ""; // Clear existing projects
            projects.forEach(project => {
                const projectCard = document.createElement("div");
                projectCard.classList.add("project-card");
                projectCard.dataset.projectId = project.id;
                projectCard.innerHTML = `
                    <img src="${project.project_thumbnail_url}" alt="${project.project_name}" class="project-thumbnail"
                         style="width: 360px; height: 240px; object-fit: cover; display: block; margin: 0 auto; border-radius: 8px;"
                         loading="lazy"> <!-- Lazy load images -->

                    <div class="project-info">
                        <h3>${project.project_name}</h3>
                        <span class="project-category">${project.project_category}</span>
                        <p class="project-summary">${project.project_summary}</p>
                    </div>
                `;
                projectCard.addEventListener("click", () => openProjectModal(project.id, projects));
                projectGrid.appendChild(projectCard);
            });
        }
    } catch (error) {
        console.error("Could not load projects:", error);
        if (document.querySelector(".project-grid")) {
            document.querySelector(".project-grid").innerHTML = "<p>Lỗi tải danh sách dự án.</p>";
        }
    }
}

//test








    // Modal functionality
    const modal = document.getElementById("project-modal");
    const modalContent = document.getElementById("modal-project-content");
    const closeButton = document.querySelector(".close-button");

    // function openProjectModal(projectId, allProjects) {
    //     const project = allProjects.find(p => p.id === projectId);
    //     if (!project || !modal || !modalContent) return;

    //     let mediaHTML = '<div class="media-gallery">';
    //     project.media.forEach(item => {
    //         // if (item.type === "image") {
    //         //     mediaHTML += `<div class="media-item"><img src="${item.url}" alt="${item.alt_text}"><p>${item.caption || ''}</p></div>`;
    //         // }
    //         if (item.type === "image") {
    //             mediaHTML += `
    //                 <div class="media-item">
    //                     <img class="zoomable-image" src="${item.url}" alt="${item.alt_text}"
    //                          style="border: 2px solid black !important; height: 250px; width: 100%; object-fit: cover;">
    //                     <p style="text-align: justify;">${item.caption || ''}</p>
    //                 </div>`;
    //         }
    //          else if (item.type === "video") {
    //             // Basic YouTube/Vimeo embed from URL
    //             let videoEmbedUrl = item.url;
    //             if (item.url.includes("youtube.com/watch?v=")) {
    //                 videoEmbedUrl = item.url.replace("watch?v=", "embed/");
    //             } else if (item.url.includes("vimeo.com/")) {
    //                 const videoId = item.url.substring(item.url.lastIndexOf('/') + 1);
    //                 videoEmbedUrl = `https://player.vimeo.com/video/${videoId}`;
    //             }
    //             mediaHTML += `<div class="media-item"><iframe src="${videoEmbedUrl}" frameborder="0" allowfullscreen></iframe><p>${item.caption || ''}</p></div>`;
    //         }
    //     });
    //     mediaHTML += '</div>';

    //     modalContent.innerHTML = `
    //         <h2>${project.project_name}</h2>
    //         <div class="project-meta">
    //             <span><strong>Thể loại:</strong> ${project.project_category}</span><br>
    //             <span><strong>Ngày:</strong> ${project.project_date}</span>
    //             ${project.client_name ? `<span><strong>Khách hàng:</strong> ${project.client_name}</span>` : ''}
    //         </div>
    //         <div class="description-detailed">${project.project_description_detailed}</div>
    //         ${project.tools_used && project.tools_used.length > 0 ? `<p><strong>Công cụ sử dụng:</strong> ${project.tools_used.join(", ")}</p>` : ''}
    //         ${project.project_live_url ? `<p><a href="${project.project_live_url}" target="_blank" class="cta-button">Xem trực tiếp</a></p>` : ''}
    //         ${project.project_case_study_url ? `<p><a href="${project.project_case_study_url}" target="_blank" class="cta-button">Xem Case Study</a></p>` : ''}
    //         <h3>Hình Ảnh/Video Dự Án</h3>
    //         ${mediaHTML}
    //     `;
    //     modal.style.display = "block";
    // }
    function openProjectModal(projectId, allProjects) {
        const project = allProjects.find(p => p.id === projectId);
        if (!project || !modal || !modalContent) return;
    
        // Đếm số ảnh
        const imageCount = project.media.filter(item => item.type === "image").length;
    
        let mediaHTML = '<div class="media-gallery">';
        project.media.forEach(item => {
            if (item.type === "image") {
                const isMultiple = imageCount > 1;
                const imageStyle = isMultiple
                    ? 'height: 250px; width: 100%; object-fit: cover;'
                    : 'width: 100%; height: auto;';
    
                mediaHTML += `
                    <div class="media-item">
                        <img class="zoomable-image" src="${item.url}" alt="${item.alt_text}"
                             style="border: 2px solid black !important; ${imageStyle}">
                        <p style="text-align: justify;">${item.caption || ''}</p>
                    </div>`;
            } else if (item.type === "video") {
                let videoEmbedUrl = item.url;
                if (item.url.includes("youtube.com/watch?v=")) {
                    videoEmbedUrl = item.url.replace("watch?v=", "embed/");
                } else if (item.url.includes("vimeo.com/")) {
                    const videoId = item.url.substring(item.url.lastIndexOf('/') + 1);
                    videoEmbedUrl = `https://player.vimeo.com/video/${videoId}`;
                }
                mediaHTML += `
                    <div class="media-item">
                        <iframe src="${videoEmbedUrl}" frameborder="0" allowfullscreen></iframe>
                        <p>${item.caption || ''}</p>
                    </div>`;
            }
        });
        mediaHTML += '</div>';
    
        modalContent.innerHTML = `
            <h2>${project.project_name}</h2>
            <div class="project-meta">
                <span><strong>Thể loại:</strong> ${project.project_category}</span><br>
                <span><strong>Ngày:</strong> ${project.project_date}</span>
                ${project.client_name ? `<span><strong>Khách hàng:</strong> ${project.client_name}</span>` : ''}
            </div>
            <div class="description-detailed">${project.project_description_detailed}</div>
            ${project.tools_used && project.tools_used.length > 0 ? `<p><strong>Công cụ sử dụng:</strong> ${project.tools_used.join(", ")}</p>` : ''}
            ${project.project_live_url ? `<p><a href="${project.project_live_url}" target="_blank" class="cta-button">Xem trực tiếp</a></p>` : ''}
            ${project.project_case_study_url ? `<p><a href="${project.project_case_study_url}" target="_blank" class="cta-button">Xem Case Study</a></p>` : ''}
            <h3>Hình Ảnh/Video Dự Án</h3>
            ${mediaHTML}
        `;
        modal.style.display = "block";
    }
    
    if (closeButton) {
        closeButton.onclick = function () {
            if (modal) modal.style.display = "none";
        }
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            if (modal) modal.style.display = "none";
        }
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize
    loadPersonalInfo();
    loadProjects();
});
document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.getElementById("imageOverlay");
    const overlayImage = document.getElementById("overlayImage");

    document.body.addEventListener("click", function (e) {
        if (e.target.classList.contains("zoomable-image")) {
            overlayImage.src = e.target.src;
            overlay.style.display = "flex";
        } else if (e.target === overlay || e.target === overlayImage) {
            overlay.style.display = "none";
        }
    });
});


