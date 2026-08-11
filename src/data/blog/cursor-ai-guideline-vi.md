---
title: "Cursor AI Editor trong Doanh nghiệp: Mô hình 3 lớp, Zero Trust Security và cách team không bị 'ngáo' Code AI"
description: "Bóc tách quy chuẩn kỹ thuật nội bộ về cách đưa Cursor AI vào quy trình sản xuất phần mềm thực tế: từ phân lớp công cụ, pipeline chuyển đổi UI, cấu hình Zero Trust đến quản trị Rules & Skills 2 cấp."
pubDate: 2026-08-11
category: "engineering"
image: "/blog/cursor-ai-guideline/hero.jpg"
lang: "vi"
translationKey: "cursor-ai-guideline"
draft: false
---

![Cursor AI Code Editor trong môi trường Doanh nghiệp](/blog/cursor-ai-guideline/hero.jpg)

> **TL;DR** — Đưa AI Code Editor vào doanh nghiệp không chỉ đơn giản là cấp tài khoản Cursor rồi bảo anh em "dùng đi cho nhanh". Nếu không có quy chuẩn, AI sẽ tạo ra một núi code "mỳ ăn liền" rác rưởi, hallucination logic nghiệp vụ, và nguy cơ leak API key nội bộ là cực kỳ cao. Bài viết này bóc tách toàn bộ tài liệu hướng dẫn kỹ thuật nội bộ của chúng tôi: từ chiến lược công cụ 3 lớp, quy trình Backend/Frontend song song, cơ chế bảo mật Zero Trust cho đến hệ thống phân cấp Rules & Skills giúp AI sinh mã đúng convention ngay lần đầu.

---

## 1. Cạm bẫy lớn nhất: Nhầm lẫn giữa "Công cụ gõ code" và "Tư duy lập trình"

Nhiều người nghĩ trang bị Cursor AI sẽ giúp lập trình viên rảnh tay chỉ ngồi duyệt code. Thực tế hoàn toàn ngược lại: **Cursor không thay thế tư duy của lập trình viên.**

Khi bạn cấp cho AI một prompt mơ hồ, nó sẽ đưa ra một giải pháp generic (chung chung) dựa trên xác suất từ vựng phổ biến trên GitHub, chứ không phải giải pháp tối ưu cho hệ thống microservices đang chạy của bạn. Mã do AI sinh ra bắt buộc phải trải qua 3 bước: **Review ➔ Tinh chỉnh ➔ Tích hợp logic nghiệp vụ** trước khi bước vào lệnh `git commit`.

Để ngăn chặn tình trạng dev lạm dụng hoặc bị AI "dắt mũi", chúng tôi chia vai trò của các công cụ trong hệ thống phát triển thành **Mô hình 3 lớp (Layered Tooling Strategy)** rõ ràng:

| Lớp công cụ | Công cụ chính | Vai trò | Trách nhiệm chính |
|---|---|---|---|
| **Lớp 1 — AI-Native Dev** | Cursor AI | Công cụ phát triển cốt lõi | Soạn thảo mã nguồn, refactor đa tệp, sinh unit test, tự động hóa tác vụ lặp |
| **Lớp 2 — UI Prototyping** | Lovable, v0.dev, Stitch | Nguồn mẫu thiết kế frontend | Tạo prototype UI nhanh, layout dựng sẵn, component mẫu bằng ngôn ngữ tự nhiên |
| **Lớp 3 — Execution** | IntelliJ, VS, Rider | Thực thi & Xác thực | Chạy build, đính kèm Debugger, theo dõi heap/thread, profiling trước khi deploy |

> **Nguyên tắc cốt lõi**: Cursor là nơi *viết mã*, còn IDE truyền thống là nơi *chạy và debug*. Hai cửa sổ này luôn được mở song song trên màn hình làm việc của kỹ sư.

---

## 2. Quy trình phát triển Backend: Vòng lặp song song 3 bước

Đừng bắt Cursor phải tự build và run server nếu bạn không muốn tốn token vô ích cho những lỗi syntax cơ bản. Cách làm chuẩn là thiết lập môi trường làm việc song song (Dual-window workflow):

```
┌──────────────────────────────────────┐        ┌──────────────────────────────────────┐
│          CURSOR AI (Viết mã)         │        │    IDE: IntelliJ / VS / Rider        │
├──────────────────────────────────────┤        ├──────────────────────────────────────┤
│ ➔ Soạn thảo toàn bộ mã nguồn         │        │ ➔ Khởi động server & Debugger        │
│ ➔ Sinh Boilerplate (Controller/Repo) │        │ ➔ Theo dõi log runtime, heap/thread  │
│ ➔ Refactor đa tệp qua Agent Mode    │        │ ➔ Chạy test suite, kiểm tra coverage │
│ ➔ Phân tích Stack Trace export được  │ ◄────► │ ➔ Export Stack Trace khi gặp Crash   │
└──────────────────────────────────────┘        └──────────────────────────────────────┘
```

Vòng lặp thực tế diễn ra như sau:

1. **Thiết lập môi trường song song**: Mở IDE truyền thống để chạy server ở chế độ Debug mode. Mở cùng lúc Cursor trên thư mục dự án đó. IDE giữ nguyên trạng thái ứng dụng.
2. **Development Loop (Viết & Quan sát)**: Kỹ sư yêu cầu Cursor viết hoặc refactor code ➔ Lưu file ➔ IDE tự động Hot-reload / Rebuild ➔ Quan sát log và kết quả trên IDE. Nếu có lỗi nhỏ, quay lại Cursor sửa ngay mà không đóng mở công cụ.
3. **Debug nâng cao**: Khi gặp lỗi runtime hoặc bug logic phức tạp, IDE đã sẵn sàng breakpoint để step-through xem giá trị biến. Copy Stack Trace từ IDE, dán trực tiếp vào Cursor để AI phân tích root cause và đề xuất patch.

---

## 3. Quy trình Frontend: Pipeline 3 bước chuyển đổi từ Mockup sang Production

Viết UI bằng AI hay bị hai thái cực: một là code CSS xập xệ, hai là dán nguyên xi code do Lovable/v0 sinh ra vào repo dự án làm vỡ sạch convention hiện tại.

Để giải quyết, chúng tôi phân luồng Frontend thành 2 dạng tác vụ:

* **Sửa nhỏ / Thêm component lẻ**: Làm việc trực tiếp trên Cursor (mô tả thay đổi, dán design spec hoặc mô tả triệu chứng bug UI).
* **Giao diện mới hoàn toàn / Refactor lớn**: Bắt buộc tuân theo **Pipeline chuyển đổi 3 bước**:

```
[ BƯỚC 1: Lovable / v0 / Stitch ]
   Prompt ngôn ngữ tự nhiên ──▶ Visual Artifact (Chỉ dùng làm bản vẽ tham chiếu)
                                     │
                                     ▼
[ BƯỚC 2: Context Extraction ]
   Rút gọn thông số kỹ thuật ──▶ Chiết xuất Token, Component re-use, State, Grid/Flex
                                     │
                                     ▼
[ BƯỚC 3: Cursor Code Gen ]
   Nạp Context vào Cursor   ──▶ Mã nguồn chuẩn Convention dự án (Angular/React/Vue)
```

### Chi tiết bước Context Extraction (Trích xuất ngữ cảnh):
Trước khi bật Cursor để gen code UI, kỹ sư phải thực hiện bước "lọc thô" từ bản demo của v0/Lovable:
* **Màu sắc, Font, Spacing**: Chuyển thành CSS custom properties hoặc Design Token (Tailwind config, SCSS variables).
* **Phân rã Component**: Xác định rõ phần nào cần tạo mới, phần nào tái sử dụng từ thư viện UI nội bộ của dự án.
* **Luồng dữ liệu (State)**: Xác định rõ State nào nằm local trong component, State nào phải đẩy lên Store chia sẻ.
* **Bố cục (Layout)**: Ghi chú cách dựng Flexbox / Grid để tái tạo đúng layout trong framework thực tế.

Nhờ bước chuẩn bị ngữ cảnh này, Cursor sẽ sinh mã chuẩn ngay từ lần đầu tiên mà không bắt bạn phải sửa đi sửa lại layout.

---

## 4. Bảo mật Zero Trust: Không đánh đổi Data & Secrets lấy tiện ích AI

Sử dụng AI trong các dự án của doanh nghiệp (như viễn thông, tài chính, quản lý nhà nước) thì **Bảo mật là tiêu chí sống còn**. Một cú dán prompt vô tình chứa Database Password hay API Key nội bộ có thể dẫn đến hậu quả nghiêm trọng.

Chúng tôi áp dụng mô hình **Zero Trust** khắt khe khi cấu hình Cursor:

```
                          ┌───────────────────────────┐
                          │   CURSOR SECURITY MODEL   │
                          └─────────────┬─────────────┘
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             ▼                          ▼                          ▼
   ┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
   │   Privacy Mode    │      │    MCP Server     │      │ Secret Management │
   │   BẬT (Bắt buộc)  │      │  Deny All Default │      │   Zero Hardcode   │
   │ Ngăn gửi code cho │      │ Quản lý nghiêm ngặt│      │ Dùng env vars &   │
   │ LLM bên thứ 3     │      │  qua mcp.json     │      │ .cursorignore     │
   └───────────────────┘      └───────────────────┘      └───────────────────┘
```

1. **Privacy Mode = BẬT (Bắt buộc)**: Đảm bảo mã nguồn của dự án không bị các nhà cung cấp LLM bên thứ ba lưu trữ hay sử dụng để huấn luyện mô hình (training data).
2. **Codebase Indexing = BẬT**: Cho phép Cursor index cấu trúc dự án cục bộ (Local Indexing) giúp AI đưa ra gợi ý chuẩn xác mà không đẩy source code ra bên ngoài.
3. **MCP (Model Context Protocol) Server**: Từ chối tất cả extension trái phép muốn truy cập tài nguyên nội bộ hoặc điều khiển IDE. Chỉ các MCP Server được phê duyệt qua file `mcp.json` bởi Tech Lead mới được vận hành.
4. **Quản lý Secrets**: **Nghiêm cấm tuyệt đối** việc dán API Key, Password, Connection String vào prompt chat hoặc hardcode trong mã nguồn. Tất cả file chứa biến môi trường (`.env`, `credentials.json`) bắt buộc phải được khai báo trong `.cursorignore`.

---

## 5. Chuẩn hóa Kiến trúc với Tài liệu *.md

Trong hệ thống Microservices, tài liệu kỹ thuật rải rác hoặc "quên cập nhật" là nguyên nhân chính khiến các team tốn hàng tuần để tích hợp API với nhau. Với Cursor AI, chúng tôi chuẩn hóa việc sinh tài liệu dựa trên mã nguồn thực tế thông qua các prompt mẫu:

* **`README.md`**: Tổng quan dịch vụ, cách khởi chạy môi trường local, biến môi trường.
  * *Prompt gợi ý*: `"Đọc toàn bộ project và tạo README.md đầy đủ cho service này"`
* **`API.md`**: Danh sách REST Endpoints, Schema Request/Response, cơ chế Auth, Error Code.
  * *Prompt gợi ý*: `"Liệt kê toàn bộ REST endpoint với request body, response và HTTP status code"`
* **`ARCHITECTURE.md`**: Sơ đồ luồng dữ liệu, các service phụ thuộc (dependencies), message queue.
  * *Prompt gợi ý*: `"Mô tả kiến trúc nội bộ, dependency ngoài và luồng xử lý chính"`

---

## 6. Quản trị Tri thức qua Skills & Rules 2 Cấp

Nếu không cung cấp "bản chỉ dẫn", AI sẽ code theo thói quen ngẫu nhiên. Chúng tôi quản trị tri thức AI thông qua 2 cơ chế chính: **Skills** và **Cursor Rules**.

### 6.1. Quản lý Skills (`.cursor/skills/`)
Skills là các file `*.md` chứa quy tắc chuyên biệt được nạp vào Cursor theo ngữ cảnh dự án.

```
.cursor/
└── skills/
    ├── enterprise/             # [Phòng Quản lý — Chỉ đọc]
    │   ├── security-forbidden.md
    │   └── code-conventions.md
    ├── team/                   # [Tech Lead quản lý — Theo dự án]
    │   ├── billing-rules.md
    │   ├── kafka-schema.md
    │   └── springboot-conventions.md
    └── personal/               # [Từng kỹ sư — Không commit lên Git]
        └── my-shortcuts.md
```

* **Cách dùng**: Kéo thả file `*.md` vào cửa sổ chat Cursor khi cần xử lý module tương ứng, hoặc đặt vào `.cursorrules` với lệnh `@file` để tự động nạp mỗi khi mở project.

### 6.2. Hệ thống Cursor Rules 2 Cấp
File `.cursorrules` (hoặc các file `.mdc`) đóng vai trò như "Hiến pháp" ép AI phải tuân thủ nghiêm ngặt các convention của team.

* **Cấp 1: Enterprise Rules (`~/.cursor/rules/enterprise.mdc`)** — Do phòng quản lý chỉ định, áp dụng chung cho toàn bộ kỹ sư và mọi project. Không ai được phép ghi đè.
* **Cấp 2: Team Rules (`.cursor/rules/*.mdc`)** — Do Tech Lead xây dựng dựa trên Tech Stack cụ thể (Java/Spring Boot hay Angular).

#### Mẫu Enterprise Rules (Bắt buộc):

```markdown
# TTKDGP Enterprise Rules – Phòng DLS
## Ngôn ngữ & Giao tiếp
- Luôn phản hồi bằng tiếng Việt trong comment và giải thích.
- Tên biến, hàm, class dùng tiếng Anh theo camelCase / PascalCase.
- Commit message theo chuẩn Conventional Commits (feat/fix/refactor...).

## Bảo mật — NGHIÊM CẤM tuyệt đối
- KHÔNG hardcode API key, password, token, secret trong bất kỳ file nào.
- KHÔNG tự ý viết luồng xác thực, phân quyền, mã hóa — báo Senior.
- KHÔNG log thông tin nhạy cảm (số điện thoại, CMND, dữ liệu khách hàng).

## Chất lượng mã
- Mỗi hàm không quá 50 dòng. Tách nhỏ nếu vượt.
- Luôn thêm Javadoc / Docstring cho public method.
- Không dùng magic number — khai báo constant có tên rõ nghĩa.
```

#### Mẫu Team Rules (Ví dụ cho Angular & Spring Boot):

```markdown
# Team Rules — Backend Java/Spring Boot
- Dùng Repository Pattern. Không gọi DB trực tiếp từ Controller/Service.
- Exception handling tập trung qua @ControllerAdvice — không try/catch lẻ tẻ.
- Response luôn bọc trong ApiResponse<T> wrapper chuẩn của team.

# Team Rules — Frontend Angular
- KHÔNG dùng React, JSX, Vue. Chỉ Angular + TypeScript + HTML template.
- State management: RxJS BehaviorSubject hoặc Angular Signals (Angular 17+).
- Lazy loading bắt buộc cho mọi feature module. Standalone component convention.
```

---

## Lời kết

Ứng dụng Cursor AI vào sản xuất không phải là việc mua một giấy phép phần mềm rồi kỳ vọng năng suất tăng gấp 10 lần. Năng suất chỉ thực sự đến khi bạn có **một quy trình chặt chẽ, một kiến trúc công cụ phân lớp rõ ràng và một hệ thống Rules đủ mạnh để giữ AI trong khuôn khổ.**

AI là một lập trình viên học việc cực kỳ nhanh nhưng thiếu kinh nghiệm thực tế. Hãy đóng vai trò là một Tech Lead nghiêm khắc với AI — kiểm soát bảo mật, đặt ra luật chơi rõ ràng, và bạn sẽ biến Cursor thành trợ lý đắc lực nhất trong hành trình phát triển phần mềm của mình.
