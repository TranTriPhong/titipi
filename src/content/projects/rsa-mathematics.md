---
title: "Toán học đằng sau thuật toán RSA"
description: "Giải phẫu cơ chế toán học cốt lõi của mã hóa bất đối xứng RSA: Số nguyên tố, Hàm phi Euler và Số học module."
techStack: ["Mathematics", "Cryptography", "Algorithms"]
category: "script"
featured: true
publishDate: 2026-05-01
---

Hệ thống mật mã bất đối xứng RSA (Rivest–Shamir–Adleman) là xương sống của bảo mật Internet hiện đại. Thay vì tập trung vào code, bài viết này sẽ bóc tách nền tảng toán học đằng sau nó.

Bảo mật của RSA dựa trên một bài toán hóc búa: Rất dễ để nhân hai số nguyên tố lớn với nhau, nhưng cực kỳ khó (gần như không thể với máy tính hiện tại) để làm điều ngược lại: phân tích tích của chúng ra thành hai thừa số nguyên tố ban đầu.

### 1. Tạo khóa (Key Generation)
Quá trình tạo ra Khóa công khai (Public Key) và Khóa bí mật (Private Key) trải qua các bước toán học sau:

**Bước 1: Chọn số nguyên tố**
Chọn hai số nguyên tố lớn ngẫu nhiên, ký hiệu là $p$ và $q$.
Tính $n = p \times q$. 
Độ dài của $n$ (tính bằng bit) chính là độ dài của khóa (ví dụ: RSA-2048 bit). Số $n$ này sẽ được công khai.

**Bước 2: Tính hàm phi Euler**
Tính giá trị hàm số Euler của $n$, ký hiệu là $\phi(n)$:
$$ \phi(n) = (p - 1)(q - 1) $$

**Bước 3: Chọn khóa công khai (e)**
Chọn một số nguyên $e$ sao cho $1 < e < \phi(n)$ và $e$ phải là số nguyên tố cùng nhau với $\phi(n)$. Tức là ước chung lớn nhất của chúng bằng 1:
$$ \gcd(e, \phi(n)) = 1 $$
*(Cặp số $(e, n)$ chính là Khóa công khai dùng để mã hóa dữ liệu).*

**Bước 4: Tính khóa bí mật (d)**
Tìm số nguyên $d$ sao cho:
$$ d \times e \equiv 1 \pmod{\phi(n)} $$
Nói cách khác, $d$ là nghịch đảo module của $e$ theo module $\phi(n)$.
*(Số $d$ phải được giữ bí mật tuyệt đối. Cặp $(d, n)$ là Khóa bí mật dùng để giải mã).*

### 2. Quá trình Mã hóa và Giải mã

**Mã hóa (Encryption):**
Để mã hóa một thông điệp (đã được chuyển thành số nguyên $M$ sao cho $0 \le M < n$), ta dùng Khóa công khai $(e, n)$ để tạo ra bản mã $C$:
$$ C \equiv M^e \pmod{n} $$

**Giải mã (Decryption):**
Người nhận sử dụng Khóa bí mật $(d, n)$ để khôi phục lại thông điệp $M$ ban đầu:
$$ M \equiv C^d \pmod{n} $$

**Tại sao nó hoạt động?**
Tính đúng đắn của phép giải mã được chứng minh bằng Định lý Euler. Kẻ tấn công có thể biết $n$, $e$ và $C$, nhưng để tính được $d$, chúng bắt buộc phải biết $\phi(n)$. Mà để tính được $\phi(n)$, chúng phải phân tích được $n$ ra thành $p$ và $q$. Với những số nguyên tố có hàng trăm chữ số, việc phân tích này tốn hàng nghìn năm để xử lý.