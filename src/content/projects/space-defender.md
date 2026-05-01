---
title: "Space Defender"
description: "Game bắn máy bay phong cách Retro cổ điển. Được tối ưu hóa vòng lặp game (game loop) để chạy mượt 60FPS trên trình duyệt."
techStack: ["HTML5 Canvas", "JavaScript", "Game Dev"]
featured: true
category: "game"
publishDate: 2026-05-01
---

Dự án này được viết hoàn toàn bằng JavaScript thuần không dùng engine để rèn luyện tư duy xử lý va chạm (collision detection) và quản lý bộ nhớ.

<iframe src="/games/space-defender/index.html" width="100%" height="500" style="border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; margin: 20px 0;"></iframe>

### Tính năng chính
* Hệ thống hạt (Particle system) khi tiêu diệt địch.
* Tính điểm highscore lưu vào LocalStorage.
* Tối ưu hóa RequestAnimationFrame.