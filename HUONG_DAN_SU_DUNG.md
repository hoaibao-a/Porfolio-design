# Hướng dẫn sử dụng Trang Web Portfolio Cá Nhân

Chào bạn,

Trang web portfolio của bạn đã được tạo xong! Dưới đây là hướng dẫn nhanh để bạn có thể dễ dàng quản lý và cập nhật nội dung.

## Cấu trúc thư mục

Toàn bộ mã nguồn của trang web nằm trong thư mục `portfolio_site` với cấu trúc như sau:

```
portfolio_site/
├── css/
│   └── style.css         # File CSS chính cho giao diện
├── data/
│   ├── personal_info.json  # File chứa thông tin cá nhân của bạn
│   └── projects.json       # File chứa danh sách các dự án của bạn
├── images/                 # Thư mục chứa hình ảnh (ảnh đại diện, logo công ty, ảnh dự án)
├── js/
│   └── script.js         # File JavaScript xử lý logic và tải dữ liệu
└── index.html              # File HTML chính của trang web
```

## Cách cập nhật nội dung

Trang web được thiết kế để bạn có thể dễ dàng cập nhật thông tin bằng cách chỉnh sửa trực tiếp các tệp JSON trong thư mục `data/`.

### 1. Cập nhật Thông tin Cá nhân

*   Mở tệp `portfolio_site/data/personal_info.json` bằng một trình soạn thảo văn bản (ví dụ: Notepad, VS Code, Sublime Text).
*   Chỉnh sửa các trường thông tin theo ý muốn của bạn. Ví dụ:
    *   `"name"`: Tên của bạn
    *   `"tagline"`: Chức danh hoặc mô tả ngắn
    *   `"profile_picture_url"`: Đường dẫn đến ảnh đại diện. Bạn nên đặt ảnh vào thư mục `portfolio_site/images/` và cập nhật đường dẫn tương đối ở đây (ví dụ: `"images/ten_anh_dai_dien.jpg"`).
    *   `"bio_short"`, `"bio_long"`: Tiểu sử ngắn và dài.
    *   `"contact_email"`, `"phone_number"`: Thông tin liên hệ.
    *   `"social_links"`: Danh sách các mạng xã hội. Mỗi mục gồm `platform` (tên), `url` (đường dẫn), và `icon_class` (lớp icon FontAwesome, ví dụ `"fab fa-behance"`).
    *   `"skills_technical"`, `"skills_software"`: Danh sách các kỹ năng.
    *   `"work_experience"`: Kinh nghiệm làm việc. Mỗi mục gồm `job_title`, `company_name`, `company_logo_url` (đặt logo vào `images/`), `duration`, `responsibilities`.
*   Lưu lại tệp `personal_info.json` sau khi chỉnh sửa.

### 2. Cập nhật/Thêm Dự án

*   Mở tệp `portfolio_site/data/projects.json`.
*   Đây là một mảng (danh sách) các đối tượng dự án. Mỗi đối tượng đại diện cho một dự án.
*   **Để chỉnh sửa dự án hiện có:** Tìm đối tượng dự án tương ứng và thay đổi các giá trị.
*   **Để thêm dự án mới:** Sao chép một đối tượng dự án hiện có, dán nó vào cuối danh sách (trước dấu `]` đóng mảng, và đảm bảo có dấu phẩy `,` ngăn cách giữa các đối tượng dự án), sau đó chỉnh sửa thông tin cho dự án mới.
*   Các trường quan trọng trong mỗi dự án:
    *   `"id"`: Một mã định danh duy nhất cho dự án (viết liền, không dấu, ví dụ: `"du-an-moi-cua-toi"`).
    *   `"project_name"`: Tên dự án.
    *   `"project_thumbnail_url"`: Đường dẫn đến ảnh thumbnail của dự án (đặt ảnh vào `portfolio_site/images/` và dùng đường dẫn tương đối, ví dụ: `"images/thumbnail_du_an_moi.jpg"`).
    *   `"project_category"`: Thể loại dự án.
    *   `"project_date"`: Thời gian thực hiện.
    *   `"project_summary"`: Mô tả ngắn.
    *   `"project_description_detailed"`: Mô tả chi tiết (có thể dùng HTML cơ bản để định dạng).
    *   `"media"`: Danh sách hình ảnh/video cho dự án. Mỗi mục có `type` ("image" hoặc "video"), `url` (đường dẫn ảnh trong `images/` hoặc link nhúng video YouTube/Vimeo), `alt_text`, `caption`.
*   Lưu lại tệp `projects.json`.

### 3. Quản lý Hình ảnh

*   Tất cả hình ảnh (ảnh đại diện, logo công ty, ảnh dự án, thumbnail dự án) nên được đặt trong thư mục `portfolio_site/images/`.
*   Khi khai báo đường dẫn ảnh trong các tệp JSON, hãy sử dụng đường dẫn tương đối bắt đầu bằng `images/`. Ví dụ: `"images/my_project_image.png"`.

## Xem thay đổi

Sau khi bạn chỉnh sửa các tệp JSON và lưu lại:

1.  Mở tệp `portfolio_site/index.html` bằng trình duyệt web của bạn (nhấp đúp vào tệp).
2.  Nếu trang web đã mở sẵn, hãy làm mới (refresh) trang (thường là phím F5 hoặc Ctrl+R/Cmd+R) để xem các thay đổi.

## Triển khai (Deploy) trang web (Tùy chọn)

Vì đây là một trang web tĩnh (chỉ HTML, CSS, JavaScript và file JSON), bạn có thể dễ dàng triển khai nó lên các dịch vụ hosting miễn phí hoặc trả phí hỗ trợ trang web tĩnh như:

*   GitHub Pages
*   Netlify
*   Vercel
*   Cloudflare Pages

Bạn chỉ cần tải toàn bộ nội dung thư mục `portfolio_site` lên dịch vụ hosting đó.

Chúc bạn có một trang portfolio ấn tượng!

