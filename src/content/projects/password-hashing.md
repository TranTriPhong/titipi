---
title: "Phân biệt Băm (Hashing) và Mã hoá (Encryption) trong lưu trữ mật khẩu"
description: "Tại sao không bao giờ được lưu mật khẩu dưới dạng plain-text? Phân tích cơ chế hoạt động của thuật toán băm (Bcrypt) và kỹ thuật dùng Salt để chống lại tấn công Rainbow Table."
techStack: ["Cryptography", "Backend", "Security"]
category: "tool"
featured: true
publishDate: 2026-05-01
---

*Lưu ý: Bài viết thuộc chuỗi nghiên cứu học thuật về An toàn thông tin và Mật mã học ứng dụng.*

Một trong những sai lầm sơ đẳng nhất của lập trình viên khi mới làm web là lưu trữ mật khẩu người dùng dưới dạng văn bản thuần túy (plain-text) hoặc sử dụng mã hóa hai chiều (Encryption). 

### 1. Mã hóa (Encryption) không dành cho mật khẩu
Mã hóa là quá trình biến đổi dữ liệu thành một dạng khó hiểu, nhưng **có thể giải mã** ngược lại nếu có khóa (Key).
*   **Ví dụ thuật toán:** AES, RSA.
*   **Rủi ro:** Nếu hacker xâm nhập được vào máy chủ và lấy được cả Database lẫn Khóa giải mã, toàn bộ mật khẩu của hệ thống sẽ bị lộ. Hệ thống lúc này sụp đổ hoàn toàn.

### 2. Hàm băm (Hashing) - Giải pháp một chiều
Hàm băm toán học sẽ biến đổi một chuỗi đầu vào có độ dài bất kỳ thành một chuỗi ký tự có độ dài cố định. Quan trọng nhất: **Đã băm là không thể dịch ngược**.
*   **Ví dụ:** `MD5`, `SHA-256`, `Bcrypt`.
*   **Cách hoạt động khi Login:** Hệ thống không lưu mật khẩu thật. Khi người dùng nhập pass, hệ thống sẽ băm pass đó ra và so sánh với chuỗi băm trong Database. Khớp mã băm = Mật khẩu đúng.

<!-- Note: Chèn một đoạn code minh họa dùng thư viện bcrypt trong Node.js -->
```javascript
const bcrypt = require('bcrypt');
const password = "mySuperSecretPassword";

// Hệ thống tự động tạo một chuỗi ngẫu nhiên (Salt) và trộn vào mật khẩu trước khi băm
const saltRounds = 10;
bcrypt.hash(password, saltRounds, function(err, hash) {
    // Chuỗi hash này mới là thứ được lưu vào Database
    console.log("Chuỗi băm an toàn:", hash); 
});