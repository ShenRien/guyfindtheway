##### This blog made with Nulite starter [med]

##### Updated all off source

##### Updated config

Blog cá nhân viết về những kiến thức và suy nghĩ mỗi khi muốn.

Theme và mã nguồn được thiết kế tập trung vào sự cơ bản là đọc.

Blog sử dụng mã nguồn theme Nulite (từ file /README-Author.md)

### Mã nguồn được chia sẻ ở đây có thể được cá nhân hóa bởi người thấy thích muốn sử dụng 
#### Mình tùy biến thêm một số tính năng như hình ảnh và hiển thị danh sách

#### Plugins list
> - npm install --save markdown-it-attrs (target _blank (mở liên kết qua trang mới bằng hậu tố  [your text](http://yourlink.example/){target='_blank'} ))

##### Cách dùng
- Tải trực tiếp mã nguồn từ đây (gitclone)
		
	1. Bản production được build trong thư mục ```_site``` bằng lệnh:	
	```
	npx @11ty/eleventy
	```
	Hoặc build và host trong local cho chế độ phát triển bằng lệnh:
	```
	npx @11ty/eleventy --serve
	```

- Thư mục scr/posts/ lưu trữ tất cả các bài viết 
- Thay thế một số placeholder từ các file .liquid
- Thay đổi favion thành ảnh riêng nếu muốn
- Cài đặt Node.js để chạy test trên local
- format khuyến nghị:
  
  File posttitle.md
  
  ``` markdown
  ---
  date: dd/mm/yyyy
  tag: #posttags
  title: Tên Bài Post
  description: Tóm tắt nội dung bài post
  image: /assets/images/hinhanh.png
  (tùy chọn, không để ảnh sẽ hiển thị ảnh mặc định, đặt vào trong thư mục posts/assets/images/)
  ---
  // Nội dung bài viết
  ```
  
Enjoy it!
